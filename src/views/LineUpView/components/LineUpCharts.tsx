import React, {useEffect, useRef} from 'react';
import {createStyles, createTheme, makeStyles, ThemeProvider} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    Container: {
        display: "flex",
        alignItems: "center",
        marginLeft: 50,
        marginBottom: 5,
    },
    chartContainer: {
        margin: "0 2px",
        borderRadius: "2px",
        background: "#e8eaf2",
        "&:hover": {
            background: "#f5f6fa",
        }
    },
    legend: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "#777880",
        fontWeight: 600,
        marginTop: 5
    },
    rect: {
        width: 13,
        height: 13,
        border: "1px solid white",
        marginRight: 5
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

const echarts = require("echarts");
const LineUpCharts: React.FC = () => {
    const classes = useStyles();
    const rootNodes = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)];
    useEffect(() => {
        renderCharts();
    }, [])
    const renderCharts = () => {

        rootNodes.forEach((rootNode) => {
            const div = rootNode.current;
            const chart = echarts.init(div);
            let xAxisData = [];
            let data = [];
            for (let i = 0; i < 10; i++) {
                xAxisData.push('Class' + i);
                data.push(+(Math.random() * 2).toFixed(2));
            }
            const option = {
                brush: {
                    toolbox: ['lineX'],
                    xAxisIndex: 0
                },
                tooltip: {},
                toolbox: {
                    itemSize: 10,
                    itemGap: 0
                },
                xAxis: {
                    data: xAxisData,
                },
                yAxis: {},
                grid: {
                    left: "5%",
                    right: "5%",
                    bottom: "0%",
                    top: "5%"
                },
                series: [
                    {
                        name: 'bar',
                        type: 'bar',
                        data: data,
                        itemStyle: {
                            color: "#b6becb"
                        }
                    }
                ]
            };
            chart.setOption(option);
        })
    }
    const colors = ["#ebdac9", "#d9e1eb", "#8c92ac", "#ebdac9", "#d9e1eb", "#8c92ac"];
    const attrNames = ["Wrong", "Wrong", "Wrong", "Dense", "Dense", "Dense"];
    return <ThemeProvider theme={theme}>
        <div className={classes.Container}>
            {rootNodes.map((node, i) => {
                return <div className={classes.chartContainer}>
                    <div className={classes.legend}>
                        <div className={classes.rect} style={{background: colors[i]}}/>
                        {attrNames[i]}
                    </div>
                    <div style={{width: 100, height: 80}} ref={node}/>
                </div>
            })}
        </div>
    </ThemeProvider>
}

export default LineUpCharts;
