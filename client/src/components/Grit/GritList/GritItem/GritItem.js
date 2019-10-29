import React from 'react';
import './GritItem.css';
import {Link} from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const GritItem = (props) => {
    const percentage = props.element.completed ? Number.parseInt(props.element.completed) : 0;
    const classPercent = 'c100 small p'+ percentage;
    return (
        <Grid item xs={12} sm={4} lg={3}>
            <Link to={'/grit/detail/'+props.element._id}>
                <Card className="gritItem">
                    <CardContent className="progressList">
                        <div className="clearfix">
                            <div className={classPercent}>
                                <span>{percentage}%</span>
                                <div className="slice">
                                    <div className="bar"></div>
                                    <div className="fill"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardContent className="titlePage">
                        {props.element.title}
                    </CardContent>
                    <CardContent className="detailPage">
                        <List className="nav">
                            <ListItem>
                                <ListItemIcon>
                                    <i className="material-icons">check_box_outline_blank</i>
                                </ListItemIcon>
                                <ListItemText primary={props.element.startDate} className="item"/>
                            </ListItem>
                            <ListItem >
                                <ListItemIcon>
                                    <i className="material-icons">check_box</i>
                                </ListItemIcon>
                                <ListItemText primary={props.element.dueDate} className="item"/>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
                
            </Link>
        </Grid>
    )
}

export default GritItem;