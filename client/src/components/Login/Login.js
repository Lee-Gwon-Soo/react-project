import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import './Login.css';
import { loginRequest } from '../../actions/auth';
import { fetchUser } from '../../actions';

import Basicinput from '../form/BasicInput/Basicinput';
import Aux from '../../HOC/Aux';
import Toast from '../Shared/Toast/Toast';
import Spinner from '../Shared/Spinner/Spinner';
import LinearLoading from '../Shared/LinearLoading/LinearLoading';
import LockIcon from '@material-ui/icons/Lock';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class Login extends Component {
    state = {
        loginForm: {
            email : {
                elementConfig: {
                    type: 'text',
                    label : '이메일',
                    missingMsg :"mKeyword 아이디를 입력해주세요.",
                    width: '100%'
                },
                validation: {
                    required: true
                },
                valid:false,
                touched:false,
                value: ''
            },
            password: {
                elementConfig: {
                    type: 'password',
                    label : '비밀번호',
                    missingMsg : '비밀번호를 입력해주세요.',
                    width: '100%'
                },
                validation: {
                    required: true
                },
                valid:false,
                touched:false,
                value: ''
            }
        },
        formError: false,
        errorMessage: '',
        loading: false,
        loginSuccess:false,
    }

    componentDidMount() {
        if(this.props.auth) {
            if(this.props.auth.status_cd === 'S') {
                this.props.history.push('/study/dashboard/list');
            }else {
                this.props.history.push('/dashboard/summary'); 
            }
        }
    }

    checkInputHandler = (inputIdentifier) => {
        const updatedLoginForm = {
            ...this.state.loginForm
        }
        const updatedFormEL = {...updatedLoginForm[inputIdentifier]};
        updatedFormEL.touched = true;
        updatedLoginForm[inputIdentifier] = updatedFormEL;

        this.setState(function(state, props){
            return {
                loginForm: updatedLoginForm,
            };
        });
    }

    inputChangedHandler = (event, inputIdentifier) => {
            const updatedLoginForm = {
                ...this.state.loginForm
            }
            const updatedFormEL = {...updatedLoginForm[inputIdentifier]};
            updatedFormEL.value= event.target.value;
            updatedFormEL.touched = true;
            updatedFormEL.valid = this.checkValidity(updatedFormEL.value, updatedFormEL.validation, updatedFormEL.touched);
            updatedLoginForm[inputIdentifier] = updatedFormEL;

            this.setState(function(state, props){
                return {
                    loginForm: updatedLoginForm,
                };
            });
    }

    checkValidity(value, rules, isTouched){
        let isValid = false;    
        
        if(rules.required && isTouched===true) {
            isValid = value.trim() !== '';
        }

        return isValid;
    }

    setErroMessage(msg) {
        this.setState(function(state, props){
            return {
                errorMessage : msg
            }
        });
    }

    formError(value) {
        this.setState(function(state, props){
            return {
                formError: value
            }
        });
    }

    submitForm = async (event) => {
        const formData = {};
        for(let formElementIdentifier in this.state.loginForm){
            formData[formElementIdentifier] = this.state.loginForm[formElementIdentifier].value;
        }
        if(this.formValidation(formData)===false) {
            this.formError(true);
            return ;
        } else {
            this.setState(function(state, props){ return{ loading: true }});
            this.props.loginRequest(formData, this.props.history)
                .then((response) => {
                    if(response.status===false){
                        this.setState(function(state, props){ return{ loading: false }});
                        this.setErroMessage(response.message)
                        this.formError(true);
                    } else {
                        this.props.fetchUser();
                        setTimeout(() => {
                            let path = '';
                            if(this.props.match.params.studyId) {
                                path = '/study/signup/'+this.props.match.params.studyId+'/recommend';
                            } else {
                                path = this.props.auth.status_cd === 'S' ? '/study/dashboard/list' : '/dashboard/summary';
                            }
                            this.props.history.push(path);
                        },2000)
                    }
                })
                .catch(error => {
                    this.setState(function(state, props){ return{ loading: false }});
                    this.setErroMessage("로그인에 실패하였습니다.")
                    this.formError(true);
                })
            
        }
    }

    formValidation(data){
        const email = data.email;
        const password = data.password;

        let isValid = true;
        let msg = '';
        if ( email.trim() === '' || !(email.trim().indexOf('@')> -1) ) {
            msg = "mKeyword ID는 이메일 형식입니다.";
            document.querySelector('#email').focus();
            isValid = false;
        }else if ( password.trim() === '' ){
            msg = "mKeyword 비밀번호를 입력해 주세요.";
            document.querySelector('#password').focus();
            isValid = false;
        }

       
        this.setErroMessage(msg);
        return isValid;
    }

    onKeyDown = (event, id) => {
        if(event.key === 'Enter') {
            if(id==='email') {
                document.querySelector('#password').focus();
            }else {
                this.submitForm();
            }
        }
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { formError: false }
        });
    };

    render(){
        const formArray = [];

        for(let key in this.state.loginForm){
            formArray.push({
                id:key,
                config:this.state.loginForm[key]
            })
        }

        // ErrorMeasge pop up when there is an error
        let errorMessage = null;
        if(this.state.formError) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose} />
            )
        }else {
            errorMessage = null;
        }

        //Loader when click submit button
        let form = null;
        if(this.state.loginSuccess){
            const path = this.props.auth.status_cd === 'S' ? '/study/dashboard/list' : '/dasboard';
            form = (
                 <Redirect to={path} />  
            );
        }else if(this.state.loading){
            form = (
                <Spinner />
            )
        } else {
            form = (
                <Grid container spacing={8} className="ContentForm">
                    <Grid className="form" item xs={12}>
                    {formArray.map(formElement => (
                            <Basicinput 
                                elementConfig={formElement.config.elementConfig} 
                                key={formElement.id} 
                                id={formElement.id}
                                value={formElement.config.value}
                                changed={(event) =>this.inputChangedHandler(event, formElement.id)}
                                blur={() => this.checkInputHandler(formElement.id)}
                                validation={formElement.config.validation}
                                valid = {formElement.config.valid}
                                touched= {formElement.config.touched}
                                maxWidth="350px"
                                onKeyDown={(event) => this.onKeyDown(event, formElement.id)}
                                
                                />
                    ))}
                    </Grid>
                    <Button
                        type="button"
                        style={{maxWidth:'350px', width: '100%', marginBottom:'20px'}}
                        variant="contained"
                        color="primary"
                        onClick={this.submitForm}
                        >
                        로그인
                    </Button>
                </Grid>
            )
        }
        
        return (
            <Aux>
                <div className="Login container">
                        <Paper className="Pad">
                            <div className="Title">
                                <LockIcon />
                                <h2>M KEYWORD</h2>
                            </div>
                            {form}
                            <section>
                                <Button onClick={this.findPassword}>
                                    비밀번호를 잊으셨나요?
                                </Button>
                            </section>
                        </Paper>
                </div>
                {errorMessage}
            </Aux>
        )
    }   
}

function mapStateToProps( { auth }) {
    return {auth}
}

const mapDispatchToProps = {
    loginRequest, // will be wrapped into a dispatch call
    fetchUser, // will be wrapped into a dispatch call
  };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));