import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CheckIcon from '@material-ui/icons/Check';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Avatar from '@material-ui/core/Avatar';
import HumanIcon from '../../Shared/HumanIcons/HumanIcon';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
    [theme.breakpoints.down('sm')] : {
      flexBasis: '100%',
    } 
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const AssignmentItem = (props) => {
  const { classes } = props;
  const date =  new Date(props.element.ins_dtime);
  
  
  const status = props.element.status.filter(x => x._user === props.userId);
  let complete_date = status[0].isDone ? new Date(status[0].complete_dtime) : null ;
  if(complete_date) {
    complete_date = `${complete_date.getFullYear().toString()}년 ${(complete_date.getMonth()+1)}월 ${complete_date.getDate()}일`
  }
  return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>
            {status[0].isDone 
              ? <Chip color="secondary" icon={<CheckIcon />} label="과제 완료" className={classes.chip}  /> 
              : status[0].isProcessing  ? <Chip color="primary" icon={<MoreHoriz />} label="과제 진행중" className={classes.chip}  />
              : <Chip color="primary" variant="outlined" label="과제 미완료" className={classes.chip}  />}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>{props.element.title}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}> 
              등록일자<br></br>{`${date.getFullYear().toString()}년 ${(date.getMonth()+1)}월 ${date.getDate()}일`}
          </div>
          <div className={classes.column}>
              완료일자<br></br>
              {complete_date}
          </div>
          <div className={classNames(classes.column, classes.helper)}>
            <Typography variant="caption">
              {"총 "+props.element.questionCount+"개의 질문이 있습니다."}
              <br />
              <a href="#sub-labels-and-columns" className={classes.link}>
                {!(props.element.publisher_img.indexOf('.') > -1) ? 
                <Avatar  alt="" className={classes.cover}  style={{height: 'inherit', background: 'transparent'}} title={props.element.name}>
                      <HumanIcon indexValue={props.element.publisher_img} />
                </Avatar> :props.element.publisher_img 
                  ? <Avatar alt={props.element.publisher} src={props.element.publisher_img} style={{display:'flex', margin: '10px'}}/> 
                  : null
                  } made by {props.element.publisher} <br />
              </a>
            </Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
        {status[0].isDone 
          ? <Button size="small"  onClick={props.onStartAssign}>나의 과제보기</Button>
          : <Button size="small" color="primary" onClick={props.onStartAssign}>과제 시작하기</Button>
        }
        </ExpansionPanelActions>
      </ExpansionPanel>
  );
}

AssignmentItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssignmentItem);