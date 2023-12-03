// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3000");

// Listen for messages
socket.addEventListener("message", (event) => {
    console.log(event.data);
});

// Connection closed
socket.addEventListener("error", (event) => {
    console.log('ERROR')
});

// Connection opened
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!!");
});