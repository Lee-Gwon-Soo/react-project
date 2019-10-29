import React from 'react';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const GritCheckItem = (props) => {
    return (
        <Grid item xs={12} sm={4} lg={3} className="GritCheckItem">
            <Card  className="gritBoard">
                <CardContent>
                    <div className="itemDate">
                        {props.date}
                    </div>
                    <div className="checkIcon">
                        {props.checked === true ? <i className="material-icons checked">check_circle</i> : <i className="material-icons">remove_circle_outline</i>}
                    </div>
                </CardContent>
            </Card>
        </Grid>
    )
}
export default GritCheckItem;