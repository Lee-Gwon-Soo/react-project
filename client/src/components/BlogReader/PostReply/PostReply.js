import React from 'react';

import CustomTextarea from '../../form/CustomTextarea/CustomTextarea';
import CustomTextInput from '../../form/CustomTextInput/CustomTextInput';
import Button from '@material-ui/core/Button';
const PostReply = (props) => {
    return (
        <div>
            <div style={{padding: '10px'}} >
                <CustomTextInput 
                    placeholder="작성자 이름" 
                    style={{maxWidth: '150px', marginTop:'10px'}}
                    value={props.author}
                    onChange={props.handleAuthor}
                    />
                <CustomTextarea 
                    style={{margin:'10px 0px', minHeight: '100px'}}
                    placeholder="소중한 댓글 부탁드립니다."
                    value={props.content}
                    onChange={props.handleContent}
                    />
                <div style={{textAlign:'right'}}>
                    <Button variant="outlined" color="primary" onClick={props.onPostReply}>
                        댓글 남기기
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PostReply;