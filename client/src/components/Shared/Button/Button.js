import React from 'react';

import './Button.css';

const Button = (props) => {
    let classes = '';
    switch(props.type) {
        case ('apple-basic'):
            classes = 'custom-apple';
            break;
        default :
            classes = 'custom-apple';
    }

    switch(props.size) {
        case ('big'):
            classes += ' big';
            break;
        default :
            classes += ' normal';
    }


    return (
        <button type="button" className={classes} onClick={props.onClick}>
            {props.label}
        </button>
    )
}

export default Button;