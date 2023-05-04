import Message from "../models/message.js";
import Chat from "../models/chat.js";
import User from "../models/users.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

export const allMessages = catchAsyncErrors(async (req, res, next) => {

  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate("chat");
  res.json(messages);

  res.status(200).json({
    success: true,
    messages,
  });
});



export const sendMessage = catchAsyncErrors(async (req, res, next) => {

  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new ErrorHandler("Invalid data passed into request", 400));
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  var message = await Message.create(newMessage);

  message = await message.populate("sender", "name pic").execPopulate();
  message = await message.populate("chat").execPopulate();
  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

  res.status(200).json({
    success: true,
    message,
  });
});

