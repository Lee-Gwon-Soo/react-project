import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './MenuList.css';

import Menu from './Menu/Menu';
import menuConfig from './MenuConfig';

import Grid from '@material-ui/core/Grid';

class MenuList extends Component {
    state = {
        clickMenu: false,
        link: '',
    }

    goToMenu(link) {
        this.setState(function(state, props){
            return {
                clickMenu: true,
                link: link
            }
        })
    }

    render(){

        let renderView = null;
        if(this.state.clickMenu) {
            renderView = (
                <Redirect to={this.state.link+'/'+this.props.userid}/>
            )
        } else {
            renderView = menuConfig.map((menuElement) => {
                return (
                    <Menu key={menuElement.key} element={menuElement} onClick={() => this.goToMenu(menuElement.link)}/>
                );
            })
        }

        return (
            <div className="MenuList container">
                <Grid container spacing={8}>
                    {renderView}
                </Grid>
            </div>
        )   
    }
}

export default MenuList;