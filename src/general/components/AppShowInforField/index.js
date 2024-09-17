import React from 'react';
import PropTypes from 'prop-types';

AppShowInforField.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  additionalClassName: PropTypes.string,
  fieldBackGround: PropTypes.string,
  additionalContentClassName: PropTypes.string,
};

AppShowInforField.defaultProps = {
  label: '',
  content: '',
  additionalClassName: '',
  fieldBackGround: 'light',
  additionalContentClassName: '',
};

function AppShowInforField(props) {
  const { label, content, additionalClassName, fieldBackGround, additionalContentClassName } =
    props;
  return (
    <div className={`mb-5 ${additionalClassName}`}>
      <p className="mb-2">{label}</p>
      <div
        className={`border bg-${fieldBackGround} rounded p-2 ${
          content ? '' : 'text-muted font-italic'
        } ${additionalContentClassName}`}
        style={{ minHeight: '35px' }}
      >
        {content ? content : label}
      </div>
    </div>
  );
}

export default AppShowInforField;
