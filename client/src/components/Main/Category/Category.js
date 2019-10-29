import React from 'react';
import classes from './Category.css';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

const Category = (props) => {

    return (
        <Grid item xs={12} md={4} style={{paddingLeft: '0px'}}>
            <div className={classes.Category}>
                <Typography variant="headline" className={classes.headline}>
                    {props.title}
                </Typography>
                <div>
                    {props.description}
                </div>
                <a className={classes.arrowPosition} href={`/page/${props.email}/category/${props.categoryId}`}>
                    <i className="material-icons">
                    arrow_forward
                    </i>
                </a>
            </div>
        </Grid>
    )
}

export default Category;