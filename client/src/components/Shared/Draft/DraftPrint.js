import React from 'react';
import axios from 'axios';

import './Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-focus-plugin/lib/plugin.css';
import 'draft-js-side-toolbar-plugin/lib/plugin.css';

import { EditorState,convertToRaw, convertFromRaw, DefaultDraftBlockRenderMap } from 'draft-js';
import Immutable from 'immutable';

import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import alignmentToolStyles from './alignmentToolStyles.css';
import buttonStyles from './buttonStyles.css';

//Focus and Alignment Plugin
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin({
  theme: {
    buttonStyles: buttonStyles,
    alignmentToolStyles: alignmentToolStyles
  }
});

const decorator = composeDecorators(
  alignmentPlugin.decorator,
  resizeablePlugin.decorator,
  blockDndPlugin.decorator,
  focusPlugin.decorator,
);

//Image Plugin
const imagePlugin = createImagePlugin({ decorator });

const plugins = [
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin
];
const blockRenderMap = Immutable.Map({
  'pullBlockquote': {
    element: 'blockquote'
  },
  'customCodeBlock': {
    element: 'pre'
  }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

// Custom overrides for "code" style.
function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        case 'pullBlockquote': return 'pullBlockquote';
        case 'customCodeBlock': return 'customCodeBlock';
        
        default: return null;
    }
}

class DraftPrint extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          loaded:false,
          editorState: EditorState.createEmpty()
        }

        this.focus = () => this.editor.focus();

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
      }

    componentWillMount() {
        const editorState = this.props.editorState;
        this.setState({editorState: editorState});

        var value = convertToRaw(editorState.getCurrentContent());
        const entityArray = value.entityMap;
        
        let replacedArray = {};
        for (let key in entityArray) {
            const data = {...entityArray[key]};
            if(data.type === 'IMAGE') {
                const url = data.data.src;
                
                //image를 dataURL로 저장. --> 그래야 프린트가 된다... 쉣..
                axios.get(url, { responseType: 'arraybuffer' })
                    .then((response) => {
                        console.log(response);
                        let image = btoa(
                        new Uint8Array(response.data)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );
                        const modifiedURL =  `data:image/png;base64,${image}`;
                        data.data.src = modifiedURL;
                        
                        replacedArray[key] = data;
                        value.entityMap = {...replacedArray};
                        const newEditorState = EditorState.createWithContent(convertFromRaw(value));
                        this.setState({editorState :newEditorState});
                    })
                    .catch(err => {
                        console.log(err);
                        const editorState = this.props.editorState;
                        this.setState({editorState: editorState});
                    })
                    ;
            }
        }
        this.setState(function(state, props){
            return {
                loaded: true,
            }
        })
    }
    
    onChange = (editorState) => {
        this.setState({editorState});
    };

    render() {
          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'RichEditor-editor';

          return (
            <div className="RichEditor-root">
            {this.state.loaded ? (
              <div className={className}>
                <Editor
                  readOnly={true}
                  blockStyleFn={getBlockStyle}
                  editorState={this.state.editorState}
                  blockRenderMap={extendedBlockRenderMap}
                  ref={(element) => {
                    this.editor = element;
                  }}
                  placeholder={'적고 싶은 내용을 마음껏 펼쳐보세요.'}
                  onChange={(editorState) => this.onChange(editorState)}
                  plugins={plugins}
                  spellCheck
                />
              </div>
            ) : null}
            </div>
          );
    }
}

export default DraftPrint;

      

      