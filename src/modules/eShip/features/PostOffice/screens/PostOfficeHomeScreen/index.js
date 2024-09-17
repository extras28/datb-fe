import { unwrapResult } from '@reduxjs/toolkit';
import postOfficeApi from 'api/postOfficeApi';
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
import ModalPostOfficeEdit from '../../components/ModalEditPostOffice';
import { setPaginationPerPage, thunkGetListPostOffice } from '../../postOfficeSlice';

PostOfficeHomeScreen.propTypes = {};

const sTag = '[PostOfficeHomeScreen]';

function PostOfficeHomeScreen(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Global.gFiltersPostOfficeList);
  const [selectedPostOffices, setSelectedPostOffices] = useState([]);
  const [toggledClearPostOffices, setToggledClearPostOffices] = useState(true);
  const { postOffices, isGettingPostOfficeList, pagination } = useSelector(
    (state) => state.postOffice
  );
  const needToRefreshData = useRef(postOffices?.length === 0);
  const refLoading = useRef(false);
  const columns = useMemo(() => {
    return [
      {
        name: t('Logo'),
        sortable: false,
        // minWidth: '100px',
        center: 'true',
        cell: (row) => {
          return (
            <img
              src={Utils.getFullUrl(row?.logo)}
              style={{
                aspectRatio: '1/1',
                objectFit: 'cover',
                height: 80,
                borderRadius: 10,
              }}
            />
          );
        },
      },
      {
        name: t('PostOfficeName'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.postOfficeName}
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
              {row?.phone}
            </div>
          );
        },
      },
      {
        name: t('Address'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.address}
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
                  handleEditPostOffice(row);
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
                  handleDeletePostOffice(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>

            <KTTooltip text={t('Call')}>
              <a
                className="btn btn-icon btn-sm btn-success btn-hover-success"
                href={`tel:${row.phone}`}
              >
                <i className="far fa-phone p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, []);
  const [selectedPostOfficeItem, setSelectedPostOfficeItem] = useState(null);
  const [modalPostOfficeEditShowing, setModalPostOfficeEditShowing] = useState(false);

  // MARK: --- Functions ---
  // Get postOffice list
  async function getPostOfficeList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListPostOffice(filters)));
    } catch (error) {
      console.log(`${sTag} get postOffice list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedPostOfficesChanged(state) {
    const selectedPostOffices = state.selectedRows;
    setSelectedPostOffices(selectedPostOffices);
  }

  function clearSelectedPostOffices() {
    setSelectedPostOffices([]);
    setToggledClearPostOffices(!toggledClearPostOffices);
  }

  function handleDeleteMultiPostOffices() {
    const arrIdsToDelete = selectedPostOffices.map((item) => item.postOfficeId);
    console.log(`${sTag} handle delete multi post-offices: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiPostOffice', {
        postOffices: JSON.stringify(arrIdsToDelete.length),
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
        const postOfficeIds = arrIdsToDelete;
        try {
          const res = await postOfficeApi.deletePostOffice(postOfficeIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedPostOffices();
            Global.gNeedToRefreshPostOfficeList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersPostOfficeList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedPostOfficesChanged(state) {
    const selectedPostOffices = state.selectedRows;
    setSelectedPostOffices(selectedPostOffices);
  }

  function handleEditPostOffice(postOffice) {
    setSelectedPostOfficeItem(postOffice);
    setModalPostOfficeEditShowing(true);
  }

  function handleDeletePostOffice(postOffice) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeletePostOffice', { name: postOffice?.fullname }),
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
          const res = await postOfficeApi.deletePostOffice([postOffice.postOfficeId]);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshPostOfficeList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersPostOfficeList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete postOffice error: ${error?.message}`);
        }
      }
    });
  }

  // MARK: --- Hooks ---
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshPostOfficeList)) {
      getPostOfficeList();
      Global.gNeedToRefreshPostOfficeList = false;
    }
  }, [filters]);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListPostOffice')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedPostOffices.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiPostOffices();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedPostOffices.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalPostOfficeEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewPostOffice')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersPostOfficeList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersPostOfficeList = {
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
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            // fixedHeader
            // fixedHeaderScrollHeight="60vh"
            columns={columns}
            data={postOffices}
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
            progressPending={isGettingPostOfficeList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedPostOfficesChanged}
            clearSelectedRows={toggledClearPostOffices}
            onRowClicked={(row) => {
              handleEditPostOffice(row);
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && postOffices?.length > 0 && (
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
                  Global.gFiltersPostOfficeList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersPostOfficeList = {
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

      <ModalPostOfficeEdit
        show={modalPostOfficeEditShowing}
        onClose={() => {
          setModalPostOfficeEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedPostOfficeItem(null);
        }}
        postOfficeItem={selectedPostOfficeItem}
        onRefreshPostOfficeList={() => {
          setSelectedPostOfficeItem(null);
          getPostOfficeList();
        }}
      />
    </div>
  );
}

export default PostOfficeHomeScreen;
