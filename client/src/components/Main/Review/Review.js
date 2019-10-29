import React from 'react';
import classes from './Review.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const Review = (props) => {
    return (
        <Grid item xs={12} sm={3}  onClick={props.readReview}>
            <div className="reviewListItem">
                <a className="reviewCard">
                    <div className="card__background"></div>
                    <div className="reviewCop">
                        <div className="reviewDetail">
                            <div style={{width: '100%', height: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                                <div className={classes.review__image} style={{backgroundImage: `url(${props.element.img_path})`}}></div>
                            </div>
                            <Typography variant="p" className={classes.review__title}>
                                {props.element.title}
                            </Typography>
                        </div>
                        <div className="reviewCover">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{props.element.bookTitle}</td>
                                    </tr>
                                    <tr>
                                        <td>{props.element.publisher}</td>
                                    </tr>
                                    <tr>
                                        <td>{props.element.author}</td>
                                    </tr>
                                    <tr>
                                        <td>ISBN : {props.element.ISBN}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </a>
            </div>
            {/* <a className={classes.review} onClick={props.readReview}>
                <section className={classes.review__content}>
                    <header className={classes.review__eyebrow}>{props.element.bookTitle}</header>
                    <h3 className={classes.review__title}>
                        {props.element.title}
                    </h3>
                </section>
                <div>
                    <figure className={classes.review__image} style={{backgroundImage: `url(${props.element.img_path})`}}></figure>
                </div>
            </a> */}
        </Grid>
    )
}

export default Review;