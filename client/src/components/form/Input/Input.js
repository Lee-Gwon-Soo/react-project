import React from 'react';
import Aux from '../../../HOC/Aux';
import './Input.css';

const Input = (props) => {
    let inputElement = null;
    props = {
        type: props.type,
        label: props.label,
        value: props.value,
        name: props.name,
        placeholder: props.placeholder,
        onChange: props.onChange,
        onClick: props.onClick
    }
    switch( props.type ) {
        case ('input') :
            inputElement = (
                <div className="input-field" style={{marginBottom: '30px', width:'100%'}}>
                    <input {...props}/>
                    <label className="active">{props.label}</label>
                </div>
            );
            break;
        case ('textarea'):
            inputElement = (
                <div className="input-field" style={{marginBottom: '30px', width:'100%'}}>
                    <textarea {...props}/>
                    <label className="active">{props.label}</label>
                </div>
            );
            break;
        case ('select'): 
            inputElement = (
                <div className="selectionField" style={{marginBottom: '30px', width:'100%'}}>
                    <select> 
                        {/*Selection 보류*/}
                    </select>
                </div>
            );
            break;
        default :
            inputElement = (
                <div className="input-field" style={{marginBottom: '30px', width:'100%'}}>
                    <input {...props}/>
                    <label className="active">{props.label}</label>
                </div>
            );
    };

    return (
        <Aux>
            {inputElement}
        </Aux>
    )
}

export default Input;