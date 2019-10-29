import React from 'react';
import axios from 'axios';

import './Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-focus-plugin/lib/plugin.css';
import '../../../../node_modules/draft-js-side-toolbar-plugin/lib/plugin.css';

import {AtomicBlockUtils, RichUtils, EditorState, DefaultDraftBlockRenderMap, ContentState, Modifier } from 'draft-js';
import Immutable from 'immutable';

import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import alignmentToolStyles from './alignmentToolStyles.css';
import buttonStyles from './buttonStyles.css';
import SideToolbar from './SideToolbar';

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
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  alignmentPlugin.decorator,
  blockDndPlugin.decorator,
  focusPlugin.decorator,
  resizeablePlugin.decorator
);

//Image Plugin
const imagePlugin = createImagePlugin({ decorator });


const blockRenderMap = Immutable.Map({
  'pullBlockquote': {
    element: 'blockquote',
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

class Draft extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          clicked:false,
        }

        this.focus = () => this.editor.focus();

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
      }

      insertImage = (url) => {
        const editorState = this.props.editorState;

        const entityData = { src: url, height: 100, width: 100, };
        const contentStateWithEntity=editorState.getCurrentContent().createEntity('IMAGE', 'IMMUTABLE', entityData);

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
        let newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity },);
        newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,' ',);
        this.props.onChange(newEditorState);
      };

      _handleKeyCommand(command) {
        const editorState = this.props.editorState;
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
          this.props.onChange(newState);
          return true;
        } else if(command === 'split-block') {
          this.props.onChange(newState);
        }
        return false;
      }

      _onTab(e) {
        const maxDepth = 4;
        this.props.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
      }

      _toggleBlockType(blockType) {
          this.props.onChange(
            RichUtils.toggleBlockType(
              this.props.editorState,
              blockType
            )
          ); 
      }
      
      _toggleInlineStyle(inlineStyle) {
        this.props.onChange(
          RichUtils.toggleInlineStyle(
            this.props.editorState,
            inlineStyle
          )
        );
      }
    startInsertImage = () => {
        this.refs.hiddenImage.click();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/blog/post/imageUpload/'+this.props.auth, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.hiddenImage.value='';
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    showToolBar = () => {
      this.setState(function(state, props){
          return {
            clicked : !state.clicked
          }
      })
    }

    handlePastedText = (text) => {
      const editorState = this.props.editorState;
      const blockMap = ContentState.createFromText(text.trim()).blockMap;
      const newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);
      this.props.onChange(EditorState.push(editorState, newState, 'insert-fragment'));
      return true;
    };

    render() {
        const editorState = this.props.editorState;

          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'RichEditor-editor';
          var contentState = editorState.getCurrentContent();
          if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
              className += ' RichEditor-hidePlaceholder';
            }
          }

          let Controls = null;

          if ( this.props.readOnly !== true) {
            Controls = (
                <SideToolbar 
                    editorState={editorState}
                    toggleBlockType={this.toggleBlockType}
                    toggleInlineStyle={this.toggleInlineStyle}
                    startInsertImage={this.startInsertImage}
                    showToolBar={this.showToolBar}
                    clicked={this.state.clicked}
                    type={this.props.type}
                />
            )
          } else {
            Controls = null;
          }
          let plugins = [
            focusPlugin,
            blockDndPlugin,
            resizeablePlugin,
            imagePlugin,
            alignmentPlugin
          ];
          if(this.props.readOnly) {
            plugins = [
              focusPlugin,
              resizeablePlugin,
              imagePlugin,
              alignmentPlugin
            ];
          }
          
          return (
            <div className="RichEditor-root">
              <input type="file" className="hiddenInput" ref="hiddenImage" onChange = {(event) => this.uploadImage(event)} />
              <div className={className} onClick={this.props.readOnly ? null : this.focus}>
                {Controls}
                <div className={this.props.readOnly ? 'editor readonly' : 'editor'} >
                  <Editor
                    readOnly={this.props.readOnly}
                    blockStyleFn={getBlockStyle}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.props.onChange}
                    onTab={this.onTab}
                    blockRenderMap={extendedBlockRenderMap}
                    ref={(element) => {
                      this.editor = element;
                    }}
                    placeholder={'적고 싶은 내용을 마음껏 펼쳐보세요.'}
                    plugins={plugins}
                    spellCheck
                  />
                  {this.props.readOnly ? null : <AlignmentTool />}
                </div>
              </div>
            </div>
          );
    }
}

export default Draft;

      

      