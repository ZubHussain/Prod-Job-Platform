import Notification from "../models/Notification.js";
const uid = req => req.headers["x-user-id"];
export async function list(req,res){ res.json(await Notification.find({userId:uid(req)}).sort({createdAt:-1}).limit(100)); }
export async function markRead(req,res){ res.json(await Notification.findOneAndUpdate({_id:req.params.id,userId:uid(req)},{$set:{read:true}},{new:true})); }
