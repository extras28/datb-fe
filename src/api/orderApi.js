import axiosClient from './axiosClient';

const orderApi = {
  getListOrder: (params) => {
    const url = '/order/find';
    return axiosClient.get(url, { params });
  },
  createOrder: (params) => {
    const url = '/order/create';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateOrder: (params) => {
    const url = `/order/update`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteOrder: (params) => {
    const url = '/order/delete';
    return axiosClient.delete(url, {
      data: {
        orderIds: params,
      },
    });
  },
};

export default orderApi;
