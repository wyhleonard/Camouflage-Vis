import { 
    createStyles, 
    makeStyles,
} from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../../store";
import { GlobalState } from "../../../store/GlobalStore";
import { GnnNode } from "../../../types";
import { useDispatch } from "react-redux";
import { GlobalActions, GlobalUpdateCurrentNodeAction } from "../../../store/GlobalActions";

const useStyles = makeStyles(() => createStyles({
    root: {
        width: '100%',
        height: '100%',
    },
    listDiv: {
        width: 'calc(100% - 20px)',
        height: 'calc(100% - 20px)',
        margin: 10,
        overflowY: 'auto',  
    },
    listItem: {
        width: 'calc(100% - 8px)',
        height: 'calc(50% - 4px)',
        marginLeft: 4,
        marginBottom: 4,
        border: '2px solid #021D38',
        borderRadius: 4,
        boxSizing: 'border-box',
    },
    textDiv: {
        width: '100%',
        height: '10%',
        display: 'flex',
        alignContent: 'center',
    },
    textStyle: {
        marginLeft: 10,
        color: '#021D38',
        fontSize: 16,
    },
}));

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        gnnNodes: global.gnnNodes,
    })
)

export interface BasicInfoViewProps {

}

const BasicInfoView: React.FC<BasicInfoViewProps> = ({

}) => {
    const classes = useStyles();
    const {
        gnnNodes,
        // focusedGnnNodes
    } = useSelector(globalInfo);
    const dispatch = useDispatch();

    const [focusedNodes, setFocusedNodes] = useState<GnnNode[]>([]);
    const [currentNode, setCurrentNode] = useState<GnnNode>({} as GnnNode);

    // console.log('wyh-test-01', focusedNodes, currentNode);
    
    useEffect(() => {
        if(gnnNodes.length > 0) {
            const nodeIds: number[] = [];
            const nodeList: GnnNode[] = [];
            gnnNodes.forEach((gn: GnnNode) => {
                // if(gn.ground_truth_label !== gn.gnn_prob_label && gn.ground_truth_label === 0) {
                // if(gn.ground_truth_label === 1) {
                //     nodeIds.push(gn.id);
                //     nodeList.push(JSON.parse(JSON.stringify(gn)));
                // }
                if(gn.id === 6674) {  // 10900
                    nodeIds.push(gn.id);
                    nodeList.push(JSON.parse(JSON.stringify(gn)));
                }
            })

            fetch('http://127.0.0.1:8000/fetch_relation_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                mode: "cors",
                cache: "default",
                body: JSON.stringify({
                    input: nodeIds
                })
            })
            .then(res => res.json())
            .then(json => {
                const relationData = json.relationData;
                // console.log('wyh-test-02', nodeList.length, relationData.length);
                for(let i = 0; i < relationData.length; i++) {
                    for(let r = 0; r < relationData[i].length; r++) {
                        nodeList[i].selected_neighs.push([]);
                        for(let k = 0; k < relationData[i][r][0].length; k++) {
                            nodeList[i].selected_neighs[r].push(relationData[i][r][0][k][1])
                        }
                        nodeList[i].unselected_neighs.push([]);
                        for(let k = 0; k < relationData[i][r][1].length; k++) {
                            nodeList[i].unselected_neighs[r].push(relationData[i][r][1][k][1])
                        }
                    }
                }
                setFocusedNodes(nodeList);
            })
        }
    }, [gnnNodes])

    const listItem = useMemo(() => {
        return focusedNodes.map((fn: GnnNode) => {
            return <div key={`list-item-${fn.id}`} className={classes.listItem} onClick={() => setCurrentNode(fn)}>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`ID: ${fn.id}`}</span>
                    <span className={classes.textStyle}>{`GTL: ${fn.ground_truth_label}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`GPS: ${fn.gnn_prob_score[0]}/${fn.gnn_prob_score[1]}`}</span>
                    <span className={classes.textStyle}>{`GPL: ${fn.gnn_prob_label}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`LPS: ${fn.fcn_prob_score[0]}/${fn.fcn_prob_score[1]}`}</span>
                    <span className={classes.textStyle}>{`LPL: ${fn.fcn_prob_label}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`R0-S: ${fn.selected_neighs[0].length}`}</span>
                    <span className={classes.textStyle}>{`R1-S: ${fn.selected_neighs[1].length}`}</span>
                    <span className={classes.textStyle}>{`R2-S: ${fn.selected_neighs[2].length}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`R0-US: ${fn.unselected_neighs[0].length}`}</span>
                    <span className={classes.textStyle}>{`R1-US: ${fn.unselected_neighs[1].length}`}</span>
                    <span className={classes.textStyle}>{`R2-US: ${fn.unselected_neighs[2].length}`}</span>
                </div>
            </div>
        })
    }, [focusedNodes, gnnNodes])

    useEffect(() => {
        if(currentNode.id !== undefined) {

            const nodeIds: number[][] = [];
            currentNode.selected_neighs.forEach((r: number[], i: number) => {
                nodeIds.push([]);
                r.forEach((n: number) => {
                    if(n !== currentNode.id) {
                        nodeIds[i].push(n);
                    }
                });
            })
            currentNode.unselected_neighs.forEach((r: number[], i: number) => r.forEach((n: number) => nodeIds[i].push(n)));

            // const nodes: number[] = [];
            // gnnNodes.forEach((gn: GnnNode) => {
            //     if(gn.ground_truth_label === 1 && gn.gnn_prob_label === 0) {
            //         nodes.push(gn.id);
            //     }
            // })
            // const nodeIds = [nodes, nodes, nodes]

            console.log('wyh-test-nodeIds', nodeIds)
            fetch('http://127.0.0.1:8000/fetch_subgraph_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                mode: "cors",
                cache: "default",
                body: JSON.stringify({
                    input: nodeIds
                })
            })
            .then(res => res.json())
            .then(json => {
                // console.log('wyh-test-03', json.graphData);
                const graphData = json.graphData;
                const relations: [number, number, number][][] = []
                for(let i = 0; i < graphData.length; i++) {
                    relations.push([]);
                    for(let k = 0; k < graphData[i].length; k++) {
                        relations[i].push(graphData[i][k])
                    }
                }

                dispatch<GlobalUpdateCurrentNodeAction>({
                    type: GlobalActions.UpdateCurrentNode,
                    payload: {
                        node: currentNode,
                        edges: relations
                    }
                })
            })
        }
    }, [currentNode])

    return <div className={classes.root}>
        <div className={classes.listDiv}>
            {listItem}
        </div>
    </div>
}

export default BasicInfoView;  