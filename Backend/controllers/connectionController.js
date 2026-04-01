import Connection from "../models/Connection.js";


export const sendRequest = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // ❌ Cannot send to yourself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself"
      });
    }

    // ❌ Check existing connection
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ],
      status: { $in: ["pending","accepted"]}
    });

    if (existingConnection) {
      return res.status(400).json({
        message: "Connection request already exists"
      });
    }

    // ✅ Create connection
    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    });

    // ✅ Response
    res.status(201).json({
      message: "Connection request sent successfully",
      connection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Accept Request
export const acceptRequest = async (req,res) => {
    try {
        const connectedId = req.params.id;
        const userId = req.user._id;

        const connection = await Connection.findById(connectedId);

        if(!connection){
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        // 🔐 Only receiver can accept
        if (connection.receiver.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this request"
            });
        }

        // ❌ Already handled
        if (connection.status !== "pending") {
            return res.status(400).json({
                message: `Request already ${connection.status}`
            });
        }


        // ✅ Accept request
        connection.status = "accepted";
        await connection.save();

        // 📤 Response
        res.status(200).json({
            message: "Connection request accepted",
            connection
        });

    } catch (error){
        res.status(500).json({ message: error.message });
    }
};




export const rejectRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const userId = req.user._id;

    // 🔍 Find connection
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found"
      });
    }

    // 🔐 Only receiver can reject
    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reject this request"
      });
    }

    // ❌ Already handled
    if (connection.status !== "pending") {
      return res.status(400).json({
        message: `Request already ${connection.status}`
      });
    }

    // ❌ Reject request
    connection.status = "rejected";
    await connection.save();

    // 📤 Response
    res.status(200).json({
      message: "Connection request rejected",
      connection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ],
      status: "accepted"
    })
    .populate("sender", "-password")
    .populate("receiver", "-password");

    res.status(200).json({
      connections
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};