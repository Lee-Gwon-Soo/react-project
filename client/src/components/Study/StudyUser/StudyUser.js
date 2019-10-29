import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import Button from '@material-ui/core/Button';
import HumanIcon from '../../Shared/HumanIcons/HumanIcon';

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

class StudyUser extends React.Component {
    state = {
        isLoading: true,
        info: null,
        showSnack: false,
        snackMessage: '',
        password: '',
        password_confirm: '',
        passwordError: false,
    };

    componentDidMount() {
        //추천으로 들어온 경우
        if(this.props.auth.id) {
            axios.get('/api/auth/getUserInfo/'+this.props.auth.id)
                .then(response => {
                    const data = response.data;
                    if(data.status) {
                        this.setState(function(state, props){
                            return {
                                info: data.data,
                                isLoading: false,
                            }
                        });
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

    handleInput = (event, identifier) => {
        const info = {...this.state.info};
        info[identifier] = event.target.value;
        this.setState(function(state, props){
            return {
                info: info
            }
        });
    }

    handlePassword = (event) => {
        const value = event.target.value;
        let error = false;
        if(this.state.password !== '' && this.state.password_confirm !=='' && value !== this.state.password) {
            error = true;
        }
        this.setState(function(state, props){
            return {
                password: value,
                passwordError: error
            }
        });
    }

    handlePasswordConfirm = (event) => {
        const value = event.target.value;
        let error = false;
        if(this.state.password !== '' && this.state.password_confirm !=='' && value !== this.state.password) {
            error = true;
        }
        this.setState(function(state, props){
            return {
                password_confirm: value,
                passwordError: error
            }
        });
    }
    handleTextArea = (event) => {
        const info = {...this.state.info};
        info.intro = event.target.value;
        this.setState(function(state, props){
            return {
                info: info
            }
        })
    }
    checkForm = () => {
        if(this.state.info.name === '') {
            this.showAlarm('한글 이름을 입력해주세요.');
            return false;
        }

        if(this.state.info.name_en === '') {
            this.showAlarm('영문 이름을 입력해주세요.');
            return false;
        }

        if(this.state.info.password === '') {
            this.showAlarm('비밀번호를 입력해주세요.');
            return false;
        }

        if(this.state.passwordError) {
            this.showAlarm('비밀번호 확인에 실패하였습니다.');
            this.setState(function(state, props){
                return {
                    password: '',
                    password_confirm: ''
                }
            })
            return false;
        }

        if(this.state.info.belongto === '') {
            this.showAlarm('소속을 입력해주세요.');
            return false;
        }
        return true;
    }
    handleNext = () => {
        if(this.state.activeStep === 0) {
            if(!this.checkForm()){
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

    completeModify = () => {
        if(!this.checkForm()) {
            return false;
        }

        this.setState(function(state, props){
            return {
                isLoading: true,
            }
        });
        const body = {...this.state.info};
        if(this.state.password.trim() !== '') {
            body.password = this.state.password;
        }

        axios.post('/api/auth/editMember', body)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.showAlarm("회원 정보가 정상적으로 수정되었습니다.");
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                            password: '',
                            password_confirm: '',
                            passwordError: false,
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
        const info = {...this.state.info};
        info.img_path = url;
        this.setState(function(state,props){
            return {
                info:info
            }
        });
        this.showAlarm('프로필 사진이 성공적으로 변경되었습니다.');
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

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.layout}>
        <LinearLoading open={this.state.isLoading}/>
        {!this.state.info ? null : 
        <div className={classes.layout}>
            <Paper className={classes.paper}>
                <React.Fragment>
                    <Typography variant="h6" gutterBottom>
                        회원 기본 정보
                        <Button variant="contained" onClick={this.completeModify} style={{float: 'right'}}>수정</Button>
                    </Typography>
                    <Grid container spacing={24}>
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            {!this.state.info.img_path || this.state.info.img_path === '' ? 
                            (<a onClick={this.startInsertImage} style={{cursor: 'pointer'}}>
                                <Avatar style={{width:'100px', height:'100px', margin: '0 auto'}} alt="">
                                    <FaceIcon style={{width:'100px', height:'100px'}}/>
                                </Avatar>
                                <br />사진을 등록해주세요.
                            </a>) : (
                                <a onClick={this.startInsertImage} style={{cursor: 'pointer'}}>
                                {this.state.info.isEmoticon ? 
                                    <Avatar style={{width:'100px', height:'100px', margin: '0 auto'}} alt="">
                                        <HumanIcon indexValue={this.state.info.img_path} />
                                    </Avatar>:
                                    <img src={this.state.info.img_path} width="100px" height="100px" alt="user image" />}
                                </a>
                            ) }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            required
                            id="name"
                            name="name"
                            label="한국 이름"
                            value={this.state.info.name}
                            onChange={(event) => this.handleInput(event, 'name')}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: this.state.info.name_en ? true : false }}
                            required
                            id="name_en"
                            name="name_en"
                            label="영문 이름(영어 이름)"
                            value={this.state.info.name_en}
                            onChange={(event) => this.handleInput(event, 'name_en')}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            readOnly
                            id="email"
                            name="email"
                            label="이메일"
                            value={this.state.info.email}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            error={this.state.passwordError}
                            id="password"
                            name="password"
                            label="패스워드"
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePassword}
                            fullWidth
                        />
                        {this.state.passwordError ?
                        <React.Fragment >
                            <section style={{color: 'red'}}>
                                패스워드가 일치하지 않습니다.
                            </section>
                        </React.Fragment>
                        : null }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="password_confirm"
                            name="password_confirm"
                            label="패스워드 확인"
                            type="password"
                            value={this.state.password_confirm}
                            onChange={this.handlePasswordConfirm}
                            fullWidth
                        />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            required
                            InputLabelProps={{ shrink: this.state.info.belongto ? true : false }}
                            id="belongto" 
                            name="belongto" 
                            label="소속/대학" 
                            value={this.state.info.belongto}
                            onChange={(event) => this.handleInput(event, 'belongto')}
                            fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="tel_no" 
                            name="tel_no" 
                            InputLabelProps={{ shrink: this.state.info.tel_no ? true : false }}
                            label="연락처" 
                            value={this.state.info.tel_no}
                            onChange={(event) => this.handleInput(event, 'tel_no')}
                            fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: this.state.info.job ? true : false }}
                            id="job"
                            name="job"
                            label="직업"
                            fullWidth
                            value={this.state.info.job}
                            onChange={(event) => this.handleInput(event, 'job')}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            InputLabelProps={{ shrink: this.state.info.position ? true : false }}
                            id="position"
                            name="position"
                            label="직책"
                            fullWidth
                            value={this.state.info.position}
                            onChange={(event) => this.handleInput(event, 'position')}
                        />
                        </Grid>
                    </Grid>
                <Grid container spacing={24} style={{ marginTop: '15px'}}>
                    <Grid item xs={12}>
                    <TextField
                        required
                        InputLabelProps={{ shrink: this.state.info.intro ? true : false }}
                        multiline
                        id="intro"
                        value={this.state.info.intro}
                        onChange={this.handleTextArea}
                        label="간단한 자기소개를 적어주세요."
                        fullWidth
                    />
                    </Grid>
                </Grid>
                </React.Fragment>
                <input type="file" style={{display: 'none'}} ref="userImage" onChange = {(event) => this.uploadImage(event)} />
            </Paper>
        </div>
          }
        <Snackbar
            place="br"
            color="danger"
            message={this.state.snackMessage}
            open={this.state.showSnack}
            closeNotification={() => this.setState({ showSnack: false })}
            close
            />
        </div>
    </React.Fragment>
    );
  }
}

StudyUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(StudyUser));