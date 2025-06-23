import prisma from '../prisma.js';

const getChatWithUser = async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    const currentUserId = parseInt(req.user?.id);

    if (isNaN(otherUserId) || isNaN(currentUserId)) {
      return res.status(400).json({ error: "Invalid user IDs." });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      orderBy: { createdAt: "asc" }
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

  
  export{
    getChatWithUser,
  }