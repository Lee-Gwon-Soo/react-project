import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ITEM_HEIGHT = 48;

class PostHeader extends React.Component{
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    printAll = () => {
        this.handleClose();
        this.props.onClickPrinted();
    }

    deleteBlog = () => {
        this.handleClose();
        this.props.tryDeleting();
    }

    render(){
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <div className="BlogHeader">
                <ul>
                    <li>
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
                                <MenuItem onClick={this.printAll} >
                                    프린트
                                </MenuItem>
                                <MenuItem onClick={this.deleteBlog} >
                                    삭제
                                </MenuItem>
                            </Menu>
                    </li>
                    <li><Link to={`/blog/detail/${this.props.categoryId}`}><i className="material-icons">arrow_back</i></Link></li>
                    <li onClick={this.props.onClick}>수정하기</li>   
                </ul>
            </div>
        )
    }
}

export default PostHeader;