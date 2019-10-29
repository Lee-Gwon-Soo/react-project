import React from 'react';
import Icon from 'react-icons-kit';

const ToolbarItem = (props) => {
    return (
        <div className="tooltip-icon-button" onPointerDown={props.onPointerDown} onMouseDown={props.onMouseDown}>
            <Icon icon={props.iconKey}/>
        </div>
    )
};

export default ToolbarItem;