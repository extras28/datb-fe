import { unwrapResult } from '@reduxjs/toolkit';
import postOfficeApi from 'api/postOfficeApi';
import receiptApi from 'api/receiptApi';
import shipperApi from 'api/shipperApi';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import KeenSearchBarNoFormik from 'general/components/OtherKeenComponents/KeenSearchBarNoFormik';
import Pagination from 'general/components/Pagination';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import ReceiptHelper from 'general/helpers/ReceiptHelper';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ModalReceiptEdit from '../../components/ModalEditReceipt';
import { setPaginationPerPage, thunkGetListReceipt } from '../../receiptSlice';
import Utils from 'general/utils/Utils';

ReceiptHomeScreen.propTypes = {};

const sTag = '[ReceiptHomeScreen]';

function ReceiptHomeScreen(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [postOffices, setPostOffices] = useState([]);

  const [shippers, setShippers] = useState([]);
  const [filters, setFilters] = useState(Global.gFiltersReceiptList);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [toggledClearReceipts, setToggledClearReceipts] = useState(true);
  const { receipts, isGettingReceiptList, pagination } = useSelector((state) => state.receipt);
  const needToRefreshData = useRef(receipts?.length === 0);
  const refLoading = useRef(false);
  const columns = useMemo(() => {
    return [
      {
        name: t('Label'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.label}
            </div>
          );
        },
      },
      {
        name: t('Description'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.description}
            </div>
          );
        },
      },
      {
        name: t('NumberOfOrder'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.orderCount}
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
        name: t('Shipper'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {shippers?.find((item) => item?.shipperId === row?.shipperId)?.shipperName}
            </div>
          );
        },
      },

      {
        name: t('Status'),
        sortable: false,
        cell: (row) => {
          return (
            <span className={`badge bg-${ReceiptHelper.getReceiptStatusColor(row?.status)}`}>
              {ReceiptHelper.getReceiptStatusText(row?.status)}
            </span>
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
                  handleEditReceipt(row);
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
                  handleDeleteReceipt(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>
            <KTTooltip text={t('Copy')}>
              <a
                className="btn btn-icon btn-sm btn-warning btn-hover-warning"
                onClick={(e) => {
                  e.preventDefault();
                  copyReceiptContent(row);
                }}
              >
                <i className="far fa-copy p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, [postOffices, shippers]);
  const [selectedReceiptItem, setSelectedReceiptItem] = useState(null);
  const [modalReceiptEditShowing, setModalReceiptEditShowing] = useState(false);

  // MARK: --- Functions ---
  // Get receipt list
  async function getReceiptList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListReceipt(filters)));
    } catch (error) {
      console.log(`${sTag} get receipt list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedReceiptsChanged(state) {
    const selectedReceipts = state.selectedRows;
    setSelectedReceipts(selectedReceipts);
  }

  function clearSelectedReceipts() {
    setSelectedReceipts([]);
    setToggledClearReceipts(!toggledClearReceipts);
  }

  function handleEditReceipt(receipt) {
    setSelectedReceiptItem(receipt);
    setModalReceiptEditShowing(true);
  }

  function handleDeleteMultiReceipts() {
    const arrIdsToDelete = selectedReceipts.map((item) => item.goodsHandoverReceiptId);
    console.log(`${sTag} handle delete multi receipts: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiReceipt', {
        goodsHandoverReceipts: JSON.stringify(arrIdsToDelete.length),
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
        const goodsHandoverReceiptIds = arrIdsToDelete;
        try {
          const res = await receiptApi.deleteReceipt(goodsHandoverReceiptIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedReceipts();
            Global.gNeedToRefreshReceiptList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersReceiptList = { ...filters };
            setFilters({ ...filters });
            Global.gNeedToRefreshOrderList = true;
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedReceiptsChanged(state) {
    const selectedReceipts = state.selectedRows;
    setSelectedReceipts(selectedReceipts);
  }

  function handleDeleteReceipt(receipt) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteReceipt', { name: receipt?.label }),
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
          const res = await receiptApi.deleteReceipt([receipt.goodsHandoverReceiptId]);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshReceiptList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersReceiptList = { ...filters };
            setFilters({ ...filters });
            Global.gNeedToRefreshOrderList = true;
          }
        } catch (error) {
          console.log(`Delete receipt error: ${error?.message}`);
        }
      }
    });
  }

  async function getListShipper() {
    const res = await shipperApi.getListShipper();
    const { result, shippers } = res;
    if (result === 'success') {
      setShippers(shippers);
    }
  }

  async function getListPostOffice() {
    const res = await postOfficeApi.getListPostOffice();
    const { result, postOffices } = res;
    if (result === 'success') {
      setPostOffices(postOffices);
    }
  }

  async function copyReceiptContent(row) {
    try {
      const res = await receiptApi.copyReceiptContent({
        goodsHandoverReceiptId: row.goodsHandoverReceiptId,
      });
      const { result, label, orderCodes } = res;

      if (result === 'success') {
        Utils.copyTextToClipboard(`${label} \n ${orderCodes}`);
        ToastHelper.showSuccess(t('CopiedToClipboard'));
      }
    } catch (error) {
      console.log(`copy receipt content error: ${error.message}`);
    }
  }

  // MARK: ---- Hooks ----
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshReceiptList)) {
      getReceiptList();
      Global.gNeedToRefreshReceiptList = false;
    }
  }, [filters]);

  useEffect(() => {
    getListShipper();
    getListPostOffice();
  }, []);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header breceipt-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListReceipt')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedReceipts.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiReceipts();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedReceipts.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalReceiptEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewReceipt')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersReceiptList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersReceiptList = {
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
                value={Global.gFiltersReceiptList.postOfficeId}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersReceiptList = {
                    ...filters,
                    page: 0,
                    postOfficeId: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersReceiptList,
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
                options={[{ name: 'All', value: '' }, ...AppData.receiptStatus]}
                value={Global.gFiltersReceiptList.status}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersReceiptList = {
                    ...filters,
                    page: 0,
                    status: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersReceiptList,
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
            data={receipts}
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
            progressPending={isGettingReceiptList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedReceiptsChanged}
            clearSelectedRows={toggledClearReceipts}
            onRowClicked={(row) => {
              handleEditReceipt(row);
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && receipts?.length > 0 && (
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
                  Global.gFiltersReceiptList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersReceiptList = {
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

      <ModalReceiptEdit
        show={modalReceiptEditShowing}
        onClose={(item) => {
          setModalReceiptEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedReceiptItem(null);
        }}
        receiptItem={selectedReceiptItem}
        onRefreshReceiptList={() => {
          setSelectedReceiptItem(null);
          getReceiptList();
        }}
      />
    </div>
  );
}

export default ReceiptHomeScreen;
