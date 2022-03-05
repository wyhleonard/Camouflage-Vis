export interface Node {
    id: number,
    features: number[],
    label: number,
    relations: [number, number][][]
}

export interface NodeRawData {
    nodes_data: Node[]
}

export interface GnnNode {
    id: number,
    embedding: [number, number],
    gnn_prob_score: [number, number],
    fcn_prob_score: [number, number],
    gnn_prob_label: number,
    fcn_prob_label: number,
    ground_truth_label: number,
    selected_neighs: number[][],
    selected_neighs_score?: number[][],
    unselected_neighs: number[][],
    unselected_neighs_score?: number[][],
    isTrainNode: boolean,
}
