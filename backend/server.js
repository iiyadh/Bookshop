const express = require("express");
const session = require("express-session");
const cors = require('cors');
const db = require('./db/config');
const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));


app.post("/login", (req, res) => {
  const {email ,password} = req.body;
  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email,password],(err,result)=>{
    if(!err){
      console.log()
      if(result.length > 0){
        req.session.user = {name:result[0].name,email};
        req.session.isAuth = true;
        res.status(200).json({msg: "Login Successfull", user: req.session.user ,isAuth:req.session.isAuth});
      }else{
        res.status(203).json({msg : "Invalid Credintial"});
      }
  }else{
    res.status(500).json({msg : "Internal Server Error"});
  }
})
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
    if (result.length > 0) {
      return res.status(203).json({ msg: "Email Already Exists" });
    } 
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err, result) => {
        if (err) {
          return res.status(500).json({ msg: "Internal Server Error" });
        }
        res.status(200).json({ msg: "Account Created Successfully" });
      }
    );
  });
});

app.post("/addbook", (req, res) => {
  const {  title,price,description,bookImg,quantity	 } = req.body;
  db.query("SELECT * FROM books WHERE title = ?", [title], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
    if (result.length > 0) {
      return res.status(203).json({ msg: "Book Already Exists" });
    } 
    db.query(
      "INSERT INTO books (title, price, description, bookImg , quantity) VALUES (?, ?, ?, ? ,?)",
      [title,price,description,bookImg,quantity],
      (err, result) => {
        if (err) {
          return res.status(500).json({ msg: "Internal Server Error" });
        }
        res.status(200).json({ msg: "Book Added Successfully" });
      }
    );
  });
});


app.get("/getbooks",(req,res)=>{
  db.query("SELECT * FROM books",(err,result)=>{
    if(!err){
      res.status(200).json(result);
    }else{
      res.status(300).json({msg:"Internal Server Error"});
    }
  })
})

app.get("/orders",(req,res)=>{
  db.query("SELECT * FROM orders",(err,result)=>{
    if(!err){
      res.status(200).json(result);
    }else{
      res.status(300).json({msg:"Internal Server Error"});
    }
  })
})

app.post("/placeorder",(req,res)=>{
  const {name,email} = req.body.user;
  const totalprice = req.body.totalPrice;
  const orders = req.body.items;
  db.query("INSERT INTO orders (username,email,totalprice,ord) VALUES (?,?,?,?) ",[name,email,totalprice,orders],(err,result)=>{
    if(!err){
      res.status(200).json({msg:"Order Placed Successfully"});
    }else{
      res.status(300).json({msg:"Internal Server Error"});
    }
  })
})


app.delete("/deletebook/:id",(req,res)=>{
  db.query("DELETE FROM books WHERE ID = ?",[req.params.id],(err,result)=>{
    if(!err){
      res.status(200).json({msg : "Book Deleted Successfully"});
    }else{
      res.status(500).json({msg:"Internal Server Error"});
    }
  })
})

app.post("/editbook/:id", (req, res) => {
  const { ID,title, price, description, bookImg, quantity } = req.body;
  db.query("SELECT * FROM books WHERE title = ?", [title], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
    if (result.length > 0 && ID !=result[0].ID) {
      return res.status(203).json({ msg: "Title Already Exists" });
    }
    db.query(
      "UPDATE books SET title = ?, price = ?, description = ?, bookImg = ?, quantity = ? WHERE ID = ?",
      [title, price, description, bookImg, quantity, req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ msg: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ msg: "Book Not Found" });
        } 
        res.status(200).json({ msg: "Book Edited Successfully" });
      }
    );
  });
});

app.get("/check", (req, res) => {
  if (req.session.isAuth) {
    res.json({msg:"Pass",user:req.session.user});
  } else {
    res.json({msg:"Not"});
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.clearCookie('connect.sid');
    res.send("Logged out");
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});