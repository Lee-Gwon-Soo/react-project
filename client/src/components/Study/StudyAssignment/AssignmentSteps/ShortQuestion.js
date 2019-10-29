import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Aux from '../../../../HOC/Aux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
      display: 'flex',
      paddingTop: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      borderRadius: '4px',
      paddingBottom: '16px',
      backgroundColor: '#eeeeee',
      marginTop: '20px',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    formControl: {
      margin: theme.spacing.unit * 3,
    },
    
  });

const ShortQuestion = (props) => {
    const {classes} = props;
    return (
        <Grid className={classes.root} container spacing={8}>
            <Grid item xs={12}  >
                <Typography variant="h4" gutterBottom>
                    문제{" "+props.problemNumber}
                </Typography>
                <TextField
                    id={"question_"+props.index}
                    label="단답형 질문"
                    fullWidth
                    multiline
                    className={classes.textField}
                    value={props.form.question}
                    onChange={props.handleQuestion}
                    margin="normal"
                    variant="outlined"
                    />
            </Grid>
            <Grid item xs={12}  >
                <Input
                    fullWidth
                    onChange={props.handleAnswer}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': '정답',
                        'placeholder': '정답을 적어주세요'
                    }}
                />
            </Grid>
            {props.form.videoLink === undefined ? null : 
            <Grid className={classes.root} container spacing={16} style={{marginTop:'20px'}}>
                <Grid item xs={12} sm={8} style={{marginTop:'20px'}}>
                    <Input
                        id={'videoLink_'+props.index}
                        fullWidth
                        className={classes.textField}
                        inputProps={{
                            'aria-label': '보기옵션',
                            'placeholder': '추가할 영상 URL(유튜브)을 입력해주세요.'
                        }}
                    />
                </Grid>
                <Grid item xs={12}  sm={4}  >
                    <Button onClick={props.onAddVideoLink} variant="contained">영상 추가</Button>
                    <Button onClick={props.cancelVideo}>영상 취소</Button>
                </Grid>
            </Grid>}
            
            {props.form.imageLink === undefined ? null : 
            <Grid item xs={12}  style={{marginTop:'20px'}}>
                <Button onClick={(event) => props.onRegisterImage(event)}>이미지 등록</Button>
            </Grid>}
                
            { !props.form.videoLink ? null : (
                <Grid item xs={12} sm={6} style={{marginTop:'20px'}}>
                <iframe 
                    width="100%" 
                    height="315" 
                    src={props.form.videoLink} 
                    frameBorder="0" 
                    title="첨부 비디오"
                    allow="autoplay; encrypted-media" 
                    allowFullScreen></iframe>
                    
                </Grid>)}
            { !props.form.imageLink ? null : (
                <Grid item xs={12} sm={6} style={{marginTop:'20px'}}>
                    <img src={props.form.imageLink} width="100%" height="315" alt="첨부사진"/> 
                </Grid>)}
        </Grid>
    )
}

export default withStyles(styles)(ShortQuestion);