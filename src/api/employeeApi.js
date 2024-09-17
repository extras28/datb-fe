import axiosClient from './axiosClient';

const employeeApi = {
  getListEmployee: (params) => {
    const url = '/employee/find';
    return axiosClient.get(url, { params });
  },
  createEmployee: (params) => {
    const url = '/employee/create';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateEmployee: (params) => {
    const url = `/employee/update/${params.accountId}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteEmployee: (params) => {
    const url = '/employee/delete';
    return axiosClient.delete(url, {
      data: {
        accountIds: params,
      },
    });
  },
};

export default employeeApi;
