import shipperApi from 'api/shipperApi';
import { FastField, Formik } from 'formik';
import KTImageInput from 'general/components/OtherKeenComponents/FileUpload/KTImageInput';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import AppConfigs from 'general/constants/AppConfigs';
import AppResource from 'general/constants/AppResource';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListShipper } from '../../shipperSlice';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';

ModalShipperEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshShipperList: PropTypes.func,
  shipperItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalShipperEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshShipperList: null,
  shipperItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshShipperList: function,
 * shipperItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalShipperEdit(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onRefreshShipperList, shipperItem, onExistDone } = props;
  const isEditMode = !_.isNull(shipperItem);
  const postOffice = useSelector((state) => state?.postOffice?.postOffices);

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

  // Request create new shipper
  async function requestCreateShipper(values) {
    try {
      let params = { ...values };
      const res = await shipperApi.createShipper(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListShipper(Global.gFiltersShipperList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Request update new shipper
  async function requestUpdateShipper(values) {
    try {
      let params = { ...values };
      const res = await shipperApi.updateShipper(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListShipper(Global.gFiltersShipperList));
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
          shipperId: shipperItem ? shipperItem.shipperId : '',
          shipperName: shipperItem ? shipperItem.shipperName : '',
          shipperPhone: shipperItem ? shipperItem.shipperPhone : '',
          postOfficeId: shipperItem ? shipperItem.postOfficeId : '',
          avatar: shipperItem ? shipperItem.avatar : '',
          avatarLink: shipperItem ? Utils.getFullUrl(shipperItem.shipperImage) : '',
        }}
        validationSchema={Yup.object({
          shipperName: Yup.string().required(t('Required')),
          shipperPhone: Yup.string().required(t('Required')),
          postOfficeId: Yup.string().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          if (isEditMode) {
            requestUpdateShipper(values);
          } else {
            requestCreateShipper(values);
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
                <Modal.Title>{shipperItem ? t('EditShipper') : t('NewShipper')}</Modal.Title>
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
                                  //   Utils.validateImageFile(file);
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
                    {/* shipperName */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Fullname')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="shipperName"
                        inputElement={
                          <FastField name="shipperName">
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
                                // disabled={!canEdit}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                    {/* shipperPhone */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Phone')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="shipperPhone"
                        inputElement={
                          <FastField name="shipperPhone">
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
                    {/* postOfficeId */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('PostOffice')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="postOfficeId"
                        inputElement={
                          <FastField name="postOfficeId">
                            {({ field, form, meta }) => (
                              <KTFormSelect
                                disabled={isEditMode}
                                name={field.name}
                                isCustom
                                options={[{ name: '', value: '' }].concat(
                                  postOffice?.map((item) => {
                                    return {
                                      name: item.postOfficeName,
                                      value: item.postOfficeId.toString(),
                                    };
                                  })
                                )}
                                value={field.value?.toString()}
                                onChange={(newValue) => {
                                  form.setFieldValue(field.name, newValue);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
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

export default ModalShipperEdit;
