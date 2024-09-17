import axiosClient from './axiosClient';

const shipperApi = {
  getListShipper: (params) => {
    const url = '/shipper/find';
    return axiosClient.get(url, { params });
  },
  createShipper: (params) => {
    const url = '/shipper/create';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateShipper: (params) => {
    const url = `/shipper/update/${params.shipperId}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteShipper: (params) => {
    const url = '/shipper/delete';
    return axiosClient.delete(url, {
      data: {
        shipperIds: params,
      },
    });
  },
};

export default shipperApi;
