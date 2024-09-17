import { unwrapResult } from '@reduxjs/toolkit';
import employeeApi from 'api/employeeApi';
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
import ModalEmployeeEdit from '../../Components/ModalEditEmployee';
import { setPaginationPerPage, thunkGetListEmployee } from '../../employeeSlice';
import ModalResetPasswordEmployee from '../../Components/ModelResetPasswordEmployee';

EmployeeHomePage.propTypes = {};

const sTag = '[EmployeeHomePage]';

function EmployeeHomePage(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Global.gFiltersEmployeeList);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [toggledClearEmployees, setToggledClearEmployees] = useState(true);
  const { employees, isGettingEmployeeList, pagination } = useSelector((state) => state.employee);
  const needToRefreshData = useRef(employees?.length === 0);
  const refLoading = useRef(false);
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
              src={Utils.getFullUrl(row?.logo)}
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
        name: t('Email'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.email}
            </div>
          );
        },
      },
      {
        name: t('Username'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.username}
            </div>
          );
        },
      },
      {
        name: t('Fullname'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <p
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-normal m-0 text-maxline-3 mr-4"
            >
              {row?.fullname}
            </p>
          );
        },
      },

      {
        name: t('Address'),
        sortable: false,
        // minWidth: '80px',
        cell: (row) => {
          return (
            <p
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-normal m-0 text-maxline-3 mr-4"
            >
              {row?.address}
            </p>
          );
        },
      },
      {
        name: t('Phone'),
        sortable: false,
        // minWidth: '80px',
        cell: (row) => {
          return (
            <p
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-normal m-0 text-maxline-3 mr-4"
            >
              {row?.phone}
            </p>
          );
        },
      },
      {
        name: '',
        center: 'true',
        width: '200px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <KTTooltip text={t('Edit')}>
              <a
                className="btn btn-icon btn-sm btn-primary btn-hover-primary mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditEmployee(row);
                }}
              >
                <i className="fa-regular fa-user-pen p-0 icon-1x" />
              </a>
            </KTTooltip>

            <KTTooltip text={t('Delete')}>
              <a
                className="btn btn-icon btn-sm btn-danger btn-hover-danger mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteEmployee(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>
            <KTTooltip text={t('ResetPassword')}>
              <a
                className="btn btn-icon btn-sm btn-warning btn-hover-warning mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleResetPasswordEmployee(row);
                }}
              >
                <i className="fa-regular fa-key p-0 icon-1x" />
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
  const [selectedEmployeeItem, setSelectedEmployeeItem] = useState(null);
  const [modalEmployeeEditShowing, setModalEmployeeEditShowing] = useState(false);
  const [modalEmployeeResetPasswordShowing, setModalEmployeeResetPasswordShowing] = useState(false);

  // MARK: --- Functions ---
  // Get employee list
  async function getEmployeeList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListEmployee(filters)));
    } catch (error) {
      console.log(`${sTag} get employee list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedEmployeesChanged(state) {
    const selectedEmployees = state.selectedRows;
    setSelectedEmployees(selectedEmployees);
  }

  function clearSelectedEmployees() {
    setSelectedEmployees([]);
    setToggledClearEmployees(!toggledClearEmployees);
  }

  function handleEditEmployee(employee) {
    setSelectedEmployeeItem(employee);
    setModalEmployeeEditShowing(true);
  }

  function handleDeleteMultiEmployees() {
    const arrIdsToDelete = selectedEmployees.map((item) => item.accountId);
    console.log(`${sTag} handle delete multi employees: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiEmployee', {
        employees: JSON.stringify(arrIdsToDelete.length),
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
        const employeeIds = arrIdsToDelete;
        try {
          const res = await employeeApi.deleteEmployee(employeeIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedEmployees();
            Global.gNeedToRefreshEmployeeList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersEmployeeList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedEmployeesChanged(state) {
    const selectedEmployees = state.selectedRows;
    setSelectedEmployees(selectedEmployees);
  }

  function handleResetPasswordEmployee(employee) {
    setSelectedEmployeeItem(employee);
    setModalEmployeeResetPasswordShowing(true);
  }

  function handleDeleteEmployee(employee) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteEmployee', { name: employee?.fullname }),
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
          const res = await employeeApi.deleteEmployee([employee.accountId]);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshEmployeeList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersEmployeeList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete employee error: ${error?.message}`);
        }
      }
    });
  }

  // MARK: --- Hooks ---
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshEmployeeList)) {
      getEmployeeList();
      Global.gNeedToRefreshEmployeeList = false;
    }
  }, [filters]);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListEmployee')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedEmployees.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiEmployees();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedEmployees.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalEmployeeEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewEmployee')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersEmployeeList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersEmployeeList = {
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
            data={employees}
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
                  imageEmpty={AppResource.icons.icEmptyBox}
                  imageEmptyPercentWidth={170}
                />
              </div>
            }
            progressPending={isGettingEmployeeList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedEmployeesChanged}
            clearSelectedRows={toggledClearEmployees}
            onRowClicked={(row) => {
              handleEditEmployee(row);
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && (
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
                  Global.gFiltersEmployeeList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersEmployeeList = {
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

      <ModalEmployeeEdit
        show={modalEmployeeEditShowing}
        onClose={() => {
          setModalEmployeeEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedEmployeeItem(null);
        }}
        employeeItem={selectedEmployeeItem}
        onRefreshEmployeeList={() => {
          setSelectedEmployeeItem(null);
          getEmployeeList();
        }}
      />
      <ModalResetPasswordEmployee
        show={modalEmployeeResetPasswordShowing}
        onClose={() => {
          setModalEmployeeResetPasswordShowing(false);
        }}
        onExistDone={() => {
          setSelectedEmployeeItem(null);
        }}
        employeeItem={selectedEmployeeItem}
        onRefreshEmployeeList={() => {
          setSelectedEmployeeItem(null);
          getEmployeeList();
        }}
      />
    </div>
  );
}

export default EmployeeHomePage;
