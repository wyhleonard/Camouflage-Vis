import React, {useEffect, useMemo, useState} from 'react';
import {createStyles, createTheme, makeStyles, ThemeProvider} from "@material-ui/core";
import LineUpCharts from "./components/LineUpCharts";
import LineUpRow from "./components/LineUpRow";
import {createSelector} from "reselect";
import {RootState} from "../../store";
import {GlobalState} from "../../store/GlobalStore";
import {useDispatch, useSelector} from "react-redux";
import {fetchCommunityMatrix, fetchConnectSubgraph} from "../../api";
import {GlobalActions, GlobalUpdateMatrixAction} from "../../store/GlobalActions";

const useStyles = makeStyles(() => createStyles({
    Container: {
        margin: 10,
        width: 50 + 100 * 6 + 4 * 6,
    },
    row: {
        display: "flex",
        alignItems: "center",
        margin: 1,
        height: 36,
        border: "1px solid #233",
        padding: 1
    },

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
        focusedNodes: global.focusedGnnNodes
    })
)


const LineUpView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const rowDataDefault = {
        value: [
            [50 + Math.random() * 100, 50 + Math.random() * 100, 50 + Math.random() * 100],
            [50 + Math.random() * 100, 50 + Math.random() * 100, 50 + Math.random() * 100],
        ],
        range: [
            [[0, 150], [0, 150], [0, 150]],
            [[0, 150], [0, 150], [0, 150]],
        ]
    }
    const {focusedNodes,} = useSelector(globalInfo);
    const [lineUpData, setLineUpData] = useState([rowDataDefault]);
    const [communities, setCommunities] = useState([[0, 1]]);

    useEffect(() => {
        if (focusedNodes.length > 0) {
            fetchConnectSubgraph({
                nodes_id: focusedNodes.map((node) => {
                    return node.id;
                })
            }).then(data => {
                console.log(data);
                const {edge_dense, error_counts, community} = data;
                const newData: any = [];

                const edgeList: number[][] = [[], [], []]
                const errorList: number[][] = [[], [], []]

                // 统计出每列的最大最小值
                edge_dense.forEach((item: any) => {
                    item.forEach((v: number, i: number) => {
                        edgeList[i].push(v);
                    })
                })
                const edgeRange = edgeList.map((item) => {
                    return [Math.min(...item), Math.max(...item)];
                })

                error_counts.forEach((item: any) => {
                    item.forEach((v: number[], i: number) => {
                        errorList[i].push(v.length);
                    })
                })
                const errorRange = errorList.map((item) => {
                    return [Math.min(...item), Math.max(...item)];
                })

                for (let i = 0; i < error_counts.length; i++) {
                    newData.push({
                        value: [error_counts[i].map((item: any) => item.length), edge_dense[i]],
                        range: [errorRange, edgeRange]
                    })
                }

                console.log(newData);
                setLineUpData(newData)
                setCommunities(community);
            })
        }
    }, [focusedNodes])

    const handleCommunitySelect = (index: number) => {
        console.log(communities[index]);
        const nodes_id = [2984, 6799, 6937, 9248, 9292, 6306, 3854, 8853, 9581, 5972, 9919, 3063, 54, 4514, 9464, 6770, 2037, 837, 3940, 10406, 5547, 9828, 8440, 10404, 6537, 5926, 7841, 4218, 6407, 11053, 8197, 10710, 4805, 4587, 9632, 2504, 7251, 9404, 3796, 11212, 4493, 7968, 6309, 5634, 9160, 3791, 6824, 6240, 11233, 3245, 7572, 4939, 3485, 5736, 6227, 7133, 6669, 2641, 4375, 7943, 11680, 5644, 7297, 4574, 9323, 6061, 8403, 4961, 5396, 6882, 544, 9522, 4264, 6238, 4549, 9958, 3797, 5215, 6883, 6363, 5584, 8017, 3996, 7278, 4382, 7370, 8342, 3889, 2100, 7654, 5477, 7389]
        fetchCommunityMatrix({nodes_id})
            .then((data) => {
                const {k_comminuties, matrix_overlap, matrix_bad} = data;
                dispatch<GlobalUpdateMatrixAction>({
                    type: GlobalActions.UpdateMatrixData,
                    payload: {
                        kCommunities: k_comminuties,
                        matrixOverlap: matrix_overlap,
                        matrixBad: matrix_bad
                    }
                })
            })
    }

    return <ThemeProvider theme={theme}>
        <div className={classes.Container}>
            <LineUpCharts/>
            {lineUpData.map((rowData: any, i) => {
                const {value, range} = rowData;
                return <LineUpRow
                    index={i}
                    value={value}
                    dataRnage={range}
                    onRowSelect={handleCommunitySelect}/>;
            })}
        </div>
    </ThemeProvider>
}

export default LineUpView;
