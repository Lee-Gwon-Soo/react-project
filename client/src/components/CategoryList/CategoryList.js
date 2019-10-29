import React from 'react';
import axios from 'axios';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

import './CategoryList.css';
import Toast from '../Shared/Toast/Toast';
import Loading from '../Shared/Loading/Loading';
import Aux from '../../HOC/Aux';
import PostItem from './PostItem/PostItem';

import Grid from '@material-ui/core/Grid';

class CategoryList extends React.Component {
    state = {
        error: false,
        errorMessage: '',
        categoryInfo: null,
        postList: [],
        isLoading: true,
    }

    componentDidMount() {
        if(this.props.match.params.categoryId) {
            //Get categoryList
            axios.get('/api/category/post/'+this.props.match.params.categoryId)
                .then(response => {
                    const data = response.data;

                    if(data.status) {
                        const categoryInfo = data.categoryInfo;
                        const list = data.list;
                        this.setState(function(state, props) {
                            return {
                                isLoading: false,
                                categoryInfo: categoryInfo,
                                postList: list
                            }
                        })
                    } else {
                        this.setState(function(state,props){
                            return { 
                                error: true, 
                                errorMessage: data.message
                            }
                        });
                    }
                })
        } else {
            // Wrong.
        }
    }


    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    readArticle = (categoryId, postId) => {
        this.props.history.push(`/page/${this.props.match.params.email}/post/${categoryId}/${postId}`);
    }

    renderPostList = () => {
        if(this.state.postList) {
            return this.state.postList.map((post, index) => {
                return (
                    <PostItem element={post} key={post._id} onClick={() => this.readArticle(post._category, post._id)}/>
                )
            })
        }
    }

    renderView = () => {
        if(this.state.isLoading) {
            return <Loading />;
        } else {
            return (
                <div>
                    <Header 
                        email={this.props.match.params.email}
                    />
                    <Grid container className="categoryDescription container">
                        <Grid item xs={12} sm={10} style={{margin:'0 auto'}}>
                            <div className="small-title">카테고리</div>
                            <div className="title">
                                {this.state.categoryInfo.title}
                            </div>
                            <hr />
                            <div className="category-detail">
                                {this.state.categoryInfo.detail_descrption}
                            </div>
                            <hr />
                            <div className="postCount">전체 {this.state.postList.length || 0 }개의 글</div>
                            <Grid container spacing={16}>
                                {this.renderPostList()}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Footer />
                </div>
            )
        }
    }
    
    render() {

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = <Toast error="true" errorMessage={this.state.errorMessage} handleClose={this.handleClose}/>
        } else {
            errorMessage = null;
        }


        return (
            <Aux>
                {this.renderView()}
                {errorMessage}
            </Aux>
        )
    }
}

export default CategoryList;