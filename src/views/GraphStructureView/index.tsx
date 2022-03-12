import {d3Edge, GraphStructureViewProps} from "./type";
import {
    Button,
    ButtonGroup,
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {createSelector} from "reselect";
import {RootState} from "../../store";
import {GlobalState} from "../../store/GlobalStore";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import ForceLayout from "./components/ForceLayout";
import {GnnNode} from "../../types";
import {GlobalActions, GlobalUpdateCurrentNodeAction} from "../../store/GlobalActions";
import {fetchNodesRelation, fetchSubgraphData} from "../../api";

const useStyles = makeStyles(() => createStyles({
    root: {
        width:"100%",
        height:"100%"
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

const GraphStructureView: React.FC<GraphStructureViewProps> = ({}) => {
    const classes = useStyles();
    const {gnnNodes} = useSelector(globalInfo);

    const [layoutSvgs, setLayoutSvgs] = useState([]);
    const container = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setHeight(container.current?.clientHeight || 0)
    }, [container])

    useEffect(() => {
        if (gnnNodes.length > 0) {
            const nodes_id = [6309, 9581, 8197, 7841, 6824, 9522, 9248, 6937, 3940, 6770, 7654, 4375]

            const nodes = nodes_id.map((node) => {
                return gnnNodes.find((n) => n.id === node);
            });

            fetchNodesRelation({nodes_id})
                .then((data) => {
                    const {relations} = data;
                    const edges: d3Edge[] = [];
                    const layout: any = [];

                    relations.forEach((relation: number[][]) => {
                        relation.map((r) => {
                            edges.push({source: r[0], target: r[1], isSelected: 1});
                        })
                    })

                    layout.push(
                        <ForceLayout
                            key={`layout-svg-${0}`}
                            index={0}
                            width={height}
                            height={height}
                            nodes={nodes as GnnNode[]}
                            edges={edges}
                        />
                    )

                    setLayoutSvgs(layout);
                })
        }
    }, [height, gnnNodes])

    return <div className={classes.root}>
        <div className={classes.forceLayoutDiv} ref={container}>
            {layoutSvgs}
        </div>
    </div>
}

export default GraphStructureView;
