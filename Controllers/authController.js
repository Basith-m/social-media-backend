import userModel from "../Models/userSchema.js";
import bcrypt from "bcrypt";

// registering a new user
export const userRegister = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  // creating salt
  const salt = await bcrypt.genSalt(10);
  // password hashing / crypt
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    username,
    password: hashedPass,
    firstname,
    lastname,
  });

  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// login user

export const userLogin = async (req, res) => {
  const { username, password } = req.body

  try{
    // find the user using username
    const user = await userModel.findOne({username: username})
    if(user){
      // validation using password
      const validity = await bcrypt.compare(password, user.password)
      // 400 un authenticated user
      validity ? res.status(200).json(user) : res.status(400).json("Wrong Password")
    }else{
      // 404 - Not found
      res.status(404).json("User deos not exists")
    }
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}
