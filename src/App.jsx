
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import YouTube from "react-youtube";
import "./App.css";

// Local testing: localhost
// Multiple devices: replace with your computer's LAN IP
const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
);

// Detect YouTube video ID
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.split("/")[1] || null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const match = parsed.pathname.match(
        /^\/(embed|shorts|live)\/([^/?]+)/
      );

      return match ? match[2] : null;
    }

    return null;
  } catch {
    return null;
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [users, setUsers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState("");
  const [status, setStatus] = useState(
    "Create or join a room"
  );

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const playTimerRef = useRef(null);

  const youtubeId = getYouTubeId(videoUrl);
  const isYouTube = Boolean(youtubeId);

  useEffect(() => {
    socket.on("room-state", (data) => {
      setUsers(data.users);
      setVideoUrl(data.videoUrl);
    });

    socket.on("countdown", (number) => {
      setCount(number);
    });

    socket.on("play-video", ({ playAt }) => {
      setCount("PLAY!");

      clearTimeout(playTimerRef.current);

      const delay = Math.max(0, playAt - Date.now());

      playTimerRef.current = setTimeout(async () => {
        try {
          if (isYouTubeRef.current) {
            if (!playerRef.current) {
              setStatus("YouTube player is not ready.");
              return;
            }

            playerRef.current.playVideo();
          } else {
            const video = videoRef.current;

            if (!video) {
              setStatus("Video player is not ready.");
              return;
            }

            video.muted = false;
            await video.play();
          }

          setStatus("Playback started!");
        } catch (error) {
          console.error(error);
          setStatus(
            "Playback blocked. Tap the video Play button."
          );
        }
      }, delay);
    });

    socket.on("error-message", (message) => {
      setStatus(message);
    });

    socket.on("room-closed", () => {
      setStatus("Host disconnected. Room closed.");
      setRoomCode("");
      setReady(false);
    });

    return () => {
      socket.off("room-state");
      socket.off("countdown");
      socket.off("play-video");
      socket.off("error-message");
      socket.off("room-closed");
      clearTimeout(playTimerRef.current);
    };
  }, []);

  // Keep latest media type available to socket listener
  const isYouTubeRef = useRef(false);
  isYouTubeRef.current = isYouTube;

  // Create room
  const createRoom = () => {
    if (!url.trim()) {
      alert("Enter video URL");
      return;
    }

    try {
      new URL(url);
    } catch {
      alert("Enter a valid video URL");
      return;
    }

    socket.emit("create-room", url.trim(), (result) => {
      if (result?.success) {
        setRoomCode(result.code);
        setVideoUrl(url.trim());
        setIsHost(true);
        setReady(false);
        setStatus("Room created! Connect other devices.");
      } else {
        setStatus("Could not create room.");
      }
    });
  };

  // Join room
  const joinRoom = () => {
    if (!code.trim()) {
      alert("Enter room code");
      return;
    }

    socket.emit(
      "join-room",
      code.trim().toUpperCase(),
      (result) => {
        if (result?.success) {
          setRoomCode(code.trim().toUpperCase());
          setVideoUrl(result.videoUrl);
          setIsHost(false);
          setReady(false);
          setStatus("Connected! Load the video and get ready.");
        } else {
          alert(result?.message || "Room not found");
        }
      }
    );
  };

  // YouTube player ready
  const onYouTubeReady = (event) => {
    playerRef.current = event.target;
    setStatus("YouTube video loaded. Click I'M READY.");
  };

  // Mark device ready
  const markReady = async () => {
    try {
      if (isYouTube) {
        if (!playerRef.current) {
          setStatus("Please wait for YouTube player to load.");
          return;
        }

        // Attempt muted playback during user interaction
        playerRef.current.mute();
        playerRef.current.playVideo();
        playerRef.current.pauseVideo();
        playerRef.current.seekTo(0, true);
        playerRef.current.unMute();
      } else {
        const video = videoRef.current;

        if (!video) {
          setStatus("Please wait for video to load.");
          return;
        }

        video.muted = true;
        await video.play();
        video.pause();
        video.currentTime = 0;
        video.muted = false;
      }
    } catch (error) {
      console.log("Playback permission:", error);
    }

    setReady(true);
    socket.emit("device-ready", roomCode);
    setStatus("You are READY! Waiting for host.");
  };

  // Host starts synchronized playback
  const startVideo = () => {
    socket.emit("start-video", roomCode);
    setStatus("Checking all devices...");
  };

  const allReady =
    users.length > 0 &&
    users.every((user) => user.ready);

  // YouTube player settings
  const youtubeOptions = {
    width: "100%",
    height: "360",
    playerVars: {
      autoplay: 0,
      controls: 1,
      playsinline: 1,
      rel: 0
    }
  };

  return (
    <div className="app">
      <h1>SYNC VIDEO</h1>
      <p>Watch together. Play together.</p>

      {!roomCode && (
        <div className="panel">
          <h2>Create Room</h2>

          <input
            placeholder="Paste YouTube or MP4 video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button onClick={createRoom}>
            CREATE ROOM
          </button>

          <hr />

          <h2>Join Room</h2>

          <input
            placeholder="Enter room code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button onClick={joinRoom}>
            CONNECT DEVICE
          </button>
        </div>
      )}

      {roomCode && (
        <div className="panel">
          <h2>Room: {roomCode}</h2>

          <h3>
            Connected Devices: {users.length}
          </h3>

          <div className="devices">
            {users.map((user) => (
              <div key={user.id}>
                📱 Device:{" "}
                {user.ready ? "READY ✅" : "WAITING..."}
              </div>
            ))}
          </div>

          <div className="video-container">
            {isYouTube ? (
              <YouTube
                key={youtubeId}
                videoId={youtubeId}
                opts={youtubeOptions}
                onReady={onYouTubeReady}
                onError={(event) => {
                  setStatus(
                    "YouTube error: video unavailable or embedding restricted."
                  );
                  console.error("YouTube error:", event.data);
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                preload="auto"
                onCanPlay={() => {
                  setStatus("Video loaded. Click I'M READY.");
                }}
                onError={() => {
                  setStatus(
                    "Video could not load. Use a direct MP4/WebM URL."
                  );
                }}
              />
            )}
          </div>

          {!ready && (
            <button onClick={markReady}>
              I'M READY 🔊
            </button>
          )}

          {ready && (
            <p>✅ This device is ready</p>
          )}

          {isHost && (
            <button
              onClick={startVideo}
              disabled={!allReady}
            >
              {allReady
                ? "PLAY ON ALL DEVICES"
                : "WAITING FOR DEVICES..."}
            </button>
          )}

          <h1 className="count">{count}</h1>

          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
