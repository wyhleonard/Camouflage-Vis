from sqldb import app
from sqldb.model import *
from sqlalchemy import or_, and_
from utils import get_node_score, create_graph, normalize
import json
from dao import *
from flask import request
from CliquePercolationMethod import clique_percolation_method
import time

# 数据库的查询操作（查）
@app.route("/fetch_init_data", methods=["get"])
def fetch_init_data():
    split_data = list(AmazonTrainTestSplit.query.all())
    embedding_data = list(AmazonEmbedding.query.all())
    label_data = list(AmazonLabel.query.all())
    score_data = list(AmazonScore.query.all())

    id = []
    isTrain = []
    embedding = []
    label = []
    score = []
    for i in range(len(split_data)):
        id.append(split_data[i].id)
        isTrain.append(split_data[i].is_train)
        embedding.append([embedding_data[i].x, embedding_data[i].y])
        label.append([
            label_data[i].gnn_label,
            label_data[i].fcn_label,
            label_data[i].ground_truth
        ])
        score.append([
            score_data[i].gnn_score0,
            score_data[i].gnn_score1,
            score_data[i].fcn_score0,
            score_data[i].fcn_score1
        ])

    result = json.dumps({
        'data': {
            'id': id,
            'isTrain': isTrain,
            'embedding': embedding,
            'label': label,
            'score': score
        }
    })
    return result

# 获取指定节点之间的关系
@app.route("/fetch_nodes_relation", methods=["post"])
def fetch_nodes_relation():
    nodes_id = request.json.get('nodes_id')
    relation0, relation1, relation2 = fetch_relation_by_nodes_id(nodes_id)

    return json.dumps({
        "relations": [
            [[r.source, r.target, r.weight_source, r.weight_target] for r in relation0],
            [[r.source, r.target, r.weight_source, r.weight_target] for r in relation1],
            [[r.source, r.target, r.weight_source, r.weight_target] for r in relation2]
        ]
    })

# 获取列表中异常节点的节点
def get_node_predict(nodes_id=[5997, 5117, 3785, 5715, 4561, 5255, 5562, 6051, 5469, 8097, 3767, 3808, 7237]):
    predicts = list(AmazonLabel.query.filter(
        and_(AmazonLabel.id.in_(nodes_id), AmazonLabel.gnn_label == 1)))
    predict_data = []
    for predict in predicts:
        predict_data.append(predict.id)
    return predict_data

@app.route("/fetch_subgraph_data", methods=["post"])
def fetch_subgraph_data():
    nodes_id = request.json.get('nodes_id')
    relation0, relation1, relation2 = fetch_relation_by_nodes_id(nodes_id)
    return json.dumps({
        "graphData": [
            [[r.source, r.target, r.weight_source] for r in relation0],
            [[r.source, r.target, r.weight_source] for r in relation1],
            [[r.source, r.target, r.weight_source] for r in relation2],
        ]
    })

