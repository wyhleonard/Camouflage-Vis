from igraph import Graph, summary
import numpy as np
from sqldb.model import *
from sqlalchemy import or_, and_

# 筛选出gnn_score0 - gnn_score1 < 02的节点id
def get_node_score(nodes_id=[1, 26, 52]):
    scores = list(AmazonScore.query.filter(
        and_(AmazonScore.id.in_(nodes_id), AmazonScore.gnn_score0 - AmazonScore.gnn_score1 < 0.2)).all())
    score_data = []
    for score in scores:
        score_data.append(score.id)
    return score_data

# 创建图
def create_graph(relations):
    nodes = set()
    edges = []

    for relation in relations:
        for r in relation:
            edges.append((str(r.source), str(r.target)))
            nodes.add(str(r.source))
            nodes.add(str(r.target))

    g = Graph()
    g.add_vertices(list(nodes))
    g.add_edges(edges)

    summary(g)

    return g, nodes, edges

# 归一化数组
def normalize(array):
    mx = np.nanmax(array)
    mn = np.nanmin(array)
    t = (array - mn) / (mx - mn)
    return t, mx, mn
