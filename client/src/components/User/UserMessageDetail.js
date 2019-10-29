import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import  { connect } from 'react-redux';
import Aux from '../../HOC/Aux';
import Snackbar from "../CustomLayout/components/Snackbar/Snackbar";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LinearLoading from '../Shared/LinearLoading/LinearLoading';
import MessageItem from './MessageItem';
import Button from '@material-ui/core/Button';
import ReplyIcon from '@material-ui/icons/Reply';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      [theme.breakpoints.down('sm')] : {
          marginBottom: '30px'
      }
    },
    table: {
      minWidth: 500,
    },
    tableWrapper: {
      overflowX: 'auto',
    },

    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    replyBoard: {
        marginTop: theme.spacing.unit*3
    },
    button: {
        paddingTop: '0px !important',
        paddingBottom: '0px !important',
    },
    paper: {
        padding: '10px',
    },
    input: {
        border: 'none',
        padding: '10px',
        width: '100%',
        resize: 'none',
        height: 'auto',
        fontSize: '17px',
    },
    replyTitle: {
        borderBottom: '1px solid #efefef'
    },
    replyToolbar: {
        marginTop: '10px'
    }
});
const lineHeight = 30;
class UserMessageDetail extends React.Component {
    state= {
        messageList: [],
        originalMessage: {},
        senderInfo: {},
        receiverInfo: {},
        isLoading: true,
        dataLoaded: false,
        isReply: false,
        replyContent: '',
        rows: 2,
        showSnack: false,
        snackMessage: '',
    }

    handleChange =(event) => {
        // To cause proper recalc when deleting lines
        const oldRows = event.target.rows;
        event.target.rows = 2;
        const newRows = ~~(event.target.scrollHeight/lineHeight);
        
        if (newRows >= oldRows) {
            event.target.rows = newRows;
        }
        const value = event.target.value;
        this.setState(function(state,props){
            return{
                replyContent: value,
                rows: newRows
            }
        });
    }

    componentDidMount() {
        if(this.props.match.params.messageId) {
            axios.get('/api/getMessageItem/'+this.props.match.params.messageId+'/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        this.setState(function(state, props){
                            return {
                                messageList: [...res.childList],
                                originalMessage: {...res.message},
                                senderInfo: {...res.senderInfo},
                                receiverInfo: {...res.receiverInfo},
                                isLoading: false,
                                dataLoaded: true,
                            }
                        })
                    }
                })
        }
    }

    cancelReply = () => {
        this.setState(function(state, props){
            return {
                isReply: false,
                replyContent: '',
            }
        });
        this.showAlarm('답장 전달이 취소되었습니다.');
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

    saveReply = () => {
        if( this.state.replyContent ==='') {
            this.showAlarm("답장 내용을 입력해주세요.");
            return false;
        }

        var target_email = document.getElementById('target_email').value;

        this.setState(function(state){
            return {
                isLoading: true,
            }
        })

        const body = {
            target_email: target_email,
            senderId : this.props.auth.id,
            ori_msg_id: this.props.match.params.messageId,
            content: this.state.replyContent
        }

        axios.post('/api/sendReplyMessage',body)
            .then(response =>{
                const res = response.data;
                if(res.status) {
                    const messageList = [...this.state.messageList];
                    messageList.push(res.data);
                    this.setState(function(state){
                        return {
                            isLoading: false,
                            messageList:messageList,
                            isReply: false,
                            replyContent: '',
                        }
                    });
                    this.showAlarm("답장이 전달되었습니다.");
                }
            })
    }

    startReply = () => {
        this.setState(function(){return {isReply: true}});
    }

    render(){
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <LinearLoading open={this.state.isLoading} />
                <Grid container justify="center">
                    <Grid item xs={12} sm={8} >
                        {this.state.isLoading && !this.state.dataLoaded? 
                        (<React.Fragment>
                            메시지를 불러오고 있습니다.
                        </React.Fragment>) : 
                        <Aux>
                        <input type="hidden" id="target_email" value={this.state.receiverInfo.email} />
                        <Button aria-label="send" size="small" className={classes.button} onClick={() => this.props.history.push('/dashboard/message/inbox')}>
                            <UndoIcon />
                        </Button>
                        <MessageItem 
                            element={this.state.originalMessage} 
                            imgPath={!this.state.originalMessage.isOwn ? this.state.receiverInfo.img_path : this.state.senderInfo.img_path}    
                        />
                        {this.state.messageList.map((item, index) => {
                            return (
                                <MessageItem
                                    element={item}
                                    key={item._id}
                                    imgPath={!item.isOwn ? this.state.receiverInfo.img_path : this.state.senderInfo.img_path}  
                                />
                            )
                        })}
                        </Aux>}
                    </Grid>
                    <Grid item xs={12} sm={8} className={classes.replyBoard}>
                        {this.state.isReply ?(
                        <Paper className={classes.paper}>
                            <div className={classes.replyTitle}>
                                <Typography variant="h6" gutterBottom>
                                    <ReplyIcon className={classes.extendedIcon} />
                                    {this.state.receiverInfo.name}님에게 {`<${this.state.receiverInfo.email}>`}
                                </Typography>
                            </div>
                            <textarea 
                                className={classes.input} 
                                rows={this.state.rows} 
                                autoFocus
                                onChange={this.handleChange}
                                placeholder="답장을 입력해주세요"
                                style={{lineHeight: `${lineHeight}px`}}></textarea>
                            <div className={classes.replyToolbar}>
                            <Button aria-label="send" size="small" className={classes.button} onClick={this.saveReply}>
                                <SendIcon />
                            </Button>
                            <Button aria-label="delete" size="small" className={classes.button} onClick={this.cancelReply}>
                                <DeleteIcon />
                            </Button>
                            </div>
                        </Paper>
                        ) : 
                        <Button variant="outlined" className={classes.button} onClick={this.startReply}>
                            <ReplyIcon className={classes.extendedIcon} />
                            답장
                        </Button>
                        }
                    </Grid>
                </Grid>
                <Snackbar
                    place="br"
                    color="danger"
                    message={this.state.snackMessage}
                    open={this.state.showSnack}
                    closeNotification={() => this.setState({ showSnack: false })}
                    close
                    />
            </div>
        )
    }
}

UserMessageDetail.propTypes = {
    classes: PropTypes.object.isRequired,
  };

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(UserMessageDetail));;