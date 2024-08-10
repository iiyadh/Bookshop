import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

  const navigate = useNavigate();
  const [right, setRight] = useState(false);
  axios.defaults.withCredentials = true;

  const SignIN = useRef(null);
  const handleSignIn = async (e) => {
    e.preventDefault();
    const formData = new FormData(SignIN.current);
    const Data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    try {
      const resp = await axios.post('http://localhost:5000/login', Data);
      if(resp.status == 200){
        toast.success(resp.data.msg);
        navigate('/Dashboard');
      }else if(resp.status == 203){
        toast.warn(resp.data.msg);
      }else{
        toast.error("Failed to sign in");
      }
    } catch (err) {
      toast.error("Failed to sign in.");
      console.log(err);
    }
  };

  const SignUP = useRef(null);
  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(SignUP.current);
    const Data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
    try{
      const resp = await axios.post('http://localhost:5000/signup', Data);
      console.log(resp.data);
      if(resp.status == 200){
        toast.success(resp.data.msg);
      }else if(resp.status == 203){
        toast.warn(resp.data.msg);
      }else{
        toast.error("Failed to sign up");
      }
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className='Login'>
      <div className={`container ${right ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={(e) => handleSignUp(e)} ref={SignUP}>
            <h1>Create Account</h1>
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={(e) => handleSignIn(e)} ref={SignIN}>
            <h1>Sign in</h1>
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={() => { setRight(false) }}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={() => { setRight(true) }}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer className="noti"/>
    </div>
  )
}

export default Login;