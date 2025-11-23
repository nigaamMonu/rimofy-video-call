import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// api/users/recommended
export const getRecommendedUsers = async(req, res)=>{
  try{
    const currentUserId = req.user._id;
    const currentUser = req.user;

    // find users who are not friends and not the current user
    const recommendedUsers = await User.find({
      $and:[
        {_id: {$ne: currentUserId}}, // not the current user
        {_id: {$nin: currentUser.friends}}, // not friends with current user
        {isOnBoarded: true} // only onboarded users
      ]
    }).select("-password -email -__v -createdAt -updatedAt"); // exclude sensitive fields

    res.status(200).json( recommendedUsers);

  }catch(err){
    console.log("Error in getRecommendedUsers:", err);
    res.status(500).json({message: "Internal Server Error in getRecommendedUsers"});
  }
}

// api/users/friends
export const getMyFriends = async(req, res)=>{
  try{
    const currentUserId = req.user._id;
    const user = await User.findById(currentUserId).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage location");

    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    return res.status(200).json(user.friends);

  }catch(err){
    console.log("Error in getMyFriends:", err);
    res.status(500).json({message: "Internal Server Error in getMyFriends"});
  }
}

// api/users/friend-request/:id (send friend request)
export const sendFriendRequest = async (req, res) => {
  try{
    const myId =req.user._id;
    const {id : recipientId }= req.params;

    // Prevent sending request to self
    if(myId.toString() === recipientId.toString()){
      return res.status(400).json({success:false, message: "Your cannot send friend request to yourself."});
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if(!recipient){
      return res.status(404).json({success:false, message: "Recipient user not found."});
    }

    // Check if already friends
    if(recipient.friends.includes(myId)){
      return res.status(400).json({success:false, message: "You are already friends with this user."});
    }

    // Check if a friend request already exists
    const exsitingRequest = await FriendRequest.findOne({
      $or:[
        {sender: myId, recipient: recipientId},
        {sender: recipientId, recipient: myId}
      ],
      
    });

    if(exsitingRequest){
      return res.status(400).json({success:false, message: "A friend request already exists between you and this user."});
    }

    const newFriendRequest = new FriendRequest({
      sender :myId,
      recipient: recipientId,
    })
    await newFriendRequest.save();

    
     res.status(200).json(newFriendRequest);

  }catch(err){
    console.log("Error in sendFriendRequest:", err);
    res.status(500).json({message: "Internal Server Error in sendFriendRequest"});
  }
}


// api/users/friend-request/:id/accept (accept friend request)
export const acceptFriendRequest = async (req, res) => {
  try{
    const {id: requestId} = req.params;
    const myId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest){
      return res.status(404).json({success:false, message: "Friend request not found."});
    }

    if(friendRequest.recipient.toString() !== myId.toString()){
      return res.status(403).json({success:false, message: "You are not authorized to accept this friend request."});
    }

    if(friendRequest.status !== 'pending'){
      return res.status(400).json({success:false, message: `This friend request has already been ${friendRequest.status}.`});
    }

    // Update the friend request status to accepted
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add each user to the other's friends list
    await User.findByIdAndUpdate(myId, {$addToSet:{friends: friendRequest.sender}});
    await User.findByIdAndUpdate(friendRequest.sender, {$addToSet:{friends: myId}});

    res.status(200).json({success:true, message: "Friend request accepted.", friendRequest});
  }catch(err){
    console.log("Error in acceptFriendRequest controllers:", err);
    res.status(500).json({message: "Internal Server Error in acceptFriendRequest"});
  }
}


// api/users/friend-request (get all friend requests)
export const getFriendRequests = async(req,res)=>{
  try{
    const myId = req.user._id;

    const incomingReqs = await FriendRequest.find({recipient: myId, status:'pending'}).populate('sender','fullName profilePic nativeLanguage learningLanguage location');
   

    const acceptedReqs = await FriendRequest.find({recipient: myId, status:'accepted'}).populate('recipient','fullName profilePic');
   

    res.status(200).json({incomingReqs, acceptedReqs});
  }catch(err){
    console.log("Error in getFriendRequests controllers:", err);
    res.status(500).json({message: "Internal Server Error in getFriendRequests"});
  }
}



// api/users/outgoing-friend-requests (get all outgoing friend requests)
export const getOutgoingFriendRequests = async(req,res)=>{
  try{
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", " fullName profilePic nativeLanguage learningLanguage location");

    res.status(200).json(outgoingRequests);
  }catch(err){
    console.log("Error in getOutgoingFriendRequests controllers:", err);
    res.status(500).json({message: "Internal Server Error in getOutgoingFriendRequests"});
  }
}