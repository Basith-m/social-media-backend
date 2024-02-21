import userModel from "../Models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// get all users
export const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find()
        console.log(users);
        users = users.map((user) => {
            const {password, ...otherDetails} = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await userModel.findById(id)
        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("User does not exist");
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//  update a user

export const updateUser = async (req, res) => {
    const id = req.params.id
    const { _id, currentUserAdminStatus, password } = req.body

    if (id === _id) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt)
            }
            const user = await userModel.findByIdAndUpdate(id, req.body, { new: true })

            const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_KEY, { expiresIn: "1h" })
            res.status(200).json({user, token})
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access denied..! You can only update your own profile")
    }
}

// delete user 
export const deleteUser = async (req, res) => {
    const id = req.params.id
    const { _id, currentUserAdminStatus } = req.body

    if (_id === id || currentUserAdminStatus) {
        try {
            await userModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully...")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access denied..! You can only delete your own profile")
    }
}

// follow user
export const followUser = async (req, res) => {
    const id = req.params.id
    const { _id } = req.body
    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(_id)

            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } })
                await followingUser.updateOne({ $push: { following: id } })
                res.status(200).json("User followed...")
            } else {
                res.status(403).json("User already followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

// unfollow user
export const unfollowUser = async (req, res) => {
    const id = req.params.id
    const { _id } = req.body
    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(_id)

            console.log(_id);

            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } })
                await followingUser.updateOne({ $pull: { following: id } })
                res.status(200).json("User unfollowed...")
            } else {
                res.status(403).json("User is not followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}