const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is started");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    // Handle user setup
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    // Handle joining a chat room
    socket.on('join chat', (roomId) => {
        socket.join(roomId);
        console.log("User joined room " + roomId);
    });

    // Handle sending a message
    socket.on('send message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) {
            return console.log("Chat is undefined");
        }

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) {
                return;
            }
            socket.in(user._id).emit("Message received", newMessageReceived);
        });
    });

    // Handle typing events
    socket.on('typing', (room) => {
        socket.in(room).emit("typing");
    });

    socket.on('stop typing', (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userData._id);
    })
});
