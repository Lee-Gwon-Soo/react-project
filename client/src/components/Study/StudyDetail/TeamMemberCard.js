import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import HumanIcon from '../../Shared/HumanIcons/HumanIcon';

const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1'
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: '120px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});

function TeamMemberCard(props) {
  const { classes } = props;

  return (
    <Grid item xs={12} sm={6} onClick={props.trySendMessage}>
        <Card className={classes.card}>
        <div className={classes.details}>
            <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                    {props.element.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.element.email}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.element.belongto}
                </Typography>
            </CardContent>
        </div>
        {props.element.isEmoticon ? 
        <div className={classes.cover} style={{ display: 'flex', borderLeft: '1px dotted rgba(0,0,0,0.1)'}} >
          <Avatar  alt="" className={classes.cover}  style={{height: 'inherit', background: 'transparent'}} title={props.element.name}>
                <HumanIcon indexValue={props.element.img_path} />
          </Avatar>
        </div>:
        <CardMedia
            className={classes.cover}
            image={props.element.img_path ? props.element.img_path : 'https://s3.ap-northeast-2.amazonaws.com/mkeyword-study/noimage.png'}
            title={props.element.name}
        />}
        </Card>
    </Grid>
  );
}

TeamMemberCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TeamMemberCard);