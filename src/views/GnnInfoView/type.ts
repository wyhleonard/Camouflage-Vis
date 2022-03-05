export interface GnnInfoViewProps {

}

const projectType = [
    'clustering',
    'gnn score',
    'fcn score'
] as const 

export type projectType = typeof projectType[number];

export const initGnnNode = {
    id: -1,
    embedding: [-1, -1],
    gnn_prob_score: [-1, -1],
    fcn_prob_score: [-1, -1],
    gnn_prob_label: -1,
    fcn_prob_label: -1,
    ground_truth_label: -1,
    selected_neighs: [],
    unselected_neighs: [],
    isTrainNode: false,
}