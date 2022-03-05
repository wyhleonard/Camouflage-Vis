import { GnnInfoViewProps } from "./type";
import { 
    createStyles, 
    makeStyles,
    Paper, 
} from "@material-ui/core";
import BasicInfoView from "./components/BasicInfoView";
import ScatterPlotView from "./components/ScatterPlotView";

const useStyles = makeStyles(() => createStyles({
    root: {
        marginLeft: 4,
        marginTop: 4,
        width: 'calc(100% - 6px)',
        height: 'calc(100% - 8px)',
        borderWidth: 2,
        boxSizing: 'border-box',
    },
    basicInfoView: {
        width: '100%',
        height: '50%',
    },
    scatterPlotView: {
        width: '100%',
        height: '50%',
    }
}));

const GnnInfoView: React.FC<GnnInfoViewProps> = ({

}) => {
    const classes = useStyles();

    return <Paper variant='outlined' className={classes.root}>
        <div className={classes.basicInfoView}>
            <BasicInfoView />
        </div>
        <div className={classes.scatterPlotView}>
            <ScatterPlotView />
        </div>
    </Paper>
}

export default GnnInfoView;