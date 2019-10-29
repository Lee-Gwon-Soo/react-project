import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
    container: {
        padding: '16px 24px',
        borderRadius: '0px !important'
    },
}
const NewReply = (props) => {
    const {classes} = props;
    return (
        <Paper className={classes.container} >
            <TextField
                style={{width: '100%'}}
                id="detail_descrption"
                label="당신의 의견은 소중합니다."
                multiline={true}
                className="textField"
                value={props.value}
                onChange={props.onChange}
                margin="normal"
                />
                <Button color="primary" variant="contained" onClick={props.onClick}>의견 남기기</Button>
        </Paper>
    )
}

export default withStyles(styles)(NewReply);