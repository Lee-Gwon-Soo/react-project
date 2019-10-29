import React from "react";
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import * as actions from '../../../actions/study';
import TeamMemberCard from './TeamMemberCard';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import Aux from '../../../HOC/Aux';
import PostItem from './PostItem';
import StudyRecommendDialog from './StudyRecommendDialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import HomeIcon from '@material-ui/icons/Home';
import MessageDialog from "./MessageDialog.js";

const styles = (theme) => ({
    studyInfo: {
        padding: '24px',
    },
    studySummary: {
        display: 'flex',
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '4px',
        paddingBottom: '16px',
        backgroundColor: '#eeeeee',
    },
    space : {
        marginTop: '40px'
    },
    buttonArea: {
        justifyContent: "center",
        alignItems: 'center',
        display: 'flex',
    },
    memberSummary: {
        marginTop: '20px',
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '4px',
        paddingBottom: '16px',
    },
    container: {
        [theme.breakpoints.down('sm')] : {
            marginBottom: '30px'
        }
    },
    title: {
        [theme.breakpoints.down('sm')] : {
            display: 'none'
        }
    },
    mobileTitle: {
        [theme.breakpoints.up('sm')] : {
            display: 'none'
        },
    }
})
class StudyDetail extends React.Component {
    state = {
        isLoading: true,
        info: {},
        postList: [],
        open: false,
        recommend_email: '',
        showSnack: false,
        snackMessage: '',
        isCreator: false,
        messageForm: {
            email: '',
            receiverName: '',
            content: '',
            title:'',
        },
        messageOpen: false,
    }

    handleMessageOpen = () => {
        this.setState(function(state, props) {
            return {
                messageOpen: true
            }
        });
    };

    handleMessageClose = () => {
        this.setState(function(state, props) {
            return {
                messageOpen: false
            }
        });
    };

