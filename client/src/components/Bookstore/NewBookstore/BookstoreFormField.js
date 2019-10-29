import React from 'react';
import Aux from '../../../HOC/Aux';
import Input from '../../form/Input/Input';

const BookstoreFormField = (props) => {

    let renderField = null;

    if( props.buttonlabel ) {
        renderField = (
            <div className="field">
                <div className="inputField"><Input {...props}/></div>
                <div className="buttonField">
                    <a className="waves-effect blue lighten-2 btn-small" onClick={props.generateStoreCode}>{props.buttonlabel}</a>
                </div>
            </div>
        )
    } else {
        renderField = (
            <div>
                <Input {...props}/>
            </div>
        )
    }

    return (
        <Aux>
            {renderField}
        </Aux>
    )
}

export default BookstoreFormField;