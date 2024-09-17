import receiptApi from 'api/receiptApi';
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
import { thunkGetListReceipt } from '../../receiptSlice';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import moment from 'moment';
import AppData from 'general/constants/AppData';
import KTFormTextArea from 'general/components/OtherKeenComponents/Forms/KTFormTextArea';
import ShipperSignature from '../ShipperSignature';
import { useEffect, useState } from 'react';
import shipperApi from 'api/shipperApi';
import ModalSelectOrder from '../ModalSelectOrder';
import employeeApi from 'api/employeeApi';
import orderApi from 'api/orderApi';

ModalReceiptEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshReceiptList: PropTypes.func,
  receiptItem: PropTypes.object,
  onExistDone: PropTypes.func,
  selectedOrders: PropTypes.array,
};

ModalReceiptEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshReceiptList: null,
  receiptItem: null,
  onExistDone: null,
  selectedOrders: [],
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshReceiptList: function,
 * receiptItem: object,
 * onExistDone: function,
 * selectedOrders: array,
 * }} props
 * @returns
 */
function ModalReceiptEdit(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, receiptItem, onExistDone, selectedOrders } = props;
  const isEditMode = !_.isNull(receiptItem);
  const postOffice = useSelector((state) => state?.postOffice?.postOffices);
  const [showing, setShowing] = useState(true);
  const [shippers, setShippers] = useState([]);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const [orders, setOrders] = useState([]);

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

  async function getListShipper(postOfficeId) {
    const res = await shipperApi.getListShipper({ postOfficeId: postOfficeId });
    setShippers(res.shippers);
  }

  // Request create new receipt
  async function requestCreateReceipt(values) {
    try {
      let params = { ...values };
      params.scanTime = moment().toISOString();
      params.orderIds = `[${params.orderIds}]`;
      const res = await receiptApi.createReceipt(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListReceipt(Global.gFiltersReceiptList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Request update new receipt
  async function requestUpdateReceipt(values) {
    try {
      let params = { ...values };
      params.orderIds = `[${params.orderIds}]`;
      const res = await receiptApi.updateReceipt(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListReceipt(Global.gFiltersReceiptList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getListOrder() {
    const res = await orderApi.getListOrder({
      goodsHandoverReceiptId: receiptItem?.goodsHandoverReceiptId,
    });
    const { result, orders } = res;
    if (result == 'success') {
      setOrders(orders);
    }
  }

  useEffect(() => {
    if (receiptItem?.postOfficeId) {
      getListShipper(receiptItem?.postOfficeId);
    }
  }, [receiptItem]);

  useEffect(() => {
    if (receiptItem?.goodsHandoverReceiptId) {
      getListOrder();
    }
  }, [receiptItem]);

  return (
    <div>
      <Formik
        initialValues={{
          goodsHandoverReceiptId: receiptItem ? receiptItem.goodsHandoverReceiptId : '',
          label: receiptItem ? receiptItem.label : ``,
          description: receiptItem ? receiptItem.description : ``,
          shipperId: receiptItem ? receiptItem.shipperId : '',
          orderIds: receiptItem ? orders.map((item) => item?.orderId) : [],
          postOfficeId: receiptItem ? receiptItem.postOfficeId : '',
          status: receiptItem ? receiptItem.status : AppData.RECEIPT_STATUS.NOT_SEND,
          package: receiptItem ? receiptItem.package : '',
          packageLink:
            receiptItem && receiptItem.deliveredImage
              ? Utils.getFullUrl(receiptItem.deliveredImage)
              : '',
          signature: receiptItem ? receiptItem.signature : '',
          signatureLink: receiptItem ? Utils.getFullUrl(receiptItem.shipperSignature, false) : '',
        }}
        validationSchema={Yup.object({
          // Label: Yup.string().required(t('Required')),
          // postOfficeId: Yup.string().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          if (isEditMode) {
            requestUpdateReceipt(values);
          } else {
            requestCreateReceipt(values);
          }
        }}
      >
        {(formikProps) => (
          <>
            <Modal
              className=""
              show={show && showing}
              backdrop="static"
              size="lg"
              onHide={handleClose}
              centered
              onExit={() => {
                if (!showModalOrder) formikProps.handleReset();
              }}
              onExited={() => {
                if (!showModalOrder) handleExistDone();
              }}
              enforceFocus={false}
            >
              <Modal.Header className="px-5 py-5">
                <Modal.Title>{receiptItem ? t('EditReceipt') : t('NewReceipt')}</Modal.Title>
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
                    {/* postOfficeId */}
                    <div className="mb-4 d-flex flex-column">
                      <label className="mb-2" htmlFor="postOfficeId">
                        {_.capitalize(t('PostOffice'))}
                        <span className="text-danger">(*)</span>
                      </label>
                      <KTFormSelect
                        name="postOfficeId"
                        isCustom
                        options={[{ name: '', value: '' }].concat(
                          postOffice?.map((item) => {
                            return {
                              name: item.postOfficeName,
                              value: item.postOfficeId.toString(),
                            };
                          })
                        )}
                        value={formikProps.getFieldProps('postOfficeId').value?.toString()}
                        onChange={(newValue) => {
                          formikProps.getFieldHelpers('postOfficeId').setValue(newValue);
                          if (!receiptItem?.postOfficeId) {
                            getListShipper(
                              postOffice.find((item) => item.postOfficeId == newValue).postOfficeId
                            );
                          }
                          formikProps
                            .getFieldHelpers('label')
                            .setValue(
                              `Xuất hàng ${
                                postOffice.find((item) => item.postOfficeId == newValue)
                                  .postOfficeName
                              } ngày ${Utils.formatDateTime(moment.now(), 'DD/MM/YYYY')}`
                            );
                        }}
                      />
                    </div>

                    {/* label */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Label')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="label"
                        inputElement={
                          <FastField name="label">
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
                                placeholder={`${_.capitalize(t('Label'))}...`}
                                type={KTFormInputType.text}
                                // disabled={!canEdit}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                    {/* description */}
                    <div className="col-12">
                      <KTFormGroup
                        label={<>{t('Description')}</>}
                        inputName="description"
                        inputElement={
                          <FastField name="description">
                            {({ field, form, meta }) => (
                              <KTFormTextArea
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
                                placeholder={`${_.capitalize(t('Description'))}...`}
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* orderId */}
                    <div className="col-12">
                      <KTFormGroup
                        label={<>{t('OrderList')}</>}
                        inputName="orderId"
                        inputElement={
                          // <FastField name="orderId">
                          //   {({ field, form, meta }) => (
                          <div
                            className="border rounded p-3"
                            onClick={() => {
                              if (!formikProps.getFieldProps('postOfficeId').value) {
                                ToastHelper.showError(t('EmptyPostOffice'));
                              } else {
                                setShowing(false);
                                setShowModalOrder(true);
                              }
                            }}
                          >
                            <div>{`${
                              formikProps.getFieldProps('orderIds').value?.length ?? 0
                            } Don hang`}</div>
                          </div>
                          //   )}
                          // </FastField>
                        }
                      />
                    </div>

                    {/* status */}
                    <div className="mb-4 d-flex flex-column">
                      <label className="mb-2" htmlFor="status">
                        {_.capitalize(t('Status'))}
                      </label>
                      <KTFormSelect
                        name="status"
                        isCustom
                        options={AppData.receiptStatus}
                        value={formikProps.getFieldProps('status').value?.toString()}
                        onChange={(newValue) => {
                          formikProps.getFieldHelpers('status').setValue(newValue);
                        }}
                      />
                    </div>

                    {/* shipperId */}
                    <div className="mb-4 d-flex flex-column">
                      <label className="mb-2" htmlFor="shipperId">
                        {_.capitalize(t('Shipper'))}
                        <span className="text-danger">(*)</span>
                      </label>
                      <KTFormSelect
                        name="shipperId"
                        isCustom
                        options={[{ name: '', value: '' }].concat(
                          shippers?.map((item) => {
                            return {
                              name: item?.shipperName,
                              value: item?.shipperId.toString(),
                            };
                          })
                        )}
                        value={formikProps.getFieldProps('shipperId').value?.toString()}
                        onChange={(newValue) => {
                          formikProps.getFieldHelpers('shipperId').setValue(newValue);
                        }}
                      />
                    </div>

                    {/* package */}
                    {formikProps.getFieldProps('status').value === AppData.RECEIPT_STATUS.SENT ? (
                      <div className="col-12">
                        <KTFormGroup
                          label={
                            <>
                              {t('PackageImage')} <span className="text-danger">(*)</span>
                            </>
                          }
                          inputName="packageLink"
                          inputElement={
                            <FastField name="packageLink">
                              {({ field, form, meta }) => (
                                <KTImageInput
                                  isAvatar={false}
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
                                  defaultImage={AppResource.images.imgUpload}
                                  acceptImageTypes={AppConfigs.acceptImages}
                                  onSelectedFile={(file) => {
                                    console.log(file);
                                    //   Utils.validateImageFile(file);
                                    form.setFieldValue('package', file);
                                  }}
                                  onRemovedFile={() => {
                                    form.setFieldValue('package', null);
                                  }}
                                  additionalClassName=""
                                />
                              )}
                            </FastField>
                          }
                        />
                      </div>
                    ) : null}

                    {/* signature */}
                    {formikProps.getFieldProps('status').value === AppData.RECEIPT_STATUS.SENT ? (
                      <div className="col-12">
                        <KTFormGroup
                          label={
                            <>
                              {t('Signature')} <span className="text-danger">(*)</span>
                            </>
                          }
                          inputName="signatureLink"
                          inputElement={
                            <FastField name="signatureLink">
                              {({ field, form, meta }) => (
                                <ShipperSignature
                                  signatureItem={field.value}
                                  onSignDone={(blob) => form.setFieldValue('signature', blob)}
                                />
                              )}
                            </FastField>
                          }
                        />
                      </div>
                    ) : null}
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
            <ModalSelectOrder
              onSelectOrder={(orderId, checked) => {
                if (checked) {
                  formikProps
                    .getFieldHelpers('orderIds')
                    .setValue(formikProps.getFieldProps('orderIds').value.concat([orderId]));
                } else {
                  formikProps
                    .getFieldHelpers('orderIds')
                    .setValue(
                      formikProps.getFieldProps('orderIds').value.filter((item) => item != orderId)
                    );
                }
              }}
              orderList={formikProps.getFieldProps('orderIds').value}
              receiptItem={formikProps.getFieldProps().value}
              show={showModalOrder}
              onClose={() => {
                setShowModalOrder(false);
                setShowing(true);
              }}
            />
          </>
        )}
      </Formik>
    </div>
  );
}

export default ModalReceiptEdit;
