import Notification from "../models/notification.model.js"

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id

    const notifications = await Notification.find({to: userId}).populate({
      path: "from",
      select: "username profileImg"
    })

    await Notification.updateMany({to:userId}, {read:true})
    const filteredNotifications = notifications.filter(notification => notification.from._id.toString() !== userId.toString());
    res.status(200).json(filteredNotifications);
    return;
  } catch (error) {
    console.error("Error in getNotification controller", error)
    res.status(500).json({error: "Internal server error"})
  }
}

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id

    await Notification.deleteMany({to:userId})
    res.status(200).json({message: "Notification Deleted Successfully"})
  } catch (error) {
    console.error("Error in deleteNotification controller", error)
    res.status(500).json({error: "Internal server Error"})
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id
    const userId = req.user._id
    const notification = await Notification.findById(notificationId)

    if(!notification){
      return res.status(404).json({error: "Notification not Found"})
    }

    if(notification.to.toString() !== userId.toString()){
      return res.status(403).json({error: "You are not allowed to delete this"})
    } 
    await Notification.findByIdAndDelete(notificationId)
    res.status(200).json({message: "Notification deleted Successfully"})
  } catch (error) {
    console.error("Error in deleteNotification controller", error)
    res.status(500).json({error: "Internal server Error"})
  }
}