import {
    createStyles,
    createTheme,
    IconButton,
    makeStyles, Paper,
    ThemeProvider
} from "@material-ui/core";
// import RevealView from "./views/RevealView";
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BackendIcon from '@material-ui/icons/Backup';
import {GnnNode} from "./types";
import {useDispatch} from "react-redux";
import {GlobalActions, GlobalUpdateGnnNodesAction} from "./store/GlobalActions";
import GnnInfoView from "./views/GnnInfoView";
import GraphStructureView from "./views/GraphStructureView";
import LineUpView from "./views/LineUpView/index"
import {fetchInitData} from "./api";
import ConfusionMatrixView from "./views/ConfusionMatrixView";
import ViewContainer from "./components/ViewContainer";

const useStyles = makeStyles(() => createStyles({
    app: {
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    },
    systemTitle: {
        width: '100%',
        height: '4%',
        background: '#021D38',
        display: 'flex',
        alignItems: 'center',
    },
    titleIcon: {
        marginLeft: 10,
    },
    titleText: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 24,
        fontWeight: 700,
    },
    uploadIcon: {
        marginLeft: 1655,
    },
    mainContent: {
        width: '100%',
        height: '96%',
        display: 'flex',
    },
    revealView: {
        width: '100%',
        height: '48%',
    },
    gnnInfoView: {
        width: '35%',
        height: '100%',
    },
    networkInfoDiv: {
        width: '65%',
        height: '100%',
        margin: 4
    },
    graphStructureView: {
        width: '100%',
        height: '50%',
    },
    nodeInformationView: {}
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

const App: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleUploadData = () => {
        fetchInitData().then(json => {
            const gnnNodes: GnnNode[] = [];
            const nodesData = json.data;

            for (let i = 0; i < nodesData.id.length; i++) {
                gnnNodes.push({
                    id: nodesData.id[i],
                    embedding: nodesData.embedding[i],
                    gnn_prob_score: [nodesData.score[i][0], nodesData.score[i][1]],
                    fcn_prob_score: [nodesData.score[i][2], nodesData.score[i][3]],
                    gnn_prob_label: nodesData.label[i][0],
                    fcn_prob_label: nodesData.label[i][1],
                    ground_truth_label: nodesData.label[i][2],
                    isTrainNode: nodesData.isTrain[i] === 1 ? true : false,
                    selected_neighs: [],
                    unselected_neighs: []
                })
            }

            dispatch<GlobalUpdateGnnNodesAction>({
                type: GlobalActions.UpdateGnnNodes,
                payload: gnnNodes
            })
        })
    }

    return <ThemeProvider theme={theme}>
        <div className={classes.app}>
            <div className={classes.systemTitle}>
                <AccountTreeIcon className={classes.titleIcon} color={'secondary'}/>
                <span className={classes.titleText}>CamouflageVis</span>
                <IconButton onClick={handleUploadData}>
                    <BackendIcon className={classes.uploadIcon} color={'secondary'}/>
                </IconButton>
            </div>

            <div className={classes.mainContent}>
                <div className={classes.gnnInfoView}>
                    <GnnInfoView/>
                </div>

                <div className={classes.networkInfoDiv}>
                    <div style={{display: "flex", height: "50%", overflow: "auto"}}>
                        <ViewContainer title={"LineupView"}>
                            <LineUpView/>
                        </ViewContainer>

                        <ViewContainer title={"ConfusionMatrixView"}>
                            <ConfusionMatrixView/>
                        </ViewContainer>
                    </div>
                    <div className={classes.graphStructureView}>
                        <ViewContainer title={"GraphStructureView"}>
                            <GraphStructureView/>
                        </ViewContainer>
                    </div>
                </div>
            </div>
        </div>
    </ThemeProvider>
}

export default App;
