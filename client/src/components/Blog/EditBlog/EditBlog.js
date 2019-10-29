import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Loading from '../../Shared/Loading/Loading';
import Toast from '../../Shared/Toast/Toast';
import Draft from '../../Shared/Draft/Draft';
import Aux from '../../../HOC/Aux';
import  './editorStyles.css';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Input from '@material-ui/core/Input';


class EditBlog extends Component {
    state = {
        _user: '',
        title:'',
        isLoading:false,
        editorState: EditorState.createEmpty(),
        isPublish: false,
        isMain: false,
        publish_name: '',
        error: false,
        errorMessage: '',
        timeout: null,
        isSaving: false,
        saved: false,
        category: '',
        CategoryList: [],
        anchorEl: null,
        selectedIndex: 0,
    }

    componentDidMount() {
        if( this.props.match.params.id ) {
            axios.get('/api/blog/post/getInfo/' + this.props.match.params.id)
                .then(response => {
                    if(response.data.status) {
                        const data = response.data.data;
                        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
                        const tempList = [...response.data.categoryList];
                        this.setState(function(state, props) {
                            return {
                                isLoading: false,
                                editorState: editorState,
                                _user: data._user,
                                title: data.title,
                                isPublish: data.isPublish,
                                isMain: data.isMain,
                                publish_name: data.publish_name,
                                category: data._category || '',
                                CategoryList: tempList
                            }
                        });
                    } else {
                        this.props.history.push('/blog/'+this.props.auth.id);
                    }
                })
                .catch( err => {
                    this.props.history.push('/blog/'+this.props.auth.id);
                });
        }
    }

    // On change, update the app's React state with the new editor value.
    
    onChange = (editorState) => {
        this.setState({editorState});
        
        if(this.state.saved === false) {
            this.setState(function(state,props){
                return {
                        timeout: this.resetTimeout(this.state.timeout, setTimeout(this.autoSave, 180000))
                    }
            });
        }

    };
    
    autoSave = () => {
        this.modifyData('auto');
    }
    
    resetTimeout = (id, newID) => {
        clearTimeout(id);
        return newID;
    }
    
    modifyData = async (mode) => {
        if(mode === 'save'){
            if  (this.state.title === '') {
                this.setState(function(state, props){
                    return {
                        error: true,
                        errorMessage: '제목을 입력해 주세요.'
                    };
                });
                document.querySelector('#title').focus();
                return false;
            }

            this.setState(function(state, props){
                return {
                    isLoading: true
                }
            });
        } else {
            this.setState(function(state, props){
                return {
                    isSaving: true
                }
            });
        }
        const editorState = this.state.editorState;
        var value = convertToRaw(editorState.getCurrentContent());
        
        const basicImage = this.getMainImage(value);

        const content = JSON.stringify(value);

        const body = {
            title: this.state.title,
            category: this.state.category,
            content:content,
            basicImage:basicImage,
            isPublish: this.state.isPublish,
            publish_name: this.state.publish_name
        }

        const res = await axios.post('/api/blog/modifyBlog/'+this.props.match.params.id, body);

        if(mode === 'save'){
            this.setState(function(state, props){
                return {
                    isLoading: false
                }
            });

            if(res.data.status === true ) {
                this.props.history.replace("/blog/post/"+res.data.data._id);
            } else {
                this.setState(function(state, props){
                    return {
                        error: true,
                        errorMessage: res.data.message
                    };
                })
            }
        } else {
            if(res.data.status === true ) {
                this.setState(function(state, props){
                    return {
                        isSaving:false,
                        saved:true,
                    };
                })
                setTimeout(() => this.setState(function(state,props){
                    return {
                        saved: false,
                    }
                }), 5000)
            } else {
                this.setState(function(state, props){
                    return {
                        error: true,
                        errorMessage: res.data.message
                    };
                })
            }
        }
    }

