import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Input from '@material-ui/core/Input';
import { Divider } from '@material-ui/core';
import './floating.css';

const styles = theme => ({
  card: {
   width: '100%',
   borderRadius: '0px !important'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  floating: {
    animation:`floating .3s linear`,
  },
  avatar: {
    backgroundColor: red[500],
  },
  childavatar: {
      backgroundColor: blue[200],
      width: '35px',
      height: '35px',
      marginLeft: 'auto',
      marginRight: '20px'
  },
  childReplyTitle: {
    fontSize: '12px'
  },
  
});

class ReplyItem extends React.Component {
    state = { 
      expanded: false,
      replyOpen: false,
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };
    getPostDate = (ori_date) => {
        const date =  new Date(ori_date);
        return `${date.getFullYear().toString()}년 ${(date.getMonth()+1)}월 ${date.getDate()}일`;
    }
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card} style={this.props.style}>
        <CardHeader
          avatar={
            this.props.element.img_path ?
            (<Avatar aria-label="Recipe" className={classes.avatar} src={this.props.element.img_path}></Avatar>) : 
            (<Avatar aria-label="Recipe" className={classes.avatar}>T</Avatar>)
          }
          action={
            <IconButton onClick={() => this.setState(function(state,props){return {replyOpen: !state.replyOpen}})}>
              <EditIcon />
            </IconButton>
          }
          title={this.props.element.author}
          subheader={this.getPostDate(this.props.element.ins_dtime)}
        />
        <CardContent>
          <Typography>
            {this.props.element.content}
          </Typography>
          {this.state.replyOpen ? 
          (<Grid container  style={{ marginTop: '20px'}}>
            <Grid item xs={12} sm={12}>
              <Input
                multiline={true}
                id={`reply_${this.props.element._id}`}
                fullWidth
                inputProps={{
                  'placeholder': "댓글을 남겨주세요.",
                  'aria-label': 'Description',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} style={{ marginTop: '10px', textAlign:'right'}} >
              <Button color="default" size="small" onClick={() => this.setState(function(state,props){return {replyOpen: false}})}>취소 </Button>{"  "}
              <Button color="primary" variant="contained" size="small"  onClick={() => this.props.replyAgainSave(this.props.element._id)}>의견 남기기</Button>
            </Grid>
          </Grid>)
            : null }
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites" onClick={this.props.giveHeart}>
              {this.props.element.likes >0 ? 
              <Badge className={classes.margin} badgeContent={this.props.element.likes} >
                <FavoriteIcon color="secondary" className={classnames({
                  [classes.floating]: this.props.clickLike === this.props.element._id
                })}/>
              </Badge>
              : <FavoriteIcon color="secondary" className={classnames({
                [classes.floating]: this.props.clickLike === this.props.element._id
              })}/>}
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
              {this.props.childReply && this.props.childReply.length >0 ? this.props.childReply.map((item, index) => {
                return (
                  <Grid container key={item._id} style={{marginTop: '10px'}}>
                    <Grid item xs={2} style={{justifyContent: 'flex-end'}}>
                      {  item.img_path ?
                        (<Avatar aria-label="Recipe" className={classes.childavatar} src={item.img_path}></Avatar>) : 
                        (<Avatar aria-label="Recipe" className={classes.childavatar}>T</Avatar>)
                      }
                    </Grid>
                    <Grid item xs={8}>
                        <div className={classes.childReplyTitle}>{item.author}</div>
                        <div className={classes.childReplyTitle}>{this.getPostDate(item.ins_dtime)}</div>
                        <Divider></Divider>
                        <div style={{ whiteSpace: 'pre-line'}}>{item.content}</div>
                    </Grid>
                    <Grid item xs={2}></Grid>
                  </Grid>
                )
              }) : "등록된 댓글이 없습니다."}

              <section>
              </section>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

ReplyItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReplyItem);