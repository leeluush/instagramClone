const Like = require('../models/like');
const asyncHandler = require('express-async-handler');



// Function to handle like operation
const like = asyncHandler(async function (req, res) {
    // Extracting userId and postId from the request body
    const { userId  } = req.body;
    const { postId } = req.params;

    

    try {
        // Creating a new Like instance
        const like = new Like({ user: userId, post: postId });

        // Saving the Like instance to the database
        await like.save();

        // If successful, returning a success message
        return res.status(200).json({ message: "Like created successfully" });
    } catch (err) {
        // If error occurs, returning an error message
        return res.status(500).json({ error: "An error occurred while creating the like" });
    }
});

// Function to handle unlike operation
const unlike = asyncHandler(async function (req, res) {
    // Extracting userId from the request body
    const { userId  } = req.body;
    // Extracting postId from req param
    const { postId } = req.params

    try {
        // Finding the Like instance in the database and removing it
        const like = await Like.findOneAndRemove({ user: userId, post: postId });

        // If successful, returning a success message
        return res.status(200).json({ message: "Like deleted successfully" });
    } catch (error) {
        // If error occurs, returning an error message
        return res.status(500).json({ error: "An error occurred while deleting the like" });
    }
});


// Function to handle likes number calacultion 

const getLikesCount = asyncHandler(async function (req ,res){
    const { postId } = req.params;
    try {
        const likesCount = await Like.countDocuments({post: postId});
        res.status(200).json({ likesCount })
    } catch (error) {
        res.status(500).json({error: "an error occurred while counting the likes"})
    } 

})

const getLikesCountComments = asyncHandler(async function (req ,res){
    const { commentId } = req.params;
    try {
        const likesCount = await Like.countDocuments({comment: commentId});
        res.status(200).json({ likesCount })
    } catch (error) {
        res.status(500).json({error: "an error occurred while counting the likes"})
    }

})

// Function to check if a like exists
const checkLike = asyncHandler(async function (req, res) {
    // Extracting userId and postId from the request params
    const { userId, postId } = req.params;

    try {
        // Check if a Like instance exists
        const like = await Like.findOne({ user: userId, post: postId });

        // If successful, return true or false based on whether a like exists
        return res.status(200).json({ liked: !!like });
    } catch (err) {
        // If error occurs, returning an error message
        return res.status(500).json({ error: "An error occurred while checking the like" });
    }
});


module.exports = {
    like,
    unlike,
    getLikesCount,
    getLikesCountComments,
    checkLike
}
