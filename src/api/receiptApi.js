import axiosClient from './axiosClient';

const receiptApi = {
  getListReceipt: (params) => {
    const url = '/receipt/find';
    return axiosClient.get(url, { params });
  },

  copyReceiptContent: (params) => {
    const url = `/receipt/copy/${params.goodsHandoverReceiptId}`;
    return axiosClient.get(url);
  },

  createReceipt: (params) => {
    const url = '/receipt/create';
    const formData = new FormData();
    for (const key in params) {
      if (params[key]) {
        formData.append(key, params[key]);
      }
    }

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateReceipt: (params) => {
    const url = `/receipt/update/${params.goodsHandoverReceiptId}`;
    const formData = new FormData();
    for (const key in params) {
      if (params[key]) {
        formData.append(key, params[key]);
      }
    }

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteReceipt: (params) => {
    const url = '/receipt/delete';
    return axiosClient.delete(url, {
      data: {
        ids: params,
      },
    });
  },
};

export default receiptApi;
