import React, {useEffect, useRef} from 'react';
import {createStyles, createTheme, makeStyles, ThemeProvider} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    Container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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

const echarts = require("echarts");

interface StatisticChartsProps {
    data: {
        train_tt: number[],
        train_ff: number[],
        train_tf: number[],
        train_ft: number[],
        test_true: number[],
        test_false: number[]
    },
    xAxisData: string[]
}

const LineUpCharts: React.FC = () => {
    const classes = useStyles();
    const rootNode = useRef(null);

    useEffect(() => {
        renderCharts();
    }, [])

    const renderCharts = () => {

        const div = rootNode.current;
        const chart = echarts.init(div);

        const option = {
            dataset: [
                {
                    source: [
                        [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                        [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                        [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                        [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                        [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
                    ]
                },
                {
                    transform: {
                        type: 'boxplot',
                        config: { itemNameFormatter: 'feature {value}' }
                    }
                },
                {
                    fromDatasetIndex: 1,
                    fromTransformResult: 1
                }
            ],
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '5%'
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                splitArea: {
                    show: false
                }
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    datasetIndex: 1
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    datasetIndex: 2
                }
            ]
        };
        chart.setOption(option);
    }

    return <ThemeProvider theme={theme}>
        <div className={classes.Container}>
            <div style={{width: 620, height: 500}} ref={rootNode}/>
        </div>
    </ThemeProvider>
}

export default LineUpCharts;
