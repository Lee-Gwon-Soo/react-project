import React from 'react';
import './DataLoading.css';

const DataLoading = (props) => {
    return (
        <div className="loadingBoard">
            <div className="board">
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                </div>
            </div>
        </div>
    )
}

export default DataLoading;