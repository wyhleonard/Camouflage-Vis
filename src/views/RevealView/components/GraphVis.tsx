import { 
    createStyles, 
    makeStyles,
    Paper, 
} from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../../store";
import { GlobalState } from "../../../store/GlobalStore";
import { GnnNode } from "../../../types";
import * as d3 from 'd3';

const useStyles = makeStyles(() => createStyles({
    root: {
        width: 'calc(100% - 4px)',
        height: 'calc(100% - 6px)',
        marginLeft: 4,
        marginTop: 4,
        borderWidth: 2,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
    },
    graphList: {
        width: '20%',
        height: '100%',
        background: '#bbb',
        overflowY: 'auto',  
    },
    nodeLink:{

    },
    graphItem: {
        width: 'calc(100% - 8px)',
        height: '26px',
        display: 'flex',
        marginLeft: '4px',
        marginTop: '4px'
    },
    relationTypeDiv: {
        width: '26px',
        height: '26px',
        background: '#021D38',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 700,
    },
    nodeCountDiv: {
        width: '26px',
        height: '26px',
        marginLeft: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    circleDiv: {
        width: '26px',
        height: '26px',
        marginLeft: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderRadius: '13px'
    }
}))

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        focusedGnnNodes: global.focusedGnnNodes
    })
)

export interface GraphVisProps {

}

