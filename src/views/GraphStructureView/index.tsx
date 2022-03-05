import { d3Edge, GraphStructureViewProps } from "./type";
import { 
    Button,
    ButtonGroup,
    createStyles, 
    makeStyles,
    Paper, 
} from "@material-ui/core";
import { createSelector } from "reselect";
import { RootState } from "../../store";
import { GlobalState } from "../../store/GlobalStore";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import ForceLayout from "./components/ForceLayout";
import { GnnNode } from "../../types";

const useStyles = makeStyles(() => createStyles({
    root: {
        marginLeft: 2,
        marginTop: 4,
        width: 'calc(100% - 6px)',
        height: 'calc(100% - 8px)',
        borderWidth: 2,
        boxSizing: 'border-box',
    },
    headDiv: {
        width: '100%',
        height: '8%',
        display: 'flex',
        alignItems: 'center',
    },
    listTitle: {
        width: '10%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    titleText: {
        marginLeft: 10,
        color: '#021D38',
        fontSize: 16,
    },
    forceLayoutDiv: {
        margin: "0px 10px 10px 10px",
        width: 'calc(100% - 20px)',
        height: 'calc(92% - 10px)',
        display: 'flex',
        overflowX: 'auto'
    },
    buttonGroupDiv: {
        width: '80%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
}));

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        gnnNodes: global.gnnNodes,
        currentNode: global.currentNode,
        currentEdges: global.currentEdges
    })
)

const GraphStructureView: React.FC<GraphStructureViewProps> = ({

}) => {
    const classes = useStyles();
    const {
        gnnNodes,
        currentNode,
        currentEdges
    } = useSelector(globalInfo);

    const [currentDisplay, setCurrentDisplay] = useState<'All' | 'Selected' | 'Discarded'>('Selected');

    const container = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setHeight(container.current?.clientHeight || 0)
    }, [container])

    console.log('wyh-test-01', currentNode, currentEdges);

    const layoutSvgs = useMemo(() => {
        const layoutSvgs = [];
        if(currentNode.selected_neighs !== undefined) {
            const subgraphs = generateSubgraph(currentNode, currentEdges[0], gnnNodes, 0);
            for(let i = 0; i < currentNode.selected_neighs.length; i++) {

                // const subgraphs = generateSubgraph(currentNode, currentEdges[i], gnnNodes, i);
                // if(i === 1) continue;

                if(currentNode.selected_neighs[i].length > 0 || currentNode.unselected_neighs[i].length > 0 && currentEdges.length > 0) {

                    const nodes: GnnNode[] = [currentNode];
                    for(let k = 0; k < currentNode.selected_neighs[i].length; k++) {
                        const sn = gnnNodes.find(d => d.id === currentNode.selected_neighs[i][k]);
                        if(!!sn) nodes.push(sn);
                    }

                    for(let k = 0; k < currentNode.unselected_neighs[i].length; k++) {
                        const usn = gnnNodes.find(d => d.id === currentNode.unselected_neighs[i][k]);
                        if(!!usn) nodes.push(usn);
                    }

                    const edges: d3Edge[] = [];
                    for(let k = 0; k < currentEdges[i].length; k++) {
                        if(currentDisplay === 'Selected' && currentEdges[i][k][2] === 1) {
                            edges.push({
                                source: currentEdges[i][k][0],
                                target: currentEdges[i][k][1],
                                isSelected: currentEdges[i][k][2]
                            })
                        } else if(currentDisplay === 'Discarded' && currentEdges[i][k][2] === 0) {
                            edges.push({
                                source: currentEdges[i][k][0],
                                target: currentEdges[i][k][1],
                                isSelected: currentEdges[i][k][2]
                            })
                        } else if(currentDisplay === 'All') {
                            edges.push({
                                source: currentEdges[i][k][0],
                                target: currentEdges[i][k][1],
                                isSelected: currentEdges[i][k][2]
                            })
                        }
                    }

                    layoutSvgs.push(
                        <ForceLayout 
                            key={`layout-svg-${i}`}
                            index={i}
                            width={height} 
                            height={height}
                            nodes={nodes}
                            edges={edges}
                        />
                    )
                }
            }
            return layoutSvgs;
        }
    }, [currentNode, currentEdges, height, currentDisplay])

    return <Paper variant='outlined' className={classes.root}>
        <div className={classes.headDiv}>
            <div className={classes.listTitle}>
                <span className={classes.titleText}>Graph Structure</span>
            </div>
            <div className={classes.buttonGroupDiv}>
                <ButtonGroup color='primary'>
                    <Button size='small' onClick={() => setCurrentDisplay('All')}>All</Button>
                    <Button size='small' onClick={() => setCurrentDisplay('Selected')}>Selected</Button>
                    <Button size='small' onClick={() => setCurrentDisplay('Discarded')}>Discarded</Button>
                </ButtonGroup>
            </div>
        </div>
        <div className={classes.forceLayoutDiv} ref={container}>
            {layoutSvgs}
        </div>
    </Paper>
}

