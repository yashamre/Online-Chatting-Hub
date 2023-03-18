const { userName, userPassword } = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  
  
console.log(userName,userPassword)
const socket=io("http://localhost:3000");


socket.emit("joinRoom", { userName, userPassword });

socket.on("users",(users)=>{
   
     users.forEach(user => {
      if(socket.id!=user.id){
          if(user.userPassword==userPassword){
           const ul=document.querySelector("ul");
           const li=document.createElement("li");
           li.innerHTML="<h2>"+user.userName+"</h2>";
           li.classList.add("listItem")
           ul.appendChild(li);
          }
        }
     });
    
})

socket.on("user",(userName) => {
  const ul=document.querySelector("ul");
  const li=document.createElement("li");
  li.innerHTML="<h2>"+userName+"</h2>";
  li.classList.add("listItem")
  ul.appendChild(li);
})

socket.on('message',({username, message})=>{
    const chatBox=document.querySelector(".chatBox");
const messageDiv=document.createElement("div");
messageDiv.innerHTML="<span>"+username+"</span>"+"<br>"+message;
chatBox.appendChild(messageDiv)
messageDiv.classList.add('message');

chatBox.scrollTop=chatBox.scrollHeight
  
})

socket.on("leave",(users)=>{
  const ul=document.querySelector("ul");
  ul.innerHTML=" ";
  users.forEach(user => {
    if(socket.id!=user.id){
    const ul=document.querySelector("ul");
   const li=document.createElement("li");
   li.innerHTML="<h2>"+user.userName+"</h2>";
   li.classList.add("listItem")
   ul.appendChild(li);
   }
   });

})

const Button=document.querySelector(".Send")


Button.addEventListener('click', (event) => {
    event.preventDefault();
   const msg= document.querySelector(".TextBox").value;
   socket.emit('chat-message',msg);
   document.querySelector(".TextBox").value="";
   
});