const GraphVis: React.FC<GraphVisProps> = ({

}) => {
    const classes = useStyles();
    const { focusedGnnNodes } = useSelector(globalInfo);

    // console.log('wyh-test-01', focusedTrainNodes, focusedTestNodes);

    const [connectedGraphs, setConnectedGraphs] = useState<number[][][]>([]);
    const [connectedGraphsEdges, setConnectedGraphsEdges] = useState<[number, number][][][]>([]);

    // useEffect(() => {
    //     if(focusedTrainNodes.length > 0 || focusedTestNodes.length > 0) {
    //         const nodesId: number[] = [];
    //         focusedTrainNodes.forEach((tn: GnnNode) => nodesId.push(tn.id));
    //         focusedTestNodes.forEach((tn: GnnNode) => nodesId.push(tn.id));

    //         fetch('http://127.0.0.1:8000/fetch_relation_data/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json;charset=UTF-8'
    //             },
    //             mode: "cors",
    //             cache: "default",
    //             body: JSON.stringify({
    //                 nodesId: nodesId
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(json => {
    //             const relationData: [number, number][][] = json.relation_data;
    //             const { connectedGraphs, connectedGraphsEdges }= generateConnectedGraphs(nodesId, relationData);
    //             setConnectedGraphs(connectedGraphs);
    //             setConnectedGraphsEdges(connectedGraphsEdges);
    //         })
    //     }
    // }, [focusedTrainNodes, focusedTestNodes])

    // const [currentGraphIndex, setCurrentGraphIndex] = useState<[number, number]>([-1, -1]);
    // const handleGraphItemClick = (r: number, i: number) => {
    //     console.log('wyh-test-03', r, i);
    //     setCurrentGraphIndex([r, i]);
    // }

    // const width = 500;
    // const height = 500;

    // useEffect(() => {
    //     const r = currentGraphIndex[0];
    //     const i = currentGraphIndex[1];
    //     if(r >= 0 && i >= 0) {
    //         const nodesId = connectedGraphs[r][i];
    //         const nodes = [];
    //         for(let k = 0; k < nodesId.length; k++) {
    //             let hasFound = false;
    //             for(let m = 0; m < focusedTrainNodes.length; m++) {
    //                 if(nodesId[k] === focusedTrainNodes[m].id) {
    //                     nodes.push(JSON.parse(JSON.stringify(focusedTrainNodes[m])));
    //                     hasFound = true;
    //                     break
    //                 }
    //             }
    //             if(hasFound === false) {
    //                 for(let m = 0; m < focusedTestNodes.length; m++) {
    //                     if(nodesId[k] === focusedTestNodes[m].id) {
    //                         nodes.push(JSON.parse(JSON.stringify(focusedTestNodes[m])));
    //                         break
    //                     }
    //                 }
    //             }
    //         }
    //         const edges = [];
    //         const oriEdges = connectedGraphsEdges[r][i];
    //         for(let k = 0; k < oriEdges.length; k++) {
    //             edges.push({
    //                 source: nodesId.indexOf(oriEdges[k][0]),
    //                 target: nodesId.indexOf(oriEdges[k][1]),
    //             })
    //         }

    //         console.log('wyh-test-04', nodes, edges)

    //         const svg = d3.select('#networkSvg');
    //         svg.selectAll('*').remove()

    //         const force = d3.forceSimulation(nodes as any)
    //         .force('charge', d3.forceManyBody())
    //         .force('link', d3.forceLink(edges))
    //         .force('center', d3.forceCenter().x(width / 2).y(height / 2))

    //         const drawEdges = svg.append('g')
    //         .selectAll('line')
    //         .data(edges)
    //         .enter()
    //         .append('line')
    //         .style('stroke', '#888')
    //         .attr('stroke-opacity', 0.5)

    //         console.log(drawEdges)
        
    //         const drawNodes =svg.append('g')
    //         .selectAll('circle')
    //         .data(nodes)
    //         .enter()
    //         .append('circle')
    //         .attr('r', 5)
    //         .style('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
    //         .attr('fill-opacity', 1)
    //         .attr('stroke', d => {
    //             for(let m = 0; m < focusedTrainNodes.length; m++) {
    //                 if(d.id === focusedTrainNodes[m].id) {
    //                     return d.ground_truth_label !== d.gnn_prob_label ? (d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA') : ''
    //                 }
    //             }
    //             return ''
    //         })
    //         .attr('stroke-width', 2)

    //         force.on('tick', () => {
    //             drawEdges
    //             .attr('x1', d => (d.source as any).x)
    //             .attr('y1', d => (d.source as any).y)
    //             .attr('x2', d => (d.target as any).x)
    //             .attr('y2', d => (d.target as any).y)

    //             drawNodes
    //             .attr('cx', d => d.x)
    //             .attr('cy', d => d.y)
    //         })
    //     }
    // }, [currentGraphIndex, focusedTrainNodes, focusedTestNodes, connectedGraphs, connectedGraphsEdges]);

    // const graphItems = useMemo(() => {
    //     const graphItems = [];
    //     for(let r = 0; r < connectedGraphs.length; r++) {
    //         for(let i = 0; i < connectedGraphs[r].length; i++) {
    //             // 先这么写吧
    //             const nodeCount = [0, 0, 0, 0, 0, 0];
    //             for(let k = 0; k < connectedGraphs[r][i].length; k++) {
    //                 const id = connectedGraphs[r][i][k];
    //                 for(let m = 0; m < focusedTrainNodes.length; m++) {
    //                     if(id === focusedTrainNodes[m].id) {
    //                         if(focusedTrainNodes[m].ground_truth_label === 0 && focusedTrainNodes[m].gnn_prob_label === 1) nodeCount[0] += 1;
    //                         if(focusedTrainNodes[m].ground_truth_label === 1 && focusedTrainNodes[m].gnn_prob_label === 0) nodeCount[1] += 1;
    //                         if(focusedTrainNodes[m].ground_truth_label === 0 && focusedTrainNodes[m].gnn_prob_label === 0) nodeCount[2] += 1;
    //                         if(focusedTrainNodes[m].ground_truth_label === 1 && focusedTrainNodes[m].gnn_prob_label === 1) nodeCount[3] += 1;
    //                         break
    //                     }
    //                 }

    //                 for(let m = 0; m < focusedTestNodes.length; m++) {
    //                     if(id === focusedTestNodes[m].id) {
    //                         if(focusedTestNodes[m].gnn_prob_label === 1) nodeCount[4] += 1;
    //                         if(focusedTestNodes[m].gnn_prob_label === 0) nodeCount[5] += 1;
    //                     }
    //                 }
    //             }

    //             graphItems.push(
    //                 <div className={classes.graphItem} key={`graph-item-r${r}-${i}`} onClick={() => handleGraphItemClick(r, i)}>
    //                     <div className={classes.relationTypeDiv}>
    //                         <span className={classes.textStyle}>{`R${r}`}</span>
    //                     </div>
    //                     <div className={classes.relationTypeDiv} style={{marginLeft: '4px'}}>
    //                         <span className={classes.textStyle}>{`${connectedGraphs[r][i].length}`}</span>
    //                     </div>
    //                     <div className={classes.nodeCountDiv} style={{background: '#F6903D', border: '2px solid #61DDAA'}}>
    //                         <span className={classes.textStyle}>{`${nodeCount[0]}`}</span>
    //                     </div>
    //                     <div className={classes.nodeCountDiv} style={{background: '#61DDAA', border: '2px solid #F6903D'}}>
    //                         <span className={classes.textStyle}>{`${nodeCount[1]}`}</span>
    //                     </div>
    //                     <div className={classes.nodeCountDiv} style={{background: '#F6903D', border: '2px solid #F6903D'}}>
    //                         <span className={classes.textStyle}>{`${nodeCount[3]}`}</span>
    //                     </div>
    //                     <div className={classes.nodeCountDiv} style={{background: '#61DDAA', border: '2px solid #61DDAA'}}>
    //                         <span className={classes.textStyle}>{`${nodeCount[2]}`}</span>
    //                     </div>

    //                     <div className={classes.circleDiv} style={{background: '#F6903D', border: '2px solid #F6903D'}}>
    //                         <span className={classes.textStyle}>{`${nodeCount[4]}`}</span>
    //                     </div>
    //                     <div className={classes.circleDiv} style={{background: '#61DDAA', border: '2px solid #61DDAA'}}>
    //                         <span className={classes.textStyle}>{`${nodeCount[5]}`}</span>
    //                     </div>
    //                 </div>
    //             )
    //         }
    //     }
    //     return graphItems
    // }, [connectedGraphs, focusedTrainNodes, focusedTestNodes])

    return <Paper variant='outlined' className={classes.root}>
        {/* <div className={classes.graphList}>
            {graphItems}
        </div>
        <div>
            <svg id='networkSvg' width={width} height={height}>

            </svg>
        </div> */}
    </Paper>
}

export default GraphVis;

export const generateConnectedGraphs = (nodesId: number[], relationData: [number, number][][]) => {
    const graphsIndex: number[][] = [];
    const graphsId: number[][][] = [];
    const graphsEdges: [number, number][][][] = []

    for(let r = 0; r < relationData.length; r++) {
        // console.log('relation', r, relationData[r].length)
        graphsIndex.push([])
        graphsId.push([]);
        graphsEdges.push([]);
        for(let i = 0; i < nodesId.length; i++) {
            graphsIndex[r].push(i);
            graphsId[r].push([nodesId[i]]);
            graphsEdges[r].push([])
        }
    }

    for(let r = 0; r < relationData.length; r++) {
        for(let i = 0; i < relationData[r].length; i++) {
            const relation = relationData[r][i];
            const index0 = nodesId.indexOf(relation[0]);
            if(index0 !== -1 && graphsId[r][graphsIndex[r][index0]].indexOf(relation[1]) === -1) {
                const index1 = nodesId.indexOf(relation[1]);
                if(index1 !== -1 && graphsIndex[r][index0] !== graphsIndex[r][index1]) {
                    // update graphsId
                    for(let k = 0; k < graphsId[r][graphsIndex[r][index1]].length; k++) {
                        graphsId[r][graphsIndex[r][index0]].push(graphsId[r][graphsIndex[r][index1]][k])
                    }
                    graphsId[r][graphsIndex[r][index1]] = [];

                    // update graphsEdges
                    graphsEdges[r][graphsIndex[r][index0]].push(relation);
                    for(let k = 0; k < graphsEdges[r][graphsIndex[r][index1]].length; k++) {
                        graphsEdges[r][graphsIndex[r][index0]].push(graphsEdges[r][graphsIndex[r][index1]][k])
                    }
                    graphsEdges[r][graphsIndex[r][index1]] = [];

                    // update graphsIndex
                    graphsIndex[r][index1] = graphsIndex[r][index0];
                }
            }
        }
    }

    const graphs: number[][][] = [];
    const edges: [number, number][][][] = [];
    for(let r = 0; r < relationData.length; r++) {
        graphs.push([]);
        edges.push([]);
        for(let i = 0; i < graphsId[r].length; i++) {
            if(graphsId[r][i].length > 1) {
                graphs[r].push(graphsId[r][i]);
                edges[r].push(graphsEdges[r][i]);
            }
        }
    }

    console.log('wyh-test-02', graphs, edges)
    return {
        connectedGraphs: graphs,
        connectedGraphsEdges: edges
    }
}