# 获取子图，构建混淆矩阵
@app.route("/fetch_community_matrix", methods=["post"])
def fetch_community_matrix():
    nodes_id = request.json.get('nodes_id')

    print("before filter node length : ", len(nodes_id))

    nodes_id = get_node_score(nodes_id)

    print("after filter node length : ", len(nodes_id))

    # relation0 = list(AmazonRelation0Datum.query.filter(
    #     and_(AmazonRelation0Datum.source.in_(nodes_id[0]), AmazonRelation0Datum.target.in_(nodes_id[0]))))
    # relation1 = list(AmazonRelation1Datum.query.filter(
    #     and_(AmazonRelation1Datum.source.in_(nodes_id[0]), AmazonRelation1Datum.target.in_(nodes_id[0]))))
    relation2 = list(AmazonRelation2Datum.query.filter(
        and_(AmazonRelation2Datum.source.in_(nodes_id), AmazonRelation2Datum.target.in_(nodes_id))))

    print("edge length : ", len(relation2))

    result = []
    k_comminuties = []

    def get_max_k(relation):
        g, nodes, edges = create_graph([relation])

        k = len(nodes)
        while k >= 0:
            print("find k , current : ", k)
            communities = clique_percolation_method(graph=g, k=k, workers=1, verbose=True)
            if len(communities) > 0:
                break
            k -= 1
        return k

    def k_clique(relation, k=3):
        g, nodes, edges = create_graph([relation])

        communities = clique_percolation_method(graph=g, k=k, workers=1, verbose=True)
        print("Cliques:")
        for count, comm in enumerate(communities):
            print("communities {}: {}".format(count, [g.vs[i]["name"] for i in comm]))
            result.append([g.vs[i]["name"] for i in comm])
            k_comminuties.append({"k": k, "community": [int(g.vs[i]["name"]) for i in comm]})

    k_max = get_max_k(relation2)
    print("k_max : ", k_max)

    for i in range(6):
        print("find k community : ", k_max - i)
        k_clique(relation2, k_max - i)

    matrix_overlap = []
    matrix_bad = []

    for r1 in result:
        temp1 = []
        temp2 = []
        for r2 in result:
            overlap_ids = list(set(r1).intersection(set(r2)))
            overlap_ids = [int(i) for i in overlap_ids]  # 转为int
            temp1.append(len(overlap_ids))
            temp2.append(len(get_node_predict(overlap_ids)))

        matrix_overlap.append(temp1)
        matrix_bad.append(temp2)

    return json.dumps({
        "k_comminuties": k_comminuties,
        "matrix_overlap": matrix_overlap,
        "matrix_bad": matrix_bad
    })

