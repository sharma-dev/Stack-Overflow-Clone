import React from 'react';
import './Premium.css';
import { useSelector } from 'react-redux';
import {loadStripe} from '@stripe/stripe-js';
function Premium() {
  
  const User = useSelector(state => state.currentUserReducer);
  const makePayment = async()=>{
  
    const key  ="pk_test_51PAVfGSFGtS1rLyb3NxKUajbiHIOGGIwr2cugwgE4gvR1cpENVN6fEAPbW9r4NEM3uUQJOnllXs24QaSIncqswdZ00GUKdxY1j";
      const stripe = await loadStripe(key);
      // console.log(User.result);
      const headers = {
        "Content-Type":"application/json",
      }

      const response = await fetch("http://localhost:5000/payment/create-checkout-session", {
        method:"POST",
        headers:headers,
        body : JSON.stringify(User.result),
      });

      const session = await response.json();
      console.log(session);
      const result = stripe.redirectToCheckout({
        sessionId : session.id
        }
      )

      if(result.error){
        console.log(result.error);
      }

      // console.log(User.result.premium);
  }
  return (
    <div className="pricing-page">
      <h1>Become a Premium Member</h1>
      <div className="pricing-card premium">
        <h2>Premium</h2>
        <p>$20 per Member</p>
        <p>Get Acces to our Premium Features</p>
        <ul>
          <li>● Ask Unlimited Questions</li>
          <li>● See Unlimited Answers</li>
        </ul>
        <button onClick={makePayment}>Get Started With Premium</button>
      </div>
      <div className="pricing-card">{/* Add content for Personal plan here */}</div>
    </div>
  );
}

export default Premium;
