import AppResource from './AppResource';

const AppData = {
  // regex
  regexSamples: {
    phoneRegex:
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    urlRegex:
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  },

  // phan trang
  perPageItems: [
    { value: 5 },
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 50 },
    { value: 100 },
  ],

  // ngon ngu
  languages: [
    {
      icon: AppResource.icons.icFlagUs,
      title: 'English',
      code: 'en',
    },
    {
      icon: AppResource.icons.icFlagVi,
      title: 'Tiếng Việt',
      code: 'vi',
    },
  ],

  // languages
  languageItems: [
    { name: 'English', value: 'en', icon: AppResource.icons.icFlagUs },
    { name: 'Tiếng Việt', value: 'vi', icon: AppResource.icons.icFlagVi },
  ],

  // apex chart color list
  chartColors: [
    '#007aff',
    '#ff2d55',
    '#5856d6',
    '#ff9500',
    '#ffcc00',
    '#ff3b30',
    '#5ac8fa',
    '#4cd964',
  ],
  orderStatus: [
    { name: 'Đã đóng gói', value: 'SCANNED' },
    { name: 'Sẵn sàng giao', value: 'READY_TO_SHIP' },
    { name: 'Đang vận chuyển', value: 'HANDED_OVER' },
    { name: 'Hoàn hàng', value: 'RETURNED' },
    { name: 'Huỷ hàng', value: 'CANCELED' },
  ],
  ORDER_STATUS: {
    SCANNED: 'SCANNED',
    READY_TO_SHIP: 'READY_TO_SHIP',
    HANDED_OVER: 'HANDED_OVER',
    RETURNED: 'RETURNED',
    CANCELED: 'CANCELED',
  },
  receiptStatus: [
    { name: 'sẵn sàng giao', value: 'NOT_SEND' },
    { name: 'Đang vận chuyển', value: 'SENT' },
  ],
  RECEIPT_STATUS: {
    NOT_SEND: 'NOT_SEND',
    SENT: 'SENT',
  },
  postOffices: [
    { name: 'J&T Express', value: 'J&T Express', image: AppResource.images.imgSpx },
    { name: 'SPX Express', value: 'SPX Express', image: AppResource.images.imgJt },
    { name: 'Giao Hàng Nhanh', value: 'Giao Hàng Nhanh', image: AppResource.images.imgGhn },
    {
      name: 'Giao hàng tiết kiệm',
      value: 'Giao hàng tiết kiệm',
      image: AppResource.images.imgGhtk,
    },
    // { name: 'Khác', value: 'custom' },
  ],
};

export default AppData;
