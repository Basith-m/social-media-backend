import mongoose from "mongoose";
import postModel from "../Models/postSchema.js";
import userModel from "../Models/userSchema.js";

// create post
export const createPost = async (req, res) => {
    const newPost = await postModel(req.body)

    try {
        await newPost.save()
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
}


// get post
export const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await postModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

// update a post
export const updatePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await postModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post Updated...")
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete a post
export const deletePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await postModel.findById(postId)

        if (post.userId === userId) {
            await post.deleteOne()
            res.status(200).json("Post Deleted Successfully...")
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// like and unlike post
export const likePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await postModel.findById(postId)
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json("Post liked")
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json("Post unliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// get timeline post
export const getTimelinePost = async (req, res) => {
    const userId = req.params.id

    try {
        const currentUserPost = await postModel.find({ userId: userId })
        const followingPosts = await userModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            }, 
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])
        res.status(200).json(currentUserPost.concat(...followingPosts[0].followingPosts).sort((a,b) => {
            return b.createdAt - a.createdAt;
        }))
    } catch (error) {
        res.status(500).json(error)
    }
}