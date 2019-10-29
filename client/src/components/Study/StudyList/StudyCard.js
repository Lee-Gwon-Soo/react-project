import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
const styles = {
  card: {
    maxWidth: 345,
    borderRadius: '0px',
    minHeight: '340px'
  },
  media: {
    backgroundSize: '100% 100%',
  },
};

const StudyCard = (props) => {
    const { classes } = props;
    return (
        <Grid item xs={12} sm={4} md={3}>
            <Card className={classes.card}>
                <CardActionArea onClick={props.gotoDetail}>
                    <CardMedia
                    component="img"
                    alt="no image"
                    className={classes.media}
                    height="140"
                    image={props.element.img_path ? props.element.img_path : 'https://s3.ap-northeast-2.amazonaws.com/mkeyword-study/noimage.png'}
                    title={props.element.name}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.element.name && props.element.name.length > 100? (props.element.name.substring(0, 100)+ '...') : props.element.name}
                    </Typography>
                    <Typography component="p">
                        인원 제한 {props.element.memCount}명<br></br>
                        현재 인원 {props.element.currentMemberCount}명
                    </Typography>
                    <Typography component="p">
                            장소 : {props.element.place}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

StudyCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudyCard);