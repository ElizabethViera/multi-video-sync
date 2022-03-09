import { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const sampleVideo =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/9/96/Curiosity%27s_Seven_Minutes_of_Terror.ogv/Curiosity%27s_Seven_Minutes_of_Terror.ogv.480p.vp9.webm";

const sampleVideo2 =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/5c/Flapping-Tail-Membrane-in-Bats-Produces-Potentially-Important-Thrust-during-Horizontal-Takeoffs-and-pone.0032074.s004.ogv/Flapping-Tail-Membrane-in-Bats-Produces-Potentially-Important-Thrust-during-Horizontal-Takeoffs-and-pone.0032074.s004.ogv.240p.vp9.webm";

interface VideoConfig {
  width: number;
  height: number;
  posx: number;
  posy: number;
  src: string;
  title: string;
  offset: number;
}

const videos: VideoConfig[] = [
  {
    width: 500,
    height: 500,
    posx: 600,
    posy: 600,
    src: sampleVideo,
    title: "first video",
    offset: 0,
  },
  {
    width: 500,
    height: 500,
    posx: 100,
    posy: 100,
    src: sampleVideo2,
    title: "second video",
    offset: 3,
  },
];

function App() {
  const [time, setTime] = useState(0);
  return (
    <div className="App">
      {videos.map((video) => (
        <VideoFrame
          key={video.title}
          {...video}
          time={time - video.offset}
          onTimeChange={(t) => {
            setTime(t + video.offset);
          }}
        />
      ))}
    </div>
  );
}

function VideoFrame({
  width,
  height,
  posx,
  posy,
  src,
  time,
  onTimeChange,
}: {
  width: number;
  height: number;
  posx: number;
  posy: number;
  src: string;
  time: number;
  onTimeChange: (time: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null as any);
  useEffect(() => {
    let adjustedTime = Math.min(Math.max(0, time), ref.current.duration);

    if (!isFinite(adjustedTime)) {
      return;
    }

    if (ref.current.currentTime === adjustedTime) {
      return;
    }
    ref.current.setAttribute("data-time-change", "true");
    ref.current.currentTime = adjustedTime;
  });
  return (
    <video
      ref={ref}
      width={width}
      height={height}
      src={src}
      style={{ left: posx, top: posy }}
      controls={true}
      onTimeUpdate={(e) => {
        if (ref.current.getAttribute("data-time-change")) {
          ref.current.setAttribute("data-time-change", "");
          return;
        }
        onTimeChange(ref.current.currentTime);
      }}
    />
  );
}

export default App;
