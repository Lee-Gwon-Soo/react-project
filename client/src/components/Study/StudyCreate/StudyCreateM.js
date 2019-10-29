import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Step1 from './Step1';
import Step2 from './Step2';
import SignupReview from './StudyCreateReview';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
});

const steps = ['기본 정보', '상세 정보', '정보 확인'];



class StudyCreateM extends React.Component {
    state = {
        activeStep: 0,
        step1Form: {
            name: '',
            field: '',
            email: '',
            place: '',
            memCount: 2,
        },
        step2Form: {
            intro:'',
            img_path: '',
        },
        info: {},
        studyId: '',
        showSnack: false,
        snackMessage: '',
        isLoading: true,
    }

    componentDidMount() {
        if(this.props.match.params.studyId) {
            axios.get('/api/study/getStudyInfo/'+this.props.match.params.studyId+'/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;
                    
                    if ( res.status ) {
                        const data = res.data;
                        if(!res.isCreator) {
                            this.props.history.push('/study/dashboard/detail/'+this.props.match.params.studyId);
                        }
                        const step1Form = {
                            name: data.name,
                            field: data.field,
                            email: data.email,
                            place: data.place,
                            memCount: data.memCount,
                        }
                        const step2Form = {
                            intro: data.intro,
                            img_path: data.img_path,
                        }
                        this.setState(function(state,props) {
                            return {
                                step1Form: step1Form,
                                step2Form: step2Form,
                                isLoading: false,
                                studyId: this.props.match.params.studyId
                            }
                        });
                    } 
                })
                .catch(error => {
                    this.props.history.push('/study/dashboard/detail/'+this.props.match.params.studyId)
                })
        }else{
            this.setState(function(state,props){
                return {
                    isLoading: false
                }
            });
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
        },5000);
    }

    saveStudyInfo = () => {
        this.setState(function(state,props) {
            return {
                isLoading: true,
            }
        });
        const form = {
            name: this.state.step1Form.name,
            field: this.state.step1Form.field,
            email: this.state.step1Form.email,
            place: this.state.step1Form.place,
            memCount: this.state.step1Form.memCount,
            intro:this.state.step2Form.intro,
            img_path: this.state.step2Form.img_path,
        }
        let url = '';
        if(this.props.match.params.studyId) {
            url = '/api/study/modify/'+this.props.match.params.studyId
        } else {
            url = '/api/study/create/'+this.props.auth.id
        }

        axios.post(url, form)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.setState(function(state,props) {
                        return {
                            isLoading: false,
                            studyId: res.data._id,
                            activeStep: state.activeStep + 1,
                        }
                    });
                } else {
                    this.showAlarm(res.message);
                }

                this.setState(function(state,props) {
                    return {
                        isLoading: false,
                    }
                });
            })
            .catch(error => {
                this.showAlarm(error);
                this.setState(function(state,props) {
                    return {
                        isLoading: false,
                    }
                });
            })
    }
    getStepContent = (step) => {
        switch (step) {
        case 0:
            return <Step1 form={this.state.step1Form} handleInput={(event, identifier) => this.handleInput(event, identifier)}/>;
        case 1:
            return <Step2 form={this.state.step2Form} handleTextArea={this.handleTextArea} startInsertImage={this.startInsertImage}/>;
        case 2:
            return <SignupReview form={this.state.step1Form} intro={this.state.step2Form.intro} imgPath={this.state.step2Form.img_path}/>;
        default:
            throw new Error('Unknown step');
        }
    }
    handleInput = (event, identifier) => {
        const step1Form = {...this.state.step1Form};
        step1Form[identifier] = event.target.value;
        this.setState(function(state, props){
            return {
                step1Form: step1Form
            }
        })
    }

    handleTextArea = (event) => {
        const step2Form = {...this.state.step2Form};
        step2Form.intro = event.target.value;
        this.setState(function(state, props){
            return {
                step2Form: step2Form
            }
        })
    }
    checkForm1 = () => {
        if(this.state.step1Form.name === '') {
            this.showAlarm('스터디 이름을 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.email === '') {
            this.showAlarm('대표자 이메일을 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.email === '' || !(this.state.step1Form.email.indexOf('@')>-1)) {
            this.showAlarm('올바른 이메일 형식을 사용해주세요.');
            return false;
        }

        if(this.state.step1Form.place === '') {
            this.showAlarm('스터디 장소를 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.field === '') {
            this.showAlarm('스터디 분야를 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.memCount === '' || this.state.step1Form.memCount <=0) {
            this.showAlarm('스터디 인원을 올바르게 입력해주세요.');
            return false;
        }

        return true;
    }

    handleNext = () => {
        if(this.state.activeStep === 0) {
            if(!this.checkForm1()){
                return false;
            }
        }

        if(this.state.activeStep === 2) {
            this.saveStudyInfo();
            
            return false;
        }

        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({activeStep: 0,});
    };
    startInsertImage = (e) => {
        this.refs.studyImage.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/study/imageUpload/'+this.props.auth.id, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.studyImage.value='';
                }
            })
            .catch(error => {
                this.showAlarm('스터디 사진 업로드에 문제가 생겼습니다.');
            })
    }

    insertImage = (url) => {
        const form = {...this.state.step2Form};
        form.img_path = url;
        this.setState(function(state,props){
            return {
                step2Form:form
            }
        });
        this.showAlarm('스터디 사진 업로드에 성공했습니다.');
    }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    return (
      <React.Fragment>
        <LinearLoading open={this.state.isLoading}/>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                {this.props.match.params.studyId ? "스터디 정보 수정" : "스터디 신규 생성" }
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    {this.props.match.params.studyId ? "스터디 정보 수정이 완료되었습니다." : "스터디 개설이 완료되었습니다." }
                  </Typography>
                    {this.props.match.params.studyId ? (
                    <div style={{whiteSpace: 'pre-line'}}>
                        <Typography variant="subtitle1">
                            꾸준한 스터디로 더욱 행복해지기를 MKEYWORD가 응원하겠습니다.<br />
                            평생 기억에 남을 스터디를 만드시기 바랍니다.
                        </Typography>
                    </div>) : (
                  <Typography variant="subtitle1">
                    새로운 스터디와 함께 더욱 행복해지기를 MKEYWORD가 응원하겠습니다.<br />
                    평생 기억에 남을 스터디를 만드시기 바랍니다.
                  </Typography>)}
                  <br />
                  <Button 
                    color="primary"
                    variant="contained"
                    onClick={() => this.props.history.push('/study/dashboard/detail/'+this.state.studyId)}
                    >스터디 바로가기</Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {activeStep === 0 && (
                      <Button onClick={()=>this.props.history.push('/study/dashboard/detail/'+this.state.studyId)} className={classes.button}>
                        취소
                      </Button>
                    )}
                    {activeStep !== 0 && (
                      <Button onClick={this.handleBack} className={classes.button}>
                        뒤로
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? '완료' : '다음'}
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
            <input type="file" style={{display: 'none'}} ref="studyImage" onChange = {(event) => this.uploadImage(event)} />
          </Paper>
            <Snackbar
                place="br"
                color="danger"
                message={this.state.snackMessage}
                open={this.state.showSnack}
                closeNotification={() => this.setState({ showSnack: false })}
                close
                />
        </main>
      </React.Fragment>
    );
  }
}

StudyCreateM.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(StudyCreateM));