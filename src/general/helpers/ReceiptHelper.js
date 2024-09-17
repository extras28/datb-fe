import AppData from 'general/constants/AppData';

const ReceiptHelper = {
  getReceiptStatusText: (status) => {
    switch (status) {
      case AppData.RECEIPT_STATUS.NOT_SEND:
        return AppData.receiptStatus.find((item) => item.value == AppData.RECEIPT_STATUS.NOT_SEND)
          .name;
      case AppData.RECEIPT_STATUS.SENT:
        return AppData.receiptStatus.find((item) => item.value == AppData.RECEIPT_STATUS.SENT).name;

      default:
        return '';
    }
  },
  getReceiptStatusColor: (status) => {
    switch (status) {
      case AppData.RECEIPT_STATUS.SENT:
        return 'success';
      case AppData.RECEIPT_STATUS.NOT_SEND:
        return 'warning text-dark';

      default:
        return '';
    }
  },
};

export default ReceiptHelper;
