import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({username}).select("-password")
    if(!user) {
      return res.status(404).json({error: "User not found"})
    }
    res.status(200).json(user)
  } catch (error) {
    console.error("Error in get user profile", error.message)
    res.status(500).json({ error: error.message })
  }
}

export const followUnfollowUser = async (req, res) => {

  try {
    const {id} = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()){
      return res.status(400).json({error: "You cannot follow/unfollow yourself"})
    }
    if(!userToModify || !currentUser){
      return res.status(404).json({error: "User not found"})
    }
    const isFollowing = currentUser.following.includes(id)

    if(isFollowing){
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      })
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      })
      res.status(200).json({message: "Unfollowed successfully"})  
    }else{
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      })
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      })

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      })

      await newNotification.save()
      res.status(200).json({message: "Followed successfully"})
    }
  } catch (error) {
    console.error("Error in followUnfollowUser", error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getSuggestedUsers = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}
