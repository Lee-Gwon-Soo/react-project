import React from 'react';
import './Post.css';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const Post = (props) => {
    let date = new Date(props.element.ins_dtime);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    date = year + '. ' + month + '. ' + day;
    
    let classHeader = 'Post';
    let onClickFunction = props.onClick;
    if(props.startSelecting) {
        classHeader += ' checkBox';
        onClickFunction = props.selectedAsTop;
        if(props.selectedItem === props.element._id) {
            classHeader += ' selected';
        }
    } else if (props.startChangingUsage) {
        classHeader += ' showUsage';
        onClickFunction = props.selectedToUse;
        if(props.usageSelected.indexOf(props.element._id) > -1) {
            classHeader += ' selected';
        }
    } else {
        classHeader = 'Post';
        onClickFunction = props.onClick;
    }

    return (
        <Grid item sm={3} xs={12}>
            <Paper className={classHeader} onClick={onClickFunction}>
                <div className="circle"></div>
                <div className="circle-usage">
                    {props.startChangingUsage ?
                    <i className="material-icons">check</i> : null }
                </div>
                <div className="mainSection">
                    <div className="OtherInformation">
                        <Chip
                            avatar={<Avatar className={`chipAvatar ${props.element.isTopItem? 'selected' : null}`}><i className="material-icons">{props.element.isTopItem ? "done" : "edit"}</i></Avatar>}
                            label={date}
                            color="primary"
                            variant="outlined"
                            clickable
                        /> 
                        {props.element.isPublish ? <span className="new badge" data-badge-caption="">Published</span> : null }
                    </div> 
                    {props.element.isPublish ? ( 
                        <div className="PublishInfo">
                            {props.element.publish_name}
                        </div>
                    )
                    : null }
                    <div className="Title">
                        {props.element.title}
                    </div>
                </div>
                    {props.element.basicImage ===null ? null : (
                        <div className="imageSection" style={{backgroundImage: `url('${props.element.basicImage}')`}}></div>
                    )}
            </Paper>
        </Grid>
    )
}

export default Post;