import React from 'react';
import {createStyles, makeStyles, Paper} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    root: {
        margin: 4,
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        boxSizing: 'border-box',
        borderWidth: 2
    },
    title: {
        margin: 10,
        color: '#021D38',
        fontSize: 16,
        height: 22
    },
    content: {
        height: "calc(100% - 42px)"
    }
}));

interface ViewContainerProps {
    title: string
}

const ViewContainer: React.FC<ViewContainerProps> = (props) => {
    const classes = useStyles();
    return <Paper variant='outlined' className={classes.root}>
        <div className={classes.title}>
            {props.title}
        </div>
        <div className={classes.content}>
            {props.children}
        </div>
    </Paper>

}

export default ViewContainer;