    getMainImage = ( value ) => {
        const entityMap = value['entityMap'];
        if( entityMap[0] === undefined ) {
            return null;
        } else {
            let entityArray = [];
            for (let key in entityMap) {
                entityArray.push({
                    id: key,
                    element: entityMap[key]
                })
            }

            let imageUrl = null;

            entityArray.map(item => {
                if(imageUrl ===null && item.element.type ==='IMAGE'){
                    imageUrl = item.element.data.src;
                }
            });
            return imageUrl;
        }
    }

    inputHandler = (event) => {
        const value = event.target.value;

        this.setState(function(state, props) {
            return {
                title: value
            }
        })
    }


    inputHandlerPublicName = (event) => {
        const value = event.target.value;

        this.setState(function(state, props) {
            return {
                publish_name: value
            }
        })
    }

    changePlanStatus = () => {
        this.setState(function(state, props) {
            return {
                isPublish: !state.isPublish
            }
        });
    }

    renderCategoryMenu = () => {
        let categoryArray = [];
        const { anchorEl } = this.state; 
        if( this.state.CategoryList.length > 0) {
            let i = 0 ;
            for(let key in this.state.CategoryList) {
                categoryArray.push({
                    id: key,
                    element: this.state.CategoryList[key]
                });
                if(this.state.category === this.state.CategoryList[key].title) {
                    this.setState(function(state, props){
                        return {
                            selectedIndex : i
                        }
                    })
                }

                i++;
            }
            return (
                <Aux>
                    <List>
                        <ListItem
                            button
                            aria-haspopup="true"
                            aria-controls="lock-menu"
                            aria-label="When device is locked"
                            onClick={this.handleClickListItem}
                        >
                            <ListItemText
                            primary="카테고리"
                            secondary={categoryArray[this.state.selectedIndex].element.title}
                            />
                        </ListItem>
                    </List>
                    <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    >
                    {categoryArray.map((element, index) => {
                        return (
                            <MenuItem
                                key={index}
                                selected={index === this.state.selectedIndex}
                                onClick={event => this.handleMenuItemClick(event, index)}
                            >
                            {element.element.title}
                            </MenuItem>
                        )
                    })}
                    </Menu>
                </Aux>
            );
        }else{
            return null;
        }
    }

    toogleTopItem = () => {
        this.setState(function(state, props) {
            return {
                isMain: !state.isMain
            }
        });
    }

    handleChangeCategory = (event) => {
        const value = event.target.value;
        this.setState(function(state,props){
            return {
                category: value
            }
        });
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };
    focus = () => {
        this.editor.focus();
    };

