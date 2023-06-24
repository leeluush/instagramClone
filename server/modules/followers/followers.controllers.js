const userService = require('../../services/user.service')
const Follower = require('./follower.model')

async function followUser(req, res) {

    try {
        const followee = req.params.id;
        const user = req.user.id;

        const follower = new Follower({
            user, followee
        })



        await follower.save()
     res.status(200).json({ message: "Followed Sucessfully" });


    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

async function unfollowUser(req, res) {
    try {
        const followee = req.params.id;
        const user = req.user.id;

        await Follower.findOneAndRemove({ followee, user })

        res.status(200).json({ message: "Unfollowed successfully" })
    } catch (error) {

    }
}

module.exports = {
    followUser,
    unfollowUser
}
