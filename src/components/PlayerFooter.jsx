import React, { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

const PlayerFooter = ({
  currentTrack,
  audioRef,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio && !isNaN(audio.duration) && !isScrubbing) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        const percent = audio.duration
          ? (audio.currentTime / audio.duration) * 100
          : 0;
        setProgress(percent || 0);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const interval = setInterval(updateProgress, 500);
    audio?.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      clearInterval(interval);
      audio?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isPlaying, audioRef, isScrubbing]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        onPlayPause();
      } else if (e.code === "ArrowRight") {
        onNext();
      } else if (e.code === "ArrowLeft") {
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPlayPause, onNext, onPrev]);

  const formatTime = (sec) => {
    if (typeof sec !== "number" || isNaN(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 border-t border-yellow-500/20 h-[80px] sm:h-[90px] flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 sm:gap-0 z-50">
      {/* Left: Song Info */}
      <div className="hidden sm:flex items-center gap-4 w-full sm:w-[30%] min-w-0">
        <img
          src={currentTrack?.image}
          alt={currentTrack?.title}
          className="w-14 h-14 rounded-md object-cover"
        />
        <div className="truncate" aria-live="polite">
          <h4 className="text-sm font-semibold truncate max-w-[180px]">
            {currentTrack?.title}
          </h4>
          <p className="text-xs text-gray-400 truncate max-w-[180px]">
            {currentTrack?.artist}
          </p>
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center w-full sm:w-[40%] max-w-[600px]">
        <div className="flex items-center gap-6 mb-1">
          <SkipBack
            size={20}
            onClick={onPrev}
            className="cursor-pointer hover:scale-110 transition"
            aria-label="Previous Track"
          />
          <button
            onClick={onPlayPause}
            className="bg-yellow-400 text-black p-2 rounded-full hover:scale-110 transition hover:cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <SkipForward
            size={20}
            onClick={onNext}
            className="cursor-pointer hover:scale-110 transition"
            aria-label="Next Track"
          />
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs w-[40px] text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const newProgress = parseFloat(e.target.value);
              setProgress(newProgress);
              if (audioRef.current && audioRef.current.duration) {
                audioRef.current.currentTime =
                  (audioRef.current.duration * newProgress) / 100;
              }
            }}
            onMouseDown={() => setIsScrubbing(true)}
            onMouseUp={() => setIsScrubbing(false)}
            onTouchStart={() => setIsScrubbing(true)}
            onTouchEnd={() => setIsScrubbing(false)}
            className="w-full h-2 sm:h-2.5 rounded-full appearance-none cursor-pointer bg-gray-600 transition duration-200
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.8)]
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.8)]
              [&::-moz-range-thumb]:hover:scale-110"
            style={{
              background: `linear-gradient(to right, #facc15 ${progress}%, #404040 ${progress}%)`,
            }}
            aria-label="Track Progress"
            title={`${Math.round(progress)}%`}
          />
          <span className="text-xs w-[40px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume Control */}
      <div className="flex items-center gap-3 w-full sm:w-[30%] justify-end sm:pr-4">
        {muted ? (
          <VolumeX
            size={18}
            className="text-yellow-400 cursor-pointer"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = false;
                setMuted(false);
              }
            }}
            title="Unmute"
            aria-label="Unmute"
          />
        ) : (
          <Volume2
            size={18}
            className="text-yellow-400 cursor-pointer"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = true;
                setMuted(true);
              }
            }}
            title="Mute"
            aria-label="Mute"
          />
        )}
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          disabled={muted}
          className="h-2 sm:h-2.5 w-[70px] sm:w-[100px] rounded-full appearance-none cursor-pointer bg-gray-600 transition duration-200
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.8)]
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.8)]
            [&::-moz-range-thumb]:hover:scale-110"
          style={{
            background: muted
              ? "#555"
              : `linear-gradient(to right, #facc15 ${volume}%, #404040 ${volume}%)`,
          }}
          aria-label="Volume Control"
          title={`${volume}%`}
        />
      </div>
    </div>
  );
};

export default PlayerFooter;
