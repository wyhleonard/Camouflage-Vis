import React, {useEffect, useRef} from 'react';
import {createStyles, createTheme, makeStyles, ThemeProvider} from "@material-ui/core";
import {fetchFeatures} from "../api";

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

interface LineUpChartsProps {
    data: number[][]
}

const FeatureCharts: React.FC<LineUpChartsProps> = ({data}) => {
    const classes = useStyles();
    const rootNode = useRef(null);

    useEffect(() => {
        renderCharts();
    }, [data])

    const renderCharts = () => {

        const div = rootNode.current;
        const chart = echarts.init(div);

        const source = data;

        const barTransparent = source.map((d: any) => {
            return Math.min(...d);
        });
        const barData = source.map((d: any) => {
            return Math.max(...d) - Math.min(...d);
        });

        const option = {
            title: [{
                text: "Feature Box Plot",
                left: "center"
            }],
            dataset: [
                {source},
                {
                    fromDatasetIndex: 0,
                    transform: {
                        type: 'boxplot',
                    },
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
                bottom: '15%',
                top: '15%'
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
                    itemStyle: {
                        color: "rgb(255,146,146)",
                        borderWidth: 2
                    },
                    datasetIndex: 1
                },
                // {
                //     name: 'outlier',
                //     type: 'scatter',
                //     datasetIndex: 2
                // },
                {
                    name: 'transparent',
                    type: 'bar',
                    data: barTransparent,
                    stack: 'Total',
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent'
                        }
                    }
                },
                {
                    name: 'total',
                    type: 'bar',
                    data: barData,
                    stack: 'Total',
                    barWidth: '95%',
                }
            ]
        };
        chart.setOption(option);
    }

    return <ThemeProvider theme={theme}>
        <div className={classes.Container}>
            <div style={{width: 800, height: 200}} ref={rootNode}/>
        </div>
    </ThemeProvider>
}

export default FeatureCharts;
