import React from 'react';

const TabKey = (props) => {
    return (
        <div className="tabKey">
            <div className="iconPart">
                <i className="material-icons">{props.icon}</i>
            </div>
            <div className="keyLabel">
                {props.label}
            </div>
        </div>
    )
}
export default TabKey;