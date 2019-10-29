import React from "react";
import { Container } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid ? true : false}>
          <section style={{display: 'inline-block'}}>
            <ul>
              <li>
                <a href="/study/dashboard/list">mKeyword Study</a>
              </li>
              <li>
                <a href="#">About Study</a>
              </li>
            </ul>
          </section>
          <div className="copyright">
            &copy; {1900 + new Date().getYear()}, copyright@{" "}
            <a
              href="https://www.creative-tim.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              mKeyword
            </a>.
          </div>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
