import React from 'react';
import PropTypes from 'prop-types';
import './Step3.css';
import { withStyles } from '@material-ui/core/styles';
import Aux from '../../../../HOC/Aux';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';


const styles = theme => ({
  root: {
    display: 'flex',
    paddingTop: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '4px',
    paddingBottom: '16px',
    marginTop: '20px',
  },
  question: {
    color: 'rgb(255, 255, 255)',
    padding: '10px !important',
    background: 'rgb(32, 35, 42)',
    fontSize: '1.5rem',
    fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0em',    
    borderRadius: '10px 10px 0px 0px',
  },
  resultBoard: {
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(236, 236, 236)',
    borderImage: 'initial',
    borderRadius: '0px 0px 10px 10px',
  },
  resultTitle: {
    color: 'rgb(109, 109, 109)',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    backgroundColor: 'rgb(236, 236, 236)',
    padding: '0px 10px',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

const Step3 = (props) => {
    let count = 0;
    const { classes } = props;
    return (
        <Aux>
            <Grid container style={{marginBottom: '20px'}}>
                <Grid item xs={12}  >
                    <Input
                        fullWidth
                        onChange={props.handleTitle}
                        className={classes.textField}
                        id="assignmentTitle"
                        inputProps={{
                            'aria-label': '과제 제목',
                            'placeholder': '과제 제목을 적어주세요.'
                        }}
                    />
                </Grid>
            </Grid>
            {props.questionList.map((item, index) => {
                if(item.type === '선택형') {
                    count += 1;
                    return (<Grid className={classes.root} container
                        key={"question_"+index}>
                        <Grid item xs={12} className={classes.question} >
                            Question{count+" : "+item.question}
                        </Grid>
                        <Grid item xs={12} className={classes.resultBoard}>
                            <div className={classes.resultTitle}>
                                보기 및 정답
                            </div>
                                {item.options.length > 0 ? (
                                <List>
                                {item.options.map((option, i) => {
                                    return (
                                        <Aux key={i} >
                                            <ListItem dense >
                                                <ListItemText primary={option} />
                                                <ListItemSecondaryAction>
                                                    {item.answer !== option ? null : 
                                                        <ListItemIcon>
                                                            <StarIcon />
                                                        </ListItemIcon>
                                                    }
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider />
                                        </Aux>  
                                )})}
                                </List>
                                ) : 
                                <List style={{marginLeft: '20px'}}>{"등록된 보기가 없습니다"}</List>}
                                <div className={classes.resultTitle}>
                                    참고 자료
                                </div>
                                <Grid container spacing={8}>
                                { !item.videoLink ? null : (
                                <Grid item xs={12} sm={6} >
                                <iframe 
                                    width="100%" 
                                    height="315" 
                                    src={item.videoLink} 
                                    frameBorder="0" 
                                    title="첨부 비디오"
                                    allow="autoplay; encrypted-media" 
                                    allowFullScreen></iframe>
                                    
                                </Grid>)}
                                { !item.imageLink ? null : (
                                    <Grid item xs={12} sm={6}>
                                        <img src={item.imageLink} width="100%" height="315" alt="첨부사진"/> 
                                    </Grid>)}
                                </Grid>
                        </Grid>   
                    </Grid>);
                    
                } else if (item.type === '단답형') {
                    count += 1;
                    return (<Grid className={classes.root} container
                        key={"question_"+index}>
                        <Grid item xs={12} className={classes.question} >
                            Question{count+" : "+item.question}
                        </Grid>
                        <Grid item xs={12} className={classes.resultBoard}>
                            <div className={classes.resultTitle}>
                                보기 및 정답
                            </div>
                            <Typography variant="body1" gutterBottom style={{padding: '10px'}}>
                                Answer{" : "+item.answer}
                            </Typography>
                            <div className={classes.resultTitle}>
                                참고 자료
                            </div>
                            <Grid container spacing={8}>
                                { !item.videoLink ? null : (
                                    <Grid item xs={12} sm={6}>
                                    <iframe 
                                        width="100%" 
                                        height="315" 
                                        src={item.videoLink} 
                                        frameBorder="0" 
                                        title="첨부 비디오"
                                        allow="autoplay; encrypted-media" 
                                        allowFullScreen></iframe>
                                        
                                    </Grid>)}
                                { !item.imageLink ? null : (
                                <Grid item xs={12} sm={6} >
                                    <img src={item.imageLink} width="100%" height="315" alt="첨부사진"/> 
                                </Grid>)}
                            </Grid>
                        </Grid>    
                    </Grid>);
                } else{
                    count += 1;
                    return ((<Grid className={classes.root} container
                        key={"question_"+index}>
                        <Grid item xs={12} className={classes.question} >
                            Question{count+" : "+item.question}
                        </Grid>
                        <Grid item xs={12} className={classes.resultBoard}>
                            <div className={classes.resultTitle} >
                                참고 자료
                            </div>

                            <Grid container spacing={8}>
                                { !item.videoLink ? null : (
                                    <Grid item xs={12} sm={6} >
                                    <iframe 
                                        width="100%" 
                                        height="315" 
                                        src={item.videoLink} 
                                        frameBorder="0" 
                                        title="첨부 비디오"
                                        allow="autoplay; encrypted-media" 
                                        allowFullScreen></iframe>
                                        
                                    </Grid>)}
                                { !item.imageLink ? null : (
                                <Grid item xs={12} sm={6} >
                                    <img src={item.imageLink} width="100%" height="315" alt="첨부사진"/> 
                                </Grid>)}
                            </Grid>
                        </Grid>
                    </Grid>));
                }
                <Divider />
            })}
        </Aux>
    );
}

Step3.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step3);