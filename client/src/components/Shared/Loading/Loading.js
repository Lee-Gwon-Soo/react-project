import React from 'react';

import Aux from '../../../HOC/Aux';
import Spinner from '../Spinner/Spinner';
import './Loading.css';

const Loading = (props) => {
    return (
        <Aux>
            <div className="loadingBoard">
                <div className="board">
                    <Spinner />
                </div>
            </div>
        </Aux>
    )
}

export default Loading;