import React from 'react';
import './SideToolbar.css';

import Aux from '../../../HOC/Aux';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls/InlineStyleControls';


class SideToolbar extends React.Component {
    state = {
        top: 0,
        divHeight: 0,
    }

    componentDidMount () {

        this._bindScroll();
        this.setState(function(state, props){
            return {
                divHeight: this._header.offsetTop
            }
        })

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

        if(this.state.top > top && top >= this.state.divHeight){
            const className = `SideToolBar sticky header`;
            this._header.className = className;
        } else if( top >= this.state.divHeight){
            const className = `SideToolBar sticky`;
            this._header.className = className;
        } else {
            const className = `SideToolBar`;
            this._header.className = className;
        }

        this.setState(function(state, props){
            return {
                top: top
            }
        })
    }
    
    render(){
        return (
            <Aux>
                <div className={this.props.type === 'blog' ? "SideToolBar blog" : "SideToolBar"}
                    ref={(ref) => this._header = ref}
                >
                    <div className="ToolBarBoard">
                        <BlockStyleControls
                            editorState={this.props.editorState}
                            onToggle={this.props.toggleBlockType}
                        />
                        <InlineStyleControls
                            editorState={this.props.editorState}
                            onToggle={this.props.toggleInlineStyle}
                            addPhoto={this.props.startInsertImage}
                        />
                    </div>
                </div>
            </Aux>
        )
    }
}

export default SideToolbar;