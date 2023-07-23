const express=require('express')
const app=express();
const  socketio  = require('socket.io');
const path=require('path');
const http=require('http');
const { Socket } = require('dgram');
const server=http.createServer(app);
const io= socketio(server);
app.use(express.static(path.join(__dirname,'public')));

const users=[];

io.on('connection',socket =>{
  //  console.log("connected")
    socket.on("joinRoom", ({ userName, userPassword }) => {
         // console.log({userName,userPassword});
          socket.join(userPassword)
          const id=socket.id;
          users.push({id , userName, userPassword})
          console.log(users)
          socket.emit("users", users)
          socket.broadcast.to(userPassword).emit("user", userName)

      });



    socket.on('disconnect',()=>{
        const id=socket.id;
        const index = users.findIndex(user => user.id === id);
        users.splice(index, 1)
        console.log(users)
        socket.broadcast.emit("leave",users)
    })

    socket.on('chat-message',message=>{

        const currentUser=users.find(function(element){
            return element.id==socket.id;
        });
        const username=currentUser.userName;
        console.log(currentUser.userName)

        io.to(currentUser.userPassword).emit('message',{username,message})
    })


})


server.listen(3000 || process.env.PORT ,function(){
   console.log("server running...")
});
