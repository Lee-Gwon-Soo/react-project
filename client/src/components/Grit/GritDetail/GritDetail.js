import React from 'react';
import axios from 'axios';
import './GritDetail.css';
import moment from 'moment';
import 'moment-timezone';

import Aux from '../../../HOC/Aux';
import Loading from '../../Shared/Loading/Loading';
import Toast from '../../Shared/Toast/Toast';
import Divider from '@material-ui/core/Divider';
import FullScreenDialog from '../../Shared/Dialog/FullScreenDialog';
import GritCheckItem from './GritCheckItem';
import TodayGrit from './TodayGrit';

import Grid from '@material-ui/core/Grid';


class GritDetail extends React.Component {
    state = {
        isLoading: true,
        element : {},
        error: false,
        errorMessage: '',
        clickedKey: null,
        open: false,
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            axios.get('/api/grit/detail/'+this.props.match.params.id)
                .then((response) => {
                    const data = response.data;

                    if( data.status ) {
                        const element = {...data.data};
                        this.setState(function(state, props){
                            return {
                                isLoading: false,
                                element: element
                            }
                        })

                    } else {
                        this.setState(function(state, props){
                            return {
                                error: true,
                                errorMessage: data.message
                            }
                        });

                        setTimeout( () => {
                            this.props.history.push('/dashboard');
                        },2500);

                    }

                })
        }
    }

    handleClickOpen = () => {
        this.setState(function(state,props){ 
            return {
                open: true 
            }
        });
    };

    handleClose = () => {
        this.setState(function(state,props){ 
            return {
                open: false 
            }
        });
    };

    checkTodayWork = (key) => {
        if(this.state.clickedKey !== null ){
            return false;
        }
        
        const element = {...this.state.element};

        if( moment( element.checkList[key].date ).isAfter(moment().tz("Asia/Seoul").format('YYYY-MM-DD')) ) {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: "미래의 일을 미리 결정할 수 없습니다."
                }
            });
            return false;
        }

        element.checkList[key].checked = true;

        axios.post('/api/grit/changeGritStatus/'+element._id, element.checkList)
            .then(response => {
                const data = response.data;
                if(data.status) {
                    this.setState(function(state,props){
                        return {
                            element: {...data.data},
                            clickedKey: key
                        }
                    })
                } else {
                    this.setState(function(state, props){
                        return {
                            error: true,
                            errorMessage: data.message
                        }
                    });
                }
            })
            .catch( err => {
                this.setState(function(state, props){
                    return {
                        error: true,
                        errorMessage: err.message
                    }
                });
            });

       
    }

    render() {
        let renderView = null;

        if( this.state.isLoading ) {
            renderView = <Loading />;
        } else {
            const percentage = this.state.element.completed ? Number.parseInt(this.state.element.completed) : 0;
            const classPercent = 'c100 big p'+ percentage;

            let checkListView = null;
            let TodayId = null;
            let TodayChecked = false;

            
            if(this.state.element.checkList.length > 0 ){
                let checkArray = [];

                for(let index in this.state.element.checkList) {
                    checkArray.push({
                        id: index,
                        element: this.state.element.checkList[index]
                    })
                }

                checkListView= (
                    <FullScreenDialog
                        open={this.state.open}
                        handleClose={this.handleClose}
                        handleClickOpen={this.handleClickOpen}
                    >
                        <div className="GritDetail">
                            <Grid container spacing={8} className="gritCheckList container">
                                {checkArray.map(element => {

                                    if( moment( element.element.date ).isSame(moment().tz("Asia/Seoul").format('YYYY-MM-DD'))) {
                                        TodayId = element.id;
                                        TodayChecked = element.element.checked;
                                    }
                                    return (
                                        <GritCheckItem key={element.id} id={element.id} date={element.element.date} checked={element.element.checked} checkTodayWork={() => this.checkTodayWork(element.id)} clickedKey={this.state.clickedKey}/>
                                    )
                                })}
                            </Grid>
                        </div>
                    </FullScreenDialog>
                )
            }
            
            renderView = (
                <div className="GritDetail container">
                    <Grid container style={{width: '100%'}}> 
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            <h3 className="gritTitle">Grit 상세페이지</h3>
                        </Grid>
                    </Grid>
                    <Grid container className="GritInfo">
                        <Grid item xs={12} sm={6} className="GritProgress">
                            <div className="clearfix">
                                <div className={classPercent}>
                                    <span>{percentage}%</span>
                                    <div className="slice">
                                        <div className="bar"></div>
                                        <div className="fill"></div>
                                    </div>
                                </div>

                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} className="GritSummary">
                            <ul className="GritSummaryList">
                                <li >
                                    <div style={{justifyContent: 'center'}}>
                                        {this.state.element.title}
                                    </div>
                                </li>
                                <li>
                                    <span>
                                        <i className="material-icons">check_box_outline_blank</i>
                                        시작 일자
                                    </span>
                                    <div>
                                        {this.state.element.startDate}
                                    </div>
                                </li>
                                <li>
                                    <span>
                                        <i className="material-icons">check_box</i>
                                        마감 일자
                                    </span>
                                    <div>
                                        {this.state.element.dueDate}
                                    </div>
                                </li>
                            </ul>
                        </Grid>
                    </Grid>
                    <Divider style={{backgroundColor: 'rgba(255,255,255,0.5)', width: '80%', margin: '0 auto'}}/>
                    <Grid container style={{width: '100%'}}> 
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            <h3 className="gritTitle">Grit 체크보드
                                <span onClick={this.handleClickOpen}>전체 리스트 보기</span>
                            </h3>
                        </Grid>
                    </Grid>
                    <Grid container className="TodayGrit" style={{width: '100%'}}>
                            <TodayGrit 
                                date={moment().tz("Asia/Seoul").format('YYYY-MM-DD')}
                                checkTodayWork={() => this.checkTodayWork(TodayId)} 
                                checked={TodayChecked}
                                clickedKey={this.state.clickedKey}
                                id={TodayId}
                            />
                    </Grid>
                    {checkListView}
                </div>
            );
        }

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage}/>
            )
        } else {
            errorMessage = null;
        }


        return (
            <Aux>
                {renderView}
                {errorMessage}
            </Aux>
        )
    }
}

export default GritDetail;