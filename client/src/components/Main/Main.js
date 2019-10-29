import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './Main.css';

import TopStory from './TopStory/TopStory';
import Category from './Category/Category';
import Review from './Review/Review';
import DataLoading from '../Shared/DataLoading/DataLoading';
import Aux from '../../HOC/Aux';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class Main extends React.Component {
    state = {
        topStories: [],
        categoryList: [],
        bookReviewList: [],
        mainStory: null,
        isLoading: true,
    }

    componentDidMount() {
        if(this.props.match.params.email) {
            axios.get("/api/main/getFrontPost/"+this.props.match.params.email)
                .then((response) => {
                    const res =response.data;
                    if( res.status ) {
                        const data = res.data;
                        this.setState(function(state, props){
                            return {
                                topStories: data.recent,
                                categoryList: data.categoryList,
                                bookReviewList: data.bookReviewList,
                                mainStory: data.main,
                                isLoading: false,
                            }
                        });
                        document.getElementById('frontName').innerHTML = data.profile.name;
                    } 
                })
                .catch(err => {
                    this.props.history.replace('/login');
                });
        } else {
            this.props.history.replace('/login');
        }
    }

    readBlog = (postId, categoryId) => {
        this.props.history.push(`/page/${this.props.match.params.email}/post/${categoryId}/${postId}`);
    }

    renderTopStory = () => {
        if(this.state.topStories.length > 0 ){
            return this.state.topStories.map((story, index) => {
                return (
                    <TopStory 
                        key={index} 
                        title={story.title} 
                        category={story._categoryTitle}
                        img={story.basicImage}   
                        readBlog={() => this.readBlog(story._id, story._category)} 
                    />
                )
            })
        }
    }

    renderCategoryList = () => {
        if(this.state.categoryList.length > 0 ){
            return this.state.categoryList.map((category, index) => {
                return (
                    <Category 
                        email={this.props.match.params.email}
                        key={index}
                        description={category.description}
                        title = {category.title}
                        categoryId={category._id}
                    />
                )
            })
        } else {
            return (
            <Typography variant="h6" gutterBottom>
                공개된 카테고리가 없습니다.
            </Typography>);
        }
    }

    renderBookReviewList = () => {
        if(this.state.bookReviewList.length > 0 ){
            return this.state.bookReviewList.map((review, index) => {
                return (
                    <Review 
                        key={index}
                        element={review}
                        readReview={() => this.props.history.push(`/page/${this.props.match.params.email}/book/review/${review._id}`)}
                    />
                )
            })
        } else {
            return (
            <Typography variant="h6" gutterBottom>
                등록된 도서 리뷰가 없습니다.
            </Typography>);
        }
    }

    readMainStory = () => {
        const categoryId = this.state.mainStory._category;
        const postId = this.state.mainStory._id;

        this.props.history.push(`/page/${this.props.match.params.email}/post/${categoryId}/${postId}`);
    }
    
    renderView = () => {
        if( this.state.isLoading) {
            return <DataLoading />;
        } else {
            return (
                <Aux>
                    <Header 
                        email={this.props.match.params.email}
                    />
                    <div className="container" style={{margin: '0 auto'}}>
                        <div className="MainContainer">
                            {this.state.mainStory ? (
                            <Grid container spacing={16} className="topInterestArea">
                                <Grid item xs={12} sm={12} md={8} className="imagePart" style={{ backgroundImage: `url(${this.state.mainStory.basicImage})`}} onClick={this.readMainStory}></Grid>
                                <Grid item xs={12} sm={12} md={4} className="articlePart">
                                    <div className="category">
                                        {this.state.mainStory._categoryTitle}
                                    </div>
                                    <div className="title">
                                        <h2>{this.state.mainStory.title}</h2>
                                    </div>
                                    <div className="shortContent">
                                        요약입니다.
                                        {this.state.mainStory.summary}
                                    </div>
                                    <div className="topArticleNavButton" onClick={this.readMainStory}>
                                        <span>최신 글 읽기
                                        <i className="material-icons">
                                        send
                                        </i>
                                        </span>
                                    </div>
                                </Grid>
                            </Grid>
                            ) : null }

                            {/* Top Article of each category*/}
                            <Grid container spacing={24} className="topBlogList">
                                <div className="TopTitle">최근 블로그</div>
                                {this.renderTopStory()}
                            </Grid>

                            {/* Category List */}
                            <Grid container spacing={16} className="categoryList">
                                <div className="TopTitle">관심 카테고리</div>
                                {this.renderCategoryList()}
                            </Grid>

                            {/* Book List */}
                            <Grid container  spacing={16} className="categoryList">
                                <div className="TopTitle">도서 리뷰</div>
                                <Grid item xs={12}>
                                    <Grid container spacing={16} >
                                        {this.renderBookReviewList()}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <Footer />
                </Aux>
            )
        }
    }
    render() {
        return ( 
            <Aux>{this.renderView()}</Aux>
        )
    }
}

function mapStateToProps({auth}){
    return {auth};
}
export default connect(mapStateToProps)(Main);