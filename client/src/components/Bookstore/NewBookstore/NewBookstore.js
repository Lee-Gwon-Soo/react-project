import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Aux from '../../../HOC/Aux';
import { Redirect } from 'react-router-dom';

import StoreFormField from './StoreFormField';
import StorePlan from './StorePlan';
import Toast from '../../Shared/Toast/Toast';
import Loading from '../../Shared/Loading/Loading';
import './NewBookstore.css';


// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  tableUpgradeWrapper: {
    display: "block",
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    MsOverflowStyle: "-ms-autohiding-scrollbar"
  },
};



class NewBookstore extends Component {
    state = {
        storePlan : {
            basic: {
                name: 'basic',
                title: '기본 책장',
                description: '개인적인 취미로 가끔 글을 읽고 있는 경우 가장 적합한 플랜입니다.',
                limit: 20,
            },
            advanced: {
                name: 'advanced',
                title: '기본 책장',
                description: '독서를 좋아하여 일주일에 2~3권 정도를 읽는 경우 가장 적합한 플랜입니다.',
                limit: 50,
            },
            master: {
                name: 'master',
                title: '대형 책장',
                description: '독서에 푹 빠져서 책 없이는 살 수 없는 책벌레에게 가장 적합한 플랜입니다.',
                limit: 200,
            }
        },
        registerForm: {
            nickname: {
                value :'',
                valid: false,
                touched: false,
            },
            storeCd: {
                value :'',
                valid: false,
                touched: false,
            },
            intro: {
                value :'',
                valid: false,
                touched: false,
            },
        },
        plan: 'basic',
        error: false,
        errorMessage: '',
        loading: true,
        step: 1,
        success: false,
    }

    componentDidMount() {
        if(this.props.auth.id) {
            axios.get('/api/bookstore/' + this.props.auth.id).then(
                (response) => {
                    if(!response.data.status) {
                        this.setState(function(state, props){
                            return {
                                loading: false
                            }
                        })
                    } else{
                        this.props.history.push('/dashboard/bookstore');
                    }
                },
                (error) => {
                    this.setState(function(state, props){
                        return {
                            error: true
                        }
                    })
                }
            )
        }
    }
    

    selectPlans = (plan) => {
        this.setState(function(state, props){
            return {
                plan: plan,
                step: 2,
            }
        })
    }

    changeValue = (event, initiator) => {
        const value = event.target.value;
        const registerForm = {...this.state.registerForm};
        registerForm[initiator].value = value;
        registerForm[initiator].touched = true;
        registerForm[initiator].valid = true;
        this.setState(function(state,props){
            return {
                registerForm:registerForm
            }
        })
    }

    stepBack = () => {
        this.setState(function(state){
            return {
                plan: '',
                registerForm: {
                    nickname: {
                        value :'',
                        valid: false,
                        touched: false,
                    },
                    storeCd: {
                        value :'',
                        valid: false,
                        touched: false,
                    },
                    intro: {
                        value :'',
                        valid: false,
                        touched: false,
                    },
                },
                step: state.step-1
            }
        })
    }

    formError = (msg) => {
        this.setState(function(state, props){
            return {
                error: true,
                errorMessage: msg
            }
        })
    }

    formCheck =() => {
        const registerForm = {...this.state.registerForm};
        let valid = true;
        if(registerForm.nickname.value === '' || registerForm.nickname.touched === false ) {
            this.formError('서재 이름을 등록해 주세요.');
            registerForm.nickname.valid = false;
            registerForm.nickname.touched = true;
            valid = false;
        }

        if(registerForm.storeCd.value === ''  || registerForm.storeCd.touched === false ) {
            this.formError('서재 코드를 등록해 주세요.');
            registerForm.storeCd.touched = true;
            registerForm.storeCd.valid = false;
            valid = false;
        }

        if(registerForm.intro.value === '' || registerForm.intro.touched === false ) {
            this.formError('서재 소개를 작성해 주세요.');
            registerForm.intro.touched = true;
            registerForm.intro.valid = false;
            valid = false;
        }

        this.setState(function(state, props) {
            return {
                registerForm: registerForm,
            }
        })
        
        return valid;
    }

