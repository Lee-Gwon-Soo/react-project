import React from 'react';
import Aux from '../../../HOC/Aux';
import StyleButton from './InlineStyleControls/StyleButton';
import FormatQuote from '@material-ui/icons/FormatQuoteOutlined';
import CodeIcon from '@material-ui/icons/Code';
import FormatListBullet from '@material-ui/icons/FormatListBulleted';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import LooksOne from '@material-ui/icons/LooksOneOutlined';
import LooksTwo from '@material-ui/icons/LooksTwoOutlined';
import LooksThree from '@material-ui/icons/Looks3Outlined';
import LooksFour from '@material-ui/icons/Looks4Outlined';
import LooksFive from '@material-ui/icons/Looks5Outlined';

const BLOCK_TYPES = [
    {label: <LooksOne />, style: 'header-one'},
    {label: <LooksTwo />, style: 'header-two'},
    {label: <LooksThree />, style: 'header-three'},
    {label: <LooksFour />, style: 'header-four'},
    {label: <LooksFive />, style: 'header-five'},
    // {label: <FormatQuote />, style: 'blockquote'},
    {label: <FormatQuote />, style: 'pullBlockquote'},
    {label: <CodeIcon />, style: 'customCodeBlock'},
    {label: <FormatListBullet />, style: 'unordered-list-item'},
    {label: <FormatListNumbered />, style: 'ordered-list-item'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className="RichEditor-controls" style={{display: 'inline-block'}}>
        {BLOCK_TYPES.map((type, index) =>
          <StyleButton
            key={index}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };

  export default BlockStyleControls;