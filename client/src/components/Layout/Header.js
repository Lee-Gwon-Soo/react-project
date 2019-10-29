import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

//CSS
import * as classes from './Header.css';
import Aux from '../../HOC/Aux';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import {Link} from 'react-router-dom';


//Header 
class Header extends Component {
    state = {
        menuClicked: false,
        top: 0,
        authInfo: {}
    }

    componentDidMount () {
        this._bindScroll();
        if(this.props.email) {
            axios.get("/api/auth/getInfoByEmail/"+this.props.email)
                .then((response) => {
                    const res =response.data;
                    if( res.status ) {
                        this.setState(function(state, props){
                            return {
                                authInfo: res.data,
                                isLoading: false,
                            }
                        });
                    } 
                })
                .catch(err => {
                    console.log(err);
                    this.props.history.replace('/login');
                });
        } 
    }
    
    componentWillUnmount () {
        this._unbindScroll();
    }

  _bindScroll = () => {

    // Use passive event listener if available
    let supportsPassive = false
    try {

      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          supportsPassive = true
        },
      });
      window.addEventListener('test', null, opts);

    }
    catch (e) {} // eslint-disable-line no-empty

    window.addEventListener(
      'scroll',
      this._handleScroll,
      supportsPassive ? { passive: true } : false
    )
  }

  _unbindScroll = () => {
    window.removeEventListener('scroll', this._handleScroll);
  }

  _handleScroll = () => {

    // Ugly cross-browser compatibility
    const top = document.documentElement.scrollTop
      || document.body.parentNode.scrollTop
      || document.body.scrollTop;

    // Test < 1 since Safari's rebound effect scrolls past the top
    
    if (top < 60 ) {
        const className = `${classes.CustomNav}`;
        this._header.className = className;
    } else if( this.state.top < top && top > 60){
        const className = `${classes.CustomNav} ${classes.scrolldown}`;
        this._header.className = className;
    } else if(this.state.top > top){
        const className = `${classes.CustomNav} ${classes.scrolled}`;
        this._header.className = className;
    } 

    this.setState(function(state, props){
        return {
            top: top
        }
    })
  }

  renderMenuContent() {
        switch (this.props.email){
            case null:
                return;
            case false:
                return (
                    <ul className="menuBar-item">
                        <li>
                            <i className="material-icons">person</i>
                            <a href="/login">로그인</a>
                        </li>
                        <li>
                            <i className="material-icons">add_circle</i>
                            <a href="/signup">회원가입</a>
                        </li>
                    </ul>
                );
            default:
                return (
                    <ul className="menuBar-item">
                        <li>
                            <i className="material-icons">dashboard</i>
                            <a href="/dashboard">메뉴</a>
                        </li>
                        <li>
                            <i className="material-icons">eject</i>
                            <a href="/api/logout">로그아웃</a>
                        </li>
                    </ul>
                );
        }
    }

    renderContent() {
        switch (this.props.email){
            case null:
                return;
            case false:
                return (
                    <ul className="right hide-on-med-and-down">
                        <li><a href="/login">로그인</a></li>
                    </ul>
                );
            default:
                return (
                    <ul className="right hide-on-med-and-down">
                        <li><a href="/dashboard/summary">메뉴</a></li>
                        <li><a href="/api/logout">로그아웃</a></li>
                    </ul>
                );
        }
    }

    toggleMenuBar = (status) => {
        this.setState(function(state, props){
            return {
                menuClicked: status
            }
        });
    }

    render() {

        let menuClickView = null;
        let classArray = [classes.CustomNav];

        if(this.state.menuClicked) {
            menuClickView = (
                <div className={classes.menuBar}>
                    {this.renderMenuContent()} 
                </div>
            )
        } else {
            menuClickView = null;
        }

        return (
            <Aux>
                <div className={classArray.join(' ')}
                    ref= {(ref) => this._header = ref}>
                    <div className="navbar-fixed">
                        <div className="headerFixed">
                            <span>mKeyword</span>
                        </div>
                        
                        <div className="header__initiative_logo">
                            <IconButton className="sidenav-trigger" color="inherit" aria-label="Menu" onClick={() => this.toggleMenuBar(true)}>
                                <i className="material-icons">menu</i>
                            </IconButton>
                            <Link to={"/page/"+this.props.email} className="header_logo_title">
                                <span className="header_logo_title_text" id="frontName">
                                    {this.state.authInfo.name ? this.state.authInfo.name : this.props.name}
                                </span>
                            </Link>
                        </div>
                        <div className="header__nav hide-on-med-and-down">
                            <ul className="header__nav_ui">
                                <li><Link to={'/page/'+this.props.email+'/about'} className="header__nav_item">저를 소개합니다</Link></li>
                                <li><Link to={'/'} className="header__nav_item">저는 이런 것을 좋아합니다</Link></li>
                                <li><Link to={'/'} className="header__nav_item">제가 공부하고 있는 것들입니다</Link></li>
                            </ul>
                        </div>
                        {/* <nav className={classArray.join(' ')}
                            ref= {(ref) => 
                                this._header = ref
                            }
                        >
                            <div className="nav-wrapper">
                                <IconButton className="sidenav-trigger" color="inherit" aria-label="Menu" onClick={() => this.toggleMenuBar(true)}>
                                    <i className="material-icons">menu</i>
                                </IconButton>
                                {this.renderContent()}
                            </div>
                        </nav> */}
                    </div>
                </div>
                <div style={{height:'128px', display:'block', position:'relative'}}>&nbsp;</div>
                <Drawer open={this.state.menuClicked} onClose={() => this.toggleMenuBar(false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={() => this.toggleMenuBar(false)}
                        onKeyDown={() => this.toggleMenuBar(false)}
                    >
                        {menuClickView}
                    </div>
                </Drawer>    
            </Aux>
        )
    }
}

function mapStateToProps({auth}){
    return {auth};
}
export default connect(mapStateToProps)(Header);