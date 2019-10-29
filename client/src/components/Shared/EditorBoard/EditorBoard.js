import React, { Component } from 'react';
import './EditorBoard.css';

import FormatterToolbar from './FormatterToolbar';
import { Editor } from 'slate-react';
import { Block, Value } from 'slate';
import { getEventRange, getEventTransfer } from 'slate-react';
//import values from './value.json';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import styled from 'react-emotion';

const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
`
function isImage(url) {
    return !!imageExtensions.find(url.endsWith);
}

function insertImage(change, src, target) {
    if (target) {
      change.select(target);
    }
  
    change.insertBlock({
      type: 'image',
      data: { src },
    });
}

function MarkHotkey(options) {
    const { type, key } = options;

    // Return our "plugin" object, containing the `onKeyDown` handler.
    return {
      onKeyDown(event, change) {
        // Check that the key pressed matches our `key` option.
        if (!event.ctrlKey || event.key !== key) return;

        // Prevent the default characters from being inserted.
        event.preventDefault();

        // Toggle the mark `type`.
        change.toggleMark(type);
        return true;
      },
    }
  }


// Create our initial value...
//const initialValue = Value.fromJSON(values);

const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: '~', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' }),
];

const schema = {
    document: {
        last: { type: 'paragraph' },
        normalize: (change, { code, node, child }) => {
        switch (code) {
            case 'last_child_type_invalid': {
            const paragraph = Block.create('paragraph')
            return change.insertNodeByKey(node.key, node.nodes.size, paragraph)
            }
        }
        },
    },
    blocks: {
        image: {
        isVoid: true,
        },
    },
}

class EditorBoard extends Component {

    renderMark = values => {
        switch (values.mark.type) {
            case 'bold':
                return <strong>{values.children}</strong>
                // Add our new mark renderers...
            case 'code':
                return <code>{values.children}</code>
            case 'italic':
                return <em>{values.children}</em>
            case 'strikethrough':
                return <del>{values.children}</del>
            case 'underline':
                return <u>{values.children}</u>
            case 'block-quote':
                return <blockquote>{values.children}</blockquote>
            case 'bulleted-list':
                return <ul>{values.children}</ul>
            case 'heading-one':
                return <h1>{values.children}</h1>
            case 'heading-two':
                return <h2>{values.children}</h2>
            case 'list-item':
                return <li>{values.children}</li>
            case 'numbered-list':
                return <ol>{values.children}</ol>
        }
      }

      /**
     * Render a Slate node.
     *
     * @param {Object} 
     * @return {Element}
     */

    renderNode = value => {
        const { attributes, node, isFocused } = value;

        switch (node.type) {
            case 'image': {
                const src = node.data.get('src')
                return <Image src={src} selected={isFocused} {...attributes} />
            }
        }
    }

    onClickImage = event => {
        event.preventDefault();
        const src = window.prompt('Enter the URL of the image:');
        if (!src) return;
    
        const change = this.props.value.change().call(insertImage, src);
    
        this.props.onChange(change)
    }

    onMarkClick = (event, type) =>{
        event.preventDefault();

        const value = this.props.value;

        const change = value.change().toggleMark(type);

        this.props.onChange(change);
    }

    render() {
        return (
            <div className="EditorBoard">
                {this.props.readOnly===true ? null :<FormatterToolbar onPointerDown={(event, type) => this.onMarkClick(event, type)} onMouseDown={(event) => this.onClickImage(event)}/>}
                <Editor 
                    spellCheck
                    autoFocus
                    value={this.props.value} 
                    onChange={this.props.onChange} 
                    plugins={plugins} 
                    onPaste={this.onDropOrPaste}
                    onDrop={this.onDropOrPaste}
                    schema={schema}
                    readOnly={this.props.readOnly}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark} 
                    placeholder={this.props.placeholder}/>
            </div>
        )
    }

    onDropOrPaste = (event, change, editor) => {
        const target = getEventRange(event, change.value);
        if (!target && event.type === 'drop') return;

        const transfer = getEventTransfer(event);
        const { type, text, files } = transfer;

        if (type === 'files') {
            for (const file of files) {
            const reader = new FileReader();
            const [mime] = file.type.split('/');
            if (mime !== 'image') continue;

            reader.addEventListener('load', () => {
                editor.change(c => {
                c.call(insertImage, reader.result, target);
                })
            })

            reader.readAsDataURL(file);
            }
        }

        if (type === 'text') {
            if (!isUrl(text)) return;
            if (!isImage(text)) return;
            change.call(insertImage, text, target);
        }
    }
}

export default EditorBoard;