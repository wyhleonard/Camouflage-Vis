import { 
    Button,
    ButtonGroup,
    createStyles, 
    makeStyles,
    Paper, 
} from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../../store";
import { GlobalState } from "../../../store/GlobalStore";
import * as d3 from 'd3';
import { GlobalActions, GlobalUpdateFocusedNodesAction } from "../../../store/GlobalActions";
import { GnnNode } from "../../../types";
import { projectType } from "../type";

const useStyles = makeStyles(() => createStyles({
    root: {
        width: 'calc(100% - 4px)',
        height: 'calc(100% - 6px)',
        marginLeft: 4,
        marginTop: 4,
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
        width: '20%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    titleText: {
        marginLeft: 10,
        color: '#021D38',
        fontSize: 16,
    },
    buttonGroupDiv: {
        width: '80%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    svgRootDiv: {
        marginLeft: 10,
        width: 'calc(100% - 20px)',
        height: 'calc(92% - 10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        gnnNodes: global.gnnNodes,
        focusedNodes: global.focusedGnnNodes
    })
)

export interface EmbeddingVisProps {

}

const EmbeddingVis: React.FC<EmbeddingVisProps> = ({

}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { 
        gnnNodes, 
        focusedNodes,
    } = useSelector(globalInfo);

    const projectContainer = useRef<HTMLDivElement | null>(null);
    const [embeddingSvg, setEmbeddingSvg] = useState<[number, number]>([0, 0]);
    const [svgOffset, setSvgOffset] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        setEmbeddingSvg([projectContainer.current?.clientWidth || 0, projectContainer.current?.clientHeight || 0]);
        setSvgOffset([projectContainer.current?.offsetLeft || 0, projectContainer.current?.offsetTop || 0]);
    }, [projectContainer]);

    const [isLasso, setIsLasso] = useState<boolean>(false);
    const [selectRectStart, setSelectRectStart] = useState<[number, number]>([0, 0]);
    const [selectRectSize, setSelectRectSize] = useState<[number, number]>([0, 0]);

    const [currentDisplay, setCurrentDisplay] = useState<projectType>('clustering');

    const r = 3;
    const defaultFillOpacity = 0.3;
    const width = embeddingSvg[0];
    const height = embeddingSvg[1];

    let target: string;
    switch(currentDisplay) {
        case 'clustering': 
            target = 'embedding';
            break;
        case 'gnn score':
            target = 'gnn_prob_score';
            break;
        case 'fcn score':
            target = 'fcn_prob_score';
            break;
        default:
            target = 'embedding';
            break;
    }

    useEffect(() => {

        const svg = d3.select('#embeddingSvg');
        svg.selectAll('*').remove();

        const testNodes: GnnNode[] = [];
        const trainNodesRight: GnnNode[] = [];
        const trainNodesError: GnnNode[] = [];

        gnnNodes.forEach((gn: GnnNode) => {
            if(gn.isTrainNode) {
                if(gn.gnn_prob_label === gn.ground_truth_label) {
                    trainNodesRight.push(gn);
                } else {
                    trainNodesError.push(gn);
                }
            }
            else {
                testNodes.push(gn);
            } 
        })

        if(target !== 'embedding') {
            svg
            .append('g')
            .append('line')
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("stroke", '#021D38')
            .attr("stroke-width", 2)
            .attr('stroke-opacity', 1)
        }

        svg
        .append('g')
        .selectAll('circle')
        .data(testNodes)
        .enter()
        .append('circle')
        .attr('cx', d => (d as any)[target][0] * width)
        .attr('cy', d => (1 - (d as any)[target][1]) * height)
        .attr('r', r)
        .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
        .attr('fill-opacity', defaultFillOpacity)

        svg
        .append('g')
        .selectAll('circle')
        .data(trainNodesRight)
        .enter()
        .append('circle')
        .attr('cx', d => (d as any)[target][0] * width)
        .attr('cy', d => (1 - (d as any)[target][1]) * height)
        .attr('r', r)
        .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
        .attr('fill-opacity', defaultFillOpacity)
        .attr('stroke', d => d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.8)

        svg
        .append('g')
        .selectAll('circle')
        .data(trainNodesError)
        .enter()
        .append('circle')
        .attr('cx', d => (d as any)[target][0] * width)
        .attr('cy', d => (1 - (d as any)[target][1]) * height)
        .attr('r', r)
        .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
        .attr('fill-opacity', defaultFillOpacity)
        .attr('stroke', d => d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.8)

    }, [gnnNodes, target])

    const updateNodes = useMemo(() => {
        if(isLasso === false && selectRectSize[0] > 0) {
            const updateNodes: GnnNode[] = [];
            gnnNodes.forEach((gn: GnnNode) => {
                const cx = (gn as any)[target][0] * width;
                const cy = (1 - (gn as any)[target][1]) * height;
                const isSelected = cx >= selectRectStart[0] && cx < selectRectStart[0] + selectRectSize[0] &&
                                    cy >= selectRectStart[1] && cy < selectRectStart[1] + selectRectSize[1];
                if(isSelected) {
                    updateNodes.push(JSON.parse(JSON.stringify(gn)));
                }
            })
            return updateNodes
        } else {
            return []
        }
    }, [gnnNodes, isLasso, selectRectStart, selectRectSize, currentDisplay])

    useEffect(() => {
        if(updateNodes.length > 0) {
            dispatch<GlobalUpdateFocusedNodesAction>({
                type: GlobalActions.UpdateFocusedNodes,
                payload: updateNodes
            })
            setSelectRectSize([0, 0])
        }
    }, [updateNodes])

    useEffect(() => {
        if(focusedNodes.length > 0) {

            const testNodes: GnnNode[] = [];
            const trainNodesRight: GnnNode[] = [];
            const trainNodesError: GnnNode[] = [];
    
            focusedNodes.forEach((gn: GnnNode) => {
                if(gn.isTrainNode) {
                    if(gn.gnn_prob_label === gn.ground_truth_label) {
                        trainNodesRight.push(gn);
                    } else {
                        trainNodesError.push(gn);
                    }
                }
                else {
                    testNodes.push(gn);
                } 
            })

            const svg = d3.select('#embeddingSvg');

            console.log('wyh-test-01')

            svg
            .append('g')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#fff')
            .attr('fill-opacity', 0.8)

            svg
            .append('g')
            .selectAll('circle')
            .data(testNodes)
            .enter()
            .append('circle')
            .attr('cx', d => (d as any)[target][0] * width)
            .attr('cy', d => (1 - (d as any)[target][1]) * height)
            .attr('r', r)
            .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('fill-opacity', defaultFillOpacity)
    
            svg
            .append('g')
            .selectAll('circle')
            .data(trainNodesRight)
            .enter()
            .append('circle')
            .attr('cx', d => (d as any)[target][0] * width)
            .attr('cy', d => (1 - (d as any)[target][1]) * height)
            .attr('r', r)
            .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('fill-opacity', defaultFillOpacity)
            .attr('stroke', d => d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8)
    
            svg
            .append('g')
            .selectAll('circle')
            .data(trainNodesError)
            .enter()
            .append('circle')
            .attr('cx', d => (d as any)[target][0] * width)
            .attr('cy', d => (1 - (d as any)[target][1]) * height)
            .attr('r', r)
            .attr('fill', d => d.gnn_prob_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('fill-opacity', defaultFillOpacity)
            .attr('stroke', d => d.ground_truth_label == 1 ? '#F6903D' : '#61DDAA')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8)
        }
    }, [focusedNodes, target])

    return <Paper variant='outlined' className={classes.root}>
        <div className={classes.headDiv}>
            <div className={classes.listTitle}>
                <span className={classes.titleText}>Overview</span>
            </div>
            <div className={classes.buttonGroupDiv}>
                <ButtonGroup color='primary'>
                    <Button size='small' onClick={() => setCurrentDisplay('clustering')}>Clustering</Button>
                    <Button size='small' onClick={() => setCurrentDisplay('gnn score')}>Gnn Score</Button>
                    <Button size='small' onClick={() => setCurrentDisplay('fcn score')}>Fcn Score</Button>
                </ButtonGroup>
            </div>
        </div>
        <div className={classes.svgRootDiv} ref={projectContainer}>
            <svg 
                id='embeddingSvg' 
                width={embeddingSvg[0]} 
                height={embeddingSvg[1]}
                onTouchStart={(e) => {
                    setSelectRectSize([0, 0]);
                    setIsLasso(true)
                    setSelectRectStart([e.changedTouches[0].clientX - svgOffset[0], e.changedTouches[0].clientY - svgOffset[1]]);
                }}
                onTouchMove={(e) => {
                    if(isLasso) {
                        const width = e.changedTouches[0].clientX - svgOffset[0] - selectRectStart[0];
                        const height = e.changedTouches[0].clientY - svgOffset[1] - selectRectStart[1];
                        if(width > 0 && height > 0) {
                            setSelectRectSize([width, height]);
                        }
                    }
                }}
                onTouchEnd={(e) => {
                    setIsLasso(false);
                    const width = e.changedTouches[0].clientX - svgOffset[0] - selectRectStart[0];
                    const height = e.changedTouches[0].clientY - svgOffset[1] - selectRectStart[1];
                    if(width > 0 && height > 0) {
                        setSelectRectSize([width, height]);
                    }
                }}
            >
                {
                    isLasso && 
                    <g>
                        <rect x={selectRectStart[0]} y={selectRectStart[1]}
                            width={selectRectSize[0]}
                            height={selectRectSize[1]}
                            fill={'#021D38'}
                            fillOpacity={defaultFillOpacity}
                        />
                    </g>
                }
            </svg>
        </div>
    </Paper>
}

export default EmbeddingVis;
