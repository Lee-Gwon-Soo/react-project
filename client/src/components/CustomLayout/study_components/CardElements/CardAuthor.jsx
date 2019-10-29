import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

class CardAuthor extends React.Component {
  render() {
    return (
      <div className="author">
        <a href={this.props.link ? this.props.link : "#"} onClick={this.props.onClick}>
          <img
            className="avatar border-gray"
            src={this.props.avatar}
            alt={this.props.avatarAlt}
          />
        </a>
        <h5 className="title" style={{color: '#f96332'}}>{this.props.title}</h5>
        <p className="description">{this.props.description}</p>
      </div>
    );
  }
}

CardAuthor.propTypes = {
  // Where the user to be redirected on clicking the avatar
  link: PropTypes.string,
  avatar: PropTypes.string,
  avatarAlt: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default CardAuthor;
