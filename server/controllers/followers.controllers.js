const userService = require('../services/user.service')

async function followUser (req, res) {

    try {
        const userId = req.params.id;
        const followerId = req.user.id;

        await userService.addFollwing(userId,followerId);
        
        res.status(200).json({message: "Followed Sucessfully"});

        
    } catch(error)  {
        res.status(500).json({message: error.message})
        
    }
}

async function unfollowUser (req ,res) {
    try {
        const userId = req.params.id;
        const followerId = req.user.id;

        await userService.removeFollwing(userId, followerId);

        res.status(200).json({message:"Unfollowed successfully"})
    } catch (error) {
        
    }
}

module.exports = {
    followUser,
    unfollowUser
  }
