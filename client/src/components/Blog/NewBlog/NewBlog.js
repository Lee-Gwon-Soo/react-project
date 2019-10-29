import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import Loading from '../../Shared/Loading/Loading';
import Toast from '../../Shared/Toast/Toast';
import Aux from '../../../HOC/Aux';

import './NewBlog.css';
import {EditorState, convertToRaw} from 'draft-js';
import MaterialInput from '../../form/Input/MaterialInput';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    cardCategoryWhite: {
      color: "rgba(0,0,0,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#000000",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    }
  };

class NewBlog extends Component {
    state = {
        title:'',
        isLoading:true,
        editorState: EditorState.createEmpty(),
        isPublish: false,
        isMain: false,
        publish_name: '',
        error: false,
        errorMessage: '',
        isSaving: false,
        category: '',
        CategoryList: [],
    }

    componentDidMount() {
        if( this.props.auth.id ) {
            axios.get('/api/blog/getCategoryList/'+this.props.auth.id)
                .then((response) => {
                    const data = response.data;
                    if(data.status) {
                        const tempList = [...data.data];
                        
                        this.setState(function(state, props){
                            return {
                                isLoading: false,
                                CategoryList: tempList
                            }
                        });
                    } else {
                        this.props.history.replace('/dashboard');
                    }
                 })
                .catch(error => {
                    console.log(error);
                })
        } 
    }

    // On change, update the app's React state with the new editor value.
    
    onChange = (editorState) => {
        
        this.setState({ editorState });

        if( this.state.title !== '') {
            this.setState(function(state,props){
                return {isSaving: true}
            })
            setTimeout(this.autoSave, 400);
        } 
    };


   resetTimeout = (id, newID) => {
        clearTimeout(id)
        return newID;
    }

    autoSave = () => {
        this.saveNewBlog('auto');
    }

