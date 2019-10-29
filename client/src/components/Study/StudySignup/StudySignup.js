import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Step1 from './Step1';
import Step2 from './Step2';
import SignupReview from './SignupReview';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import EmoticonDialog from './EmoticonDialog';

const styles = theme => ({
  appBar: {
    position: 'fixed',
  },
  layout: {
    width: 'auto',
    marginTop: '100px',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
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

const steps = ['기본 정보', '상세 정보', '가입 확인'];



class StudySignup extends React.Component {
    state = {
        activeStep: 0,
        step1Form: {
            email: '',
            password: '',
            password_confirm: '',
            name: '',
            name_en: '',
            belongto: '',
            tel_no: '',
            job: '',
            position: '',
        },
        step2Form: {
            intro:'',
            img_path: '',
            isEmoticon: false
        },
        info: {},
        showSnack: false,
        snackMessage: '',
        isLoading: true,
        isMember: false,
        isDone: false,
        emoticonOpen: false,
    };

    componentDidMount() {
        if(this.props.auth) {
            this.setState(function(state, props) {
                return {
                    activeStep: 3
                }
            });
        }

        //추천으로 들어온 경우
        if(this.props.match.params.studyId) {
            axios.get('/api/study/getStudyInfo/'+this.props.match.params.studyId+'/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        this.setState(function(state, props) {
                            return {
                                info: {...res.data},
                                isLoading: false,
                                isMember: res.isMember
                            }
                        })
                    }
                })
        } else {
            this.setState(function(state, props) {
                return {
                    isLoading: false
                }
            });
        }
    }

    handleClickOpen = () => {
        this.setState(function(state, props) {
            return {
                emoticonOpen: true
            }
        });
    };

    handleClose = () => {
        this.setState(function(state, props) {
            return {
                emoticonOpen: false
            }
        });
    };

    getStepContent = (step) => {
        switch (step) {
        case 0:
            return <Step1 form={this.state.step1Form} handleInput={(event, identifier) => this.handleInput(event, identifier)}/>;
        case 1:
            return <Step2 
                        form={this.state.step2Form} 
                        handleTextArea={this.handleTextArea} 
                        startInsertImage={this.startInsertImage}
                        emoticonOpen={this.state.emoticonOpen}
                        handleClickOpen={this.handleClickOpen}
                        />;
        case 2:
            return <SignupReview 
                        form={this.state.step1Form} 
                        intro={this.state.step2Form.intro} 
                        imgPath={this.state.step2Form.img_path}
                        isEmoticon={this.state.step2Form.isEmoticon}
                        />;
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

    chooseEmoticon = (value) => {
        const step2Form = {...this.state.step2Form};
        step2Form.img_path = value;
        step2Form.isEmoticon = true;
        this.setState(function(state, props){
            return {
                step2Form: step2Form,
                
            }
        });
        this.handleClose();
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
            this.showAlarm('한글 이름을 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.name_en === '') {
            this.showAlarm('영문 이름을 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.email === '' || !(this.state.step1Form.email.indexOf('@')>-1)) {
            this.showAlarm('이메일을 확인해주세요.');
            return false;
        }

        if(this.state.step1Form.password === '') {
            this.showAlarm('비밀번호를 입력해주세요.');
            return false;
        }

        if(this.state.step1Form.password !== this.state.step1Form.password_confirm) {
            this.showAlarm('비밀번호 확인에 실패하였습니다.');
            const form = {...this.state.step1Form};
            form.password = '';
            form.password_confirm = '';
            this.setState(function(state, props){
                return {
                    step1Form: form
                }
            })
            return false;
        }

        if(this.state.step1Form.belongto === '') {
            this.showAlarm('소속을 입력해주세요.');
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
            this.completeSignup();
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

    completeSignup = () => {
        this.setState(function(state, props){
            return {
                isLoading: true,
            }
        });
        const body = {...this.state.step1Form};
        body.img_path = this.state.step2Form.img_path;
        body.intro = this.state.step2Form.intro;
        body.isEmoticon = this.state.step2Form.isEmoticon;
        body.studyId = this.props.match.params.studyId

        axios.post('/api/auth/studySignup', body)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                            activeStep: state.activeStep + 1,
                            isDone: true,
                        }
                    });
                } else {
                    this.showAlarm(res.message);
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                        }
                    });
                }
            });
    }

    handleReset = () => {
        this.setState({ activeStep: 0,});
    };
    startInsertImage = (e) => {
        this.refs.userImage.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/aws/uploadUserImage', formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.userImage.value='';
                }
            })
            .catch(error => {
                this.showAlarm('개인 사진 업로드에 문제가 생겼습니다.');
            })
    }

    insertImage = (url) => {
        const form = {...this.state.step2Form};
        form.img_path = url;
        form.isEmoticon = false;
        this.setState(function(state,props){
            return {
                step2Form:form
            }
        });
        this.showAlarm('개인 사진 업로드에 성공했습니다.');
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

    joinStudy = () => {
        this.setState(function(state, props){
            return {
                isLoading: true,
            }
        });
        const body = {
            studyId: this.props.match.params.studyId,
            userId : this.props.auth.id
        }

        axios.post('/api/study/joinStudy', body)
        .then(response => {
            const res = response.data;
            if(res.status) {
                this.setState(function(state, props){
                    return {
                        isLoading: false,
                    }
                });
                this.props.history.push('/study/dashboard/detail/'+this.props.match.params.studyId);
                
            } else {
                this.showAlarm(res.message);
                this.setState(function(state, props){
                    return {
                        isLoading: false,
                    }
                });
            }
        })
        .catch(err => {
            this.showAlarm("스터디 참여에 문제가 발생했습니다. 고객센터에 문의 부탁드립니다.");
            this.setState(function(state, props){
                return {
                    isLoading: false,
                }
            });
        });
    }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="fixed" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              mKeyword Account{this.state.info.name ? " ["+this.state.info.name+"] " : ''}
            </Typography>
          </Toolbar>
        </AppBar>
        <LinearLoading open={this.state.isLoading}/>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
             {this.state.isMember ? "이미 가입된 회원입니다" : this.props.auth ? "스터디 참여하기": "스터디 회원가입"}
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
                    {this.props.auth ? "M KEYWORD를 이용해주셔서 감사합니다." : "가입이 완료되었습니다."}
                  </Typography>
                  {this.state.isMember || !this.props.auth ?
                  <Typography variant="subtitle1">
                    스터디에 함께 동참해주셔서 감사합니다. 함께 하면 더욱 행복합니다.<br />
                    일시적인 스터디가 아니라 꾸준한 스터디로 행복을 키워가세요!
                  </Typography>
                  : <Typography variant="subtitle1">
                        스터디 추천이 들어왔습니다!<br></br>스터디에 참여를 원하시는 경우에는 아래 <span style={{color: 'red'}}>스터디 참여하기</span>를 선택해주세요.
                    </Typography>
                    }
                  <br />
                  {this.state.isMember || this.state.isDone? null : 
                  <Button 
                    color="secondary"
                    variant="contained"
                    onClick={this.joinStudy}
                    >스터디 참여하기</Button>}{"   "}
                    
                  <Button 
                    color="primary"
                    variant="contained"
                    onClick={() => this.props.history.push('/study/dashboard/list')}
                    >대시보드</Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button onClick={this.handleBack} className={classes.button}>
                        Back
                      </Button>
                    )}
                    {activeStep === 0 && (
                      <Button color="default" className={classes.button} onClick={() => this.props.history.push('/login/'+this.props.match.params.studyId)}>이용 중인 회원이신가요?</Button>
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
            <input type="file" style={{display: 'none'}} ref="userImage" onChange = {(event) => this.uploadImage(event)} />
          </Paper>
            <Snackbar
                place="br"
                color="danger"
                message={this.state.snackMessage}
                open={this.state.showSnack}
                closeNotification={() => this.setState({ showSnack: false })}
                close
                />
            <EmoticonDialog 
                open={this.state.emoticonOpen}
                handleClose={this.handleClose}
                chooseEmoticon={this.chooseEmoticon}
            />
        </main>
      </React.Fragment>
    );
  }
}

StudySignup.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(StudySignup));