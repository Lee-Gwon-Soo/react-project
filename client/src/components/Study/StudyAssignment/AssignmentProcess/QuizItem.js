import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const QuizItem = (props) => {
    return (
        <Grid container justify="center">
            <Grid item xs={12} xm={8}>
                <Typography variant="h3" gutterBottom>
                    {props.question.question}
                </Typography>
                <Grid container spacing={8} style={{marginTop: '20px', marginBottom: '20px'}}>
                    { !props.question.videoLink ? null : (
                    <Grid item xs={12} sm={6} >
                    <iframe 
                        width="100%" 
                        height="315" 
                        src={props.question.videoLink} 
                        frameBorder="0" 
                        title="첨부 비디오"
                        allow="autoplay; encrypted-media" 
                        allowFullScreen></iframe>
                        
                    </Grid>)}
                    { !props.question.imageLink ? null : (
                        <Grid item xs={12} sm={6}>
                            <img src={props.question.imageLink} width="100%" height="315" alt="첨부사진"/> 
                        </Grid>)}
                </Grid>
                <Divider />
            </Grid>
            {props.question.type === '선택형' ? 
            <Grid item xs={12} xm={8} >
                {props.processStatus && props.processStatus.result ? `정답 : ${props.processStatus.answer}` :
                    props.question.options.map((option, index) => {
                    return (
                        <FormControlLabel
                            key={index}
                            checked={option === props.answer}
                            onChange={(event) => props.chooseAnswer(event, option)}
                            control={
                                <Checkbox
                                value={option}
                                />
                            }
                            label={option}
                            /> 
                    )
                })}
                
                </Grid>
                : <Grid item xs={12} xm={8} >
                <Input
                    fullWidth 
                    readOnly={props.processStatus && props.processStatus.result && props.question.type !=='논술형' ? true : false}
                    value={props.processStatus && props.processStatus.result && props.question.type !=='논술형' ? props.processStatus.answer : props.answer}
                    onChange={props.handleAnswer}
                    style={{marginTop: '30px',padding: '10px 0px', lineHeight: '175%'}}
                    multiline={props.question.type=== '논술형' ? true : true}
                    inputProps={{
                    'aria-label': 'Answer',
                    'placeholder': "답변을 적어주세요."
                    }}
                />
            </Grid>
            }
        </Grid>
        
    )
}
export default QuizItem;