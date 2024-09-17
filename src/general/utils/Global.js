import AppData from 'general/constants/AppData';
import moment from 'moment';

// Global variables
const Global = {
  gDefaultPagination: 30,
  gNeedToRefreshEmployeeList: false,
  gFiltersEmployeeList: { page: 0, limit: 30, q: '' },

  gNeedToRefreshShipperList: false,
  gFiltersShipperList: { page: 0, limit: 30, q: '', postOfficeId: '' },

  gNeedToRefreshPostOfficeList: false,
  gFiltersPostOfficeList: { page: 0, limit: 30, q: '' },

  gNeedToRefreshOrderList: false,
  gFiltersOrderList: { page: 0, limit: 30, q: '', postOfficeId: '', accountId: '' },

  gNeedToRefreshReceiptList: false,
  gFiltersReceiptList: { page: 0, limit: 30, q: '', postOfficeId: '', accountId: '' },

  gNeedToRefreshHandedOverStatistic: false,
  gFiltersHandedOverStatistic: {
    from: moment().subtract(6, 'days').startOf('day').toISOString(),
    to: moment().endOf('day').toISOString(),
    status: AppData.ORDER_STATUS.HANDED_OVER,
  },

  gNeedToRefreshScannedStatistic: false,
  gFiltersScannedStatistic: {
    from: moment().subtract(6, 'days').startOf('day').toISOString(),
    to: moment().endOf('day').toISOString(),
    // status: AppData.ORDER_STATUS.SCANNED,
  },

  gNeedToRefreshOrderByEmployeeStatistic: false,
  gFiltersOrderByEmployeeStatistic: {
    from: moment().subtract(6, 'days').startOf('day').toISOString(),
    to: moment().endOf('day').toISOString(),
  },

  gNeedToRefreshOrderByPostOfficeStatistic: false,
  gFiltersOrderByPostOfficeStatistic: {
    from: moment().subtract(6, 'days').startOf('day').toISOString(),
    to: moment().endOf('day').toISOString(),
  },
};

export default Global;
