import React from 'react';
import './FormatterToolbar.css';
import ToolbarItem from './ToolbarItem/ToolbarItem';

//react icon kit
import {bold} from 'react-icons-kit/feather/bold';
import {italic} from 'react-icons-kit/feather/italic';
import {underline} from 'react-icons-kit/feather/underline';
import {image} from 'react-icons-kit/feather/image';
import {ic_looks_one} from 'react-icons-kit/md/ic_looks_one';

const FormatterToolbar = (props) => {
    return (
        <div className="format-toolbar">
            <ToolbarItem onPointerDown={(event) => props.onPointerDown(event, 'bold')} iconKey={bold}/>
            <ToolbarItem onPointerDown={(event) => props.onPointerDown(event, 'italic')} iconKey={italic}/>
            <ToolbarItem onPointerDown={(event) => props.onPointerDown(event, 'underline')} iconKey={underline}/>
            <ToolbarItem onPointerDown={(event) => props.onPointerDown(event, 'heading-one')} iconKey={ic_looks_one}/>
            <ToolbarItem onMouseDown={props.onMouseDown} iconKey={image}/>
        </div>
    )
}

export default FormatterToolbar;