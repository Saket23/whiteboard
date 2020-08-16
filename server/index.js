const express = require("express")
const socket = require("socket.io")
const cors = require("cors")

const PORT = 5000;

const app = express();
app.use(cors())

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})

// Static files
app.use(express.static("public"));

const data = [
    { id: 1, name: 'saket' }
]

//routes
app.get('/', (req, res) => {
    res.status(200).json(data);
})

// Socket setup
const io = socket(server);

io.on("connection", function (socket) {
    socket.username = 'Anonymous';

    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', { message: data.message, username: socket.username })
    })

    socket.on("add_path", (data) => {
        socket.broadcast.emit('add_path', { data });
    })
});