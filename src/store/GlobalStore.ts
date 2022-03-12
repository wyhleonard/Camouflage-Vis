import {GnnNode, Node} from "../types";
import {GlobalActions, GlobalActionTypes} from "./GlobalActions"

export interface GlobalState {
    nodesData: Node[],
    gnnNodes: GnnNode[],
    focusedGnnNodes: GnnNode[],
    currentNode: GnnNode,
    currentEdges: [number, number, number][][],
    kCommunities: any[],
    matrixBad: number[][],
    matrixOverlap: number[][]
}

const initialGlobalState: () => GlobalState = () => ({
    nodesData: [],
    gnnNodes: [],
    focusedGnnNodes: [],
    currentNode: {} as GnnNode,
    currentEdges: [],
    kCommunities: [
        {k: 12, community: []},
        {k: 11, community: []},
        {k: 10, community: []},
        {k: 10, community: []},
        {k: 9, community: []},
        {k: 8, community: []},
        {k: 8, community: []},
        {k: 7, community: []},
        {k: 7, community: []},
    ],
    matrixBad: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 5, 0, 5, 0, 5, 0, 5], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 5, 0, 5, 0, 5, 0, 5], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 5, 0, 5, 0, 6, 0, 6], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 5, 0, 5, 0, 6, 0, 6]],
    matrixOverlap: [[16, 16, 16, 0, 16, 0, 16, 0, 16, 0], [16, 16, 16, 0, 16, 0, 16, 0, 16, 0], [16, 16, 17, 0, 17, 0, 17, 1, 17, 1], [0, 0, 0, 10, 0, 10, 0, 10, 1, 10], [16, 16, 17, 0, 17, 0, 17, 1, 17, 1], [0, 0, 0, 10, 0, 10, 0, 10, 1, 10], [16, 16, 17, 0, 17, 0, 18, 1, 18, 2], [0, 0, 1, 10, 1, 10, 1, 12, 2, 12], [16, 16, 17, 1, 17, 1, 18, 2, 19, 3], [0, 0, 1, 10, 1, 10, 2, 12, 3, 13]]

})

const globalReducer: (state: GlobalState, action: GlobalActionTypes) => GlobalState = (state = initialGlobalState(), action) => {
    switch (action.type) {
        case GlobalActions.Init:
            return initialGlobalState();
        case GlobalActions.UpdateGnnNodes:
            return {
                ...state,
                gnnNodes: action.payload
            }
        case GlobalActions.UpdateFocusedNodes:
            return {
                ...state,
                focusedGnnNodes: action.payload
            }
        case GlobalActions.UpdateCurrentNode:
            return {
                ...state,
                currentNode: action.payload.node,
                currentEdges: action.payload.edges
            }
        case GlobalActions.UpdateMatrixData:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default globalReducer;
