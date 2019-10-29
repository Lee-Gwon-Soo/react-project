import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as actions from '../actions';

//CSS
import '../common/css/main.css';
import '../common/css/progress.css';

//Components
import Layout from './Layout/Layout';

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render(){
        return (
            <BrowserRouter>
                <Layout authenticated={this.props.auth} />
            </BrowserRouter>
        );
    }   
}
function mapStateToProps( { auth , study}) {
    return { auth, study }
}

export default connect(mapStateToProps, actions)(App);