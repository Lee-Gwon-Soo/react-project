import React from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Draft from '../../Shared/Draft/Draft';

import Aux from '../../../HOC/Aux';
import Editor from 'draft-js-plugins-editor';
import {EditorState,  convertFromRaw} from 'draft-js';
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NewReply from './NewReply';
import ReplyItem from './ReplyItem';
import HomeIcon from '@material-ui/icons/Home';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';

const styles = theme => ({
    content: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '4px',
        paddingBottom: '16px',
        whiteSpace: 'pre-line',
        backgroundColor: '#eeeeee',
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    space : {
        marginTop: '40px'
    },
    marginTop:{
        marginTop: '30px'
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
});

class StudyPostView extends React.Component {
    state = {
        info: {},
        studyInfo: {},
        replyList: [],
        replyChildArray:{},
        editorState: EditorState.createEmpty(),
        isLoading: true,
        showSnack: false,
        snackMessage: '',
        replyContent: '',
        saveLoading: false,
        clickLike: null,
    };

    componentDidMount() {
        if(this.props.match.params.postId) {
            axios.get('/api/study/front/getStudyPostInfo/'+this.props.match.params.postId)
                .then(response => {
                    const res = response.data;
                    if(res.status) {

                        const data = res.data;
                        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));

                        this.setState(function(state, props){
                            return {
                                info: {...res.data},
                                studyInfo: {...res.studyInfo},
                                editorState: editorState,
                                replyChildArray:{...res.replyChildArray},
                                replyList: [...res.replyList],
                                isLoading: false,
                            }
                        });
                    } else {
                        this.showAlarm("스터디 포스트 로딩에 문제가 생겼습니다.");
                    }
                })
                .catch(err => {
                   this.props.history.push('/login');
                })
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

    getPostDate = () => {
        const date =  new Date(this.state.info.ins_dtime);
        return `${date.getFullYear().toString()}년 ${(date.getMonth()+1)}월 ${date.getDate()}일`;
    }

    replyContentHandler = (event) => {
        const content = event.target.value;
        this.setState(function(state, props){
            return {
                replyContent: content
            }
        })
    }

    saveReply = () => {
        this.setState(function(state, props) {
            return {
                saveLoading : true,
            }
        })
        const content = this.state.replyContent;

        axios.post('/api/study/post/saveReply/'+this.state.info._id+'/'+this.props.auth.id, {content: content})
            .then(response => {
                const res = response.data;
                if(res.status) {
                    const replyList = [...this.state.replyList];
                    replyList.push(res.data);
                    this.setState(function(state, props) {
                        return {
                            replyList:replyList,
                            saveLoading : false,
                            replyContent: '',
                        }
                    })
                    this.showAlarm("의견 게시에 성공하였습니다.");
                } else {
                    this.showAlarm("의견 게시에 문제가 생겼습니다.");
                }
            })
    }

    replyAgainSave = (replyId) => {
        this.setState(function(state, props) {
            return {
                saveLoading : true,
            }
        })
        const content = document.getElementById('reply_'+replyId).value;

        const body = {
            content:content,
            upper_reply_id: replyId,
        }
        axios.post('/api/study/post/saveChildReply/'+this.state.info._id+'/'+this.props.auth.id, body)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    const childReplyList = {...this.state.replyChildArray};
                    if(!childReplyList[replyId]) {
                        childReplyList[replyId]= [];
                    }
                    childReplyList[replyId].push(res.data);
                    document.getElementById('reply_'+replyId).value = '';
                    this.setState(function(state, props) {
                        return {
                            replyChildArray:childReplyList,
                            saveLoading : false,
                            replyContent: '',
                        }
                    })
                } else {
                    this.setState(function(state, props) {
                        return {
                            saveLoading : false,
                        }
                    })
                    this.showAlarm("의견 게시에 문제가 생겼습니다.");
                }
            })
    }

    onChange = (editorState) => {
        this.setState({editorState});
    };

    giveHeart = (replyId) => {
        axios.post('/api/study/giveLikes/'+replyId)
            .then((response) => {
                const res = response.data;
                if(res.status){
                    const replyList = [...this.state.replyList];
                    replyList.map(reply => {
                        if(reply._id === replyId) {
                            reply.likes+=1;
                        }
                        return replyList;
                    });
                    this.setState(function(state){
                        return {
                            replyList:replyList,
                            clickLike: replyId,
                        }
                    })
                    setTimeout(() => {
                        this.setState(function(state){
                            return {
                                clickLike:null,
                            }
                        })
                    }, 500);
                } else{
                    this.showAlarm("좋아요 기능에 문제가 발생했습니다.")
                }
            })
    }

    renderView = () => {
        const {classes} = this.props;
        return (
            <Aux >
                <LinearLoading open={this.state.saveLoading || this.state.isLoading} />
                {this.state.isLoading ? null : 
                <Aux>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={12} md={10} className={classes.title}>
                            <HomeIcon style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/study/dashboard/detail/'+this.state.studyInfo._id)}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={10}  className={classes.marginTop}>
                            <Typography variant="h3" gutterBottom className={classes.title}>
                                {this.state.info.title}
                                <Button style={{float: 'right'}} onClick={() => this.props.history.push('/study/dashboard/post/edit/'+this.props.match.params.postId)}>수정하기</Button>
                            </Typography>
                            <div className={classes.mobileTitle}>
                                <Button style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/study/dashboard/detail/'+this.state.studyInfo._id)}>이전</Button>
                                <Button style={{float: 'right'}} onClick={() => this.props.history.push('/study/dashboard/post/edit/'+this.props.match.params.postId)}>수정하기</Button>
                                <Typography variant="h5" gutterBottom style={{marginTop:'15px'}} >
                                    {this.state.info.title}
                                </Typography>
                            </div>
                            <p>
                                {this.getPostDate()}에<br />{this.state.info.author}님이 작성하신 포스트입니다.
                            </p>
                        </Grid>
                        {this.state.info.uploadList && this.state.info.uploadList.length > 0 &&
                        <Grid item xs={12} sm={12} md={10}>
                            <div className={classes.demo}>
                                <Typography variant="h5" gutterBottom>
                                    첨부파일
                                </Typography>
                                <List dense>
                                    {this.state.info.uploadList.map((list, index) => {
                                        return (
                                            <a href={list} target="_blank">
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <FolderIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={list.substring(0,100)+"..."}
                                                    />
                                                </ListItem>
                                            </a>
                                        )
                                    })}
                                </List>
                            </div>
                        </Grid>
                        }
                        <Grid item xs={12} sm={12} md={10} className={classes.marginTop}>
                            <Grid container justify="center" spacing={16}>
                                {this.state.info.videoLink && this.state.info.videoLink !=='' &&
                                <Grid item xs={12} sm={12} md={6}>
                                    <section className={classes.content}>
                                        <Typography variant="h5" gutterBottom className={classes.title}>공유된 동영상</Typography>
                                        <Typography variant="h6" gutterBottom className={classes.mobileTitle}>공유된 동영상</Typography>
                                        <div>
                                        {!this.state.info.videoLink || this.state.info.videoLink === '' ? 
                                            "등록된 영상이 없습니다." :
                                            (
                                            <iframe 
                                            width="100%" 
                                            height="315" 
                                            src={this.state.info.videoLink} 
                                            frameBorder="0" 
                                            title="첨부 비디오"
                                            allow="autoplay; encrypted-media" 
                                            allowFullScreen></iframe>
                                            )
                                        }
                                        </div>
                                    </section>
                                </Grid>
                                }
                                {this.state.info.imageLink && this.state.info.imageLink !=='' &&
                                <Grid item xs={12} sm={12} md={6}>
                                    <section className={classes.content}>
                                        <Typography variant="h5" gutterBottom className={classes.title}>공유된 사진</Typography>
                                        <Typography variant="h6" gutterBottom className={classes.mobileTitle}>공유된 사진</Typography>
                                        <div>
                                            {!this.state.info.imageLink || this.state.info.imageLink === '' ? "등록된 사진이 없습니다." : ( <img src={this.state.info.imageLink} width="100%"
                                            height="315"  alt="첨부사진"/> )}
                                        </div>
                                    </section>
                                </Grid>
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={10}  className={classes.marginTop}>
                            <div className="editor">
                                <Draft
                                    editorState={this.state.editorState}
                                    onChange={this.onChange}
                                    readOnly={true}
                                    ref={(element) => { this.editor = element; }}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" className={classes.space}>
                        <Grid item xs={12} sm={12} md={10} >
                            <Typography variant="h5" gutterBottom>
                                의견 공유하기
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={10} >
                            <NewReply 
                                value={this.state.replyContent}
                                onChange={(event) => this.replyContentHandler(event)}
                                onClick={this.saveReply}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" className={classes.space}>
                        <Grid item xs={12} sm={12} md={10} >
                            {this.state.replyList.map((reply, index) => {
                                return  (
                                <ReplyItem  
                                    key={reply._id}
                                    element={reply}
                                    style={{marginTop: '15px'}}
                                    replyAgainSave={(id) => this.replyAgainSave(id)}
                                    childReply={this.state.replyChildArray[reply._id]}
                                    giveHeart={() => this.giveHeart(reply._id)}
                                    clickLike={this.state.clickLike}
                                />);
                            })}
                        </Grid>
                    </Grid>
                </Aux> }
            </Aux>
        )
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
            </Aux>
        )
    }
}

function mapStateToProps( { auth }) {
    return { auth };
}

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(StudyPostView));