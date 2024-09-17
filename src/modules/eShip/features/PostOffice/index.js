import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import PostOfficeHomeScreen from './screens/PostOfficeHomeScreen';

PostOffice.propTypes = {};

function PostOffice(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<PostOfficeHomeScreen />} />
    </Routes>
  );
}

export default PostOffice;
