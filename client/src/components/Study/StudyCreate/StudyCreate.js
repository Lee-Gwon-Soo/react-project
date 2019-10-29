import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Row, Col, Button } from "reactstrap";

import { FormInputs, CardAuthor } from "../../CustomLayout/study_components";
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import DataLoading from '../../Shared/DataLoading/DataLoading';
import Aux from '../../../HOC/Aux';

import userBackground from "../../../assets/study/img/bg5.jpg";
import userAvatar from "../../../assets/study/img/mike.jpg";

class StudyCreate extends React.Component {
    state = {
        form: {
            name: '',
            field: '',
            email: '',
            place: '',
            memCount: 2,
            period: 4,
            img_path: '',
            sessionTime:2,
            intro: '',
        },
        showSnack: false,
        snackMessage: '',
        isLoading: false,
    }

    handlerInput = (event, identifier) => {
        const form = {...this.state.form};
        form[identifier] = event.target.value;
        this.setState(function(state, props) {
            return {
                form : form
            }
        })
    }

    startInsertImage = (e) => {
        this.refs.bookImage.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/study/imageUpload/'+this.props.auth.id, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.bookImage.value='';
                }
            })
            .catch(error => {
                console.log(error);
                this.showAlarm('스터디 사진 업로드에 문제가 생겼습니다.');
            })
    }

    insertImage = (url) => {
        const form = {...this.state.form};
        form.img_path = url;
        this.setState(function(state,props){
            return {
                form:form
            }
        });
        this.showAlarm('스터디 사진 업로드에 성공했습니다.');
    }

    showAlarm = (msg) => {
        this.setState(function(state,props){
            return {
                showSnack: true,
                snackMessage: msg
            }
        });

        setTimeout( () => {
            this.setState(function(state,props){
                return {
                    showSnack: false,
                    snackMessage: ''
                }
            });
        },5000);
    }

    createStudy = () => {
        this.setState(function(state,props) {
            return {
                isLoading: true,
            }
        });

        axios.post('/api/study/create/'+this.props.auth.id, this.state.form)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.props.history.push('/study/dashboard/list');
                } else {
                    this.showAlarm(res.message);
                }

                this.setState(function(state,props) {
                    return {
                        isLoading: false,
                    }
                });
            })
            .catch(error => {
                this.showAlarm(error);
                console.log(error);
            })
    }
    renderView = () => {
        if(this.state.isLoading) {
            return <DataLoading />;
        } else {
            return (
                <div>
                    <div className="content">
                        <Row>
                            <Col md={8} xs={12}>
                            <Card>
                                <CardHeader>
                                <h5 className="title">새로운 스터디를 시작해보세요!</h5>
                                <span>끊임없이 배우는 것은 심신에 좋습니다.</span>
                                </CardHeader>
                                <CardBody>
                                <form>
                                    <FormInputs
                                    ncols={[
                                        "col-md-5 pr-1",
                                        "col-md-3 px-1",
                                        "col-md-4 pl-1"
                                    ]}
                                    proprieties={[
                                        {
                                        label: "스터디 이름",
                                        inputProps: {
                                            type: "text",
                                            placeholder: '스터디 이름',
                                            value: this.state.form.name,
                                            onChange: (event) =>this.handlerInput(event, 'name')
                                        }
                                        },
                                        {
                                        label: "스터디 분야",
                                        inputProps: {
                                            type: "text",
                                            placeholder: 'EX) 영어회화, 중국어...',
                                            value: this.state.form.field,
                                            onChange: (event) =>this.handlerInput(event, 'field')
                                        }
                                        },
                                        {
                                        label: "이메일",
                                        inputProps: {
                                            type: "email",
                                            placeholder: "example@gmail.com",
                                            value: this.state.form.email,
                                            onChange: (event) =>this.handlerInput(event, 'email')
                                        }
                                        }
                                    ]}
                                    />
                                    <FormInputs
                                    ncols={["col-md-12"]}
                                    proprieties={[
                                        {
                                        label: "스터디 장소",
                                        inputProps: {
                                            type: "text",
                                            placeholder: "Study Address",
                                            value: this.state.form.place,
                                            onChange: (event) =>this.handlerInput(event, 'place')
                                        }
                                        }
                                    ]}
                                    />
                                    <FormInputs
                                    ncols={[
                                        "col-md-4 pr-1",
                                        "col-md-4 px-1",
                                        "col-md-4 pl-1"
                                    ]}
                                    proprieties={[
                                        {
                                        label: "참여 인원 수",
                                        inputProps: {
                                            type: "number",
                                            min: 2,
                                            value: this.state.form.memCount,
                                            onChange: (event) =>this.handlerInput(event, 'memCount')
                                        }
                                        },
                                        {
                                        label: "기간 (주)",
                                        inputProps: {
                                            type: "number",
                                            placeholder: "8(8주), 12(12주)",
                                            min: 4,
                                            value: this.state.form.period,
                                            onChange: (event) =>this.handlerInput(event, 'period')
                                        }
                                        },
                                        {
                                        label: "세션당 진행 시간",
                                        inputProps: {
                                            type: "number",
                                            min: 1,
                                            value: this.state.form.sessionTime,
                                            onChange: (event) =>this.handlerInput(event, 'sessionTime')
                                        }
                                        }
                                    ]}
                                    />
                                    <FormInputs
                                    ncols={["col-md-12"]}
                                    proprieties={[
                                        {
                                        label: "About Study",
                                        inputProps: {
                                            type: "textarea",
                                            rows: "10",
                                            style:{maxHeight: '200px'},
                                            cols: "80",
                                            placeholder: "스터디를 소개해 주세요.",
                                            value: this.state.form.intro,
                                            onChange: (event) =>this.handlerInput(event, 'intro')
                                        }
                                        }
                                    ]}
                                    />
                                </form>
                                <Button color="primary" onClick={this.createStudy}>스터디 생성</Button>
                                </CardBody>
                            </Card>
                            </Col>
                            <Col md={4} xs={12}>
                            <Card className="card-user">
                                <div className="image">
                                    <img src={userBackground} alt="..." />
                                </div>
                                <CardBody>
                                <CardAuthor
                                    avatar={this.state.form.img_path === '' ? userAvatar : this.state.form.img_path}
                                    onClick={e => this.startInsertImage(e)}
                                    avatarAlt="..."
                                    title={this.state.form.name}
                                    description={this.state.form.field}
                                />
                                <input type="file" style={{display: 'none'}} ref="bookImage" onChange = {(event) => this.uploadImage(event)} />
                                <p className="description text-center">
                                    총 {this.state.form.period}주<br />
                                    일주일 {this.state.form.sessionTime}시간 <br />
                                    인원 수 {this.state.form.memCount}명
                                </p>
                                <p className="description text-center">
                                    장소 : {this.state.form.place}
                                </p>
                                </CardBody>
                            </Card>
                            </Col>
                        </Row>
                    </div>
                    <Snackbar
                        place="br"
                        color="success"
                        message={this.state.snackMessage}
                        open={this.state.showSnack}
                        closeNotification={() => this.setState({ showSnack: false })}
                        close
                        />
                </div>
            )
        }
    }
    render() {
        return (
        <Aux>
            {this.renderView()}
        </Aux>
        );
    }
}

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(StudyCreate);
