import React from 'react';
import './BlogHeader.css';
import { Link } from 'react-router-dom';

const BlogHeader = (props) => {
    return (
        <div className="BlogHeader">
            <ul>
                <li><Link to={props.to}>{props.label}</Link></li>   
                <li><Link to={`/blog/${props.auth}/new`}>블로그 작성</Link></li>
                <li><Link to={`/category/${props.auth}/new`}>카테고리 추가</Link></li>    
            </ul>
        </div>
    )
}

export default BlogHeader;