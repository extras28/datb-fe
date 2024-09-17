import React from 'react';
import PropTypes from 'prop-types';
import AppResource from 'general/constants/AppResource';

AuthenticationBaseLayout.propTypes = {};

function AuthenticationBaseLayout(props) {
  // --- params: ---
  const { children } = props;
  return (
    <div className="row min-vh-100 m-0">
      <div
        className="col-6 justify-content-center align-items-center d-none d-md-flex"
        style={{ backgroundColor: 'rgba(255, 250, 237, 1)' }}
      >
        <div
          style={{
            backgroundImage: `url(${AppResource.images.imgAuthenticationBg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '580/633',
            width: '70%',
          }}
        ></div>
      </div>
      <div className="col-md-6 col-12 p-0 bg-white d-flex">
        <img
          className="position-fixed bottom-0 d-block d-md-none w-100"
          src={AppResource.images.imgAuthenticationBgMobile}
        />
        {children}
      </div>
    </div>
  );
}

export default AuthenticationBaseLayout;
