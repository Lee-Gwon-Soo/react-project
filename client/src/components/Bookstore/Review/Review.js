import React, { Component } from 'react';
import Html from 'slate-html-serializer';
import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react';
import { Value } from 'slate';
import axios from 'axios';
import styled from 'react-emotion';

import FormatterToolbar from '../Bookshelf/NewReview/FormatterToolbar';
import Loading from '../../Shared/Loading/Loading';
import Toast from '../../Shared/Toast/Toast';
import Aux from '../../../HOC/Aux';
import './Review.css';

const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`;

const BLOCK_TAGS = {
    p: 'paragraph',
    li: 'list-item',
    ul: 'bulleted-list',
    ol: 'numbered-list',
    blockquote: 'quote',
    pre: 'code',
    h1: 'heading-one',
    h2: 'heading-two',
    h3: 'heading-three',
    h4: 'heading-four',
    h5: 'heading-five',
    h6: 'heading-six',
};

const MARK_TAGS = {
    strong: 'bold',
    em: 'italic',
    u: 'underline',
    s: 'strikethrough',
    code: 'code',
}

const RULES = [
    {
      deserialize(el, next) {
        const block = BLOCK_TAGS[el.tagName.toLowerCase()]
  
        if (block) {
          return {
            object: 'block',
            type: block,
            nodes: next(el.childNodes),
          }
        }
      },
    },
    {
      deserialize(el, next) {
        const mark = MARK_TAGS[el.tagName.toLowerCase()]
  
        if (mark) {
          return {
            object: 'mark',
            type: mark,
            nodes: next(el.childNodes),
          }
        }
      },
    },
    {
      // Special case for code blocks, which need to grab the nested childNodes.
      deserialize(el, next) {
        if (el.tagName.toLowerCase() === 'pre') {
          const code = el.childNodes[0]
          const childNodes =
            code && code.tagName.toLowerCase() === 'code'
              ? code.childNodes
              : el.childNodes
  
          return {
            object: 'block',
            type: 'code',
            nodes: next(childNodes),
          }
        }
      },
    },
    {
      // Special case for images, to grab their src.
      deserialize(el, next) {
        if (el.tagName.toLowerCase() === 'img') {
          return {
            object: 'block',
            type: 'image',
            nodes: next(el.childNodes),
            data: {
              src: el.getAttribute('src'),
            },
          }
        }
      },
    },
    {
      // Special case for links, to grab their href.
      deserialize(el, next) {
        if (el.tagName.toLowerCase() === 'a') {
          return {
            object: 'inline',
            type: 'link',
            nodes: next(el.childNodes),
            data: {
              href: el.getAttribute('href'),
            },
          }
        }
      },
    },
  ];
  const html = new Html({ rules: RULES });

function insertImage(change, src, target) {
    if (target) {
        change.select(target);
    }

    change.insertBlock({
        type: 'image',
        data: { src },
    });
}

/******** Class Starts *********/
class Review extends Component {
    state = {
        loading: true,
        value: Plain.deserialize(''),
        readOnly:true,
        error: false,
        errorMessage: '',
    }
    
    schema = {
        blocks: {
            image: {
            isVoid: true,
            },
        },
    }
    
    componentDidMount () {
        const userId = this.props.match.params.userId;
        const reviewId = this.props.match.params.reviewId;

        axios.get('/api/bookstore/getReviewInfo/'+reviewId )
        .then((response) => {
            
            if(response.data.status){
                const data = response.data.data;
                const initialValue = JSON.parse(data.content);

                this.setState(function(state, props) {
                    return {
                        loading: false,
                        value: Value.fromJSON(initialValue),
                    }
                });
            } else {
                this.props.history.push('/bookstore/'+userId);
            }
        })
    }
    /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

    renderNode = props => {
        const { attributes, children, node, isFocused } = props

        switch (node.type) {
        case 'quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'code':
            return (
            <pre>
                <code {...attributes}>{children}</code>
            </pre>
            )
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        case 'link': {
            const { data } = node
            const href = data.get('href')
            return (
            <a href={href} {...attributes}>
                {children}
            </a>
            )
        }
        case 'image': {
            const src = node.data.get('src')
            return <Image src={src} selected={isFocused} {...attributes} />
        }
        }
    }

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderMark = values => {
        const { children, mark, attributes } = values

        switch (mark.type) {
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
     * On change, save the new value.
     *
     * @param {Change} change
     */

    onChange = ({ value }) => {
        this.setState({ value })
    }

    goBackToBookshelf() {
        const userId = this.props.match.params.userId;
        this.props.history.push('/bookstore/'+userId);
    }

    goBackToRead() {
        this.setState(function(state, props){
            return {
                readOnly: true
            }
        })
    }

    startModify(){
        this.setState(function(state, props){
            return {
                readOnly: false
            }
        })
    }

    saveMoidfyContent= async () => {
        this.setState(function(state, props){
            return {
                loading: true
            }
        });
        const value = this.state.value;
        const content = JSON.stringify(value.toJSON());
        
        const body = {
            content: content
        }

        const res = await axios.post('/api/bookstore/modifyReview/'+this.props.match.params.reviewId, body);

        if(res.data.status === true ) {
            this.setState(function(state, props){
                return {
                    loading: false,
                    readOnly:true
                }
            });
            //this.props.history.push("/bookstore/review/"+this.props.match.params.userId+"/"+res.data.data._id);
        } else {
            this.setState(function(state, props){
                return {
                    loading: false,
                    error: true,
                    errorMessage: res.data.message
                };
            })
        }
    }

    onMarkClick = (event, type) =>{
        event.preventDefault();

        const value = this.state.value;

        const change = value.change().toggleMark(type);

        this.onChange(change);
    }

    onClickImage = event => {
        event.preventDefault();
        const src = window.prompt('Enter the URL of the image:');
        if (!src) return;
    
        const change = this.state.value.change().call(insertImage, src);
    
        this.onChange(change)
    }

    render() {
        
        let renderView = null;

        if(this.state.loading) {
            renderView = <Loading />;
        } else {
            renderView = (
                <div className="Review">
                    <div className="ButtonArea">
                        {!this.state.readOnly ? <h2 className="backbutton" onClick={() => this.goBackToRead()}>Back</h2> : <h2 className="backbutton" onClick={() => this.goBackToBookshelf()}>Back</h2> }
                        {!this.state.readOnly ? <h2 onClick={() => this.saveMoidfyContent()}>Save</h2> : <h2 onClick={() => this.startModify()}>Modify</h2> }
                    </div>
                    <div className="BoardArea">
                        {!this.state.readOnly ? <FormatterToolbar onPointerDown={(event, type) => this.onMarkClick(event, type)} onMouseDown={(e) => this.onClickImage(e)}/> : null }
                        <Editor
                            readOnly={this.state.readOnly}
                            placeholder="Paste in some HTML..."
                            value={this.state.value}
                            schema={this.schema}
                            //onPaste={this.onPaste}
                            onChange={this.onChange}
                            renderNode={this.renderNode}
                            renderMark={this.renderMark}
                        />
                    </div>
                </div>
            );
        }

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage}/>
            )
        } else {
            errorMessage = null;
        }

        return (
            <Aux>
                {renderView}
                {errorMessage}
            </Aux>
        )
    }
}

export default Review;