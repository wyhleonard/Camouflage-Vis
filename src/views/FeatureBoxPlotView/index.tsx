import React, {useEffect, useState} from 'react';
import {fetchFeatures} from "../../api";
import FeatureCharts from "../FeatureCharts";
import ViewContainer from "../../components/ViewContainer";
import {createSelector} from "reselect";
import {RootState} from "../../store";
import {GlobalState} from "../../store/GlobalStore";
import {useSelector} from "react-redux";

const globalInfo = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({
        kCommunities: global.kCommunities,
        selectedMatrixCell: global.selectedMatrixCell
    })
)
const FeatrueBoxPlotView = () => {
    const {kCommunities, selectedMatrixCell} = useSelector(globalInfo);
    const [featureData1, setFeatureData1] = useState([]);
    const [featureData2, setFeatureData2] = useState([]);
    const [featureData3, setFeatureData3] = useState([]);

    useEffect(() => {

        const [i, j] = selectedMatrixCell;

        // 第i个，第j个，重叠的
        const nodes_id: number[][] = [[], [], []]

        const community1 = kCommunities[i].community
        const community2 = kCommunities[j].community

        community1.forEach((c: number) => {
            if (community2.includes(c)) {
                nodes_id[2].push(c);
            } else {
                nodes_id[0].push(c);
            }
        })

        community2.forEach((c: number) => {
            if (!community1.includes(c)) {
                nodes_id[1].push(c);
            }
        })

        fetchFeatures({nodes_id: nodes_id[0]}).then((data) => {
            const {normalize_features, raw_features, selected_community_feature} = data;
            setFeatureData1(selected_community_feature.slice(1));
        })
        fetchFeatures({nodes_id: nodes_id[1]}).then((data) => {
            const {normalize_features, raw_features, selected_community_feature} = data;
            setFeatureData2(selected_community_feature.slice(1));
        })
        fetchFeatures({nodes_id: nodes_id[2]}).then((data) => {
            const {normalize_features, raw_features, selected_community_feature} = data;
            setFeatureData3(selected_community_feature.slice(1));
        })
    }, [selectedMatrixCell])

    return <div>
        <FeatureCharts data={featureData1}/>
        <FeatureCharts data={featureData2}/>
        <FeatureCharts data={featureData3}/>
    </div>
}

export default FeatrueBoxPlotView;
