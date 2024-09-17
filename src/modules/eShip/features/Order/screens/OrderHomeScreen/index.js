import { unwrapResult } from '@reduxjs/toolkit';
import employeeApi from 'api/employeeApi';
import orderApi from 'api/orderApi';
import postOfficeApi from 'api/postOfficeApi';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import KeenSearchBarNoFormik from 'general/components/OtherKeenComponents/KeenSearchBarNoFormik';
import Pagination from 'general/components/Pagination';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import OrderHelper from 'general/helpers/OrderHelper';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ModalOrderEdit from '../../components/ModalEditOrder';
import { setPaginationPerPage, thunkGetListOrder } from '../../orderSlice';

OrderHomeScreen.propTypes = {};

const sTag = '[OrderHomeScreen]';

function OrderHomeScreen(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const postOffices = useSelector((state) => state?.postOffice?.postOffices);
  const [employees, setEmployees] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [filters, setFilters] = useState(Global.gFiltersOrderList);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [toggledClearOrders, setToggledClearOrders] = useState(true);
  const { orders, isGettingOrderList, pagination } = useSelector((state) => state.order);
  const needToRefreshData = useRef(orders?.length === 0);
  const refLoading = useRef(false);
  const columns = useMemo(() => {
    return [
      {
        name: t('OrderCode'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.orderCode}
            </div>
          );
        },
      },
      {
        name: t('ECommercePlatform'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.eCommercePlatform}
            </div>
          );
        },
      },
      {
        name: t('ScanTime'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {Utils.formatDateTime(row?.scanTime, 'DD/MM/YYYY HH:mm')}
            </div>
          );
        },
      },
      {
        name: t('PostOffice'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {
                postOffices?.find((item) => item?.postOfficeId === row?.postOfficeId)
                  ?.postOfficeName
              }
            </div>
          );
        },
      },
      {
        name: t('PackingEmployee'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {employees?.find((item) => item?.accountId === row?.accountId)?.fullname}
            </div>
          );
        },
      },
      {
        name: t('Status'),
        sortable: false,
        cell: (row) => {
          return (
            <span className={`badge bg-${OrderHelper.getOrderStatusColor(row?.status)}`}>
              {OrderHelper.getOrderStatusText(row?.status)}
            </span>
          );
        },
      },

      {
        name: '',
        center: 'true',
        width: '100px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <KTTooltip text={t('Edit')}>
              <a
                className="btn btn-icon btn-sm btn-primary btn-hover-primary mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditOrder(row);
                }}
              >
                <i className="far fa-pen p-0 icon-1x" />
              </a>
            </KTTooltip>
            {/* )} */}
            <KTTooltip text={t('Delete')}>
              <a
                className="btn btn-icon btn-sm btn-danger btn-hover-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteOrder(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, [postOffices, employees]);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [modalOrderEditShowing, setModalOrderEditShowing] = useState(false);

  // MARK: --- Functions ---
  // Get order list
  async function getOrderList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListOrder(filters)));
    } catch (error) {
      console.log(`${sTag} get order list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedOrdersChanged(state) {
    const selectedOrders = state.selectedRows;
    setSelectedOrders(selectedOrders);
  }

  function clearSelectedOrders() {
    setSelectedOrders([]);
    setToggledClearOrders(!toggledClearOrders);
  }

  function handleEditOrder(order) {
    setSelectedOrderItem(order);
    setModalOrderEditShowing(true);
  }

  function handleDeleteMultiOrders() {
    const arrIdsToDelete = selectedOrders.map((item) => item.orderId);
    console.log(`${sTag} handle delete multi orders: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiOrder', {
        orders: JSON.stringify(arrIdsToDelete.length),
      }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('Yes'),
      cancelButtonText: t('Cancel'),
      customClass: {
        confirmButton: 'btn btn-danger font-weight-bolder',
        cancelButton: 'btn btn-light font-weight-bolder',
      },
    }).then(async function (result) {
      if (result.value) {
        const orderIds = arrIdsToDelete;
        try {
          const res = await orderApi.deleteOrder(orderIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedOrders();
            Global.gNeedToRefreshOrderList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersOrderList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedOrdersChanged(state) {
    const selectedOrders = state.selectedRows;
    setSelectedOrders(selectedOrders);
  }

  function handleDeleteOrder(order) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteOrder', { orderCode: order?.orderCode }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('Yes'),
      cancelButtonText: t('Cancel'),
      customClass: {
        confirmButton: 'btn btn-danger font-weight-bolder',
        cancelButton: 'btn btn-light font-weight-bolder',
      },
    }).then(async function (result) {
      if (result.value) {
        try {
          const res = await orderApi.deleteOrder([order.orderId]);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshOrderList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersOrderList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete order error: ${error?.message}`);
        }
      }
    });
  }

  async function getListEmployee() {
    const res = await employeeApi.getListEmployee();
    const { result, employees } = res;
    if (result === 'success') {
      setEmployees(employees);
    }
  }

  async function getListPostOffice() {
    const res = await postOfficeApi.getListPostOffice();
    const { result, postOffices } = res;
    if (result === 'success') {
      setPostOffices(postOffices);
    }
  }

  // MARK: ---- Hooks ----
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshOrderList)) {
      getOrderList();
      Global.gNeedToRefreshOrderList = false;
    }
  }, [filters, Global.gNeedToRefreshOrderList]);

  useEffect(() => {
    getListEmployee();
    getListPostOffice();
  }, []);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListOrder')}</h1>
              <span>{`(${pagination?.total})`}</span>
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedOrders.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiOrders();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedOrders.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalOrderEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewOrder')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersOrderList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersOrderList = {
                  ...filters,
                  q: text,
                  page: 0,
                };
                setFilters({
                  ...filters,
                  q: text,
                  page: 0,
                });
              }}
            />
            <div className="mt-4 mr-4 d-flex flex-wrap align-items-center">
              <label className="mr-2 mb-0" htmlFor="postOffice">
                {_.capitalize(t('PostOffice'))}
              </label>
              <KTFormSelect
                name="postOffice"
                isCustom
                options={[
                  { name: 'All', value: '' },
                  ...postOffices.map((item) => {
                    return { name: item.postOfficeName, value: item.postOfficeId.toString() };
                  }),
                ]}
                value={Global.gFiltersOrderList.postOfficeId}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = {
                    ...filters,
                    page: 0,
                    postOfficeId: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersOrderList,
                  });
                }}
              />
            </div>
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
                value={Global.gFiltersOrderList.accountId}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = {
                    ...filters,
                    page: 0,
                    accountId: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersOrderList,
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
                value={Global.gFiltersOrderList.status}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = {
                    ...filters,
                    page: 0,
                    status: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersOrderList,
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            columns={columns}
            data={orders}
            customStyles={customDataTableStyle}
            responsive={true}
            noHeader
            selectableRows={true}
            striped
            noDataComponent={
              <div className="pt-12">
                <Empty
                  text={t('NoData')}
                  visible={false}
                  imageEmpty={AppResource.images.imgEmpty}
                  imageEmptyPercentWidth={80}
                />
              </div>
            }
            progressPending={isGettingOrderList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedOrdersChanged}
            clearSelectedRows={toggledClearOrders}
            onRowClicked={(row) => {
              handleEditOrder(row);
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && orders?.length > 0 && (
            <div className="d-flex align-items-center justify-content-center mt-3">
              <Pagination
                rowsPerPage={pagination.perPage}
                rowCount={pagination.total}
                currentPage={pagination.currentPage}
                onChangePage={(newPage) => {
                  let iNewPage = parseInt(newPage);
                  iNewPage -= 1;
                  if (iNewPage < 0) {
                    iNewPage = 0;
                  }
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = {
                    ...filters,
                    limit: iNewPerPage,
                  };
                  setFilters({
                    ...filters,
                    limit: iNewPerPage,
                    page: 0,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>

      <ModalOrderEdit
        show={modalOrderEditShowing}
        onClose={() => {
          setModalOrderEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedOrderItem(null);
        }}
        orderItem={selectedOrderItem}
        onRefreshOrderList={() => {
          setSelectedOrderItem(null);
          getOrderList();
        }}
        employees={employees}
      />
    </div>
  );
}

export default OrderHomeScreen;
