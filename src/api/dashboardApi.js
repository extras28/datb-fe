const { default: axiosClient } = require('./axiosClient');

const dashboardApi = {
  getStatisticByDate: (params) => {
    console.log(params);
    const url = '/statistic/handed-over';
    return axiosClient.get(url, { params });
  },
  getStatisticThisMonth: () => {
    const url = '/statistic/order-by-month';
    return axiosClient.get(url);
  },
  getStatisticByEmployee: (params) => {
    const url = '/statistic/order-by-employee';
    return axiosClient.get(url, { params });
  },
  getStatisticByPostOffice: (params) => {
    const url = '/statistic/post-office';
    return axiosClient.get(url, { params });
  },
};
export default dashboardApi;
