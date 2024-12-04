import express from "express";
import cors from "cors";
import colors from 'colors'
import userRoutes from "./routes/Users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import Auth from "./models/auth.js";


import connectDB from './config/connectDB.js'
import Stripe from "stripe";
 
connectDB()

const PORT = 5000

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);


const Secret_Key = "sk_test_51PAVfGSFGtS1rLybZ1G8gBFthIwlnVduGjFbM87NQJOPp3flICqL3fggS6FeAfPQkwtkBP7jdGXvzJqEsTpk7I8t002mMHYvIr";
const stripe = new Stripe(Secret_Key); 

  app.post( "/payment/create-checkout-session", async(req, res) => {
      const prod = req.body;
      // console.log(prod.email);

      
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:[
          {
          price_data: {
            currency: "usd",
            unit_amount: 2000,
            product_data: {
              name: 'Premium Subscription',
            },
          },
          quantity: 1,
        }],
        // phone_number_collection:{
        //   enabled:true,
        // },
        customer_email: prod.email,
        mode: 'payment',
        success_url: `http://localhost:5000/success?user_id=${prod._id}`,
        cancel_url: 'http://localhost:5000/failed',
      });
      // console.log(session);
      res.json({id:session.id,});  
      // console.log(prod._id);
  });

app.get('/success', async(req, res) =>{
  const {user_id} = req.query;
  await Auth.findByIdAndUpdate(user_id, {premium : true})
  // const userdetail = await Auth.findById(user_id)
  // console.log(userdetail);
  res.redirect('http://localhost:3000/AskQuestion')
});


app.get('/failed',(req, res)=>{
  setTimeout(() => {
    res.redirect('http://localhost:3000/premium')
  }, 2000);
})


app.get('/', (req, res) => {
  res.send("stack overflow clone by Pavan Kumar Sharma")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgBlue.white)
})
