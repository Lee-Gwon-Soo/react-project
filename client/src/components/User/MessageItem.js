import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import HumanIcon from '../Shared/HumanIcons/HumanIcon';

const styles = theme => ({
    itemMain: {
        width: '100%',
        color: '#777',
        borderTop: '1px solid #efefef',
        marginTop: '15px'
    },
    imgBoard: {
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        padding: '20px 10px !important',
    },
    avatar: {
        margin: 10,
    },
    hide: {
        display: 'none'
    },
    small: {
        fontSize: '10px'
    },
    openContent: {
        whiteSpace: 'pre-line',
        color: '#000',
    },
    sender: {
        color: '#000',
        fontWeight: 'bold',
    }
})

class MessageItem extends React.Component{
    state = {
        open : false,
    }

    toggleOpen = () => {
        this.setState(function(state){
            return {
                open: !state.open
            }
        })
    }

    render(){
        const {classes} = this.props;
        const {open} = this.state;
        const date =  new Date(this.props.element.ins_dtime);
        return (
            <React.Fragment>
                <div className={classes.itemMain}>
                    <Grid container spacing={8} onClick={this.toggleOpen} style={{cursor: 'pointer'}}>
                        <Grid item xs={1} className={classes.imgBoard}>
                        {!(this.props.imgPath.indexOf('.') > -1) ? 
                            <Avatar  alt="" className={classes.cover}  style={{height: 'inherit', background: 'transparent'}} title={this.props.element.senderName}>
                                <HumanIcon indexValue={this.props.imgPath} />
                            </Avatar> :
                            <Avatar alt={this.props.element.senderName} src={this.props.imgPath} className={classes.avatar} />}
                        </Grid>
                        <Grid item xs={11} className={classes.content} >
                            <div className={classes.sender}>
                                {this.props.element.senderName}
                            </div>
                            <div className={classNames(open && classes.hide )}>
                                {this.props.element.content.substring(0, 32)}
                            </div>
                            <div className={classNames(!open && classes.hide, classes.small )}>
                                {`${date.getFullYear().toString()}년 ${(date.getMonth()+1)}월 ${date.getDate()}일`}
                            </div>
                            <div >
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} className={classNames(!open && classes.hide)}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={11} className={classes.openContent} >
                            {this.props.element.content}
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, {withTheme: true})(MessageItem);