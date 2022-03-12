import {getLinearColor} from "../../../utils/d3utils";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    Cell: {
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",

        '&:hover': {
            opacity: 0.3
        }
    }
}));

interface CellPorps {
    data: number
    max: number
    min: number
    onCellClick: () => void
}

const Cell: React.FC<CellPorps> = ({data, max, min, onCellClick}) => {
    const classes = useStyles();
    const value = (data - min) / (max - min);
    return <div className={classes.Cell}
                style={{background: getLinearColor(value)}}
                onClick={onCellClick}>
        {data}
    </div>
}

export default Cell;
