import React from 'react';
import classes from './StudyDetail.css';

const PostItem = (props) => {
    return (
        <a className={classes.postItem} onClick={props.onClick}>
            <section className={classes.postItem__content}>
                <header className={classes.postItem__eyebrow}>{props.element.author}</header>
                <h3 className={classes.postItem__title}>
                    {props.element.title}
                </h3>
            </section>
            <div>
                <figure className={classes.postItem__image} style={{backgroundImage: `url(${props.element.imageLink})`}}></figure>
            </div>
        </a>
    );
}

export default PostItem;