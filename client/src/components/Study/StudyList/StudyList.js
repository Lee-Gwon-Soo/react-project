import React from "react";
import { Row } from "reactstrap";
import { connect } from "react-redux";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import LinearLoading from "../../Shared/LinearLoading/LinearLoading";
import Aux from "../../../HOC/Aux";
import StudyCard from "./StudyCard";
import * as actions from "../../../actions";

class StudyList extends React.Component {
  state = {
    studyList: [],
    requestId: 1,
    isLoading: true
  };

  componentDidMount() {
    if (this.props.auth.id) {
      axios.get("/api/study/getList/" + this.props.auth.id).then(response => {
        const res = response.data;
        if (res.status) {
          const list = res.data;
          this.setState(function(state, props) {
            return {
              isLoading: false,
              studyList: list._studies
            };
          });

          document.getElementById('title').innerHTML = 'M-KEYWORD';
        } else{
          this.props.history.push('/login');
        }
      });
    } else {
      this.props.history.push('/login');
    }
  }

  renderView = () => {
    if (this.state.isLoading) {
      return <LinearLoading open={this.state.isLoading}/>;
    } else {
      return (
        <div>
          <Grid className="content" container justify="center">
            <Grid item xs={12}  style={{marginTop: '15px'}}>
              <Grid container spacing={16}>
                {this.state.studyList.length > 0 ? (
                  this.state.studyList.map((item, index) => {
                    return (
                      <StudyCard
                        element={item}
                        gotoDetail={() =>
                          this.props.history.push(
                            "/study/dashboard/detail/" + item._id
                          )
                        }
                        key={"studyitem_" + index}
                      />
                    );
                  })
                ) : (
                  <div style={{ marginTop: "30px" }}>
                    아직 등록된 스터디가 없습니다.
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
  };
  render() {
    return <Aux>{this.renderView()}</Aux>;
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(StudyList);
