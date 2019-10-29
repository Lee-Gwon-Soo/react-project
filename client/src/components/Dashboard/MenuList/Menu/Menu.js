import React from 'react';
import './Menu.css';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const Menu = (props) => {
    const element = {...props.element};
    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className="menuItem">
                <CardActionArea className="cardButton" onClick={props.onClick}>
                    <CardContent className="iconPage">
                        <i className="material-icons">{element.icon}</i>
                    </CardContent>
                    <CardContent className="contentPage">
                        <Typography gutterBottom variant="headline" component="h2" style={{textAlign: 'center'}}>
                            {element.name}
                        </Typography>
                        <Typography component="p" style={{textAlign: 'center'}}>
                            {element.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default Menu;