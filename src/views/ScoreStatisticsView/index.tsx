import React, {useEffect, useMemo, useState} from "react";
import StatisticCharts from "./components/StatisticCharts";
import {fetchCcoreStatistics} from "../../api";

const ScoreStatisticsView: React.FC = () => {
    const getDefaultData = () => {
        const xAxisData: any = [];
        const train_tt: number[] = [];
        const train_ff: number[] = [];
        const train_tf: number[] = [];
        const train_ft: number[] = [];
        const test_true: number[] = [];
        const test_false: number[] = [];

        for (let i = 0; i < 10; i++) {
            xAxisData.push(i);
            train_tt.push(Math.random() * 2);
            train_ff.push(Math.random() * 2);
            train_tf.push(Math.random() * 2);
            train_ft.push(Math.random() * 2);
            test_true.push(Math.random() * 2);
            test_false.push(Math.random() * 2);
        }

        return {
            xAxisData,
            data: {test_true, test_false, train_ff, train_ft, train_tf, train_tt}
        }
    }
    const gnnDefaultData = useMemo(getDefaultData, []);
    const fcnDefaultData = useMemo(getDefaultData, []);

    const [gnnScoreBins, setGnnScoreBins] = useState(gnnDefaultData.xAxisData);
    const [fcnScoreBins, setFcnScoreBins] = useState(fcnDefaultData.xAxisData);
    const [gnnScoreData, setGnnScoreData] = useState(gnnDefaultData.data);
    const [fcnScoreData, setFcnScoreData] = useState(fcnDefaultData.data);

    useEffect(() => {
        // request
        fetchCcoreStatistics().then((data) => {
            const {fcn_bins, fcn_counts, gnn_bins, gnn_counts} = data;
            console.log("get statistics data", data);
            setGnnScoreBins(gnn_bins.map((i: number) => i.toFixed(2)));
            setFcnScoreBins(fcn_bins.map((i: number) => i.toFixed(2)));
            setGnnScoreData(gnn_counts);
            setFcnScoreData(fcn_counts);
        });

    }, [])

    return <div>
        <StatisticCharts data={gnnScoreData} xAxisData={gnnScoreBins}/>
        <StatisticCharts data={fcnScoreData} xAxisData={fcnScoreBins}/>
    </div>
}

export default ScoreStatisticsView;
