import React,{ Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props) => {
  return (
    props.auth ? <Route  path={props.path} component={props.component}/> :
    <Redirect from={props.path} to="/dashboard"/>
  )
}


  export default PrivateRoute;
  