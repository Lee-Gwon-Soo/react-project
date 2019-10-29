import React from 'react';
import classes from './PostItem.css';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

const PostItem = (props) => {

    return (
        <Grid item xs={12} md={4} style={{paddingLeft: '0px'}} onClick={props.onClick}>
            <div className={classes.PostItem}>
                <Typography variant="headline" className={classes.headline}>
                    {props.element.title}
                </Typography>
                <div>
                    {props.description}
                </div>
                <a className={classes.arrowPosition}>
                    <i className="material-icons">
                    arrow_forward
                    </i>
                </a>
            </div>
        </Grid>
    )
}

export default PostItem;