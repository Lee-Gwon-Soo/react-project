import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import './Bookstore';
import Bookshelf from './Bookshelf/Bookshelf';

class Bookstore extends  Component {
    state = {
        hasBookstore: true,
        error: false,

    }
    componentDidMount() {
        if(this.props.auth.id) {
            axios.get('/api/bookstore/' + this.props.auth.id).then(
                (response) => {
                    if(!response.data.status) {
                        this.props.history.push('/dashboard/bookstore/new');
                    }
                },
                (error) => {
                    this.setState(function(state, props){
                        return {
                            error: true
                        }
                    })
                }
            )
        }
    }
    
    renderView() {
        let renderView = null;

        if(this.state.error ){
            renderView = (
                <Redirect to="/dashboard/summary"/>
            )
        } else {
            renderView = (
                <div>
                    <Bookshelf history={this.props.history} auth={this.props.auth.id}/>
                </div>
            )
        } 
        return renderView;
    }
    render() {
        return (
            <div>
                {this.renderView()}
            </div>
        )
    }
}

function mapStateToProps({auth}) {
    return {auth}
}

export default connect(mapStateToProps)(Bookstore);



