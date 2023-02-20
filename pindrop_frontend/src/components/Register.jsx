import { useRef, useState } from 'react';
import axios from "axios";
import './register.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
    };

    try {
        await axios.post('/api/users/register', newUser);
        setFailure(false);
        setSuccess(true);
    } catch (err) {
        setSuccess(false);
        setFailure(true);
    }
  };

  return (
    <div className='registerContainer'>
        <div className='logo-register'>
            <LocationOnIcon />
            Pin Drop
        </div>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='username' ref={usernameRef} />
            <input type='email' placeholder='email' ref={emailRef} />
            <input type='password' placeholder='password' ref={passwordRef} />
            <button className='registerBtn'>Register</button>
            {success && (
                <span className='success'>Successful! You can login now! </span>
            )}
            {failure && (
                <span className='failure'>Oops! Something went wrong! </span>
            )}
        </form>
        <CancelIcon className='registerCancel' onClick={() => setShowRegister(false)} />
    </div>
  )
}

export default Register