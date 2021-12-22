import React, {FunctionComponent} from 'react';

import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { logUser} from '../../../Redux/Slices/user'
// refresh token
import { refreshTokenSetup } from '../../../utils/refreshToken';

const clientId ='1022962829004-ntct2adg6t1jk4rq3ns6al7as585i5mi.apps.googleusercontent.com';
const LoginButton: FunctionComponent = () =>  {
  const dispatch = useDispatch();
  const onSuccess = (res: any) => {    
    refreshTokenSetup(res);
    dispatch(logUser(res.profileObj));
  };

  const onFailure = (res: any) => {
    
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default LoginButton;