    handleClickListItem = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, anchorEl: null });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        let renderView = null;
        
        if( !this.state.loading ) {
            renderView = (
                <div>
                    <Grid container spacing={16} >
                        <Grid item xs={12}>
                            <Button color="default" onClick={() => this.props.history.push('/blog/detail/'+this.state.category)}>
                                취소
                            </Button>
                            {"  "}
                            <Button color="primary" variant="contained" onClick={() => this.modifyData('save')}>수정하기</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <TextField
                                        type="text" 
                                        label="제목" 
                                        className="inputTitle"  
                                        value={this.state.title}
                                        id="title" 
                                        onChange={(event) => this.inputHandler(event)}
                                        fullWidth    
                                    />
                                <Draft editorState={this.state.editorState} 
                                            onChange={(editorState) => this.onChange(editorState)}
                                            auth={this.props.match.params.id}
                                            autoSave={this.autoSave}
                                            type={'blog'}
                                />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <div className="optionBoard" >
                                <div className="options">
                                    <div className="categoryMenu">
                                        {this.renderCategoryMenu()}
                                    </div>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                            checked={this.state.isPublish}
                                            onChange={this.changePlanStatus}
                                            color="primary"
                                            />
                                        }
                                        label="발행용으로 작성합니다."
                                        className={this.state.isPublish ? 'active' : null}
                                    />
                                    { !this.state.isPublish ? (<p>
                                        같은 내용을 공유해서 다른 사람들에게 편의를 제공하고 싶은 경우에는 '발행용' 으로 작성하시면 됩니다.
                                    </p>) : (
                                        <p>
                                            <Input
                                                placeholder="발간시 제목"
                                                className="inputTitle" 
                                                required
                                                fullWidth
                                                value={this.state.publish_name}
                                                onChange={(event) => this.inputHandlerPublicName(event)}
                                                inputProps={{
                                                'aria-label': 'title',
                                                }}
                                            />
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Grid>
                            {/* <GridContainer>
                                <GridItem xs={12} sm={12} md={8}>
                                    <Button color="transparent" onClick={() => this.props.history.push('/blog/detail/'+this.state.category)}>
                                        <i className="material-icons">arrow_back</i>
                                    </Button>
                                    <Button color="info" onClick={() => this.modifyData('save')}>수정하기</Button>
                                </GridItem>                
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={8}>
                                <Card>
                                    <CardBody>
                                        <GridContainer>
                                            <GridItem xs={12} sm={12} >
                                            <div className="NewBlog">
                                                <div className="mainBoard">
                                                    <div className="titleBoard">
                                                        <MaterialInput 
                                                            type="text" 
                                                            label="제목" 
                                                            className="inputTitle"  
                                                            value={this.state.title}
                                                            id="title" required onChange={(event) => this.inputHandler(event)}/>
                                                    </div>
                                                    <div className="editorBoard">
                                                        <Draft editorState={this.state.editorState} 
                                                            onChange={(editorState) => this.onChange(editorState)}
                                                            auth={this.props.match.params.id}
                                                            autoSave={this.autoSave}
                                                            type={'blog'}
                                                            />
                                                    </div>
                                                </div>
                                            </div>
                                            </GridItem>
                                        </GridContainer>
                                    </CardBody>
                                </Card>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <Card>
                                        <CardBody>
                                            <div className="optionBoard" >
                                                <div className="options">
                                                    <div>
                                                        <FormControl className="formControl" style={{width: '100%'}}>
                                                            <InputLabel htmlFor="age-simple">카테고리</InputLabel>
                                                            <Select
                                                                value={this.state.category}
                                                                onChange={this.handleChangeCategory}
                                                                inputProps={{
                                                                name: 'age',
                                                                id: 'age-simple',
                                                                }}
                                                            >
                                                                <MenuItem value="none" 
                                                                style={{width: '100%'}}>
                                                                <em>없음</em>
                                                                </MenuItem>
                                                                {this.renderCategoryMenu()}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                            checked={this.state.isPublish}
                                                            onChange={this.changePlanStatus}
                                                            color="primary"
                                                            />
                                                        }
                                                        label="발행용으로 작성합니다."
                                                        className={this.state.isPublish ? 'active' : null}
                                                    />
                                                    { !this.state.isPublish ? (<p>
                                                        같은 내용을 공유해서 다른 사람들에게 편의를 제공하고 싶은 경우에는 '발행용' 으로 작성하시면 됩니다.
                                                    </p>) : (
                                                        <p>
                                                            <MaterialInput type="text" label="발간시 제목" className="inputTitle" style={{width: '100%'}} required value={this.state.publish_name} onChange={(event) => this.inputHandlerPublicName(event)}/>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </GridContainer> */}
                    </Grid>
                </div>
            )
        } else {
            renderView = <Loading />
        }

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose}/>
            )
        } else {
            errorMessage = null;
        }

        
        let savedMassage = null;
        if(this.state.saved) {
            savedMassage = (<Toast error={true} errorMessage={'자동 저장됨.'} handleClose={this.handleClose} />);
        } else {
            savedMassage = null;
        }

        return (
            <Aux>
                {renderView}
                {errorMessage}
                {savedMassage}
           </Aux>
        )
    }
}

function mapStateToProps( { auth }) {
    return {auth}
}

export default connect(mapStateToProps)(EditBlog);