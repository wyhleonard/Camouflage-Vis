import React, {useMemo, useState} from 'react';
import {createStyles, createTheme, makeStyles, ThemeProvider} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    Container: {
        display: "flex",
        alignItems: "center",
        margin: 1,
        height: 30,
        border: "1px solid #CDCDCD",
        padding: 1,
        cursor: "pointer",
        "&:hover": {
            background: "#e5f2f8"
        },
        "&:hover > $block > $bar > $barText": {
            display: "block"
        }
    },
    text: {
        width: 50,
        textAlign: "center"
    },
    block: {
        background: "#f3f3f3",
        height: 28,
        margin: "0 2px"
    },
    bar: {
        width: 60,
        height: 28,
        marginRight: 3,
        background: "#dbcce2",
        display: "inline-block",
        borderRadius: 3
    },
    barText: {
        fontSize: 14,
        color: "white",
        lineHeight: "28px",
        margin: "0 5px",
        display: "none"
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

interface LineUpRowProps {
    index: number
    value: number[][]
    dataRnage: number[][]
    onRowSelect: (index: number) => void
}

const LineUpRow: React.FC<LineUpRowProps> = ({index, value, dataRnage, onRowSelect}) => {
    const classes = useStyles();
    const colors = [["#ebdac9", "#d9e1eb", "#8c92ac"], ["#ebdac9", "#d9e1eb", "#8c92ac"]];

    return <ThemeProvider theme={theme}>
        <div className={classes.Container} onClick={() => onRowSelect(index)}>
            <div className={classes.text}>{index}</div>
            {value.map((item: number[], i: number) => {
                const len = item.length;
                return <div className={classes.block}
                            style={{width: len * 102}}>
                    {item.map((value, j) => {
                        // @ts-ignore
                        const [min, max] = dataRnage[i][j]
                        let width = 0
                        if (max - min > 0) {
                            width = 97 * value / (max - min)
                        } else if (value > 0) {
                            width = 97
                        }

                        return <div className={classes.bar}
                                    style={{background: colors[i][j], width}}>
                            <div className={classes.barText}>{value.toFixed(2)}</div>
                        </div>
                    })}
                </div>
            })}
        </div>
    </ThemeProvider>
}

export default LineUpRow;
