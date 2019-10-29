import React, { Component } from 'react';
import Aux from '../../HOC/Aux';

class EmptyLayout extends Component {
  render() {
    return (
      <Aux>
        {this.props.children}
      </Aux>
    );
  }
}
export default EmptyLayout;