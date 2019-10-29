import React from 'react';
import { Link } from 'react-router-dom';

const NewBlogHeader = (props) => {
    return (
        <div className="BlogHeader">
            <ul>
                <li><Link to={`/blog/${props.auth}`}>취소</Link></li>
                <li onClick={props.onClick}>저장</li>   
            </ul>
        </div>
    )
}

export default NewBlogHeader;