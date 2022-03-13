import numpy as np

from math import log

data_feature_matrix = np.array([[1, 1], [1, 1], [1, 0], [0, 1], [0, 1]])  # 特征矩阵

category = ['yes', 'yes', 'no', 'no', 'no']  # 5个对象分别所属的类别

def calc_shannon_ent(category_list):
    """
    :param category_list: 类别列表
    :return: 该类别列表的熵值
    """

    label_count = {}  # 统计数据集中每个类别的个数
    num = len(category_list)  # 数据集个数
    for i in range(num):
        try:
            label_count[category_list[i]] += 1

        except KeyError:

            label_count[category_list[i]] = 1
            shannon_ent = 0.
            for k in label_count:
                prob = float(label_count[k]) / num
                shannon_ent -= prob * log(prob, 2)  # 计算信息熵

    return shannon_ent

def split_data(feature_matrix, category_list, feature_index, value):
    """
    筛选出指定特征值所对应的类别列表
    :param category_list: 类别列表
    :param feature_matrix: 特征矩阵
    :param feature_index: 指定特征索引
    :param value: 指定特征属性的特征值
    :return: 符合指定特征属性的特征值的类别列表
    """

    # feature_matrix = np.array(feature_matrix)
    ret_index = np.where(feature_matrix[:, feature_index] == value)[0]  # 获取符合指定特征值的索引
    ret_category_list = [category_list[i] for i in ret_index]  # 根据索引取得指定的所属类别，构建为列表
    return ret_category_list

def choose_best_feature(feature_matrix, category_list):
    """
    根据信息增益获取最优特征
    :param feature_matrix: 特征矩阵
    :param category_list: 类别列表
    :return: 最优特征对应的索引
    """

    feature_num = len(feature_matrix[0])  # 特征个数
    data_num = len(category_list)  # 数据集的个数
    base_shannon_ent = calc_shannon_ent(category_list=category_list)  # 原始数据的信息熵
    best_info_gain = 0  # 最优信息增益
    best_feature_index = -1  # 最优特征对应的索引

    for f in range(feature_num):

        uni_value_list = set(feature_matrix[:, f])  # 该特征属性所包含的特征值
        new_shannon_ent = 0.

        for value in uni_value_list:

            sub_cate_list = split_data(feature_matrix=feature_matrix, category_list=category_list, feature_index=f,
                                       value=value)

            prob = float(len(sub_cate_list)) / data_num
            new_shannon_ent += prob * calc_shannon_ent(sub_cate_list)
            info_gain = base_shannon_ent - new_shannon_ent  # 信息增益

            print('初始信息熵为：', base_shannon_ent, '按照特征%i分类后的信息熵为：' % f, new_shannon_ent, '信息增益为：', info_gain)

            if info_gain > best_info_gain:
                best_info_gain = info_gain
                best_feature_index = f

    return best_feature_index

if __name__ == '__main__':
    best_feature = choose_best_feature(data_feature_matrix, category)