export default GraphStructureView;

export const generateSubgraph = (currentNode: GnnNode, inputEdges: [number, number, number][], gnnNodes: GnnNode[], r: number) => {
    const nodes: GnnNode[] = [currentNode];
    for(let k = 0; k < currentNode.selected_neighs[r].length; k++) {
        const sn = gnnNodes.find(d => d.id === currentNode.selected_neighs[r][k]);
        if(!!sn) nodes.push(sn);
    }

    for(let k = 0; k < currentNode.unselected_neighs[r].length; k++) {
        const usn = gnnNodes.find(d => d.id === currentNode.unselected_neighs[r][k]);
        if(!!usn) nodes.push(usn);
    }

    // filter edges
    const currentEdges: [number, number, number][] = [];
    for(let k = 0; k < inputEdges.length; k++) {
        let hasAppear = false;
        const node0 = inputEdges[k][0];
        const node1 = inputEdges[k][1];
        for(let i = 0; i < currentEdges.length; i++) {
            if(node0 === currentEdges[i][1] && node1 === currentEdges[i][0]) {
                hasAppear = true;
                break;
            }
        }
        if(hasAppear === false) {
            currentEdges.push(inputEdges[k]);
        }
    }

    const nodesId: number[] = [];
    for(let k = 0; k < currentNode.selected_neighs[r].length; k++) {
        nodesId.push(currentNode.selected_neighs[r][k])
    }
    for(let k = 0; k < currentNode.unselected_neighs[r].length; k++) {
        nodesId.push(currentNode.unselected_neighs[r][k])
    }

    // console.log('wyh-test-198', inputEdges.length, currentEdges.length, nodesId.length);

    let graphsId: number[][] = [];
    for(let k = 0; k < nodesId.length; k++) {
        graphsId.push([nodesId[k]]);
    }

    for(let i = 0; i < currentEdges.length; i++) {
        const node0 = currentEdges[i][0];
        const node1 = currentEdges[i][1];
        const node0Graphs: number[] = [];
        const node1Graphs: number[] = [];
        for(let k = 0; k < graphsId.length; k++) {
            if(graphsId[k].indexOf(node0) !== -1) node0Graphs.push(k);
            if(graphsId[k].indexOf(node1) !== -1) node1Graphs.push(k);
        }

        let hasNewGraph = false;
        for(let m = 0; m < node0Graphs.length; m++) {
            for(let n = 0; n < node1Graphs.length; n++) {

                const graph0 = node0Graphs[m];
                const graph1 = node1Graphs[n];
                const uniqueNodes: number[] = [];
                const uniqueEdges: [number, number][] = [[node0, node1]];

                // uniqueNodes
                for(let x = 0; x < graphsId[graph1].length; x++) {
                    uniqueNodes.push(graphsId[graph1][x]);
                }
                for(let x = 0; x < graphsId[graph0].length; x++) {
                    if(uniqueNodes.indexOf(graphsId[graph0][x]) === -1) uniqueNodes.push(graphsId[graph0][x]);
                }

                 // uniqueEdges
                //  console.log('test', graphsId[graph0], graphsId[graph1])
                for(let x = 0; x < graphsId[graph1].length - 1; x++) {
                    for(let y = x + 1; y < graphsId[graph1].length; y++) {
                        let hasCounted = false;
                        for(let k = 0; k < uniqueEdges.length; k++) {
                            if(
                                (graphsId[graph1][x] === uniqueEdges[k][0] && graphsId[graph1][y] === uniqueEdges[k][1]) ||
                                (graphsId[graph1][x] === uniqueEdges[k][1] && graphsId[graph1][y] === uniqueEdges[k][0])
                            ) {
                                hasCounted = true;
                                break;
                            }
                        }
                        if(hasCounted === false) uniqueEdges.push([graphsId[graph1][x], graphsId[graph1][y]]);
                    }
                }
                for(let x = 0; x < graphsId[graph0].length - 1; x++) {
                    for(let y = x + 1; y < graphsId[graph0].length; y++) {
                        let hasCounted = false;
                        for(let k = 0; k < uniqueEdges.length; k++) {
                            if(
                                (graphsId[graph0][x] === uniqueEdges[k][0] && graphsId[graph0][y] === uniqueEdges[k][1]) ||
                                (graphsId[graph0][x] === uniqueEdges[k][1] && graphsId[graph0][y] === uniqueEdges[k][0])
                            ) {
                                hasCounted = true;
                                break;
                            }
                        }
                        if(hasCounted === false) uniqueEdges.push([graphsId[graph0][x], graphsId[graph0][y]]);
                    }
                }

                const nodeNum = uniqueNodes.length;
                if(uniqueEdges.length === nodeNum * (nodeNum - 1) / 2) {
                    // console.log(uniqueNodes, uniqueEdges)
                    graphsId[graph0] = uniqueNodes;
                    // graphsId.splice(graph1, 1);
                    graphsId[graph1] = [];
                    hasNewGraph = true;
                } else {
                    // determine whether there are new complete subgraphs - graph0 - node1
                    let isAllConnected = true;
                    for(let x = 0; x < graphsId[graph0].length; x++) {
                        let isConnected = false;
                        for(let y = 0; y < uniqueEdges.length; y++) {
                            if(
                                (uniqueEdges[y][0] === graphsId[graph0][x] && uniqueEdges[y][1] === node1) ||
                                (uniqueEdges[y][1] === graphsId[graph0][x] && uniqueEdges[y][0] === node1)
                            ) {
                                isConnected = true;
                                break;
                            }
                        }
                        if(isConnected === false) {
                            isAllConnected = false;
                            break;
                        }
                    }
                    if(isAllConnected) graphsId[graph0].push(node1);

                    // graph1 - node0
                    let isAllConnected1 = true;
                    for(let x = 0; x < graphsId[graph1].length; x++) {
                        let isConnected = false;
                        for(let y = 0; y < uniqueEdges.length; y++) {
                            if(
                                (uniqueEdges[y][0] === graphsId[graph1][x] && uniqueEdges[y][1] === node0) ||
                                (uniqueEdges[y][1] === graphsId[graph1][x] && uniqueEdges[y][0] === node0)
                            ) {
                                isConnected = true;
                                break;
                            }
                        }
                        if(isConnected === false) {
                            isAllConnected1 = false;
                            break;
                        }
                    }
                    if(isAllConnected1) graphsId[graph1].push(node0);

                    if(isAllConnected || isAllConnected1) hasNewGraph = true;
                }
            }
        }
        if(hasNewGraph === false) {
            graphsId.push([node0, node1]);
        }

        const newGraphs: number[][] = [];
        for(let k = 0; k < graphsId.length; k++) {
            if(graphsId[k].length > 0) newGraphs.push(graphsId[k]);
        }
        graphsId = JSON.parse(JSON.stringify(newGraphs));
    }
    console.log('wyh-test-graphsId', graphsId)

    // test
    // for(let i = 0; i < graphsId.length; i++) {
    //     const graph = graphsId[i];
    //     let isAllConnected = true;
    //     for(let m = 0; m < graph.length - 1; m++) {
    //         let tag = true;
    //         for(let n = m + 1; n < graph.length; n++) {
    //             const node0 = graph[m];
    //             const node1 = graph[n];
    //             let isConnected = false;
    //             for(let k = 0; k < currentEdges.length; k++) {
    //                 if((currentEdges[k][0] === node0 && currentEdges[k][1] === node1) || (currentEdges[k][1] === node0 && currentEdges[k][0] === node1)) {
    //                     isConnected = true;
    //                     break
    //                 }
    //             }
    //             if(isConnected === false) {
    //                 tag = false;
    //                 break
    //             }
    //         }
    //         if(tag === false) {
    //             isAllConnected = false;
    //             break;
    //         }
    //     }
    //     if(isAllConnected === false) {
    //         console.log('wrong connected graph', i)
    //     } else {
    //         console.log('right connected graph', i)
    //     }
    // }

    const graphGnnNodes: GnnNode[][] = [];
    for(let i = 0; i < graphsId.length; i++) {
        const t_graph: GnnNode[] = []; 
        for(let k = 0; k < graphsId[i].length; k++) {
            const node = nodes.find(d => d.id === graphsId[i][k]);
            if(!!node) t_graph.push(node)

        }
        graphGnnNodes.push(t_graph);
    }

    const wrong_distribution: number[] = [];
    const train_distribution: number[] = [];
    for(let i = 0; i < graphGnnNodes.length; i++) {
        let num = 0;
        let numt = 0;
        for(let k = 0; k < graphGnnNodes[i].length; k++) {
            if(graphGnnNodes[i][k].ground_truth_label !== graphGnnNodes[i][k].gnn_prob_label) {
                num += 1
            }
            if(graphGnnNodes[i][k].isTrainNode) numt += 1;
        }
        wrong_distribution.push(num);
        train_distribution.push(numt)
    }

    console.log('wyh-test-wrong-classified', currentNode, graphGnnNodes, wrong_distribution, train_distribution);

    for(let i = 0; i < nodes.length; i++) {
        if(nodes[i].isTrainNode === true) {
            console.log('trainnode: ', nodes[i].id, nodes[i].ground_truth_label, nodes[i].gnn_prob_label)
        }
    }

}
