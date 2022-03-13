import {GnnNode} from "../types";

export enum GlobalActions {
    Init = "INIT",
    UpdateGnnNodes = 'UPDATE_GNN_NODES',
    UpdateFocusedNodes = 'UPDATE_FOCUSED_NODES',
    UpdateCurrentNode = 'UPDATE_CURRENT_NODE',
    UpdateMatrixData = "UPDATE_MATRIX_DATA",
    GlobalUpdateSelectedMatrixCellAction = "UPDATA_SELECTED_MATRIXCELL"
}

export interface GlobalAction {
    type: GlobalActions
}

export interface GlobalInitAction extends GlobalAction {
    type: GlobalActions.Init
}

export interface GlobalUpdateGnnNodesAction extends GlobalAction {
    type: GlobalActions.UpdateGnnNodes
    payload: GnnNode[]
}

export interface GlobalUpdateFocusedNodesAction extends GlobalAction {
    type: GlobalActions.UpdateFocusedNodes
    payload: GnnNode[]
}

export interface GlobalUpdateCurrentNodeAction {
    type: GlobalActions.UpdateCurrentNode
    payload: {
        node: GnnNode,
        edges: [number, number, number][][]
    }
}

export interface GlobalUpdateMatrixAction {
    type: GlobalActions.UpdateMatrixData
    payload: {
        kCommunities: any[],
        matrixBad: number[][],
        matrixOverlap: number[][]
    }
}

export interface GlobalUpdateSelectedMatrixCellAction {
    type: GlobalActions.GlobalUpdateSelectedMatrixCellAction
    payload: number[]
}

export type GlobalActionTypes =
    | GlobalInitAction
    | GlobalUpdateGnnNodesAction
    | GlobalUpdateFocusedNodesAction
    | GlobalUpdateCurrentNodeAction
    | GlobalUpdateMatrixAction
    | GlobalUpdateSelectedMatrixCellAction
