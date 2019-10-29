import React from 'react';
import { connect } from 'react-redux';
import './BlogDetail.css';

import Toast from '../../Shared/Toast/Toast';

//import Post from '../BlogBoard/Post/Post';
import BlogDetailHeader from './BlogDetailHeader';
import BlogTable from './BlogTable';


import Grid from '@material-ui/core/Grid';

class BlogDetail extends React.Component {
    state = {
        BlogList: [],
        startSelecting: false,
        selectedItem: null,
        startChangingUsage: false,
        error: false,
        errorMessage: '',
        usageSelected: [],
    }

    viewDetailPost = (id) => {
        this.props.history.push('/blog/post/'+id);
    }
    
    onStartChangingUsage = () => {
        this.setState(function(state, props){
            return {
                startChangingUsage: true
            }
        });
    }

    onCancelChangeUsage = () => {
        this.setState(function(state, props){
            return {
                startChangingUsage: false
            }
        });
    }

    onClickSelectTopItem = () => {
        this.setState(function(state, props){
            return {
                startSelecting: true
            }
        })
    }

    cancelSelectTopItem = () => {
        this.setState(function(state, props){
            return {
                startSelecting: false
            }
        });
    }

    selectedAsTop = (id) => {
        this.setState(function(state,props){
            return {
                selectedItem: id
            }
        })
    }

    showError = (msg) => {
        this.setState(function(state,props){
            return {
                error: true,
                errorMessage: msg
            }
        });
    }

    renderBlogHeader = () => {
        return (
            <BlogDetailHeader 
                auth={this.props.auth.id} 
                to={`/blog/${this.props.auth.id}`}
                label={'목록'}
                onClickSelectTopItem={this.onClickSelectTopItem}
                startSelecting={this.state.startSelecting}
                cancelSelectTopItem={this.cancelSelectTopItem}
                saveSelectedItem={this.saveSelectedItem}
            />
        );
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    render() {
        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} timer={2000} handleClose={this.handleClose}/>
            )
        } else {
            errorMessage = null;
        }

        return (
            <div>
                <div className="BlogDetail container">
                    <Grid spacing={16} container style={{marginTop: '10px'}}>
                        <BlogTable 
                            categoryId={this.props.match.params.id}
                            showError={this.showError}
                            viewDetailPost={(id) => this.viewDetailPost(id)}
                            auth={this.props.auth.id}
                        />
                    </Grid>
                </div>
                {errorMessage}
            </div>
        )
    }
}

function mapStateToProps( {auth} ) {
    return {auth};
}


export default connect(mapStateToProps)(BlogDetail);