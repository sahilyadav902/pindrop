import { useRef, useState } from 'react';
import axios from "axios";
import './login.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [failure, setFailure] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
    };

    try {
        const res = await axios.post('/api/users/login', user);
        setCurrentUser(res.data.username);
        myStorage.setItem('user', res.data.username);
        setShowLogin(false);
        setFailure(false);
    } catch (err) {
        setFailure(true);
    }
  };

  return (
    <div className='loginContainer'>
      <div className='logo-login'>
          <LocationOnIcon />
          Pin Drop
      </div>
      <form onSubmit={handleSubmit}>
          <input type='text' placeholder='username' ref={usernameRef} />
          <input type='password' placeholder='password' ref={passwordRef} />
          <button className='loginBtn'>Login</button>
          {failure && (
              <span className='failure'>Oops! Something went wrong! </span>
          )}
      </form>
      <CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
    </div>
  )
}

export default Login