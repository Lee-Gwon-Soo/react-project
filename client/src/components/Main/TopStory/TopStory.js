import React from 'react';
import classes from './TopStory.css';
import Grid from '@material-ui/core/Grid';


const TopStory = (props) => {
    
    return (
        <Grid item xs={12} sm={6} md={4} >
            <div className={classes.TopStory} onClick={props.readBlog}>
                <div className={classes.category}>
                    {props.category}
                </div>
                <div className={classes.title}>
                    {props.title}
                </div>
                <div>
                    {props.img ? 
                    <div className={classes.image} style={{backgroundImage: `url(${props.img})`}}></div>
                    :
                    <div className={classes.emptyImage} >
                        <a className={classes.arrowPosition}>
                            <i className="material-icons">
                            arrow_forward
                            </i>
                        </a>
                    </div>
                    }
                </div>
            </div>
        </Grid>
    )
}

export default TopStory;