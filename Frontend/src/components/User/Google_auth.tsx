// components/GoogleAuth.tsx
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useState } from 'react';
import { Base_URL } from '../../credentials';
import { googleLogin } from '../../redux/actions/UserActions';
import { useDispatch, useSelector } from "react-redux";


interface GoogleUser {
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
  sub: string;
}

const GoogleAuthButton = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      const decoded: GoogleUser = jwtDecode<GoogleUser>(credentialResponse.credential as string);
      console.log( decoded.email,
       decoded.given_name,
         decoded.family_name,
         decoded.picture,
        decoded.sub,"ideally")
      
        const credential = credentialResponse.credential; 
        // const login = await dispatch(googleLogin(credential));

  
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider >
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
            setLoading(false);
          }}
          useOneTap
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthButton;