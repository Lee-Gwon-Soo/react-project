import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Route } from 'react-router-dom';
import './Dashboard.css';

import MenuList from './MenuList/MenuList';
import Loading from '../Shared/Loading/Loading';


class Dashboard extends Component {
    state = {
        loading: true
    }
    componentDidMount() {
        if(!this.props.auth && this.props.auth !== null ) {
           this.props.history.push('/login'); 
        } else {
            this.setState(function(state, props) {
                return {
                    loading: false
                }
            })
        }
    }

    render(){
        let layout = null;
        if( this.state.Loading) {
            layout = <Loading /> ;
        } else {
            layout = <MenuList userid={this.props.auth.id===undefined ? this.props.auth['_id'] : this.props.auth.id}/> ;
        }

        return (
            <div className="dashboardContainer">
                <div className="title">
                    <h2>원하는 메뉴를 선택해주세요.</h2>
                </div>
                <div>
                    <Route>
                        {layout}
                    </Route>
                </div>
            </div>
        )
    }
}

function mapStateToProps( { auth }) {
    return {auth}
}

export default connect(mapStateToProps)(Dashboard);