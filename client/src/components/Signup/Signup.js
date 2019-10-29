import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/auth';

import './Signup.css';
import MaterialInput from '../form/Input/MaterialInput';
import Toast from '../Shared/Toast/Toast';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class Signup extends Component {
    state = {
        signupForm: {
            email : {
                elementConfig: {
                    type: 'text',
                    label : 'Email',
                    missingMsg : 'email is required',
                    width: '325px',
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
                    label : 'Password',
                    missingMsg : 'Password is required',
                    width: '325px',
                },
                validation: {
                    required: true
                },
                valid:false,
                touched:false,
                value: ''
            }
        },
        agreeChecked: {
            1: false,
            2: false,
            3: false,
        },
        error: false,
        errorMessage: '',
    }

    componentDidMount() {
        if(this.props.auth) {
           this.props.history.push('/dashboard'); 
        }
    }

    checkInputHandler = (inputIdentifier) => {
        const updatedSignupForm = {
            ...this.state.signupForm
        }
        const updatedFormEL = {...updatedSignupForm[inputIdentifier]};
        updatedFormEL.touched = true;
        updatedSignupForm[inputIdentifier] = updatedFormEL;

        this.setState(function(state, props){
            return {
                signupForm: updatedSignupForm,
            };
        });
    }

    inputChangedHandler = (event, inputIdentifier) => {
            const updatedSignupForm = {
                ...this.state.signupForm
            }
            const updatedFormEL = {...updatedSignupForm[inputIdentifier]};
            updatedFormEL.value= event.target.value;
            updatedFormEL.touched = true;
            updatedFormEL.valid = this.checkValidity(updatedFormEL.value, updatedFormEL.validation, updatedFormEL.touched);
            updatedSignupForm[inputIdentifier] = updatedFormEL;

            this.setState(function(state, props){
                return {
                    signupForm: updatedSignupForm,
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

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    submitForm = (event) => {
        const formData = {};
        for(let formElementIdentifier in this.state.signupForm){
            formData[formElementIdentifier] = this.state.signupForm[formElementIdentifier].value;
        }

        if(this.formValidation(formData) === false){
            return false;
        }
        formData['isAgreed'] = true;
        formData['regTime'] = Date.now();
        this.props.signupRequest(formData, this.props.history);

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
                error: value
            }
        });
    }

    formValidation(data){
        const email = data.email;
        const password = data.password;
        
        if ( email.trim() === '' || !(email.trim().indexOf('@')> -1) ) {
            this.setErroMessage('아이디를 이메일 형식으로 입력해주세요.');
            this.formError(true);
            return false;
        } else if (password === '' ){
            this.setErroMessage('비밀번호를 입력해주세요.');
            this.formError(true);
            return false;
        }
        
        const agreeChecked = {...this.state.agreeChecked};
        
        let checkedAll = true;
        for ( let key in agreeChecked) {
            if(!agreeChecked[key]){
                checkedAll = false;
            }
        }

        if(!checkedAll){
            this.setErroMessage('동의 사항에 체크해주세요.');
            this.formError(true);
            return false;
        }

        return true;
    }

    checkAgree(num){
        const newAgreeChecked = {...this.state.agreeChecked};

        newAgreeChecked[num] = !newAgreeChecked[num];
        this.setState(function(stete, props){
            return {
                agreeChecked: newAgreeChecked
            }
        })
    }

    render(){
        const formElementsArray = [];

        for( let key in this.state.signupForm) {
            formElementsArray.push({
                id: key,
                config:this.state.signupForm[key]
            })
        }

        let form = (
            <form>
                <div className="signupForm">
                    {formElementsArray.map(formElement => (
                        <MaterialInput
                            key={formElement.id}
                            name={formElement.id} 
                            type={formElement.config.elementConfig.type} 
                            label={formElement.config.elementConfig.label} 
                            style={{width: '100%', marginBottom: '10px'}}
                            value={formElement.config.value} 
                            onChange={(event) =>this.inputChangedHandler(event, formElement.id)}
                            onBlur={() => this.checkInputHandler(formElement.id)}
                            />
                    ))}
                </div>
                <div className="Consent">
                    <span style={{fontSize:'15px', margin:'10px 0px', display:'block'}}>가입자 본인은 </span>
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={this.state.agreeChecked[1]}
                            onChange={() => this.checkAgree(1)}
                            color="primary"
                            />
                        }
                        label="mKeyword의 이용약관 및 정책에 동의합니다."
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={this.state.agreeChecked[2]}
                            onChange={() => this.checkAgree(2)}
                            color="primary"
                            />
                        }
                        label="mKeyword에 제공한 정보가 사실임을 증명합니다."
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={this.state.agreeChecked[3]}
                            onChange={() => this.checkAgree(3)}
                            color="primary"
                            />
                        }
                        label="mKeyword의 선량한 사용자가 되겠습니다."
                    />
                </div>
            </form>
        );

        // ErrorMeasge pop up when there is an error
        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose} />
            )
        }else {
            errorMessage = null;
        }

        return (
            <div className="Signup">
                <div className="Pad">
                    <div>
                        <h2>회원가입</h2>
                        <p className="description">
                            <span style={{color: 'red'}}>mKeyword</span>
                            에 오신 걸 환영합니다.<br />
                            간단한 가입 절차로 저희와 함께 하실 수 있습니다.
                        </p>
                    </div>
                    <div className="Content">
                        {form}
                    </div>
                    <Button color="primary" onClick={this.submitForm} >
                        계속
                    </Button>
                </div>
                {errorMessage}
            </div>
        )
    }
}

function mapStateToProps( { auth }) {
    return {auth}
}

export default connect(mapStateToProps, actions)(withRouter(Signup));