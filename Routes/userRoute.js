import express from 'express'
import { deleteUser, followUser, getUser, unfollowUser, updateUser } from '../Controllers/userController.js'

const router = express.Router()

router.get('/', async (req, res) => {
    res.send(`<h2>user route<h2>`)
})

router.get('/:id', getUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unfollowUser)
export default router;