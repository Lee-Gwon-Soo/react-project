import React from 'react';
import './GritList.css';
import moment from 'moment';
import 'moment-timezone';
import axios from 'axios';
import Loading from '../../Shared/Loading/Loading';
import Toast from '../../Shared/Toast/Toast';
import GritTypeControls from './GritTypeControls/GritTypeControls';
import NewGritCheck from './NewGritCheck/NewGritCheck';
import GritItem from './GritItem/GritItem';

import Grid from '@material-ui/core/Grid';

class GritList extends React.Component {
    state = {
        element : {
            type: '',
            startDate:  moment().tz("Asia/Seoul").format('YYYY-MM-DD'),
            dueDate: '',
            title: '',
            completed: 0,
        },
        checkList: {
            1: false,
            2: false,
            3: false
        },
        open: false,
        selectAll: false,
        isLoading: true,
        error: false,
        errorMessage: '',
        gritList:[],
    }

    //will get list of current grit list
    componentDidMount() {
        if(this.props.match.params.id) {
            axios.get('/api/grit/getGritList/' + this.props.match.params.id)
                .then( response => {
                    const data = response.data;

                    if( data.status ) {
                        const list = [...data.data];
                        this.setState(function(state, props) {
                            return {
                                gritList: list,
                                isLoading: false,
                            }
                        })
                    } else {
                        this.setState(function(state, props){
                            return {
                                isLoading: false
                            }
                        });
                        this.setError(data.message);
                    }
                })
                .catch (err => {
                    this.setError('로딩에 문제가 생겼습니다. 페이지를 새로고침 해주세요.');
                })
        }
        
    }
    
    handleClickOpen = () => {
        this.setState(function(state,props){
            return {
                open: true,
            }
        });
    };

    handleClose = () => {
        this.setState(function(state,props){
            return {
                open: false,
            }
        });
    };

    setError = (msg) => {
        this.setState(function(state,props){
            return {
                error: true,
                errorMessage: msg
            }
        });

        setTimeout(() => {
            this.setState(function(state,props){
                return {
                    error: false,
                    errorMessage: ''
                }
            });   
        },2500);
    }

    handleFinishSelect = () => {
        if( this.state.element.title === '' ) {
            this.setError('제목을 입력해 주세요.');
            return false;
        }


        if( this.state.element.type === '' ) {
            this.setError('타입을 선택해 주세요.');
            return false;
        }

        if( this.state.element.startDate === '' ) {
            this.setError('시작일자를 선택해 주세요.');
            return false;
        }

        if( this.state.element.dueDate === '' ) {
            this.setError('마감일자를 선택해 주세요.');
            return false;
        }

        this.setState(function(state,props){
            return {
                open: false,
                selectAll: true,
            }
        });
    };

    handleChange = name => event => {
        const currentElement = {...this.state.element};
        currentElement[name] = event.target.value;

        this.setState(function(state,props){
            return {
                element: currentElement,
            }
        });
    };

    reStartGritList = () => {
        const element = {
            type: '',
            startDate:  moment().format('YYYY-MM-DD'),
            dueDate: '',
            title: '',
        }

        this.setState(function(state,props){
            return {
                element: element,
                selectAll: false,
            }
        });
    }

    addNewGritList = () => {
        if(this.checkForm() === true) {
            this.setState(function(state, props){
                return {
                    isLoading: true
                }
            });

            const startDate = this.state.element.startDate;
            const dueDate = this.state.element.dueDate;

            const difference = moment(dueDate).diff(moment(startDate), 'days');

            let dailyCheck = [];
            for( let i = 0 ; i <= difference ; i++ ){
                dailyCheck.push({
                    date: moment(startDate).add(i, 'day').format('YYYY-MM-DD'),
                    checked: false,
                })
            }


            const body = {...this.state.element};
            body.checkList = [...dailyCheck];

            axios.post('/api/grit/addNewGrit/'+ this.props.match.params.id, body)
                .then((response) => {
                    const data = response.data;
                    if( data.status ) {
                        window.location.reload();
                    } else {
                        this.setState(function(state, props){
                            return {
                                isLoading: false
                            }
                        });
                        this.setError(data.message);
                    }
                })
                .catch( err  => {
                    this.setState(function(state, props){
                        return {
                            isLoading: false
                        }
                    });
                    this.setError(err.message);
                });

        }
    }
    
    checkForm = () => {
        let allChecked = true;
        for ( let key in this.state.checkList) {
            if(this.state.checkList[key] === false) {
                allChecked = false;
            }
        }

        if(allChecked === true) {
            return true;
        } else {
            this.setError('체크리스트 하단에 동의를 눌러주세요.');
            return false;
        }
    }

    clickAgreement = (index) => {
        const checkList = {...this.state.checkList};
        checkList[index] = !checkList[index];
        this.setState(function(state,props){
            return {
                checkList: checkList,
            }
        });
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };


    render() {

        let renderView = null;
        let listView = null;
        
        if(this.state.isLoading) {
            renderView = <Loading />;
        } else if( this.state.selectAll ) {
            renderView = (
                <Grid container spacing={8} className="MainGritList">
                    <NewGritCheck 
                        element={this.state.element}
                        reStartGritList={this.reStartGritList}
                        addNewGritList={this.addNewGritList}
                        checkList={this.state.checkList}
                        clickAgreement={(index)=> this.clickAgreement(index)}
                    />
                </Grid>
            );
            listView = null;
        } else {
            if (this.state.gritList.length > 0 ){
                let renderArray = [];
                for(let key in this.state.gritList) {
                    renderArray.push({
                        id: key,
                        element: this.state.gritList[key]
                    })
                }
                listView = (
                    <div className="GritListBoard"> 
                        <Grid container spacing={8} style={{marginTop: '30px'}}>
                            {renderArray.map((element) => {
                                return (
                                    <GritItem 
                                        key={element.id} 
                                        element={element.element} 
                                        />
                                )
                            })}
                        </Grid>
                    </div>
                );
            }
            renderView = (
                <Grid container className="CreateButtonArea">
                    <Grid xs={12} item>
                        <GritTypeControls 
                            element={this.state.element} 
                            open={this.state.open}
                            handleClickOpen={this.handleClickOpen}
                            handleClose={this.handleClose}
                            handleChange={(name) => this.handleChange(name)}
                            handleFinishSelect={this.handleFinishSelect}
                        />
                    </Grid>
                </Grid>
            )
        }

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose} />
            )
        } else {
            errorMessage = null;
        }

        return (
            <div className="GritList container">
                {renderView}
                {listView}
                {errorMessage}
            </div>
        )
    }
}

export default GritList;