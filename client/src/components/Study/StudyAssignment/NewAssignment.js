import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import Aux from '../../../HOC/Aux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Step1 from './AssignmentSteps/Step1';
import Step2 from './AssignmentSteps/Step2';
import Step3 from './AssignmentSteps/Step3';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 3,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  stepperMobile: {
      [theme.breakpoints.down('sm')]: {
            padding: '24px 10px',
      }
  }
});

function getSteps() {
  return ['문제 유형을 선택해주세요.', '문제를 생성해 주세요.', '완료 전에 최종 확인해주세요.'];
}


class NewAssignment extends React.Component {
    state = {
        activeStep: 0,
        activeIndex: 0,
        assignmentOption: [],
        questionList: [],
        assignmentTitle: '',
        showSnack: false,
        snackMessage: '',
        isSaved: false,
        selectedIndex: -1,
        isLoading: false,
    };

    handleNext = () => {
        if( this.state.activeStep === 0 ) {
            if(!(this.state.assignmentOption.length >0)){
                this.showAlarm("문제 옵션을 선택해 주세요.");
                return false;
            } else {
                const questionList = [...this.state.questionList];
                this.state.assignmentOption.map((obj, index) => {
                    if(!questionList[index]){
                        let data = {
                            question: '',
                            answer: '',
                        };
                        switch(obj.qType) {
                            case 'short' :
                                data.type = '단답형';
                                break;
                            case 'selection' :
                                data.type = '선택형';
                                data.options= [];
                                break;
                            case 'essay' :
                                data.type = '논술형';
                                break;
                            default:
                            break;
                        }

                        const keys = Object.keys(obj.reference);
                        for(let i = 0 ; i< keys.length; i++ ){
                            if(obj.reference[keys[i]]){
                                const newKey = keys[i]+'Link';
                                data[newKey] ='';
                            }
                        }
                        data.count = obj.count;
                        questionList[index] = data;
                    }
                });

                this.setState(function(state, props){
                    return {
                        questionList:questionList
                    }
                })
            }
        }

        if(this.state.activeStep === 2 ) {
            if(this.state.assignmentTitle === '') {
                this.showAlarm("과제 제목을 입력해주세요.");
                document.getElementById('assignmentTitle').focus();
                return false;
            }
            //최종 저장
            this.saveAssignment();
            return false;
        }

        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    // save all data to database
    saveAssignment = () => {
        this.setState((state, props) => {return {isLoading: true}});
        const questionList = [...this.state.questionList];
        const data = {
            data: questionList,
            title: this.state.assignmentTitle,
        }
        axios.post('/api/study/saveAssignment/'+this.props.match.params.studyId+'/'+this.props.auth.id, data)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    // this.props.history.push('/study/assignment/front/'+this.props.match.params.studyId);
                    this.setState(state => ({
                        isLoading : false,
                        activeStep: state.activeStep + 1,
                    }));
                    
                } else {
                    this.showAlarm(res.message);
                    this.setState((state, props) => {return {isLoading: true}});
                }
            })
            .catch(error => {
                this.showAlarm(error);
                this.setState((state, props) => {return {isLoading: true}});
            })
    }

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState(function(state,props){
            return{
                activeStep: 0,
                activeIndex: 0,
                assignmentOption: [],
                questionList: [],
            }
        });
    };

    addQuestion = (obj) => {
        const assignmentOption = [...this.state.assignmentOption];
        const objCount = obj.count;
        for(let i = 0 ; i < objCount; i++) {
            obj.count = 1;
            assignmentOption.push(obj);
        }
        this.setState(function(state, props){
            return {
                assignmentOption:assignmentOption,
            }
        })
    }

    deleteQuestionOption = (index) => {
        let assignmentOption = [...this.state.assignmentOption.filter((item, i) => i !== index)];
        let questionList = [...this.state.questionList.filter((item, i) => i !== index)];
        this.setState(function(state, props){
            return {
                assignmentOption:assignmentOption,
                questionList: questionList
            }
        });
    }

    onAddOption = (index) => {
        const optionText = document.getElementById('option_'+index).value;
        if(optionText.trim() === '') {
            this.showAlarm("보기의 내용을 입력해주세요.");
            document.getElementById('option_'+index).focus();
            return false;
        }
        const questionList = [...this.state.questionList];
        if(questionList[index].options.includes(optionText)) {
            this.showAlarm("보기가 이미 존재합니다.");
            return false;
        }
        questionList[index].options.push(optionText);
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
        document.getElementById('option_'+index).value = '';
    }

    onAddVideoLink = (index) => {
        const videoLink = document.getElementById('videoLink_'+index).value;
        if(videoLink ==='') {
            document.getElementById('videoLink_'+index).focus();
            this.showAlarm("링크를 입력해주세요.");
            return false;
        }
        let embedLink = '';
        if(videoLink.indexOf('https://youtu.be') > -1 ) {
            embedLink = videoLink.replace('youtu.be','youtube.com/embed');
        } else if (videoLink.indexOf('www.youtube.com/watch?v=') > -1 ){
            embedLink = videoLink.replace('watch?v=','embed/');
        } else {
            this.showAlarm("유튜브 링크를 입력해주세요.");
            return false;
        }

        const questionList = [...this.state.questionList];
        questionList[index].videoLink = embedLink;
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
        document.getElementById('videoLink_'+index).value = '';
        this.showAlarm("동영상 업로드에 성공했습니다.");
    }

    cancelVideo = (index) => {
        const questionList = [...this.state.questionList];
        questionList[index].videoLink = '';
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
        this.showAlarm("동영상 업로드가 취소되었습니다.");
    }

    onRegisterImage = (e, index) => {
        this.setState(function(state, props){
            return {
                selectedIndex: index,
            }
        });
        this.refs.image.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/study/assignment/questImage/'+this.props.match.params.studyId, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.image.value='';
                }
            })
            .catch(error => {
                this.showAlarm('과제 사진 업로드에 문제가 생겼습니다.');
            })
    }

    insertImage = (url) => {
        const index = this.state.selectedIndex;
        const questionList = [...this.state.questionList];
        questionList[index].imageLink = url;
        this.setState(function(state, props){
            return {
                questionList:questionList,
                selectedIndex: -1,
            }
        });
        this.showAlarm('과제 사진 업로드에 성공했습니다.');
    }

    handleQuestion = (index, event) => {
        const content = event.target.value;
        const questionList = [...this.state.questionList];
        questionList[index].question = content;
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
    }

    handleAnswer = (index, event) => {
        const content = event.target.value;
        const questionList = [...this.state.questionList];
        questionList[index].answer = content;
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
    }

    deleteOption = (questionIndex, optionIndex) => {
        const questionList = [...this.state.questionList];
        const list = questionList[questionIndex];
        list.options = list.options.filter((value, index) => index !== optionIndex);
        questionList[questionIndex] = list;
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
    }

    checkAsAnswer = (questionIndex, optionIndex) => {
        const questionList = [...this.state.questionList];
        const list = questionList[questionIndex];
        const answer = list.options[optionIndex];
        questionList[questionIndex].answer = answer;
        this.setState(function(state, props){
            return {
                questionList:questionList
            }
        });
    }

    handleTitle = (event) => {
        const content = event.target.value;
        this.setState(function(state, props){
            return {
                assignmentTitle: content
            }
        })
    }

    getStepContent = (step) => {
        switch (step) {
        case 0:
            return (<Step1 
                showAlarm={(msg) => this.showAlarm(msg)}
                addQuestion={(obj) => this.addQuestion(obj)}
                assignmentOption={this.state.assignmentOption}
                deleteQuestionOption={(index) => this.deleteQuestionOption(index)}
            />);
        case 1:
            return (
                <Step2 
                    questionList={this.state.questionList}
                    onAddOption={(index) => this.onAddOption(index)}
                    handleQuestion={(index, event) => this.handleQuestion(index, event)}
                    handleAnswer={(index, event) => this.handleAnswer(index, event)}
                    deleteOption={(questionIndex, optionIndex) => this.deleteOption(questionIndex, optionIndex)}
                    checkAsAnswer={(questionIndex, optionIndex) => this.checkAsAnswer(questionIndex, optionIndex)}
                    onAddVideoLink={(index) => this.onAddVideoLink(index)}
                    cancelVideo={(index) => this.cancelVideo(index)}
                    onRegisterImage={(event, index) => this.onRegisterImage(event, index)}
                
                />
            );
        case 2:
            return (
                <Step3 
                    questionList={this.state.questionList}
                    assignmentTitle={this.state.assignmentTitle}
                    handleTitle={this.handleTitle}
                
                />
            );
        default:
            return 'Unknown step';
        }
    }


    showAlarm = (msg) => {
        this.setState(function(state,props){
            return {
                showSnack: true,
                snackMessage: msg
            }
        });
        
        setTimeout( () => {
            this.setState(function(state,props){
                return {
                    showSnack: false,
                    snackMessage: ''
                }
            });
        },2000);
    }

    renderView = () => {
        // if(this.state.isSaved) {
        //     return <Redirect to={}/>
        // } else {
        //     return null;
        // }
        return null;
    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

        return (
            <Aux>
                <LinearLoading open={this.state.isLoading} />
                <CssBaseline />
                <AppBar position="fixed" style={{backgroundColor: '#81D4FA'}}>
                    <Toolbar>
                        문제 생성중
                    </Toolbar>
                </AppBar>
                <input type="file" style={{display: 'none'}} ref="image" onChange = {(event) => this.uploadImage(event)} />
                <Grid container justify="center">

                    <Grid item xs={12} sm={10} > 
                        <Button
                            style={{marginLeft: 'auto',display:'flex', marginBottom: '10px'}} 
                            onClick={()=> this.props.history.push('/study/assignment/front/'+this.props.match.params.studyId)} 
                            className={classes.button}>
                            취소
                        </Button>
                        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperMobile}>
                        {steps.map((label, index) => {
                            return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                {this.getStepContent(index)}
                                <div className={classes.actionsContainer}>
                                    <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={this.handleBack}
                                        className={classes.button}
                                    >
                                        뒤로
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? '완료' : '다음'}
                                    </Button>
                                    </div>
                                </div>
                                </StepContent>
                            </Step>
                            );
                        })}
                        </Stepper>
                        {activeStep === steps.length && (
                        <Paper square elevation={0} className={classes.resetContainer}>
                            <Typography>과제가 정상적으로 등록되었습니다. 팀원들에게 좋은 과제를 만들어주셔서 감사합니다.</Typography>
                            <Button onClick={this.handleReset} className={classes.button}>
                            새로운 과제 등록하기
                            </Button>
                            <Button onClick={()=> this.props.history.push('/study/assignment/front/'+this.props.match.params.studyId)} className={classes.button}>
                            리스트 보기
                            </Button>
                        </Paper>
                        )}
                    </Grid>
                </Grid>
                <Snackbar
                    place="br"
                    color="danger"
                    message={this.state.snackMessage}
                    open={this.state.showSnack}
                    closeNotification={() => this.setState({ showSnack: false })}
                    close
                />
        </Aux>
        );
    }
}

NewAssignment.propTypes = {
  classes: PropTypes.object,
};

function mapStateToProps ({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(withStyles(styles)(NewAssignment));