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

const LineUpCharts: React.FC<StatisticChartsProps> = ({data, xAxisData}) => {
    const classes = useStyles();
    const rootNode = useRef(null);

    useEffect(() => {
        renderCharts();
    }, [data, xAxisData])

    const renderCharts = () => {
        const {train_tt, train_ff, train_ft, test_false, test_true, train_tf} = data;
        const div = rootNode.current;
        const chart = echarts.init(div);

        const option = {
            tooltip: {},
            xAxis: {
                data: xAxisData,
            },
            legend: {},
            yAxis: {},
            grid: {
                left: '0%',
                right: '4%',
                bottom: '0%',
                containLabel: true
            },
            series: [
                {
                    name: 'train_tt',
                    type: 'bar',
                    stack: 'train',
                    data: train_tt,
                    itemStyle: {}
                },
                {
                    name: 'train_ff',
                    type: 'bar',
                    stack: 'train',
                    data: train_ff,
                    itemStyle: {}
                },
                {
                    name: 'train_tf',
                    type: 'bar',
                    stack: 'train',
                    data: train_tf,
                    itemStyle: {}
                },
                {
                    name: 'train_ft',
                    type: 'bar',
                    stack: 'train',
                    data: train_ft,
                    itemStyle: {}
                },
                {
                    name: 'test_true',
                    type: 'bar',
                    stack: 'test',
                    data: test_true,
                    itemStyle: {}
                },
                {
                    name: 'test_false',
                    type: 'bar',
                    stack: 'test',
                    data: test_false,
                    itemStyle: {}
                },
            ]
        };
        chart.setOption(option);
    }

    return <ThemeProvider theme={theme}>
        <div className={classes.Container}>
            <div style={{width: 620, height: 150}} ref={rootNode}/>
        </div>
    </ThemeProvider>
}

export default LineUpCharts;
