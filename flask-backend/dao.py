import pandas as pd
import numpy as np
from sqldb.model import *
from sqlalchemy import or_, and_

# 将relation关系转换一下，把之前的数据表结构转换一下，保存成csv
def fetch_relation():
    relations = list(AmazonRelation2Datum.query.all())
    source = []
    target = []
    weight_source = []
    weight_target = []

    id_num = 11943 + 1
    matrix = np.zeros((id_num, id_num))

    for relation in relations:
        # 这边考虑，如果没有边连接，那为0，如果有边连接，但是权重不考虑，那就为1，如果考虑权重，则为2
        if relation.weight_source == 0:
            matrix[relation.source][relation.target] = 1
        elif relation.weight_source == 1:
            matrix[relation.source][relation.target] = 2

    for i in range(0, 11943 + 1):
        for j in range(i + 1, 11943 + 1):
            if matrix[i][j] > 0 and matrix[j][i] > 0:
                source.append(i)
                target.append(j)
                weight_source.append(matrix[i][j] - 1)
                weight_target.append(matrix[j][i] - 1)

    df = pd.DataFrame({
        "source": source,
        "target": target,
        "weight_source": weight_source,
        "weight_target": weight_target
    }, columns=["source", "target", "weight_source", "weight_target"])

    df.to_csv("amazon_relation2_data.csv", index=False, sep=",")

    print("done")

    return "success"

# 获取节点在nodes_id中的所有关系
def fetch_relation_by_nodes_id(nodes_id):
    relation0 = AmazonRelation0Datum.query.filter(
        and_(AmazonRelation0Datum.source.in_(nodes_id), AmazonRelation0Datum.target.in_(nodes_id))
    )
    relation1 = AmazonRelation1Datum.query.filter(
        and_(AmazonRelation1Datum.source.in_(nodes_id), AmazonRelation1Datum.target.in_(nodes_id))
    )
    relation2 = AmazonRelation2Datum.query.filter(
        and_(AmazonRelation2Datum.source.in_(nodes_id), AmazonRelation2Datum.target.in_(nodes_id))
    )
    return relation0, relation1, relation2
