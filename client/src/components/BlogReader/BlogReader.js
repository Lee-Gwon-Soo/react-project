import React from 'react';
import axios from 'axios';
import Header from '../Layout/Header';
import './BlogReader.css';

import ReplyBoard from './ReplyBoard/ReplyBoard';
import Draft from '../Shared/Draft/Draft';
import DataLoading from '../Shared/DataLoading/DataLoading';
import Aux from '../../HOC/Aux';
import Footer from '../Layout/Footer';
import {EditorState, convertFromRaw } from 'draft-js';

import Grid from '@material-ui/core/Grid';


class BlogReader extends React.Component {
    state = {
        element: {}, 
        authorInfo:null,
        isLoading: true,
    }
    componentDidMount() {
        if(this.props.match.params.postId && this.props.match.params.categoryId){
            axios.get("/api/main/getBlogItem/"+this.props.match.params.categoryId+ '/'+ this.props.match.params.postId)
            .then((response) => {
                const res =response.data;
                if( res.status ) {
                    const data = res.data;
                    data.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                            element: {...data},
                            authorInfo: res.author
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    onChange = (editorState) => {return null}


    renderView = () => {
        if(this.state.isLoading) {
            return <DataLoading />;
        } else {
            const renderView = (
                <Aux>
                    <Header 
                        email={this.props.match.params.email}
                    />
                    <div className="container BlogReader">
                        <Grid container className="BlogReaderHeader">
                            <Grid item xs={12} sm={8} className="category auto-margin">
                                {this.state.element._categoryTitle}
                            </Grid>
                            <Grid item xs={12} sm={8} className="title auto-margin">
                                {this.state.element.title}
                            </Grid>
                        </Grid>
                        <section className="mainReadingBoard">
                            <Grid container >
                                <Grid item xs={12} sm={8} className="auto-margin authorInfo">
                                    <Grid container >
                                        <Grid item xs={12} sm={4} className="author">
                                            <span><strong>{this.state.authorInfo.name}</strong></span>
                                            <span>{this.state.authorInfo.job}</span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={8} style={{marginLeft: 'auto', padding:'0px 10px'}}>
                                    <Grid item xs={12} sm={8} className="draft" >
                                        <Draft editorState={this.state.element.editorState} readOnly={true} onChange={this.onChange}/>
                                    </Grid>
                                </Grid>
                            </Grid> 
                        </section>
                        <ReplyBoard 
                            postId = {this.props.match.params.postId}
                        />
                    </div>
                    <Footer />
                </Aux>
            );

            return renderView;
        }
    }

    render() {
        return (
            <Aux>
                {this.renderView()}
            </Aux>
        )
    }
}

export default BlogReader;