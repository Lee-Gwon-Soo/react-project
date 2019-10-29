import React from 'react';
import './ReplyBoard.css';
import axios from 'axios';

import PostReply from '../PostReply/PostReply';
import ReplyItem from '../ReplyItem/ReplyItem';
import Toast from '../../Shared/Toast/Toast';
import Grid from '@material-ui/core/Grid';

class ReplyBoard extends React.Component {
    state = {
        content: '',
        author: '',
        error: false,
        errorMessage: '',
        replyList: [],
        isWriting: false,
    }

    componentDidMount() {
        if(this.props.postId) {
            axios.get('/api/post/reply/getpostReply/'+this.props.postId)
                .then(response => {
                    const data = response.data;
                    if(data.status) {
                        this.setState(function(state, props){
                            return {
                                replyList: data.data,
                            }
                        })
                    }
                })
        }
    }

    onPostReply = () => {
        if(this.state.content !== '') {
            const body = {
                content: this.state.content,
                author: this.state.author,
            }
            axios.post('/api/post/reply/save/'+this.props.postId, body) 
                .then((response) => {
                    const res = response.data;
                    if(res.status === true ){
                        this.state.replyList.push({...res.data});
                        this.setState(function(state, props){
                            return {
                                content: '',
                                author: '',
                            }
                        })
                    } else {
                        this.setState(function(state, props){
                            return {
                                error:true,
                                errorMessage: res.message,
                            }
                        })
                    }
                })
        }
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    handleContent = (event) => {
        const content = event.target.value;
        this.setState(function(state,props){
            return { content: content }
        });
    }

    handleAuthor = (event) => {
        const content = event.target.value;
        this.setState(function(state,props){
            return { author: content }
        });
    }

    likeReply = (replyId, index) => {
        axios.post('/api/post/reply/like/'+replyId)
        .then(response => {
            const data = response.data;
            if(data.status) {
                let replylistTemp = [...this.state.replyList];
                replylistTemp[index].likes = data.data.likes;

                this.setState(function(state, props){
                    return {
                        replyList: replylistTemp
                    }
                })
            }
        })
    }

    hateReply = (replyId, index) => {
        axios.post('/api/post/reply/hate/'+replyId)
            .then(response => {
                const data = response.data;
                if(data.status) {
                    let replylistTemp = [...this.state.replyList];
                    replylistTemp[index].hates = data.data.hates;

                    this.setState(function(state, props){
                        return {
                            replyList: replylistTemp
                        }
                    })
                }
            })
    }

    showReplyList = () => {
        if(this.state.replyList.length > 0) {
            return this.state.replyList.map((item, index)=> {
                return (
                    <ReplyItem 
                        key={item._id} 
                        element={item}
                        likeReply={() => this.likeReply(item._id, index)}
                        hateReply={() => this.hateReply(item._id, index)}    
                    />
                )
            })
        }
    }

    toogleWritingBoard = () => {
        this.setState(function(state,props){
            return { isWriting: !state.isWriting }
        });
    }

    render() {
        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose} />
            )
        } else {
            errorMessage = null;
        }


        return (
            <Grid container  style={{marginTop:'20px'}}>
                <Grid item xs={12} sm={8} className=" auto-margin">
                    <div className="ReplyBoard">
                        <div className="title">
                            {this.state.replyList.length > 0 ? `댓글 ${this.state.replyList.length}개`: "아직 댓글이 없습니다."}
                        </div>
                        <div className="newReply">
                            <PostReply 
                                onPostReply={this.onPostReply}
                                author={this.state.author}
                                content={this.state.content}
                                handleContent={this.handleContent}
                                handleAuthor={this.handleAuthor}
                            />
                        </div>
                        <div className="list">

                        {this.state.replyList.length > 0 ? (
                            <div className="subtitle">
                                소중한 댓글 감사합니다.
                            </div>
                            ) : null }
                            <div className="replyList">
                                {this.showReplyList()}
                            </div>
                        </div>
                    </div>
                </Grid>
                {errorMessage}
            </Grid>
        )
    }
}

export default ReplyBoard;