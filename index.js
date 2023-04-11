import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/crudOperation",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database connected");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  mobile: Number,
  work: String,
  add: String,
  desc: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/getAll", (req, res) => {
  User.find({}, (err, UserList) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(UserList);
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, age, mobile, work, add, desc } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        age,
        mobile,
        work,
        add,
        desc,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        }
        User.find({}, (err, UserList) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send(UserList);
          }
        });
      });
    }
  });
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  User.deleteOne({ _id: id }, () => {
    User.find({}, (err, UserList) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(UserList);
      }
    });
  });
});

app.listen(9002, () => {
  console.log("server listen on 9002");
});