# 获取score的统计值,很多重复无用代码，需要合并
@app.route("/fetch_score_statistics", methods=["get"])
def fetch_score_statistics():
    scores = AmazonScore.query.all()
    train_id = AmazonTrainTestSplit.query.filter(AmazonTrainTestSplit.is_train == 1)
    train_id = [item.id for item in train_id]
    test_id = AmazonTrainTestSplit.query.filter(AmazonTrainTestSplit.is_train == 0)
    test_id = [item.id for item in test_id]

    # gnn score 分成10个bin
    gnn_score_diff = [s.gnn_score0 - s.gnn_score1 for s in scores]
    fcn_score_diff = [s.fcn_score0 - s.fcn_score1 for s in scores]

    gnn_score_range = [max(gnn_score_diff), min(gnn_score_diff)]
    fcn_score_range = [max(fcn_score_diff), min(fcn_score_diff)]

    gnn_bin_interval = (gnn_score_range[0] - gnn_score_range[1]) / 10
    fcn_bin_interval = (fcn_score_range[0] - fcn_score_range[1]) / 10
    gnn_bins = [gnn_score_range[1] + i * gnn_bin_interval for i in range(10)]
    fcn_bins = [fcn_score_range[1] + i * fcn_bin_interval for i in range(10)]

    # 计算gnn的tt、tf、ff、ft,test_true,test_false
    gnn_train_tt = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 0, AmazonLabel.ground_truth == 0, AmazonLabel.id.in_(train_id))
    )

    gnn_train_tf = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 1, AmazonLabel.ground_truth == 0, AmazonLabel.id.in_(train_id))
    )

    gnn_train_ft = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 0, AmazonLabel.ground_truth == 1, AmazonLabel.id.in_(train_id))
    )

    gnn_train_ff = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 1, AmazonLabel.ground_truth == 1, AmazonLabel.id.in_(train_id))
    )

    gnn_test_true = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 0, AmazonLabel.id.in_(test_id))
    )

    gnn_test_false = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 1, AmazonLabel.id.in_(test_id))
    )

    gnn_counts = {
        "train_tt": [0 for i in range(10)],
        "train_tf": [0 for i in range(10)],
        "train_ft": [0 for i in range(10)],
        "train_ff": [0 for i in range(10)],
        "test_true": [0 for i in range(10)],
        "test_false": [0 for i in range(10)]
    }

    def compute_gnn_count(name, iter):
        def find_index(arr, value):
            i = len(arr) - 1
            while value < arr[i]:
                i -= 1
            return i

        for item in iter:
            query = AmazonScore.query.filter(AmazonScore.id == item.id)
            for s in query:
                index = find_index(gnn_bins, s.gnn_score0 - s.gnn_score1)
                gnn_counts[name][index] += 1

    compute_gnn_count("train_tt", gnn_train_tt)
    compute_gnn_count("train_tf", gnn_train_tf)
    compute_gnn_count("train_ft", gnn_train_ft)
    compute_gnn_count("train_ff", gnn_train_ff)
    compute_gnn_count("test_true", gnn_test_true)
    compute_gnn_count("test_false", gnn_test_false)

    # 计算fcn的tt、tf、ff、ft,test_true,test_false
    fcn_train_tt = AmazonLabel.query.filter(
        and_(AmazonLabel.fcn_label == 0, AmazonLabel.ground_truth == 0, AmazonLabel.id.in_(train_id))
    )

    fcn_train_tf = AmazonLabel.query.filter(
        and_(AmazonLabel.fcn_label == 1, AmazonLabel.ground_truth == 0, AmazonLabel.id.in_(train_id))
    )

    fcn_train_ft = AmazonLabel.query.filter(
        and_(AmazonLabel.fcn_label == 0, AmazonLabel.ground_truth == 1, AmazonLabel.id.in_(train_id))
    )

    fcn_train_ff = AmazonLabel.query.filter(
        and_(AmazonLabel.fcn_label == 1, AmazonLabel.ground_truth == 1, AmazonLabel.id.in_(train_id))
    )

    fcn_test_true = AmazonLabel.query.filter(
        and_(AmazonLabel.fcn_label == 0, AmazonLabel.id.in_(test_id))
    )

    fcn_test_false = AmazonLabel.query.filter(
        and_(AmazonLabel.fcn_label == 1, AmazonLabel.id.in_(test_id))
    )

    fcn_counts = {
        "train_tt": [0 for i in range(10)],
        "train_tf": [0 for i in range(10)],
        "train_ft": [0 for i in range(10)],
        "train_ff": [0 for i in range(10)],
        "test_true": [0 for i in range(10)],
        "test_false": [0 for i in range(10)]
    }

    def compute_fcn_count(name, iter):
        def find_index(arr, value):
            i = len(arr) - 1
            while value < arr[i]:
                i -= 1
            return i

        for item in iter:
            query = AmazonScore.query.filter(AmazonScore.id == item.id)
            for s in query:
                index = find_index(fcn_bins, s.fcn_score0 - s.fcn_score1)
                fcn_counts[name][index] += 1

    compute_fcn_count("train_tt", fcn_train_tt)
    compute_fcn_count("train_tf", fcn_train_tf)
    compute_fcn_count("train_ft", fcn_train_ft)
    compute_fcn_count("train_ff", fcn_train_ff)
    compute_fcn_count("test_true", fcn_test_true)
    compute_fcn_count("test_false", fcn_test_false)

    return json.dumps({
        "fcn_bins": fcn_bins,
        "gnn_bins": gnn_bins,
        "gnn_counts": gnn_counts,
        "fcn_counts": fcn_counts,
    })

