import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const styles = {
    replyItem: {
        display:'flex',
        flexDirection: 'row',
        fontSize: '13px',
        outline: 0,
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        borderBottom: '1px solid #e5e5e5',
        lineHeight: 1.4,
        margin: 0,
        padding: '15px 25px 23px 25px',
        position: 'relative',
        wordWrap: 'break-word',
    },
    author: {
        display: 'flex',
        width: '70px',
        height: '70px',
        border: '1px solid #ccc',
        borderRadius: '50% 50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
        flex: 1,
        padding: '5px 20px',
        fontSize: '15px',
        flexDirection: 'row',
    },
    contentMain: {
        display:'flex',
        flex: 1,
    },
    hidden: {
        display: 'none'
    },
    count : {
        display: 'flex',
        width: '130px',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hates : {
        display: 'flex',
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    likes : {
        display: 'flex',
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    optionButton: {
        width: 'auto',
        float:'right',
        display: 'inline-block'
    }
}

const ReplyItem = (props) => {
    const {classes} = props;
    return (
        <div className={classes.replyItem}>
            <div className={classes.author}>
                <div>{props.element.author}</div>
            </div>
            <div className={classes.content}>
                <div className={classes.contentMain}>
                    {props.element.content}
                </div>
                <div className={window.innerWidth > 959 ? classes.count : classes.hidden}>
                    <div className={classes.likes}>
                        <div style={{ display:'block', textAlign: 'center'}}>
                            <i className="material-icons" style={{color: 'blue', cursor: 'pointer'}} onClick={props.likeReply}>thumb_up</i>
                        </div>
                        <div style={{display:'block',textAlign: 'center'}}>{props.element.likes}</div>
                    </div>
                    <div className={classes.hates}>
                        <div style={{ display:'block', textAlign: 'center'}}>
                            <i className="material-icons" style={{color: 'red', cursor: 'pointer'}} onClick={props.hateReply}>thumb_down</i>
                        </div>
                        <div style={{textAlign: 'center'}}>{props.element.hates}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default withStyles(styles)(ReplyItem)    ;