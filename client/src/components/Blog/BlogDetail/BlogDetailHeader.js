import React from 'react';
import { Link } from 'react-router-dom';

class BlogDetailHeader extends React.Component{
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    startSelectTopItem = () => {
        this.handleClose();
        this.props.onClickSelectTopItem();
    }

    startChangingUsage = () => {
        this.handleClose();
        this.props.onStartChangingUsage();
    }

    deleteBlog = () => {
        this.handleClose();
        this.props.tryDeleting();
    }

    renderMenu = () => {
        if(this.props.startSelecting) {
            return (
                <ul>
                    <li onClick={this.props.cancelSelectTopItem}>취소</li>
                    <li onClick={this.props.saveSelectedItem}>저장</li>
                </ul>
                );
        } else if(this.props.startChangingUsage) {
            return (
                <ul>
                    <li onClick={this.props.onCancelChangeUsage}>취소</li>
                    <li onClick={this.props.saveUsage}>저장</li>
                </ul>
                );
        } else {
            return (
                <ul>
                    {/* <li>
                        <IconButton
                            aria-label="More"
                            aria-owns={open ? 'long-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            >
                                <i className="material-icons">more_vert</i>
                            </IconButton>
                            <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={this.handleClose}
                            PaperProps={{
                                style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: 200,
                                },
                            }}
                            >
                                <MenuItem >
                                </MenuItem>
                            </Menu>
                    </li> */}
                    <li><Link to={this.props.to}><i className="material-icons">arrow_back</i></Link></li>
                    <li><Link to={`/category/${this.props.auth}/new`}>카테고리 추가</Link></li>
                    <li><Link to={`/blog/${this.props.auth}/new`}>블로그 작성</Link></li>
                </ul>
            );
        }
    }

    render(){
        return (
            <div className="BlogHeader">
                {this.renderMenu()}
            </div>
        )
    }
}

export default BlogDetailHeader;