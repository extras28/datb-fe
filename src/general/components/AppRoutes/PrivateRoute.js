import AccountHelper from 'general/helpers/AccountHelper';
import UserHelper from 'general/helpers/UserHelper';
import { Navigate } from 'react-router-dom';

// Route yeu cau phai dang nhap
// Neu chua dang nhap nhay ve man hinh dang nhap '/sign-in'
function PrivateRoute(props) {
  // MARK: --- Params ---
  const isAuth = AccountHelper.checkAccessTokenValid();

  return isAuth ? props.children : <Navigate to="/auth" />;
}

export default PrivateRoute;
