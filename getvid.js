const video = document.getElementById("my-camera");
const otherVid = document.getElementById("other-camera");

const peer = new Peer({key: 'lwjd5qra8257b9'});
const socket = io();
let ownID;

async function getVid(id = "") {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  video.srcObject = stream;

  const call = peer.call(id, stream);
  call.on("stream", stream => {
    otherVid.srcObject = stream;
  })
}

socket.on("peer-from-server", id => {
  if (ownID !== id) {
    console.log("vid request");
    getVid(id);
  }
})
peer.on("open", id => {
  console.log(`my id is ${id}`);
  socket.emit("peer", id);
  ownID = id;
})
peer.on("call", async (call) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  video.srcObject = stream;
  call.answer(stream);
  call.on("stream", stream => {
    otherVid.srcObject = stream;
  })
})
peer.on("connection", (conn) => {
  console.log("connected via peerjs")
  conn.on("open", () => {
    console.log("connection open");
    conn.on("data", data => console.log(data));
  })
})