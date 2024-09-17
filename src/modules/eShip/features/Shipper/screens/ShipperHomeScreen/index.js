import { unwrapResult } from '@reduxjs/toolkit';
import shipperApi from 'api/shipperApi';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import KeenSearchBarNoFormik from 'general/components/OtherKeenComponents/KeenSearchBarNoFormik';
import Pagination from 'general/components/Pagination';
import AppResource from 'general/constants/AppResource';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ModalShipperEdit from '../../components/ModalEditShipper';
import { setPaginationPerPage, thunkGetListShipper } from '../../shipperSlice';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import postOfficeApi from 'api/postOfficeApi';

ShipperHomeScreen.propTypes = {};

const sTag = '[ShipperHomeScreen]';

function ShipperHomeScreen(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Global.gFiltersShipperList);
  const [selectedShippers, setSelectedShippers] = useState([]);
  const [toggledClearShippers, setToggledClearShippers] = useState(true);
  const { shippers, isGettingShipperList, pagination } = useSelector((state) => state.shipper);
  const needToRefreshData = useRef(shippers?.length === 0);
  const refLoading = useRef(false);
  const [postOffices, setPostOffices] = useState([]);
  const columns = useMemo(() => {
    return [
      {
        name: t('Avatar'),
        sortable: false,
        // minWidth: '100px',
        center: 'true',
        cell: (row) => {
          return (
            <img
              src={Utils.getFullUrl(row?.shipperImage)}
              style={{
                aspectRatio: '1/1',
                objectFit: 'cover',
                height: 50,
                borderRadius: 10,
              }}
            />
          );
        },
      },
      {
        name: t('Fullname'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.shipperName}
            </div>
          );
        },
      },
      {
        name: t('Phone'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.shipperPhone}
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
        name: '',
        center: 'true',
        width: '150px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <KTTooltip text={t('Edit')}>
              <a
                className="btn btn-icon btn-sm btn-primary btn-hover-primary mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditShipper(row);
                }}
              >
                <i className="far fa-pen p-0 icon-1x" />
              </a>
            </KTTooltip>

            <KTTooltip text={t('Delete')}>
              <a
                className="btn btn-icon btn-sm btn-danger btn-hover-danger mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteShipper(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>

            <KTTooltip text={t('Call')}>
              <a
                className="btn btn-icon btn-sm btn-success btn-hover-success"
                href={`tel:${row.shipperPhone}`}
              >
                <i className="far fa-phone p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, [postOffices]);
  const [selectedShipperItem, setSelectedShipperItem] = useState(null);
  const [modalShipperEditShowing, setModalShipperEditShowing] = useState(false);

  // MARK: --- Functions ---
  // Get shipper list
  async function getShipperList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListShipper(filters)));
    } catch (error) {
      console.log(`${sTag} get shipper list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedShippersChanged(state) {
    const selectedShippers = state.selectedRows;
    setSelectedShippers(selectedShippers);
  }

  function clearSelectedShippers() {
    setSelectedShippers([]);
    setToggledClearShippers(!toggledClearShippers);
  }

  function handleEditShipper(shipper) {
    setSelectedShipperItem(shipper);
    setModalShipperEditShowing(true);
  }

  function handleDeleteMultiShippers() {
    const arrIdsToDelete = selectedShippers.map((item) => item.shipperId);
    console.log(`${sTag} handle delete multi shippers: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiShipper', {
        shippers: JSON.stringify(arrIdsToDelete.length),
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
        const shipperIds = arrIdsToDelete;
        try {
          const res = await shipperApi.deleteShipper(shipperIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedShippers();
            Global.gNeedToRefreshShipperList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersShipperList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedShippersChanged(state) {
    const selectedShippers = state.selectedRows;
    setSelectedShippers(selectedShippers);
  }

  function handleDeleteShipper(shipper) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteShipper', { name: shipper?.shipperName }),
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
          const res = await shipperApi.deleteShipper([shipper.shipperId]);
          console.log(shipper);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshShipperList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersShipperList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete shipper error: ${error?.message}`);
        }
      }
    });
  }

  async function getListPostOffice() {
    const res = await postOfficeApi.getListPostOffice();
    const { result, postOffices } = res;
    if (result === 'success') {
      setPostOffices(postOffices);
    }
  }

  // MARK: --- Hooks ---
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshShipperList)) {
      getShipperList();
      Global.gNeedToRefreshShipperList = false;
    }
  }, [filters]);

  useEffect(() => {
    getListPostOffice();
  }, []);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListShipper')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedShippers.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiShippers();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedShippers.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalShipperEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewShipper')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersShipperList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersShipperList = {
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
              <label className="mr-2 mb-0" htmlFor="state">
                {_.capitalize(t('PostOffice'))}
              </label>
              <KTFormSelect
                name="state"
                isCustom
                options={[
                  { name: 'All', value: '' },
                  ...postOffices.map((item) => {
                    return { name: item.postOfficeName, value: item.postOfficeId.toString() };
                  }),
                ]}
                value={Global.gFiltersShipperList.postOfficeId}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersShipperList = {
                    ...filters,
                    page: 0,
                    postOfficeId: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersShipperList,
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            // fixedHeader
            // fixedHeaderScrollHeight="60vh"
            columns={columns}
            data={shippers}
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
            progressPending={isGettingShipperList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedShippersChanged}
            clearSelectedRows={toggledClearShippers}
            onRowClicked={(row) => {
              handleEditShipper(row);
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && shippers?.length > 0 && (
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
                  Global.gFiltersShipperList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersShipperList = {
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

      <ModalShipperEdit
        show={modalShipperEditShowing}
        onClose={() => {
          setModalShipperEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedShipperItem(null);
        }}
        shipperItem={selectedShipperItem}
        onRefreshShipperList={() => {
          setSelectedShipperItem(null);
          getShipperList();
        }}
      />
    </div>
  );
}

export default ShipperHomeScreen;
