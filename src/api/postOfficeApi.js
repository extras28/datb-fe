import axiosClient from './axiosClient';

const postOfficeApi = {
  getListPostOffice: (params) => {
    const url = '/post-office/find';
    return axiosClient.get(url, { params });
  },
  createPostOffice: (params) => {
    const url = '/post-office/create';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updatePostOffice: (params) => {
    const url = `/post-office/update/${params.postOfficeId}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deletePostOffice: (params) => {
    const url = '/post-office/delete';
    return axiosClient.delete(url, {
      data: {
        postOfficeIds: params,
      },
    });
  },
};

export default postOfficeApi;
