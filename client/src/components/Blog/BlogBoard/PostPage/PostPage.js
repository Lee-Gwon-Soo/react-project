import React, { Component } from 'react';
import axios from 'axios';
import './PostPage.css';

import Loading from '../../../Shared/Loading/Loading';
import Page from '../../../Shared/PDF/Page';
import Aux from '../../../../HOC/Aux';
import DeleteCheckBoard from './DeleteCheckBoard';

import Draft from '../../../Shared/Draft/Draft';
import DraftPrint from '../../../Shared/Draft/DraftPrint';
import PDFDocument from '../../../Shared/PDF/PDFDocument';
import {EditorState, convertFromRaw } from 'draft-js';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    cardCategoryWhite: {
      color: "rgba(0,0,0,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#000000",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    }
  };

class PostPage extends Component {
    state = {
        element: {},
        isLoading: true,
        error: false,
        errorMessage: '',
        readOnly: true,
        printed: false,
        onDelete: false,
    }

    componentDidMount() {
        if( this.props.match.params.id ) {
            axios.get('/api/blog/post/getInfo/' + this.props.match.params.id)
                .then(response => {
                    if(response.data.status) {
                        const data = response.data.data;
                        data.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
                        
                        this.setState(function(state, props) {
                            return {
                                isLoading: false,
                                element: {...data},
                            }
                        });
                    } 
                })
                .catch((response) => {
                    this.props.history.replace('/dashboard');
                })
        }
    }

    modifyNewBlog= () => {
        this.props.history.push('/blog/post/'+this.state.element._id+'/edit');
    }
    onChange = (editorState) => {return null}

    printePDF = () => {
        this.setState(function(state, props){
            return {
                printed: true,
            }
        })
    }


    handleClickOpen = () => {
        this.setState(function(state,props){ 
            return {
                printed: true 
            }
        });
    };

    handleClose = () => {
        this.setState(function(state,props){ 
            return {
                printed: false 
            }
        });
    };

    onDeleteArticle = async () => {
        axios.delete('/api/blog/deleteBlog/'+ this.props.match.params.id)
            .then((response) => {
                if(response.status) {
                    this.props.history.replace('/blog/detail/'+this.state.element._category);
                }
            })
            .catch(error  => {
                this.setState(function(state, props){
                    return {
                        error: true,
                        errorMessage: '삭제하는데 문제가 생겼습니다.'
                    }
                })
            })
    }

    tryDeleting = () => {
        this.setState(function(state,props){ 
            return {
                onDelete: true 
            }
        });
    }

    onClosed = () => {
        this.setState(function(state,props){ 
            return {
                onDelete: false 
            }
        });
    }

    render(){

        let renderView = null;

        if(this.state.isLoading) {
            renderView = <Loading />;
        } else if ( this.state.printed ){
            renderView = (
                    <Dialog
                    fullScreen
                    open={this.state.printed}
                    onClose={this.handleClose}
                    >
                    <AppBar style={{position: 'relative'}}>
                        <Toolbar>
                        <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                            <i className="material-icons">close</i>
                        </IconButton>
                        <Typography variant="title" color="inherit" style={{flex: 1}}>
                            블로그 프린트
                        </Typography>
                        <div >
                            <PDFDocument id={"blogPost"} label={"프린트 하기"} postId={this.props.match.params.id}/>
                        </div>
                        </Toolbar>
                    </AppBar>
                    <Page singleMode={false} id="blogPost" >
                        <div className="PostPage container">
                            <div className="PostPageTitle">
                                <div className="draftTitle">
                                    {this.state.element.title}
                                </div>
                            </div>
                            <div className="PostPageBoard">
                                <DraftPrint editorState={this.state.element.editorState} />
                            </div>
                        </div>
                    </Page>
                    </Dialog>
            )
        } else {
            renderView = (
                <Aux>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={12} md={10}>
                            <Button color="default" onClick={() => this.props.history.push('/blog/detail/'+this.state.element._category)}>
                                <i className="material-icons">arrow_back</i>
                            </Button>
                            <Button color="secondary" onClick={this.modifyNewBlog}>수정하기</Button>
                        </Grid>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={12} md={10}>
                            <h3>{this.state.element.title}</h3>
                            <Draft editorState={this.state.element.editorState} readOnly={true} onChange={this.onChange}/>
                        </Grid>
                    </Grid>
                </Aux>
            )
        }

        let deleteCheckBoard = null;
        if(this.state.onDelete) {
            deleteCheckBoard = (
                <DeleteCheckBoard 
                    open={this.state.onDelete}
                    onClosed={this.onClosed}
                    onDeleteAgree={this.onDeleteArticle}
                    title="소중하게 쓰신 블로그를 정말 삭제하시겠습니까?"
                    content="블로그를 삭제하시면 다시 복구하실 수 없습니다."
                />
            )
        } else {
            deleteCheckBoard = null;
        }

        return (
            <Aux>
                {renderView}
                {deleteCheckBoard}
            </Aux>
        )
    }
}

export default withStyles(styles)(PostPage);