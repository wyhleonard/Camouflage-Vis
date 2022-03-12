import {GnnInfoViewProps} from "./type";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import ScatterPlotView from "./components/ScatterPlotView";
import ScoreStatisticsView from "../ScoreStatisticsView";
import ViewContainer from "../../components/ViewContainer";

const useStyles = makeStyles(() => createStyles({
    root: {
        width: "100%",
        height: "100%",
        boxSizing: 'border-box',
    },
    basicInfoView: {
        width: '100%',
        height: '35%',
    },
    scatterPlotView: {
        width: '100%',
        height: '65%',
    }
}));

const GnnInfoView: React.FC<GnnInfoViewProps> = ({}) => {
    const classes = useStyles();

    return <div className={classes.root}>
        <div className={classes.scatterPlotView}>
            <ViewContainer title={"OverView"}>
                <ScatterPlotView/>
            </ViewContainer>
        </div>
        <div className={classes.basicInfoView}>
            <ViewContainer title={"StatisticsView"}>
                <ScoreStatisticsView/>
            </ViewContainer>
        </div>
    </div>
}

export default GnnInfoView;
