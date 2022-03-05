import { GnnNode, Node } from "../types";
import { GlobalActions, GlobalActionTypes } from "./GlobalActions"

export interface GlobalState {
    nodesData: Node[],
    gnnNodes: GnnNode[],
    focusedGnnNodes: GnnNode[],
    currentNode: GnnNode,
    currentEdges: [number, number, number][][],
}

const initialGlobalState: () => GlobalState = () => ({
    nodesData: [],
    gnnNodes: [],
    focusedGnnNodes: [],
    currentNode: {} as GnnNode,
    currentEdges: [],
})

const globalReducer: (state: GlobalState, action: GlobalActionTypes) => GlobalState = (state = initialGlobalState(), action) => {
    switch(action.type) {
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
        default:
            return state;
    }
}

export default globalReducer;