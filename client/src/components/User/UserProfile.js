import React from "react";
import { connect } from 'react-redux';
import axios from 'axios';

import Aux from '../../HOC/Aux';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "../CustomLayout/components/Grid/GridItem.jsx";
import GridContainer from "../CustomLayout/components/Grid/GridContainer.jsx";
import CustomInput from "../CustomLayout/components/CustomInput/CustomInput.jsx";
import Button from "../CustomLayout/components/CustomButtons/Button.jsx";
import Card from "../CustomLayout/components/Card/Card.jsx";
import CardHeader from "../CustomLayout/components/Card/CardHeader.jsx";
import CardAvatar from "../CustomLayout/components/Card/CardAvatar.jsx";
import CardBody from "../CustomLayout/components/Card/CardBody.jsx";
import CardFooter from "../CustomLayout/components/Card/CardFooter.jsx";
import Snackbar from "../CustomLayout/components/Snackbar/Snackbar.jsx";

import avatar from "../../assets/img/faces/marc.jpg";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class UserProfile extends React.Component {
    state = {
        isLoading: true,
        info: {},
        showSnack: false,
        snackMessage: ''
    }
    componentDidMount() {
        if(this.props.auth.id) {
            axios.get('/api/auth/getUserInfo/'+this.props.auth.id)
                .then(response => {
                    const data = response.data;
                    if(data.status) {
                        this.setState(function(state, props){
                            return {
                                info: data.data,
                                isLoading: false,
                            }
                        });
                    }
                })
        }
    }

    changeValue = (event, initiator) => {
        const value = event.target.value;
        const info = {...this.state.info};
        info[initiator] = value;
        this.setState(function(state,props){
            return {
                info:info
            }
        })
    }

    updateProfile = () => {
        axios.post('/api/auth/modifyUser', this.state.info)
            .then(response => {
                const data = response.data;
                if(data.status) {
                    this.showNotification("개인정보가 정상적으로 수정되었습니다.");
                }
            })
    }
    showNotification(msg) {
        this.setState(function(state, props){
            return {
                snackMessage:msg,
                showSnack: true,
            }
        });
        this.alertTimeout = setTimeout(
          function() {
            this.setState(function(state, props){
                return {
                    showSnack: false,
                }
            });
          }.bind(this),
          6000
        );
      }

    renderView = () => {
        if(this.state.isLoading) {
            return null;
        } else {
            const { classes } = this.props;
            return (
                <div>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={8}>
                        <Card>
                            <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>나의 정보 수정</h4>
                            <p className={classes.cardCategoryWhite}>자신의 정보를 상세하게 수정하세요.</p>
                            </CardHeader>
                            <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={5}>
                                <CustomInput
                                    labelText="이메일"
                                    id="email"
                                    formControlProps={{
                                    fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.email,
                                        readOnly: true
                                    }}
                                />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={3}>
                                <CustomInput
                                    labelText="이름"
                                    id="name"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.name,
                                        onChange: (event) => this.changeValue(event, 'name')
                                    }}
                                />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    labelText="전화번호"
                                    id="tel_no"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.tel_no,
                                        onChange: (event) => this.changeValue(event, 'tel_no')
                                    }}
                                />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    labelText="직장(학교)"
                                    id="belongto"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.belongto,
                                        onChange: (event) => this.changeValue(event, 'belongto')
                                    }}
                                />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    labelText="직책(학년)"
                                    id="position"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.position,
                                        onChange: (event) => this.changeValue(event, 'position')
                                    }}
                                />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    labelText="직업"
                                    id="job"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.job,
                                        onChange: (event) => this.changeValue(event, 'job')
                                    }}
                                />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12}>
                                <CustomInput
                                    labelText="주소"
                                    id="address"
                                    formControlProps={{
                                    fullWidth: true
                                    }}
                                    inputProps={{
                                        value :this.state.info.address,
                                        onChange: (event) => this.changeValue(event, 'address')
                                    }}
                                />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                <CustomInput
                                    labelText="비밀번호"
                                    id="password"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: 'password',
                                    }}
                                />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                <CustomInput
                                    labelText="비밀번호 확인"
                                    id="password_confirm"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: 'password',
                                    }}
                                />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                <CustomInput
                                    labelText="자신을 간단하게 소개해주세요."
                                    id="about-me"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        multiline: true,
                                        rows: 3,
                                        value :this.state.info.intro,
                                        onChange: (event) => this.changeValue(event, 'intro')
                                    }}
                                />
                                </GridItem>
                            </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <Button color="primary" onClick={this.updateProfile}>저장</Button>
                            </CardFooter>
                        </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                        <Card profile>
                            <CardAvatar profile>
                            <a href="#pablo" onClick={e => e.preventDefault()}>
                                <img src={avatar} alt="..." />
                            </a>
                            </CardAvatar>
                            <CardBody profile>
                            <h6 className={classes.cardCategory}>{this.state.info.belongto} / {this.state.info.job}</h6>
                            <h4 className={classes.cardTitle}>{this.state.info.name}</h4>
                            <p className={classes.description} style={{whiteSpace: 'pre-line'}}>
                                {this.state.info.intro}
                            </p>
                            <Button color="primary" round>
                                Follow
                            </Button>
                            </CardBody>
                        </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            )
        }
    }

    render(){
        return (
            <Aux>
                {this.renderView()}
                <Snackbar
                    place="br"
                    color="success"
                    icon={AddAlert}
                    message={this.state.snackMessage}
                    open={this.state.showSnack}
                    closeNotification={() => this.setState({ showSnack: false })}
                    close
                  />
            </Aux>
        );
    }
}

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(UserProfile));
