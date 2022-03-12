import {
    createStyles,
    createTheme,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import {useMemo} from "react";
import {fetchSubgraphData} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {createSelector} from "reselect";
import {RootState} from "../../store";
import {GlobalState} from "../../store/GlobalStore";
import Cell from "./components/Cell";

const useStyles = makeStyles(() => createStyles({
    Container: {
        margin: 10
    },
    ConfusionMatrix: {
        width: 300,
        height: 300,
        display: "flex",
        flexWrap: "wrap",
    },
    labelsHorizontal: {
        display: "flex",
        marginLeft: 30
    },
    labelsVertical: {
        display: "flex",
        flexDirection: "column",
    },
    labelCell: {
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    selectedCommunity: {
        marginTop: 10,
        border: "3px solid #000",
        display: "flex",
        alignItems: "center"
    },
    communityItem: {
        width: 20,
        height: 20,
        margin: 2,
        background: "#000",
        cursor: "pointer",
        "&:hover": {
            background: "#686868"
        }
    }
}));

const theme = createTheme({
    spacing: 4,
    palette: {
        primary: {
            main: '#021D38',
        },
        secondary: {
            main: '#fff',
        }
    }
})

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        gnnNodes: global.gnnNodes,
        kCommunities: global.kCommunities,
        matrixBad: global.matrixBad,
        matrixOverlap: global.matrixOverlap
    })
)

const ConfusionMatrixView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {gnnNodes, kCommunities, matrixBad, matrixOverlap} = useSelector(globalInfo);

    const {max, min} = useMemo(() => {
        let allData: number[] = []
        matrixOverlap.forEach((row) => {
            allData = allData.concat(row);
        })
        return {
            max: Math.max(...allData),
            min: Math.min(...allData)
        }
    }, [])

    const handleCellClick = (i: number, j: number) => {
        console.log(kCommunities[i], kCommunities[j]);
        // fetchSubgraphData({nodes_id: [9446]})
        //     .then((data) => {
        //         const graphData = data.graphData;
        //         const relations: [number, number, number][][] = []
        //         for (let i = 0; i < graphData.length; i++) {
        //             relations.push([]);
        //             for (let k = 0; k < graphData[i].length; k++) {
        //                 relations[i].push(graphData[i][k])
        //             }
        //         }
        //
        //         dispatch<GlobalUpdateCurrentNodeAction>({
        //             type: GlobalActions.UpdateCurrentNode,
        //             payload: {
        //                 node: currentNode as GnnNode,
        //                 edges: relations
        //             }
        //         })
        //     })
    }

    return <ThemeProvider theme={theme}>
        <div className={classes.Container}>
            <div className={classes.labelsHorizontal}>
                {kCommunities.map((i) => {
                    return <div className={classes.labelCell}>{i.k}</div>
                })}
            </div>

            <div style={{display: "flex"}}>
                <div className={classes.labelsVertical}>
                    {kCommunities.map((i) => {
                        return <div className={classes.labelCell}>{i.k}</div>
                    })}
                </div>
                <div className={classes.ConfusionMatrix} style={{
                    width: 30 * matrixOverlap.length,
                    height: 30 * matrixOverlap.length
                }}>
                    {matrixOverlap.map((row, i) => {
                        return row.map((col, j) => {
                            const data = i >= j ? matrixOverlap[i][j] : matrixBad[i][j];
                            return <Cell data={data} max={max} min={min}
                                         onCellClick={() => handleCellClick(i, j)}/>
                        })
                    })}
                </div>
            </div>
            {/*<div className={classes.selectedCommunity}>*/}
            {/*    {[1, 2, 3].map(() => {*/}
            {/*        return <div className={classes.communityItem}/>;*/}
            {/*    })}*/}
            {/*</div>*/}
        </div>
    </ThemeProvider>
}

export default ConfusionMatrixView;