    saveBookstore = () => {
        if(this.formCheck() === false) {
            return false;
        }

        this.setState(function(state, props){
            return {
                loading:true,
            }
        });

        const body = {
            plan: this.state.plan,
            nickname: this.state.registerForm.nickname.value,
            storeCd: this.state.registerForm.storeCd.value,
            intro: this.state.registerForm.intro.value,
        };

        axios.post('/api/bookstore/add/'+this.props.auth.id, body)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.setState(function(state,props){
                        return {
                            success: true,
                            loading: false,
                        }
                    })
                } else {
                    this.formError(res.message);
                    this.setState(function(state,props){
                        return {
                            loading: false,
                        }
                    })
                }
            })
    }

    generateStoreCode = () => {
        axios.post('/api/bookstore/generateStoreCode')
            .then((response) => {
                const res = response.data;
                if(res.status) {
                    const registerForm = {...this.state.registerForm};
                    registerForm['storeCd'].value = res.data;
                    registerForm['storeCd'].valid = true;
                    registerForm['storeCd'].touched = true;
                    this.setState(function(state,props){
                        return {
                            registerForm:registerForm
                        }
                    })
                }
            })
    }
    
    renderStepView = () => {
        const { step } = this.state;
        if(step === 1) {
            return (
                <StorePlan 
                    selectNext={(plan) => this.selectPlans(plan)}
                />
            )
        } else if (step === 2 ){ 
            return (
                <StoreFormField 
                    registerForm={this.state.registerForm}
                    changeValue ={(event, initiator) => this.changeValue(event, initiator)}
                    stepBack={this.stepBack}
                    saveBookstore={this.saveBookstore}
                    generateStoreCode={this.generateStoreCode}
                />
            )
        }
    }

    handleClose = () => {
        this.setState(function(state, props){
            return {
                error: false,
                errorMessage: ''
            }
        })
    }

    render(){
        const { classes } = this.props;

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose}/>
            )
        } else {
            errorMessage = null;
        }

        let renderView = null;
        if(this.state.success) {
            renderView = (
                <Redirect to="/dashboard/bookstore"/>
            )
        } else if(this.state.loading) {
            renderView = (
                <Loading />
            )
        } else {
            renderView = (
                <Grid container justify="center" className="newbookstoreContainer">
                    <Grid item xs={12} sm={12} md={8}>
                        <Typography variant="h3" gutterBottom style={{ color: '#aaaaaa'}}>
                            M Keyword
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} style={{ marginTop: '15px'}}>
                        <section>
                            <h4 className={classes.cardTitleWhite}>
                            나의 서재 등록
                            </h4>
                            <p className={classes.cardCategoryWhite}>
                            자신만의 온라인 서재를 등록해주세요.
                            </p>
                        </section>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        {this.renderStepView()}
                    </Grid>
                    {this.state.step !== 1 && (
                    <section className="stepHelper" onClick={this.stepBack}>
                        <section className="stepHelperBoard">
                            <section className="helperContent">
                                <span style={{ top: '-12px', display:'inline-block', position: 'relative'}}>
                                    <ArrowLeft />
                                </span>
                            </section>
                        </section>
                    </section>
                    )}
                    <section className="newStoreFooter">
                        <Button color="primary" onClick={this.stepBack} className="stepBackButton">
                            이전
                        </Button>
                        <Button color="primary" onClick={() => this.props.history.push('/dashboard/summary')}>
                            취소
                        </Button>
                    </section>
                </Grid>
            );
        }

        return (
            <Aux>
                {renderView}
                {errorMessage}
            </Aux>
        )
    }
}

function mapStateToProps({auth}) {
    return {auth};
}

NewBookstore = withStyles(styles, {name: 'NewBookstore'})(NewBookstore);
export default connect(mapStateToProps)(NewBookstore);
