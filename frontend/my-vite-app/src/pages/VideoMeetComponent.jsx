import React, { useState, useRef, useEffect } from "react";
import "../styles/VideoMeetComponent.css";
import { IconButton, Button, TextField, Badge } from "@mui/material";
import io from "socket.io-client";
//import styles from "../styles/VideoMeetComponent.css"
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import { json, useNavigate } from "react-router-dom";
import server from "../environment";

const server_url = server;

let connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModel, setShowModel] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");
  const [participants, setParticipants] = useState([]);

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  //if(isChrome()===false){}

  let routeTo = useNavigate();

  const getPermissions = async () => {
    try {
      // Request video permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(true); // Set video availability to true
    } catch (err) {
      console.error("Video permission denied:", err);
      setVideoAvailable(false); // Set video availability to false
    }
  
    try {
      // Request audio permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(true); // Set audio availability to true
    } catch (err) {
      console.error("Audio permission denied:", err);
      setAudioAvailable(false); // Set audio availability to false
    }
  
    // Check for screen sharing availability
    setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);
  
    // If either video or audio is available, get the user media stream
    if (videoAvailable || audioAvailable) {
      try {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
  
        window.localStream = userMediaStream;
  
        // Set local video element source to the user media stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userMediaStream;
        }
  
        // Optional: Check if audio tracks are available in the stream
        const audioTracks = userMediaStream.getAudioTracks();
        if (audioTracks.length > 0) {
          console.log("Audio track is available:", audioTracks[0].label);
        } else {
          console.warn("No audio track found in the stream.");
        }
      } catch (err) {
        console.error("Failed to get user media stream:", err);
      }
    } else {
      console.warn("No video or audio permissions available.");
    }
  };
  
  useEffect(() => {
    getPermissions();
  }, []);
  

  let getUserMediaSucess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            console.log(
              `Offer created and local description set for ${id}`,
              description
            );
            socketIdRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.error("Error setting local description:", e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (error) {
            console.log(error);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              console.log(description);
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = new ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSucess) //get user media sucess
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            console.log("BEFORE:", videoRef.current);
            console.log("FINDING ID: ", socketListId);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              console.log("FOUND EXISTING");

              // Update the stream of the existing video
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Create a new video
              console.log("CREATING NEW");
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    if (participants.length <= 2) {
      setParticipants((prev) => [...prev, username]);
      setAskForUsername(false);
      getMedia();
    } else {
      alert("meeting is Full you not allowed!");
    }
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let getDisplayMediaSucess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => [
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e)),
      ]);
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (error) {
            console.log(error);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSucess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (error) {
      console.log(e);
    }
    routeTo("/home");
  };

  return (
    <div className="videoMeetPage landingPageContainer">
      {askForUsername === true ? (
        <div className="lobby-container">
          <div className="left-side">
            <h2>Enter into Lobby</h2>
            <TextField
              id="outlined-basic"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mt: 1 }}
              fullWidth
            />
            <Button variant="contained" onClick={connect} sx={{ mt: 2 }}>
              Connect
            </Button>
          </div>

          <div className="right-side">
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className="meetVideoContainer">
          {/* <h3>Participants:</h3>
          <ul>
            {participants.length > 0 ? (
              participants.map((participant, index) => (
                <li key={index}>{participant}</li>
              ))
            ) : (
              <p>No participants yet</p>
            )}
          </ul> */}

          {showModel ? (
            <div className="chatRoom">
              <div className="chatContainer">
                <h3>Chat</h3>

                <div className="chattingDisplay">
                  {messages.length > 0 ? (
                    messages.map((item, index) => (
                      <div key={index} className="messageItem">
                        <p
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                          className="messageSender"
                        >
                          {item.sender}:
                        </p>
                        <p
                          style={{ color: "black", textAlign: "left" }}
                          className="messageData"
                        >
                          {item.data}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "black" }}>No messages available</p>
                  )}
                </div>
                <div className="chattingArea">
                  <TextField
                    variant="outlined"
                    label="Enter Your Chat"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: "70%" }}
                    required
                  />
                  <Button
                    style={{ margin: "5px" }}
                    variant="contained"
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="buttonContainer">
            <IconButton onClick={handleVideo} style={{ color: "black" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "black" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "black" }}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}

            <Badge badgeContent={newMessages} max={99} color="primary">
              <IconButton
                onClick={() => setShowModel(!showModel)}
                style={{ color: "black" }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          <video
            className="meetUserVideo"
            ref={localVideoRef}
            autoPlay
            muted
          ></video>
          <div className="conferenceView">
            {/* {participants.length ===2 ? } */}
            {participants.map((participant, index) =>
              videos.map((video) => (
                <div key={video.socketId}>
                  {/* <h2 style={{ color: "red" }}>{video.socketId}</h2> */}
                  <video
                    data-socket={participant}
                    ref={(ref) => {
                      if (ref) {
                        if (video.stream) {
                          console.log(
                            `Setting stream for: ${participant}`,
                            video.stream
                          );
                          ref.srcObject = video.stream; // Set the video stream
                        } else {
                          console.log(
                            `No stream available for: ${participant}`
                          );
                        }
                      }
                    }}
                    autoPlay
                    muted
                  ></video>
                  {/* <p>{participant}</p> */}
                </div>
              ))
              // ) : (
              //   <p>No videos connected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
