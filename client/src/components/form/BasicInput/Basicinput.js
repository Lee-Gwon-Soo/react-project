import React, { Component } from 'react';
import './Basicinput.css';
import Aux from '../../../HOC/Aux';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

class Basicinput extends Component {

    render(){
        let errorMsg = null;
        let changedClass = '';

        if(!this.props.valid && this.props.touched && this.props.elementConfig.missingMsg) {
            errorMsg = (
                <div className="SmallTalk">{this.props.elementConfig.missingMsg}</div>
            );
            changedClass = 'invalid';
        }

        return (
            <Aux>
                
                <div className="BasicInput" style={{maxWidth: this.props.maxWidth? this.props.maxWidth : '100%'}}>
                    <TextField
                        name={this.props.elementConfig.name} 
                        required={this.props.validation.required} 
                        style={{width: this.props.elementConfig.width}} 
                        className={changedClass}
                        value={this.props.value} 
                        onClick={this.props.clicked}
                        onBlur={this.props.blur}
                        type={this.props.elementConfig.type}
                        onChange={this.props.changed}
                        onKeyDown={this.props.onKeyDown}
                        id={this.props.id}
                        InputProps={{
                            startAdornment: <InputAdornment className="InputAdornment" position="start">{this.props.elementConfig.label}</InputAdornment>,
                        }}
                    />
                    {errorMsg}
                </div>
            </Aux>
        )
    }
}

export default Basicinput;