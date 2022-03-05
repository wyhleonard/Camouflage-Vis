import { RevealViewProps } from "./type";
import { 
    createStyles, 
    makeStyles, 
} from "@material-ui/core";
import EmbeddingVis from "./components/EmbeddingVis";
import GraphVis from "./components/GraphVis";
import TestView from "./components/TestVis";

const useStyles = makeStyles(() => createStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
    },
    embeddingVisComp: {
        width: '25%',
        height: '100%',
    },
    graphVisComp: {
        width: '75%',
        height: '100%',
    }
}));

const RevealView: React.FC<RevealViewProps> = ({

}) => {

    const classes = useStyles();

    return <div className={classes.root}>
        <div className={classes.embeddingVisComp}>
            <EmbeddingVis />
        </div>
        <div className={classes.graphVisComp}>
            {/* <GraphVis /> */}
            <TestView />
        </div>
    </div>
}

export default RevealView;