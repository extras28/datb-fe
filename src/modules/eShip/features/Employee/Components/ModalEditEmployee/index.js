import employeeApi from 'api/employeeApi';
import { FastField, Formik } from 'formik';
import KTImageInput from 'general/components/OtherKeenComponents/FileUpload/KTImageInput';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import AppConfigs from 'general/constants/AppConfigs';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListEmployee } from '../../employeeSlice';
import AppResource from 'general/constants/AppResource';

ModalEmployeeEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshEmployeeList: PropTypes.func,
  employeeItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalEmployeeEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshEmployeeList: null,
  employeeItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshEmployeeList: function,
 * employeeItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalEmployeeEdit(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onRefreshEmployeeList, employeeItem, onExistDone } = props;
  const isEditMode = !_.isNull(employeeItem);

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

  // Request create new employee
  async function requestCreateEmployee(values) {
    try {
      let params = { ...values };
      params.password = Utils.sha256(params.password);
      const res = await employeeApi.createEmployee(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListEmployee(Global.gFiltersEmployeeList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Request update new employee
  async function requestUpdateEmployee(values) {
    try {
      let params = { ...values };
      const res = await employeeApi.updateEmployee(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListEmployee(Global.gFiltersEmployeeList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          accountId: employeeItem ? employeeItem.accountId : '',
          username: employeeItem ? employeeItem.username : '',
          fullname: employeeItem ? employeeItem.fullname : '',
          phone: employeeItem ? employeeItem.phone : '',
          address: employeeItem ? employeeItem.address : '',
          password: employeeItem ? employeeItem.password : '',
          avatar: employeeItem ? employeeItem.avatar : '',
          avatarLink: employeeItem
            ? Utils.getFullUrl(employeeItem.logo)
            : AppResource.images.imgDefaultAvatar,
          email: employeeItem ? employeeItem.email : '',
        }}
        validationSchema={Yup.object({
          username: Yup.string().required(t('Required')),
          fullname: Yup.string().required(t('Required')),
          password: isEditMode
            ? null
            : Yup.string()
                .required(t('Required'))
                .min(6, t('ThePasswordMustContainAtLeast6Characters'))
                .matches(/^\S*$/, t('ThePasswordMustNotContainWhitespace')),
          phone: Yup.string().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          if (isEditMode) {
            requestUpdateEmployee(values);
          } else {
            requestCreateEmployee(values);
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
                <Modal.Title>{employeeItem ? t('EditEmployee') : t('NewEmployee')}</Modal.Title>
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
                    {/* email */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Email')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="email"
                        inputElement={
                          <FastField name="email">
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
                                placeholder={`${_.capitalize(t('Email'))}...`}
                                type={KTFormInputType.text}
                                // disabled={!canEdit}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                    {/* username */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Username')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="username"
                        inputElement={
                          <FastField name="username">
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
                                placeholder={`${_.capitalize(t('Username'))}...`}
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* password */}
                    {!isEditMode ? (
                      <div className="col-12">
                        <KTFormGroup
                          label={
                            <>
                              {t('Password')} <span className="text-danger">(*)</span>
                            </>
                          }
                          inputName="password"
                          inputElement={
                            <FastField name="password">
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
                                  placeholder={`${_.capitalize(t('Password'))}...`}
                                  type={KTFormInputType.password}
                                />
                              )}
                            </FastField>
                          }
                        />
                      </div>
                    ) : null}

                    {/* avatar */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Avatar')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="avatarLink"
                        inputElement={
                          <FastField name="avatarLink">
                            {({ field, form, meta }) => (
                              <KTImageInput
                                name={field.name}
                                value={field.value}
                                onChange={(value) => {
                                  form.setFieldValue(field.name, value);
                                }}
                                onFocus={() => {
                                  form.setFieldTouched(field.name, true);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
                                // defaultImage={AppResource.images.imgDefaultAvatar}
                                acceptImageTypes={AppConfigs.acceptImages}
                                onSelectedFile={(file) => {
                                  form.setFieldValue('avatar', file);
                                }}
                                onRemovedFile={() => {
                                  form.setFieldValue('avatar', null);
                                }}
                                additionalClassName=""
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* fullname */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Fullname')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="fullname"
                        inputElement={
                          <FastField name="fullname">
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
                                placeholder={`${_.capitalize(t('Fullname'))}...`}
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
                                type={KTFormInputType.telephone}
                              />
                            )}
                          </FastField>
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

export default ModalEmployeeEdit;
