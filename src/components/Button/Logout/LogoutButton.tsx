import React , {FunctionComponent}from 'react';
import { GoogleLogout } from 'react-google-login';
import { logout } from '../../../Redux/Slices/user';
import { useDispatch } from 'react-redux';

const clientId ='1022962829004-ntct2adg6t1jk4rq3ns6al7as585i5mi.apps.googleusercontent.com';
const LogoutButton: FunctionComponent = () => {
  const dispatch = useDispatch()
  const onSuccess = () => {
    console.log('Logout made successfully');
    dispatch(logout());
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default LogoutButton;