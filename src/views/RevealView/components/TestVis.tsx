import { 
    createStyles, 
    makeStyles,
    Paper, 
} from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../../store";
import { GlobalState } from "../../../store/GlobalStore";
import { GnnNode } from "../../../types";
import * as d3 from 'd3';

const useStyles = makeStyles(() => createStyles({
    root: {
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 6px)',
        marginLeft: 4,
        marginTop: 4,
        borderWidth: 2,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
    },
    listDiv: {
        width: 'calc(20% - 20px)',
        height: 'calc(100% - 20px)',
        marginLeft: 10,
        background: '#bbb',
        overflowY: 'auto',  
    },
    listItem: {
        width: 'calc(100% - 8px)',
        height: 'calc(40% - 4px)',
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
    },
    textStyle: {
        marginLeft: 10,
        color: '#021D38',
        fontSize: 16,
    },
    svgDiv: {
        width: '25%',
        height: '100%',
    }
}))

export interface TestVisProps {

}

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        gnnNodes: global.gnnNodes,
        // focusedNodes: global.focusedGnnNodes
    })
)

const TestView: React.FC<TestVisProps> = ({

}) => {
    const classes = useStyles();

    const { 
        gnnNodes, 
    } = useSelector(globalInfo);

    const [listNodes, setListNodes] = useState<GnnNode[]>([])
    const [listNodeLinks, setListNodeLinks] = useState<[number, number, number][][]>([]);
    const [graphNodes, setGraphNodes] = useState<number[][]>([]);
    const [graphNodeLinks, setGraphNodeLinks] = useState<[number, number, number][][]>([]);
    const [currentId, setCurrentId] = useState<number>(3306);
   
    const projectContainer = useRef<HTMLDivElement | null>(null);
    const [svgSize, setSvgSize] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        setSvgSize([projectContainer.current?.clientWidth || 0, projectContainer.current?.clientHeight || 0]);
    }, [projectContainer]);

    useEffect(() => {
        const needBeFoundNodes: number[] = [];
        const listNodesT: GnnNode[] = [];
        gnnNodes.forEach((gn: GnnNode) => {
            if(gn.ground_truth_label == 1 && gn.gnn_prob_label == 0 && gn.isTrainNode === false) {
                needBeFoundNodes.push(gn.id);
                listNodesT.push(gn);
            }
        })

        console.log('wyh-test-01', needBeFoundNodes.length)

            fetch('http://127.0.0.1:8000/fetch_relation_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                mode: "cors",
                cache: "default",
                body: JSON.stringify({
                    input: needBeFoundNodes
                })
            })
            .then(res => res.json())
            .then(json => {
                // console.log('wyh-test-01', json);
                setListNodes(listNodesT);
                setListNodeLinks(json.relation_data);
            })

    }, [gnnNodes])

    const nodesItem = listNodes.map((gn: GnnNode) => {
            const selectedList: GnnNode[][] = [];
            const unselectedList: GnnNode[][] = [];
            for(let r = 0; r < listNodeLinks.length; r++) {
                selectedList.push([]);
                unselectedList.push([]);
                for(let k = 0; k < listNodeLinks[r].length; k++) {
                    const n1 = listNodeLinks[r][k][0];
                    const n2 = listNodeLinks[r][k][1];
                    const isSelected = listNodeLinks[r][k][2];
                    if(n1 === gn.id) {
                        if(isSelected === 1) {
                            const target = findGnnNode(gnnNodes, n2);
                            if(target !== null) selectedList[r].push(target);
                        } else {
                            const target = findGnnNode(gnnNodes, n2);
                            if(target !== null) unselectedList[r].push(target);
                        }
                    }
                    if(n2 === gn.id) {
                        if(isSelected === 1) {
                            const target = findGnnNode(gnnNodes, n1);
                            if(target !== null) selectedList[r].push(target);
                        } else {
                            const target = findGnnNode(gnnNodes, n1);
                            if(target !== null) unselectedList[r].push(target);
                        }
                    }
                }
            }

            // console.log('wyh-test-02', selectedList, unselectedList)

            const r0Info0 = getCountwithScore(selectedList[0]);
            const r0Info1 = getCountwithScore(selectedList[1]);
            const r0Info2 = getCountwithScore(selectedList[2]);

            const r1Info0 = getCountwithScore(unselectedList[0]);
            const r1Info1 = getCountwithScore(unselectedList[1]);
            const r1Info2 = getCountwithScore(unselectedList[2]);

            // if(r0Info0.count[0] > 0 || r0Info1.count[0] > 0 || r0Info2.count[0] > 0 || r1Info0.count[0] > 0 || r1Info1.count[0] > 0 || r1Info2.count[0] > 0) {
            //     console.log('neigh has counterfeit: ', gn.id)
            // }

            return <div className={classes.listItem} key={`list-item-${gn.id}`} onClick={() => setCurrentId(gn.id)}>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`ID: ${gn.id}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Score: ${gn.gnn_prob_score[0].toFixed(2)}/${gn.gnn_prob_score[1].toFixed(2)}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Score: ${gn.fcn_prob_score[0].toFixed(2)}/${gn.fcn_prob_score[1].toFixed(2)}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Selected Number - R0: ${r0Info0.count[0]}/${r0Info0.count[1]}`}</span>
                </div>
                {/* <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Selected Score - R0: ${r0Info0.score[0]}/${(r0Info0.score[2]).toFixed(2)}`}</span>
                </div> */}
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Unselected Number - R0: ${r1Info0.count[0]}/${r1Info0.count[1]}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Selected Number - R1: ${r0Info1.count[0]}/${r0Info1.count[1]}`}</span>
                </div>
                {/* <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Selected Score - R1: ${r0Info1.score[0]}/${(r0Info1.score[2]).toFixed(2)}`}</span>
                </div> */}
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Unselected Number - R0: ${r1Info1.count[0]}/${r1Info1.count[1]}`}</span>
                </div>
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Selected Number - R2: ${r0Info2.count[0]}/${r0Info2.count[1]}`}</span>
                </div>
                {/* <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Selected Score - R2: ${r0Info2.score[0]}/${(r0Info2.score[2]).toFixed(2)}`}</span>
                </div> */}
                <div className={classes.textDiv}>
                    <span className={classes.textStyle}>{`Unselected Number - R0: ${r1Info2.count[0]}/${r1Info2.count[1]}`}</span>
                </div>
            </div>
        })

    useEffect(() => {
        if(listNodeLinks.length > 0) {
            const nodeId = 3306;
            const connectNodeList: number[][] = [];
            for(let r = 0; r < listNodeLinks.length; r++) {
                connectNodeList.push([nodeId]);
                for(let k = 0; k < listNodeLinks[r].length; k++) {
                    if(listNodeLinks[r][k][0] === nodeId) {
                        connectNodeList[r].push(listNodeLinks[r][k][1])
                    } else if(listNodeLinks[r][k][1] === nodeId) {
                        connectNodeList[r].push(listNodeLinks[r][k][0])
                    }
                }
            }

            console.log('wyh-test-connectNodes: ', connectNodeList);

            fetch('http://127.0.0.1:8000/fetch_subgraph_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                mode: "cors",
                cache: "default",
                body: JSON.stringify({
                    input: connectNodeList
                })
            })
            .then(res => res.json())
            .then(json => {
                console.log('wyh-test-01', connectNodeList);
                setGraphNodes(JSON.parse(JSON.stringify(connectNodeList)));
                setGraphNodeLinks(json.relation_data);
            })
        }
    }, [listNodeLinks, gnnNodes]) // currentId

    useEffect(() => {
        if(graphNodeLinks.length > 0) {
        const data = graphNodeLinks;
        const connectNodeList = graphNodes;
        const rIndex = 1;
        if(data[rIndex].length > 0) {
            console.log('wyh-test-graph0: ', graphNodes, graphNodeLinks);

            const svg = d3.select('#r1Svg');
            svg.selectAll('*').remove();

            const nodes = [];
            for(let i = 0; i < gnnNodes.length; i++) {
                for(let j = 0; j < connectNodeList[rIndex].length; j++) {
                    if(gnnNodes[i].id === connectNodeList[rIndex][j]) nodes.push(gnnNodes[i])
                }
            }

            const edges = [];
            for(let i = 0; i < data[rIndex].length; i++) {
                edges.push({
                    source: connectNodeList[rIndex].indexOf(data[rIndex][i][0]),
                    target: connectNodeList[rIndex].indexOf(data[rIndex][i][1]),
                    isSelected: data[rIndex][i][2],
                })
            }

            console.log('wyh-test-graph: ', nodes, edges)

            const target = 'embedding'

            svg
            .append('g')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('cx', d => (d as any)[target][0] * svgSize[0])
            .attr('cy', d => (1 - (d as any)[target][1]) * svgSize[0])
            .attr('r', 3)
            .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('fill-opacity', d => d.isTrainNode ? 0.8 : 0.3)
            .attr('stroke', d => d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8)

            // const force = d3.forceSimulation(nodes as any)
            // .force('charge', d3.forceManyBody())
            // .force('link', d3.forceLink(edges))
            // .force('center', d3.forceCenter().x(svgSize[0] / 2).y(svgSize[0] / 2))

            // const drawEdges = svg.append('g')
            // .selectAll('line')
            // .data(edges)
            // .enter()
            // .append('line')
            // .style('stroke', d => d.isSelected === 1 ? '#7262fd' : '#F08BB4')
            // .attr('stroke-opacity', 1)

            // const drawNodes =svg.append('g')
            // .selectAll('circle')
            // .data(nodes)
            // .enter()
            // .append('circle')
            // .attr('r', 5)
            // .style('fill', d => {
            //     if(d.isTrainNode) {
            //         return d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA'
            //     } else {
            //         return d.gnn_prob_label == 1 ? '#B40F0F' : '#A0DC2C'
            //     }
            // })
            // .attr('fill-opacity', 1)
            // .attr('stroke', d => {
            //     if(d.isTrainNode) {
            //         return d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA'
            //     } else {
            //         return d.ground_truth_label == 1 ? '#B40F0F' : '#A0DC2C'
            //     }
            // })
            // .attr('stroke-width', 2)
            
            // force.on('tick', () => {
            //     drawEdges
            //     .attr('x1', d => (d.source as any).x)
            //     .attr('y1', d => (d.source as any).y)
            //     .attr('x2', d => (d.target as any).x)
            //     .attr('y2', d => (d.target as any).y)

            //     drawNodes
            //     .attr('cx', d => (d as any).x)
            //     .attr('cy', d => (d as any).y)
            // })

            // advance(force, 1000)
            // force.stop()
        }
    }
    }, [graphNodes, graphNodeLinks])

    return <Paper variant='outlined' className={classes.root}>
        <div className={classes.listDiv}>
            {nodesItem}
        </div>
        <div className={classes.svgDiv} ref={projectContainer}>
            <svg id='r1Svg' width={svgSize[0]} height={svgSize[0]}>

            </svg>
        </div>
    </Paper>
}

export default TestView;

const findGnnNode = (gnnNode: GnnNode[], target: number): GnnNode | null => {
    for(let i = 0; i < gnnNode.length; i++) {
        if(gnnNode[i].id === target) return gnnNode[i]
    }
    return null
}

const getCountwithScore = (nodes: GnnNode[]) => {
    const count: [number, number] = [0, 0]
    const score: [number, number, number, number] = [0, 0, 0, 0]
    nodes.forEach((gn: GnnNode) => {
        if(gn.ground_truth_label === 0) {
            count[0] += 1;
            score[0] += gn.gnn_prob_score[0]
            score[1] += gn.gnn_prob_score[1]
        } else {
            count[1] += 1;
            score[2] += gn.gnn_prob_score[0]
            score[3] += gn.gnn_prob_score[1]
        }
    })

    if(count[0] > 0) {
        score[0] /= count[0];
        score[1] /= count[0];
    }
    if(count[1] > 0) {
        score[2] /= count[1];
        score[3] /= count[1];
    }
    return {
        count: count,
        score: score,
    }
}

const advance = (force: any, num: number) => {
    for (let i = 0, n = num; i < n; ++i) {
      force.tick()
    }
}