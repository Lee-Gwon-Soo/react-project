import React from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    customs: {
        display: 'block',
        resize: 'none',
        width:'100%',
        borderRadius: '5px',
        fontSize: '13px',
        padding: '7px 10px',
        transition: 'all .25s ease',
        outline: 0,
        border: '1px solid #ccc',
        '&:focus' : {
            border: '1px solid #38d',
            boxShadow: '0 0 8px rgba(51,136,221,0.5)',
        }
    },
  };


const CustomTextarea = (props) => {
    const { classes } = props;
    return (
        <textarea 
            {...props}
            className={classes.customs}
        ></textarea>
    )
}



export default withStyles(styles)(CustomTextarea);