    componentDidMount() {
        if(!this.props.auth) {
            this.props.history.push('/login');
        }else if(this.props.match.params.study_id) {
            axios.get('/api/study/getStudyInfo/'+this.props.match.params.study_id+'/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;
                    if ( res.status ) {
                        this.setState(function(state,props) {
                            return {
                                info: {...res.data},
                                postList: [...res.list],
                                isLoading: false,
                                isCreator: res.isCreator
                            }
                        });
                        document.getElementById('title').innerHTML = this.state.info.name;
                    } else {
                        this.showAlarm("스터디 로딩에 문제가 생겼습니다.");
                        setTimeout(() => {
                            this.props.history.push('/study/dashboard/list');
                        }, 2000);

                    }
                })
        } 
    }

    handleClickOpen = () => {
        if(this.state.info.currentMemberCount === this.state.info.memCount) {
            this.showAlarm("더 이상 스터디 인원을 추천할 수 없습니다.");
            return false;
        }
        this.setState(function(state,props){
            return {
                open: true
            }
        })
    };
    
    handleClose = () => {
        this.setState(function(state,props){
            return {
                open: false
            }
        })
    };

    handleInput = (event) => {
        const content = event.target.value;
        this.setState(function(state,props){
            return {
                recommend_email: content
            }
        });
    }
    
    getDate = (original) => {
        const date =  new Date(original);
        return `${date.getFullYear().toString()}년 ${(date.getMonth()+1)}월 ${date.getDate()}일`;
    }

    sendRecommendMail = () => {
        if (this.state.recommend_email === '') {
            this.showAlarm("이메일을 입력해주세요.");
            return false;
        }

        const body = {
            email: this.state.recommend_email,
            studyId: this.props.match.params.study_id
        }
        axios.post('/api/study/send/recommendMail/'+this.props.auth.id, body)
            .then(response => {
                this.handleClose();
                this.showAlarm("이메일을 전송했습니다.");
            })
    }

    gotoPostDetail = (postId) => {
        this.props.setStudyId(this.props.match.params.study_id);
        setTimeout( () => {
            this.props.history.push('/study/front/post/'+postId);
        }, 1000);
    }

    gotoStudyPage = () => {
        this.props.setStudyId(this.props.match.params.study_id);
        setTimeout( () => {
            this.props.history.push('/study/front/'+this.props.match.params.study_id);
        }, 1000);
    }

    trySendMessage = (email, receiverName) => {
        if(email === this.props.auth.email) {
            return false;
        }
        const messageForm = {
            receiverName: receiverName,
            email: email,
        }

        this.setState(function(state){
            return {
                messageForm:messageForm
            }
        });

        this.handleMessageOpen();
    }

    renderView = () => {
        const {classes} = this.props;
        if(this.state.isLoading) {
            return <LinearLoading open={this.state.isLoading} />
        } else {
            return (
                <Aux>
                    <Grid container justify="center" className={classes.container}>
                        <Grid item xs={12} sm={12} md={10}  style={{marginTop: '20px'}} className={classes.title}>
                            <HomeIcon style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/study/dashboard/list')}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={10}>
                            <Typography variant="h3" gutterBottom className={classes.title}>
                                {this.state.info.name}
                                {this.state.isCreator ? 
                                <Button style={{float: 'right'}} onClick={() => this.props.history.push('/study/dashboard/edit/'+this.state.info._id)}>수정하기</Button>: null}
                                <Button color="primary" style={{float: 'right'}} onClick={() => this.props.history.push('/study/dashboard/post/'+this.state.info._id)}>새로운 포스트</Button>
                            </Typography>
                            <div className={classes.mobileTitle}>
                                <div style={{marginTop: '20px'}}></div>
                                <Button style={{cursor: 'pointer', marginRight: '15px'}} size="small" onClick={() => this.props.history.push('/study/dashboard/list')}>이전</Button>
                                {this.state.isCreator ? 
                                <Button  style={{float: 'right'}} onClick={() => this.props.history.push('/study/dashboard/edit/'+this.state.info._id)} size="small">수정하기</Button>: null}
                                <Button style={{float: 'right'}} color="primary" onClick={() => this.props.history.push('/study/dashboard/post/'+this.state.info._id)} size="small">새로운 포스트</Button>
                                <Typography variant="h5" style={{marginTop: '20px'}} gutterBottom >
                                    {this.state.info.name}
                                </Typography>
                            </div>
                            <p>
                                {this.state.info.intro}
                            </p>
                            <Grid container spacing={8} className={classes.studySummary}>
                                <Grid item xs={12} sm={6}>
                                    <List>
                                        <ListItem>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                            <ListItemText primary={this.state.info.field} secondary="분야" />
                                        </ListItem>
                                        <ListItem>
                                        <Avatar>
                                            <BeachAccessIcon />
                                        </Avatar>
                                            <ListItemText primary={this.state.info.place} secondary="장소" />
                                        </ListItem>
                                    </List>
                                </Grid>

                                <Grid item xs={12} sm={6} className={classes.buttonArea}>
                                    <Button variant="contained" color="primary" size="large" onClick={() => this.props.history.push('/study/assignment/front/'+this.props.match.params.study_id)}>과제 목록</Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={8} className={classes.memberSummary}>
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                    스터디 회원
                                    <Button color="secondary" onClick={this.handleClickOpen} style={{marignLeft: '10px'}}>추천 메일 보내기</Button>
                                    </Typography>
                                </Grid>
                                {this.state.info._user.length > 0 ? (
                                    this.state.info._user.map((user, index) => {
                                        return <TeamMemberCard 
                                            element={user}
                                            trySendMessage={()=>this.trySendMessage(user.email, user.name)}
                                            key={index}
                                        />;
                                    })
                                ) : (
                                    <div className="typography-line">
                                        <h6>
                                            <span>현재 등록된 회원이 없습니다.</span>
                                        </h6>
                                    </div>
                                )}
                            </Grid>
                            <div className={classes.space}>
                            <Typography variant="h4" gutterBottom className={classes.title}>회원들이 공유한 포스트를 확인해주세요.</Typography>
                            <Typography variant="h6" gutterBottom className={classes.mobileTitle}>회원들이 공유한 포스트를 확인해주세요.</Typography>
                                {this.state.postList.map((item, index)=> {
                                        return (
                                            <PostItem 
                                                key={item._id}
                                                element={item}
                                                onClick={() => this.props.history.push('/study/front/post/'+item._id)}
                                            />
                                        )
                                    })}
                            </div>
                        </Grid>
                    </Grid>
                </Aux>
            )
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

    changeMessageTitle = (event) => {
        const content = event.target.value;
        const messageForm = {...this.state.messageForm};
        messageForm.title = content;
        this.setState(function(state,props){
            return {
                messageForm: messageForm,
            }
        });
    }

    changeMessageContent= (event) => {
        const content = event.target.value;
        const messageForm = {...this.state.messageForm};
        messageForm.content = content;
        this.setState(function(state,props){
            return {
                messageForm: messageForm,
            }
        });
    }

    sendMessage = () => {
        axios.post('/api/sendPrivateMessage/'+this.props.auth.id, this.state.messageForm)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.showAlarm('메시지가 전송되었습니다.');
                    this.setState(function(state){
                        return {
                            messageForm: {
                                email: '',
                                receiverName: '',
                                content: '',
                            }
                        }
                    })
                    this.handleMessageClose();
                } else {
                    this.showAlarm('메시지 전송에 실패하였습니다.');
                    this.handleMessageClose();
                }
            })
            .catch(err => {
                this.showAlarm('메시지 전송에 실패하였습니다.');
                this.handleMessageClose();
            })
    }

    render() {
        return (
            <Aux>
                {this.renderView()}
                <Snackbar
                place="br"
                color="success"
                message={this.state.snackMessage}
                open={this.state.showSnack}
                closeNotification={() => this.setState({ showSnack: false })}
                close
                />
                <MessageDialog 
                    open={this.state.messageOpen}
                    changeMessageContent={this.changeMessageContent}
                    element={this.state.messageForm}
                    handleClose={this.handleMessageClose}
                    changeMessageTitle= {this.changeMessageTitle}
                    sendMessage={this.sendMessage}
                />
                <StudyRecommendDialog 
                    open={this.state.open} 
                    handleClose={this.handleClose}
                    recommendEmail={this.state.recommend_email}
                    handleInput={(event) => this.handleInput(event)}
                    sendRecommendMail={this.sendRecommendMail}
                    />
            </Aux>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth }
}

export default connect(mapStateToProps, actions)(compose(withStyles(styles, { withTheme: true }),withWidth())(StudyDetail));
