import React from 'react';
import StyleButton from './StyleButton';
import FormatItalic from '@material-ui/icons/FormatItalic'
import FormatBold from '@material-ui/icons/FormatBold'
import FormatUnderlinedOutlined from '@material-ui/icons/FormatUnderlinedOutlined'
import AddAPhoto from '@material-ui/icons/AddAPhotoOutlined';


var INLINE_STYLES = [
    {label: <FormatBold />, style: 'BOLD'},
    {label: <FormatItalic />, style: 'ITALIC'},
    {label: <FormatUnderlinedOutlined />, style: 'UNDERLINE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls" style={{display: 'inline-block'}}>
        {INLINE_STYLES.map((type, index) =>
            <StyleButton
            key={index}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
            />
        )}
        <span className="RichEditor-styleButton" onClick={props.addPhoto}>
            <AddAPhoto /> 
        </span>
        </div>
    );
};

  export default InlineStyleControls;