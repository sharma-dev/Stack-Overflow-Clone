import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import icon from "../../assets/icon.png";
import AboutAuth from "./AboutAuth";
import toast from "react-hot-toast";
import { signup, login } from '../../actions/auth';
import './Auth.css'

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSwitch = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!email && !password) {
      return toast.error("Please enter email and password");
    }
    else if(!email){
      return  toast.error("Please enter your email address");
    }
    else if(!password){
      return   toast.error("Please provide a password") ;
    }
    
    

    if (isSignup) {
      if (!name) {
        return toast.error("Please enter name")
      }
      try{
        const signupres = await dispatch(signup({ name, email, password }, navigate));
        // console.log("hello"+signupres);
        if (!signupres) {
          toast.error('Account Already Exist');
        }
        else{
        toast.success('Redirecting...')
        toast.success('User registered successfully')
        toast.success('Logged in successfully')
        }
      }
      catch(error){
        // console.log(error);
        toast.error('Error Occurred while registering user');
      }
    } else {
      try {
        const loginResponse =  await dispatch(login({ email, password }, navigate)); // Dispatch login action and capture response
        // console.log("hello"+loginResponse);
        
        if (!loginResponse) {
          toast.error("Email and password does not match");
        } else {
          toast.success('Redirecting...');
          toast.success('Logged in successfully');
        }
      } catch (error) {
        console.error(error); // Log the error for debugging
        toast.error("An error occurred. Please try again later.");
      }
    }

  }

  return (
    <section className="auth-section">
      {isSignup && <AboutAuth />}
      <div className="auth-container-2">
        <img src={icon} alt="stack overflow" className="login-logo" />
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label htmlFor="name">
              <h4>Name</h4>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
          )}
          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <label htmlFor="password">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Password</h4>
              {!isSignup && (
                <p style={{ color: "#007ac6", fontSize: "13px" }}>
                  Forgot password?
                </p>
              )}
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </label>
          <button type="submit" className="auth-btn">
            {isSignup ? "Sign up" : "Log in"}
          </button>
        </form>
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            className="handle-switch-btn"
            onClick={handleSwitch}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </section>
  )
}

export default Auth