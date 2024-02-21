import userModel from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// registering a new user
export const userRegister = async (req, res) => {
  // creating salt
  const salt = await bcrypt.genSalt(10);
  // password hashing / crypt
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass
  const newUser = new userModel(req.body);
  const { username } = req.body
  try {
    const oldUser = await userModel.findOne({ username })
    if (oldUser) {
      return res.status(400).json("Username already registered!")
    }
    const user = await newUser.save();
    const token = jwt.sign({
      username: user.username, id: user._id
    }, process.env.JWT_KEY, { expiresIn: '1h' })
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// login user

export const userLogin = async (req, res) => {
  const { username, password } = req.body

  try {
    // find the user using username
    const user = await userModel.findOne({ username: username })
    if (user) {
      // validation using password
      const validity = await bcrypt.compare(password, user.password)
      // 400 un authenticated user
      if (!validity) {
        res.status(400).json("Wrong Password")
      } 
      else {
        const token = jwt.sign({
          username: user.username, id: user._id
        }, process.env.JWT_KEY, { expiresIn: '1h' })
        res.status(200).json({ user, token });
      }
    } else {
      // 404 - Not found
      res.status(404).json("User deos not exists")
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
