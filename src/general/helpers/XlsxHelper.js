import * as XLSX from 'xlsx';
import _ from 'lodash';

const XlsxHelper = {
  get_header_row: (sheet) => {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);

    var C,
      R = range.s.r; /* start in the first row */
    /* walk every column in the range */

    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */

      var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

      headers.push(hdr);
    }
    return headers;
  },
};

export default XlsxHelper;
