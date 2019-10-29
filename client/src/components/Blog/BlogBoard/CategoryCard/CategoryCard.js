import React from 'react';
import './CategoryCard.css';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
  
const CategoryCard = (props) => {
    return (
        <Grid item xs={12} sm={3}>
             <Card className="Card">
                <CardMedia
                className="cardImage"
                image={props.element.imagePath}
                title="Contemplative Reptile"
                onClick={props.onClick}
                />
                <CardContent  className="categoryCardContent"  onClick={props.onClick}>
                    <Typography gutterBottom variant="headline" component="h2">
                        {props.element.title}
                    </Typography>
                    <Typography component="p"> 
                        {props.element.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={props.toggleOpen}>
                    {props.element.isOpen ? "Close" : "Open"}
                    </Button>
                    <Button size="small" color="primary" onClick={props.editCategory}>
                    Edit
                    </Button>
                    <Button size="small" color="secondary" style={{marginLeft:'auto'}} onClick={props.deleteCategory}>
                    Delete
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default CategoryCard;