import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ data }) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {data ? data.title : 'Loading'}
                  <span />
                </h1>
                <p>{data ? data.paragraph : 'Loading'}</p>
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Learn More
                </a>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  data: PropTypes.any
};

export default Header;