    saveNewBlog = async (mode) => {
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

        const editorState = this.state.editorState;
        var value = convertToRaw(editorState.getCurrentContent());
       
        const basicImage = this.getMainImage(value);

        const content = JSON.stringify(value);

        const body = {
            title: this.state.title,
            category: this.state.category,
            content:content,
            isMain: this.state.isMain,
            basicImage:basicImage,
            isPublish: this.state.isPublish,
            publish_name: this.state.publish_name,
        }

        const res = await axios.post('/api/blog/saveBlog/'+this.props.auth.id, body);

        // this.setState(function(state, props){
        //     return {
        //         isLoading: false
        //     }
        // });

        if(res.data.status === true ) {
            this.props.history.replace("/blog/post/"+res.data.data._id+'/edit');
        } else {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: res.data.message
                };
            })
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

    toogleTopItem = () => {
        this.setState(function(state, props) {
            return {
                isMain: !state.isMain
            }
        });
    }

    renderCategoryMenu = () => {
        let categoryArray = [];
        for(let key in this.state.CategoryList) {
            categoryArray.push({
                id: key,
                element: this.state.CategoryList[key]
            })
        }

        return categoryArray.map(element => {
            return (
                <MenuItem value={element.element._id} key={element.id}>{element.element.title}</MenuItem>
            )
        })
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    handleChangeCategory = (event) => {
        const value = event.target.value;
        this.setState(function(state,props){
            return {
                category: value
            }
        });
    }

    render() {
        const {classes} = this.props;
        let renderView = null;
        if( !this.state.isLoading ) {
            renderView = (
                <Grid container spacing={8} justify="center">
                    <Grid item xm={12} sm={10}>
                        <Paper className="NewBlog">
                            <div className="mainBoard">
                                <section style={{padding: '10px 0px'}}>
                                    <Typography variant="h5" component="h3">
                                        어떤 내용을 작성하고 싶으신가요?
                                    </Typography>
                                    <Typography component="p">
                                        작성하기 전에 먼저 제목과 카테고리를 선택해주세요.
                                    </Typography>
                                </section>
                                <div style={{ height: '1px', width: '60%', background: '#eeeeee'}}></div>
                                <div className="titlePart">
                                    <MaterialInput className="inputTitle" type="text" label="제목" id="title" required value={this.state.title} onChange={(event) => this.inputHandler(event)}/>
                                </div>
                                <div className="optionBoard">
                                    <div className="options">
                                        <FormControl className="formControl">
                                            <InputLabel htmlFor="age-simple">카테고리</InputLabel>
                                            <Select
                                                value={this.state.category}
                                                onChange={this.handleChangeCategory}
                                                inputProps={{
                                                name: 'cateogry',
                                                id: 'age-simple',
                                                }}
                                            >
                                                {this.renderCategoryMenu()}
                                            </Select>
                                        </FormControl>
                                        <div>
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            checked={this.state.isMain}
                                            onChange={this.toogleTopItem}
                                            value="isMain"
                                            color="primary"
                                            />
                                        }
                                        label="Main 블로그로 선정합니다."
                                        style={{marginTop: '20px'}}
                                        className={this.state.isMain ? 'active' : null}
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            checked={this.state.isPublish}
                                            onChange={this.changePlanStatus}
                                            value="isPublish"
                                            color="primary"
                                            />
                                        }
                                        label="발행용으로 작성합니다."
                                        style={{marginTop: '20px'}}
                                        className={this.state.isPublish ? 'active' : null}
                                        />
                                        </div>
                                        { !this.state.isPublish ? (<p>
                                            같은 내용을 공유해서 다른 사람들에게 편의를 제공하고 싶은 경우에는 '발행용' 으로 작성하시면 됩니다.
                                        </p>) : (
                                            <p>
                                                <MaterialInput type="text" label="발간시 제목" style={{width: '100%'}} required value={this.state.publish_name} onChange={(event) => this.inputHandlerPublicName(event)} />
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button variant="contained" color="primary" className="writeButton"  
                                    onClick={() => this.saveNewBlog('save')}>
                                    글 쓰기
                                </Button>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                // <div>
                //     <GridContainer justify="center">
                //         <GridItem xs={12} sm={12} md={8}>
                //         <Card>
                //             <CardHeader color="warning">
                //                 <h3 className={classes.cardTitleWhite}>새로운 스토리를 시작합니다!</h3>
                //             </CardHeader>
                //             <CardBody>
                //             <GridContainer>
                //                 <GridItem xs={12} sm={12} >
                //                 <div className="NewBlog">
                //                     <div className="mainBoard">
                //                         <div className="titleBoard">
                //                             <MaterialInput className="inputTitle" type="text" label="제목" id="title" required value={this.state.title} onChange={(event) => this.inputHandler(event)}/>
                //                         </div>
                //                         <div className="optionBoard">
                //                             <div className="options">
                //                                 <FormControl className="formControl">
                //                                     <InputLabel htmlFor="age-simple">카테고리</InputLabel>
                //                                     <Select
                //                                         value={this.state.category}
                //                                         onChange={this.handleChangeCategory}
                //                                         inputProps={{
                //                                         name: 'cateogry',
                //                                         id: 'age-simple',
                //                                         }}
                //                                     >
                //                                         {this.renderCategoryMenu()}
                //                                     </Select>
                //                                 </FormControl>
                //                                 <div>
                //                                 <FormControlLabel
                //                                 control={
                //                                     <Checkbox
                //                                     checked={this.state.isMain}
                //                                     onChange={this.toogleTopItem}
                //                                     value="isMain"
                //                                     color="primary"
                //                                     />
                //                                 }
                //                                 label="Main 블로그로 선정합니다."
                //                                 style={{marginTop: '20px'}}
                //                                 className={this.state.isMain ? 'active' : null}
                //                                 />
                //                                 <FormControlLabel
                //                                 control={
                //                                     <Checkbox
                //                                     checked={this.state.isPublish}
                //                                     onChange={this.changePlanStatus}
                //                                     value="isPublish"
                //                                     color="primary"
                //                                     />
                //                                 }
                //                                 label="발행용으로 작성합니다."
                //                                 style={{marginTop: '20px'}}
                //                                 className={this.state.isPublish ? 'active' : null}
                //                                 />
                //                                 </div>
                //                                 { !this.state.isPublish ? (<p>
                //                                     같은 내용을 공유해서 다른 사람들에게 편의를 제공하고 싶은 경우에는 '발행용' 으로 작성하시면 됩니다.
                //                                 </p>) : (
                //                                     <p>
                //                                         <MaterialInput type="text" label="발간시 제목" style={{width: '100%'}} required value={this.state.publish_name} onChange={(event) => this.inputHandlerPublicName(event)} />
                //                                     </p>
                //                                 )}
                //                                 <Button variant="contained" color="primary" className="wrtieButton" 
                //                                     onClick={() => this.saveNewBlog('save')}>
                //                                     글 쓰기
                //                                 </Button>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </div>
                //                 </GridItem>
                //             </GridContainer>
                //             </CardBody>
                //         </Card>
                //         </GridItem>
                //     </GridContainer>
                // </div>
                
            )
        } else {
            renderView = <Loading />
        }

        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose} />
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

function mapStateToProps( { auth }) {
    return {auth}
}

export default connect(mapStateToProps)(withStyles(styles)(NewBlog));