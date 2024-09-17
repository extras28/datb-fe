import Utils from 'general/utils/Utils';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SearchBarNoFormik from '../SearchBarNoFormik';

KeenSelectOption.propTypes = {
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  fieldProps: PropTypes.object,
  fieldMeta: PropTypes.object,
  fieldHelpers: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  options: PropTypes.array,
  containerClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  selectClassName: PropTypes.string,
  onValueChanged: PropTypes.func,
  searchable: PropTypes.bool,
  footerEl: PropTypes.element,
  menuClassName: PropTypes.string,
};

KeenSelectOption.defaultProps = {
  label: '',
  initialValue: '',
  disabled: false,
  text: '',
  options: [],
  containerClassName: 'form-group row',
  labelClassName: 'col-xl-2 col-lg-3',
  selectClassName: 'col-lg-2',
  onValueChanged: null,
  searchable: false,
  footerEl: null,
  menuClassName: 'w-100',
};

function KeenSelectOption(props) {
  // MARK: --- Params ---
  const {
    fieldProps,
    initialValue,
    fieldMeta,
    fieldHelpers,
    name,
    label,
    disabled,
    text,
    options,
    containerClassName,
    labelClassName,
    selectClassName,
    onValueChanged,
    searchable,
    footerEl,
    menuClassName,
  } = props;
  const value = fieldProps?.value ?? initialValue;
  const { t } = useTranslation();
  const [dropdownValue, setDropdownValue] = useState(t('NoChoose'));
  const [searchText, setSearchText] = useState('');
  const refOptionMenu = useMemo(() => {
    let filteredOptions = options;
    if (searchable) {
      filteredOptions = _.filter(options, (item) => {
        const itemName = Utils.removeVietnameseTones(item?.name).toLowerCase();
        return itemName?.includes(Utils.removeVietnameseTones(searchText).toLowerCase());
      });
    }
    return (
      <>
        {filteredOptions.map((item, index) => {
          return (
            <Dropdown.Item
              key={index}
              value={item.value}
              onClick={() => {
                setDropdownValue(item.text ?? item.name);
                handleOptionChanged(item.value);
              }}
              className={`d-flex flex-row align-items-center border-top border-light ${
                index === 0 ? 'border-top-0' : ''
              }`}
            >
              {item?.avatar && (
                <div
                  className={`w-40px h-40px rounded-circle overflow-hidden shadow border ${
                    item.value === value ? 'border-primary' : 'border-light'
                  } mr-2`}
                >
                  <img
                    className="w-100 h-100"
                    style={{
                      objectFit: 'cover',
                    }}
                    src={Utils.getFullUrl(item?.avatar)}
                  />
                </div>
              )}
              <div className="d-flex align-items-center justify-content-between flex-grow-1">
                <span
                  style={{
                    whiteSpace: 'normal',
                  }}
                  className={`${
                    // item.text === dropdownValue || item.name === dropdownValue
                    item.value === value ? 'text-primary' : ''
                  }`}
                >
                  {t(item.text ?? item.name)}
                </span>
                {
                  /*item.text === dropdownValue || item.name === dropdownValue*/ item.value ===
                    value && <i className="far fa-check text-primary ml-4"></i>
                }
              </div>
            </Dropdown.Item>
          );
        })}
      </>
    );
  }, [options, searchText, searchable]);

  // console.log({ fieldHelpers, fieldMeta, fieldProps });
  const showError = fieldMeta?.touched && fieldMeta?.error;
  const sError = fieldMeta?.error;

  useEffect(() => {
    if (value === '') {
      setDropdownValue(t('NoChoose'));
    } else {
      setDropdownValue(
        (options.find((item) => item.value === value)?.text ??
          options.find((item) => item.value === value)?.name) ||
          dropdownValue
      );
    }
  }, [value]);

  // MARK: --- Functions ---
  function handleOptionChanged(e) {
    fieldHelpers?.setValue(e);
    if (onValueChanged) {
      onValueChanged(e);
    }
  }

  useEffect(() => {
    setDropdownValue(
      (options.find((item) => item.value === value)?.text ??
        options.find((item) => item.value === value)?.name) ||
        dropdownValue
    );
  }, [value]);

  return (
    <div className={` ${containerClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className={`col-form-label text-left text-xl-right ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className={`${selectClassName}`}>
        <Dropdown>
          <Dropdown.Toggle
            id={name}
            disabled={disabled}
            className={`cursor-pointer border shadow-none d-flex align-items-center justify-content-between ${
              showError ? 'is-invalid' : ''
            } w-100`}
            multiple={fieldProps?.multiple}
            value={value}
            variant=""
          >
            {t(`${dropdownValue}`)}
          </Dropdown.Toggle>

          <Dropdown.Menu className={menuClassName}>
            {searchable && (
              <SearchBarNoFormik
                name={`${name}_searchbar`}
                value={searchText}
                placeholder={`${t('TypeToSearch')}...`}
                onSubmit={({ searchTerm }) => setSearchText(searchTerm)}
                containerStyle="mr-0 w-100 mx-4 my-2"
              />
            )}
            <div className="overflow-auto max-h-300px">
              {searchable
                ? refOptionMenu
                : options.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        value={item.value}
                        onClick={() => {
                          setDropdownValue(item.text ?? item.name);
                          handleOptionChanged(item.value);
                        }}
                        className={`d-flex flex-row align-items-center justify-content-between border-top border-light w-100 ${
                          index === 0 ? 'border-top-0' : ''
                        }`}
                      >
                        <span
                          style={{
                            whiteSpace: 'normal',
                          }}
                          className={`${
                            item.text === dropdownValue || item.name === dropdownValue
                              ? 'text-primary'
                              : ''
                          }`}
                        >
                          <div>
                            {t(item.text ?? item.name)}
                            {item?.subName && (
                              <div className="font-size-sm font-italic text-dark-50">
                                {item?.subName}
                              </div>
                            )}
                          </div>
                        </span>
                        {(item.text === dropdownValue || item.name === dropdownValue) && (
                          <i className="far fa-check text-primary"></i>
                        )}
                      </Dropdown.Item>
                    );
                  })}
            </div>
            {footerEl && footerEl}
          </Dropdown.Menu>
        </Dropdown>
        {text.length > 0 && <span className="form-text text-muted">{text}</span>}
        {showError && sError?.length > 0 && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{sError}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KeenSelectOption;
