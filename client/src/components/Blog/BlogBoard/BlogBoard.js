import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BlogBoard.css';
import axios from 'axios';

//component
import Loading from '../../Shared/Loading/Loading';
import Toast from '../../Shared/Toast/Toast';
import Aux from '../../../HOC/Aux';
import CategoryCard from './CategoryCard/CategoryCard';
import DeleteCheckBoard from './PostPage/DeleteCheckBoard';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class BlogBoard extends Component {
    state = {
        isLoading: true,
        BlogList: [],
        CategoryList: [],
        error: false,
        onDelete: false,
        errorMessage: '',
        delTarget: '',
    }

    componentDidMount() {
        if( this.props.auth.id ) {
            axios.get('/api/blog/getCategoryList/'+this.props.auth.id)
                .then((response) => {
                    const data = response.data;
                    if(data.status) {
                        const tempList = [...data.data];
                        
                        this.setState(function(state, props){
                            return {
                                isLoading: false,
                                CategoryList: tempList
                            }
                        });
                    } else {
                        this.props.history.replace('/dashboard');
                    }
                 })
                .catch(error => {
                    
                })
        } 
    }

    getBlogListOfCategory = (categoryId) => {
        this.props.history.push('/blog/detail/'+categoryId);
    }

    gotoUndifinedList = () => {
        this.props.history.push('/blog/detail/undefined');
    }

    toggleOpen = (categoryId) => {
        axios.post('/api/blog/modifyCategory/open/'+categoryId)
        .then(res => {
            if( res.status ) {
                const modified = this.state.CategoryList.map(item => {
                    if(item._id === categoryId){
                        item.isOpen = !item.isOpen;
                    }
                    return item;
                });
                this.setState(function(state,props){
                    return {
                        CategoryList: modified,
                        error: true,
                        errorMessage: '공개 여부가 변경되었습니다.'
                    }
                })
            } else {
                this.setState(function(state,props){
                    return {
                        error: true,
                        errorMessage: res.data.message
                    }
                })
            }
        })
        .catch(err => {
            this.setState(function(state,props){
                return {
                    error: true,
                    errorMessage: '에러가 발생했습니다.'
                }
            })
        })
    }

    deleteCategory = () => {
        const categoryId = this.state.delTarget;
        axios.delete('/api/blog/deleteCategory/'+categoryId)
        .then(res => {
            if( res.status ) {
                const modified = this.state.CategoryList.filter(x => x._id !== categoryId);
                this.setState(function(state,props){
                    return {
                        CategoryList: modified,
                        error: true,
                        errorMessage: '카테고리가 정상적으로 삭제되었습니다.'
                    }
                })
            } else {
                this.setState(function(state,props){
                    return {
                        error: true,
                        errorMessage: res.data.message
                    }
                })
            }
        })
        .catch(err => {
            this.setState(function(state,props){
                return {
                    error: true,
                    errorMessage: '삭제 시에 에러가 발생했습니다. 페이지를 Refresh 해주세요.'
                }
            })
        })
    }

    editCategory = (categoryId) => {
        this.props.history.push('/dashboard/category/edit/'+categoryId);
    }

    tryDeleting = (categoryId) => {
        this.setState(function(state,props){ 
            return {
                onDelete: true,
                delTarget: categoryId,
            }
        });
    }

    onClosed = () => {
        this.setState(function(state,props){ 
            return {
                onDelete: false,
                categoryId: '',
            }
        });
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    renderBlogCategory = () => {
        if(this.state.CategoryList.length > 0){
            let renderArray = [];
            for(let key in this.state.CategoryList) {
                renderArray.push({
                    id: key,
                    element: this.state.CategoryList[key]
                })
            }
            return (
                <Aux>
                    {renderArray.map((element) => {
                        return (
                            <CategoryCard key={element.id} 
                                element={element.element} 
                                onClick={() => this.getBlogListOfCategory(element.element._id)}    
                                toggleOpen={() => this.toggleOpen(element.element._id)}
                                deleteCategory={() => this.tryDeleting(element.element._id)}
                                editCategory={() => this.editCategory(element.element._id)}
                            />
                        )
                    })}
                </Aux>
            );
        } else {
            return null;
        }
    }

    render() {

        let renderView = null;
        
        if(this.state.isLoading) {
            renderView = <Loading />;
        } else {
            renderView = (
                <div className="BlogBoard">
                    <Grid spacing={8} container>
                        <Grid item xs={6} sm={3}>
                            <Card className="Card">
                                <CardMedia
                                className="cardImage"
                                image={'https://s3.ap-northeast-2.amazonaws.com/voidimpact-category/void.jpg'}
                                title="Contemplative Reptile"
                                onClick={this.gotoUndifinedList}
                                />
                                <CardContent  className="categoryCardContent">
                                    <Typography gutterBottom variant="headline" component="h2">
                                        분류되지 않은 글
                                    </Typography>
                                    <Typography component="p"> 
                                        아직 카테고리가 배정되지 않은 블로그입니다.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" disabled>&nbsp;</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        {this.renderBlogCategory()}
                    </Grid>
                </div>
            );
        }

        let deleteCheckBoard = null;
        if(this.state.onDelete) {
            deleteCheckBoard = (
                <DeleteCheckBoard 
                    open={this.state.onDelete}
                    onClosed={this.onClosed}
                    onDeleteAgree={this.deleteCategory}
                    title="정말 카테고리를 삭제하시겠습니까?"
                    content="카테고리를 삭제하시면 속했던 블로그에 대한 카테고리는 사라집니다."
                />
            )
        } else {
            deleteCheckBoard = null;
        }

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose} />
            )
        } else {
            errorMessage = null;
        }

        return (
            <div>
                {renderView}
                {errorMessage}
                {deleteCheckBoard}
            </div>
        )
    }
}

function mapStateToProps( { auth }) {
    return {auth}
}

export default connect(mapStateToProps)(BlogBoard);