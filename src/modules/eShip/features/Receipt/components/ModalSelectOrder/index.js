import employeeApi from 'api/employeeApi';
import orderApi from 'api/orderApi';
import { FastField, Formik } from 'formik';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import KeenSearchBarNoFormik from 'general/components/OtherKeenComponents/KeenSearchBarNoFormik';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Accordion, Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

ModalSelectOrder.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  receiptItem: PropTypes.object,
  onExistDone: PropTypes.func,
  orderList: PropTypes.array,
  onSelectOrder: PropTypes.func,
};

ModalSelectOrder.defaultProps = {
  show: false,
  onClose: null,
  receiptItem: null,
  onExistDone: null,
  orderList: [],
  onSelectOrder: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * receiptItem: object,
 * onExistDone: function,
 * onSelectOrder: function,
 * orderList: array,
 * }} props
 * @returns
 */
function ModalSelectOrder(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const { show, onClose, receiptItem, onExistDone, orderList, onSelectOrder } = props;
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    status: AppData.ORDER_STATUS.SCANNED,
    q: '',
    accountId: '',
    postOfficeId: receiptItem?.postOfficeId,
  });

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

  async function getListOrder(params) {
    const res = await orderApi.getListOrder(params);
    const { result, orders } = res;
    if (result == 'success') {
      setOrders(orders);
    }
  }

  async function getListEmployee(params) {
    const res = await employeeApi.getListEmployee(params);
    const { result, employees } = res;
    if (result == 'success') {
      setEmployees(employees);
    }
  }

  function handleSelectOrder(orderId, checked) {
    if (onSelectOrder) {
      onSelectOrder(orderId, checked);
    }
  }

  // MARK: ---- Hooks ----
  useEffect(() => {
    if (filters.postOfficeId) {
      getListOrder(filters);
    }
  }, [filters]);

  useEffect(() => {
    getListEmployee();
  }, []);

  useEffect(() => {
    setFilters({
      ...filters,
      postOfficeId: receiptItem?.postOfficeId,
      status: AppData.ORDER_STATUS.SCANNED,
    });
  }, [receiptItem?.postOfficeId, receiptItem?.label]);

  return (
    <div>
      <Formik
        initialValues={{
          orderIds: receiptItem ? receiptItem.orderIds : '',
        }}
        enableReinitialize
        onSubmit={(values) => {}}
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
                <Modal.Title>{t('ListOrder')}</Modal.Title>
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
                  <div className="d-flex flex-wrap mb-8">
                    <KeenSearchBarNoFormik
                      name="searchQuery"
                      className="mt-4 mr-4"
                      placeholder={`${t('Search')}...`}
                      value={filters.q}
                      onSubmit={(text) => {
                        setFilters({
                          ...filters,
                          q: text,
                          page: 0,
                        });
                      }}
                    />

                    <div className="mt-4 mr-4 d-flex flex-wrap align-items-center">
                      <label className="mr-2 mb-0" htmlFor="employee">
                        {_.capitalize(t('PackingEmployee'))}
                      </label>
                      <KTFormSelect
                        name="employee"
                        isCustom
                        options={[
                          { name: 'All', value: '' },
                          ...employees.map((item) => {
                            return { name: item.fullname, value: item.accountId.toString() };
                          }),
                        ]}
                        value={filters.accountId}
                        onChange={(newValue) => {
                          setFilters({
                            ...filters,
                            page: 0,
                            accountId: newValue,
                          });
                        }}
                      />
                    </div>
                    <div className="mt-4 mr-4 d-flex flex-wrap align-items-center">
                      <label className="mr-2 mb-0" htmlFor="status">
                        {_.capitalize(t('Status'))}
                      </label>
                      <KTFormSelect
                        name="status"
                        isCustom
                        options={[{ name: 'All', value: '' }, ...AppData.orderStatus]}
                        value={filters.status}
                        onChange={(newValue) => {
                          setFilters({
                            ...filters,
                            page: 0,
                            status: newValue,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    {/* postOfficeName */}
                    <div className="col-12">
                      <KTFormGroup
                        inputName="postOfficeName"
                        inputElement={
                          <Accordion defaultActiveKey="">
                            {orders?.map((item) => {
                              return (
                                <div key={item?.orderId}>
                                  <Accordion.Item
                                    eventKey={item?.orderId}
                                    className="position-relative"
                                  >
                                    <div
                                      className="mr-2 ml-2 position-absolute "
                                      style={{ top: 13, zIndex: 999 }}
                                    >
                                      <input
                                        checked={!!orderList?.find((or) => or == item.orderId)}
                                        type="checkbox"
                                        id={item?.orderCode}
                                        onChange={(e) => {
                                          handleSelectOrder(item?.orderId, e.target.checked);
                                        }}
                                      />
                                    </div>
                                    <Accordion.Header>
                                      <span className="ml-4">{item?.orderCode}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                      <div className="d-flex justify-content-center align-items-center">
                                        <img
                                          className="w-100 w-lg-50"
                                          src={Utils.getFullUrl(item?.scannedImage)}
                                          style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                                        />
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </div>
                              );
                            })}
                          </Accordion>
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
                      handleClose();
                    }}
                  >
                    {t('Confirm')}
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

export default ModalSelectOrder;
