import postOfficeApi from 'api/postOfficeApi';
import { FastField, Formik } from 'formik';
import KTImageInput from 'general/components/OtherKeenComponents/FileUpload/KTImageInput';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import AppConfigs from 'general/constants/AppConfigs';
import AppResource from 'general/constants/AppResource';
// import PostOfficeHelper from 'general/helpers/PostOfficeHelper';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListPostOffice } from '../../postOfficeSlice';
import AppData from 'general/constants/AppData';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import { useState } from 'react';

ModalPostOfficeEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshPostOfficeList: PropTypes.func,
  postOfficeItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalPostOfficeEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshPostOfficeList: null,
  postOfficeItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshPostOfficeList: function,
 * postOfficeItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalPostOfficeEdit(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onRefreshPostOfficeList, postOfficeItem, onExistDone } = props;
  const isEditMode = !_.isNull(postOfficeItem);
  const [isCustom, setIsCustom] = useState(false);

  // MARK: --- Functions ---
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleExistDone() {
    if (onExistDone) {
      onExistDone();
    }
  }

  // Request create new postOffice
  async function requestCreatePostOffice(values) {
    try {
      let params = { ...values };
      const res = await postOfficeApi.createPostOffice(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListPostOffice(Global.gFiltersPostOfficeList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Request update new postOffice
  async function requestUpdatePostOffice(values) {
    try {
      let params = { ...values };
      const res = await postOfficeApi.updatePostOffice(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListPostOffice(Global.gFiltersPostOfficeList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getTheBlobFromAssetsFile(path) {
    try {
      // Step 1: Fetch the file from the public directory
      const response = await fetch(path); // Adjust the path as needed

      // Step 2: Convert the file into a Blob
      const blob = await response.blob();

      return blob;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          postOfficeId: postOfficeItem ? postOfficeItem.postOfficeId : '',
          postOfficeName: postOfficeItem ? postOfficeItem.postOfficeName : '',
          address: postOfficeItem ? postOfficeItem.address : '',
          phone: postOfficeItem ? postOfficeItem.phone : '',
          logo: postOfficeItem ? postOfficeItem.logo : '',
          logoLink: postOfficeItem ? Utils.getFullUrl(postOfficeItem.logo) : '',
        }}
        validationSchema={Yup.object({
          postOfficeName: Yup.string().required(t('Required')),
          phone: Yup.string().required(t('Required')),
          logoLink: Yup.string().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          if (isEditMode) {
            requestUpdatePostOffice(values);
          } else {
            requestCreatePostOffice(values);
          }
        }}
      >
        {(formikProps) => (
          <>
            <Modal
              className=""
              show={show}
              backdrop="static"
              size="lg"
              onHide={handleClose}
              centered
              onExit={() => {
                formikProps.handleReset();
              }}
              onExited={() => {
                handleExistDone();
              }}
              enforceFocus={false}
            >
              <Modal.Header className="px-5 py-5">
                <Modal.Title>
                  {postOfficeItem ? t('EditPostOffice') : t('NewPostOffice')}
                </Modal.Title>
                <div
                  className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <i className="far fa-times"></i>
                </div>
              </Modal.Header>

              <Modal.Body
                className="overflow-auto"
                style={{
                  maxHeight: '70vh',
                }}
              >
                <div>
                  <div className="row">
                    {/* postOffice */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('PostOfficeName')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="PostOfficeName"
                        inputElement={
                          <div>
                            <Dropdown className="w-100 border rounded">
                              <Dropdown.Toggle
                                className={`w-100 d-flex justify-content-${
                                  formikProps.getFieldProps('postOfficeName').value
                                    ? 'between'
                                    : 'end'
                                } align-items-center min-h-35px form-control ${
                                  formikProps.getFieldMeta('postOfficeName').touched
                                    ? `${
                                        _.isEmpty(formikProps.getFieldMeta('postOfficeName').error)
                                          ? 'is-valid'
                                          : 'is-invalid'
                                      }`
                                    : ''
                                }`}
                                variant=""
                              >
                                {formikProps.getFieldProps('postOfficeName').value}
                              </Dropdown.Toggle>

                              <Dropdown.Menu className="w-100">
                                {AppData.postOffices.map((item) => (
                                  <Dropdown.Item
                                    className="d-flex align-items-center justify-content-between"
                                    onClick={() =>
                                      formikProps
                                        .getFieldHelpers('postOfficeName')
                                        .setValue(item.value)
                                    }
                                  >
                                    {item.value}
                                    {formikProps.getFieldProps('postOfficeName').value ==
                                    item.value ? (
                                      <i
                                        class="fa-regular fa-check mr-2"
                                        style={{ color: '#00b505' }}
                                      ></i>
                                    ) : null}
                                  </Dropdown.Item>
                                ))}
                                <div className="px-5 py2 d-flex align-items-center flex-row">
                                  <span className="mr-4">{t('Other')}</span>
                                  <div className="flex-grow-1">
                                    <KTFormInput
                                      name={formikProps.getFieldProps('postOfficeName').name}
                                      value={formikProps.getFieldProps('postOfficeName').value}
                                      onChange={(value) => {
                                        formikProps
                                          .getFieldHelpers('postOfficeName')
                                          .setValue(value);
                                      }}
                                      onBlur={() => {
                                        formikProps
                                          .getFieldHelpers('postOfficeName')
                                          .setTouched(true);
                                      }}
                                      enableCheckValid={false}
                                      isValid={_.isEmpty(
                                        formikProps.getFieldMeta('postOfficeName').error
                                      )}
                                      isTouched={formikProps.getFieldMeta('postOfficeName').touched}
                                      feedbackText={
                                        formikProps.getFieldMeta('postOfficeName').error
                                      }
                                      rows={5}
                                      placeholder={`${_.capitalize(t('PostOfficeName'))}...`}
                                      type={KTFormInputType.text}
                                      // disabled={!canEdit}
                                    />
                                  </div>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>

                            <>
                              {!_.isEmpty(formikProps.getFieldMeta('postOfficeName').error) ? (
                                <div
                                  className={`d-block ${
                                    _.isEmpty(formikProps.getFieldMeta('postOfficeName').error)
                                      ? 'valid-feedback'
                                      : 'invalid-feedback'
                                  }`}
                                >
                                  {formikProps.getFieldMeta('postOfficeName').error}
                                </div>
                              ) : null}
                            </>
                          </div>
                        }
                      />
                    </div>

                    {/* address */}
                    <div className="col-12">
                      <KTFormGroup
                        label={<>{t('Address')}</>}
                        inputName="address"
                        inputElement={
                          <FastField name="address">
                            {({ field, form, meta }) => (
                              <KTFormInput
                                name={field.name}
                                value={field.value}
                                onChange={(value) => {
                                  form.setFieldValue(field.name, value);
                                }}
                                onBlur={() => {
                                  form.setFieldTouched(field.name, true);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
                                rows={5}
                                placeholder={`${_.capitalize(t('Address'))}...`}
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* phone */}

                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Phone')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="phone"
                        inputElement={
                          <FastField name="phone">
                            {({ field, form, meta }) => (
                              <KTFormInput
                                name={field.name}
                                value={field.value}
                                onChange={(value) => {
                                  form.setFieldValue(field.name, value);
                                }}
                                onBlur={() => {
                                  form.setFieldTouched(field.name, true);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
                                rows={5}
                                placeholder={`${_.capitalize(t('Phone'))}...`}
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* logo */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Logo')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="logoLink"
                        inputElement={
                          <FastField name="logoLink">
                            {({ field, form, meta }) => (
                              <KTImageInput
                                name={field.name}
                                value={field.value}
                                onChange={(value) => {
                                  form.setFieldValue(field.name, value);
                                }}
                                onBlur={() => {
                                  form.setFieldTouched(field.name, true);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
                                // defaultImage={AppResource.images.imgDefaultLogo}
                                acceptImageTypes={AppConfigs.acceptImages}
                                onSelectedFile={(file) => {
                                  console.log(file);
                                  //   Utils.validateImageFile(file);
                                  form.setFieldValue('logo', file);
                                }}
                                onRemovedFile={() => {
                                  form.setFieldValue('logo', null);
                                }}
                                additionalClassName=""
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <div className="w-100 d-flex row">
                  <Button
                    className="font-weight-bold flex-grow-1 col mr-3"
                    variant="primary"
                    onClick={() => {
                      formikProps.handleSubmit();
                    }}
                  >
                    {t('Save')}
                  </Button>

                  <Button
                    className="font-weight-bold flex-grow-1 col"
                    variant="secondary"
                    onClick={handleClose}
                  >
                    {t('Close')}
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ModalPostOfficeEdit;
