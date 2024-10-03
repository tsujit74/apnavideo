import { Server } from "socket.io"


let connections = {};
let messages = {};
let timeOnline = {};
let usernames = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        socket.on("join-call", (path,username) => {
            if (!username) {
                console.error(`Username is missing for socket: ${socket.id}`);
                return;
            }
            usernames[socket.id] = username;
            console.log(`${username} joined the call`);
            if (connections[path] === undefined) {
                connections[path] = []
            }
            
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // connections[path].forEach(elem => {
            //     io.to(elem)
            // })

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path],username)
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        });

        socket.on("end-call", (path) => {
            // Notify all users that the call has ended
            connections[path].forEach((userSocketId) => {
              io.to(userSocketId).emit("call-ended");
            });
      
            // Clean up connections and messages for the room
            delete connections[path];
            delete messages[path];
          });

          socket.on("disconnect-call", () => {
            const username = usernames[socket.id];
          console.log(`User ${username} has clicked End Call`);
    
          // Log the user's disconnect time
          var diffTime = Math.abs(timeOnline[socket.id] - new Date());
    
          let roomKey;
    
          // Find the room the user belongs to by iterating through connections
          for (const [roomId, users] of Object.entries(connections)) {
            if (users.includes(socket.id)) {
              roomKey = roomId;
              break;
            }
          }
    
          if (roomKey) {
            // Notify other users in the room that this user has left
            connections[roomKey].forEach((userSocketId) => {
              if (userSocketId !== socket.id) {
                // Don't notify the disconnecting user
                io.to(userSocketId).emit("user-left",socket.id, username);
              }
            });
    
            // Remove the disconnecting user from the room's user list
            const userIndex = connections[roomKey].indexOf(socket.id);
            if (userIndex !== -1) {
              connections[roomKey].splice(userIndex, 1); // Remove user from room
            }
    
            // If the room is empty, delete the room
            if (connections[roomKey].length === 0) {
              delete connections[roomKey];
            }
    
            // Manually disconnect the user from the backend
            socket.disconnect();
          }
        });
    
        socket.on("disconnect", () => {
            const username = usernames[socket.id];
            console.log(`User ${username} (${socket.id}) has disconnected`);
    
          let roomKey;
    
          // Find which room the user was part of
          for (const [roomId, users] of Object.entries(connections)) {
            if (users.includes(socket.id)) {
              roomKey = roomId;
              break;
            }
          }
    
          if (roomKey) {
            // Notify other users in the room that this user has left
            connections[roomKey].forEach((userSocketId) => {
              if (userSocketId !== socket.id) {
                // Don't notify the disconnecting user
                io.to(userSocketId).emit("user-left", socket.id,username);
              }
            });
    
            // Remove the disconnecting user from the room's user list
            const userIndex = connections[roomKey].indexOf(socket.id);
            if (userIndex !== -1) {
              connections[roomKey].splice(userIndex, 1); // Remove user from room
            }
    
            // If the room is now empty, delete the room
            if (connections[roomKey].length === 0) {
              delete connections[roomKey];
            }
          }
    
          // Cleanup: remove socket data from any other tracking structures
          delete timeOnline[socket.id]; // If you're tracking when users are online
        });
      });


    return io;
}