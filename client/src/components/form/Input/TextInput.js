import React from 'react';
import './TextInput.css';

const TextInput = (props) => {
    return (
        <div className="TextInput input-field">
            <input {...props} />
            <label style={props.style} className={props.labelClass}>{props.label}</label>
        </div>
    )
}

export default TextInput;