@app.route("/fetch_connect_subgraph", methods=["post"])
def fetch_connect_subgraph():
    nodes_id = request.json.get('nodes_id')
    print("nodes_id : ", nodes_id)

    error_nodes = AmazonLabel.query.filter(
        and_(AmazonLabel.gnn_label == 0, AmazonLabel.ground_truth == 1, AmazonLabel.id.in_(nodes_id))
    )

    blue = [5385, 9725, 9578, 6139, 6713, 6076, 6994, 6016, 10981, 6669, 5249, 5368, 9552, 5764, 5409, 6339]
    red = [i for i in error_nodes if i.id not in blue]

    print("total bad : ", len(list(error_nodes)))

    relation0, relation1, relation2 = fetch_relation_by_nodes_id(nodes_id)

    print("relation0 : ", len(list(relation0)))
    print("relation1 : ", len(list(relation1)))
    print("relation2 : ", len(list(relation2)))

    error_counts = []
    edge_dense = []

    # 获取连通子图
    def get_community(relatiions):
        g, nodes, edges = create_graph(relatiions)
        result = []
        communities = clique_percolation_method(graph=g, k=3, workers=1)
        for count, comm in enumerate(communities):
            # print("communities {}: {}".format(count, [g.vs[i]["name"] for i in comm]))
            result.append([int(g.vs[i]["name"]) for i in comm])

        return result

    # 计算关系中，分错的标签的个数
    def compute_errors(comm):
        relation0, relation1, relation2 = fetch_relation_by_nodes_id(comm)

        r_list = [relation0, relation1, relation2]
        count = [[], [], []]

        # 分别对连通子图中不同的关系计算连通子图
        for i in range(len(r_list)):
            c = get_community([r_list[i]])

            # 展平成一维数组
            c = [a for b in c for a in b]

            # 计算每个不同关系中，有分错节点的个数
            for node in error_nodes:
                if node.id in c:
                    count[i].append(node.id)

        return count

    # 计算关系中，边的密度
    def compute_dense(comm):
        # 计算每个关系的连通子图中，边的密度：边的数量 / 完全连通的边数量
        relation0, relation1, relation2 = fetch_relation_by_nodes_id(comm)

        r_list = [relation0, relation1, relation2]
        dense = [0, 0, 0]

        for i in range(len(r_list)):
            nodes = set()
            edges = []
            for r in r_list[i]:
                edges.append((str(r.source), str(r.target)))
                nodes.add(str(r.source))
                nodes.add(str(r.target))

            if len(nodes) > 1:
                dense[i] = len(edges) / (len(nodes) * (len(nodes) - 1) / 2)

        return dense

    # 找到连通子图（只要有一个关系相连，那就说明这两个是连通的）
    n_comms = get_community([relation0, relation1, relation2])

    print("find n_comms : ", len(n_comms))

    # 对于找到的连通子图，再去计算他们的边密度和分类错误数
    for comm in n_comms:
        error_counts.append(compute_errors(comm))
        edge_dense.append(compute_dense(comm))

        blue_num = 0
        red_num = 0

        for c in comm:
            if c in blue:
                blue_num += 1
            if c in red:
                red_num += 1

        print("blue_num : %d , community nodes num : %d" % (blue_num, len(comm)))
        print("red_num : %d , community nodes num : %d" % (red_num, len(comm)))

    return json.dumps({
        "community": n_comms,
        "error_counts": error_counts,
        "edge_dense": edge_dense
    })

@app.route("/fetch_features", methods=["post"])
def fetch_features():
    nodes_id = request.json.get('nodes_id')
    features = fetch_node_features()

    raw_features = [
        [f.id, f.f2, f.f3, f.f4, f.f5, f.f6, f.f7, f.f8, f.f9, f.f10, f.f11, f.f12, f.f13, f.f14, f.f15, f.f16,
         f.f17, f.f18, f.f19, f.f20, f.f21, f.f22, f.f23, f.f24, f.f25, f.f26] for f in features]

    # node_false = AmazonLabel.query.filter(AmazonLabel.ground_truth == 1)
    # nodes_id = [i.id for i in node_false]

    # node_true = AmazonLabel.query.filter(AmazonLabel.ground_truth == 0)
    # nodes_id = [i.id for i in node_true]

    # nodes_id = [5385, 9725, 9578, 6139, 6713, 6076, 6994, 6016, 10981, 6669, 5249, 5368, 9552, 5764, 5409, 6339]
    # nodes_id = [6309, 9581, 8197, 7841, 6824, 9522, 9248, 6937, 3940, 6770, 7654, 4375]

    normalize_features = np.array(raw_features)

    # 转置，行和列互换
    normalize_features = normalize_features.transpose()

    for i in range(1, len(normalize_features)):
        t, mx, mn = normalize(normalize_features[i])
        normalize_features[i] = t

    # 重新转置回来
    normalize_features = normalize_features.transpose()

    # 筛选指定id的特征
    selected_community_feature = np.array([i for i in normalize_features if i[0] in nodes_id])
    selected_community_feature = selected_community_feature.transpose()

    return json.dumps({
        "raw_features": raw_features,
        "normalize_features": normalize_features.tolist(),
        "selected_community_feature": selected_community_feature.tolist()
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=2333, debug=True)
