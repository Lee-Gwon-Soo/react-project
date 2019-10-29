import React, {Component} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import './Toast.css';

class Toast extends Component {
    state = {
        show: false
    }
    componentWillMount() {
        this.setState(function(prevState, props){
            return {
                show: this.props.error
            }
        });
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState(function(state,props){
            return { show: false }
        });
        this.props.handleClose()
    };

      
    render(){

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.show}
                autoHideDuration={this.props.timer ? this.props.timer : 3000}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.props.errorMessage}</span>}
                action={[
                    <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
                        닫기
                    </Button>
                ]}
                />
        )
    }
}

export default Toast;