import { thunkGetAccountInfor } from 'app/authSlice';
import AccountHelper from 'general/helpers/AccountHelper';
import Global from 'general/utils/Global';
import _ from 'lodash';
import { thunkGetListPostOffice } from 'modules/eShip/features/PostOffice/postOfficeSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

DataCommonListener.propTypes = {};

const sTag = '[DataCommonListener]';

function DataCommonListener(props) {
  // MARK: --- Params ---
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.current);

  // MARK: --- Hooks ---
  useEffect(() => {
    if ((!_.isEmpty(currentUser) && currentUser?.userId) || AccountHelper.checkAccessTokenValid()) {
      dispatch(thunkGetListPostOffice(Global.gFiltersPostOfficeList));
    }
    if (_.isEmpty(currentUser) && AccountHelper.checkAccessTokenValid()) {
      dispatch(thunkGetAccountInfor());
    }
  }, [currentUser]);

  return <></>;
}

export default DataCommonListener;
