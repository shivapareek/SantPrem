import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, X, Circle } from "lucide-react";

const MeditationZone = () => {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showAutoplayError, setShowAutoplayError] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const fadeIntervalRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
        setPulseCount((p) => p + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const startMeditation = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0;
      audio.play()
        .then(() => {
          fadeVolume(audio, 1);
          setIsPlaying(true);
          setStarted(true);
        })
        .catch(() => {
          setShowAutoplayError(true);
        });
    }
  };

  const fadeVolume = (audio, targetVolume) => {
    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    fadeIntervalRef.current = setInterval(() => {
      if (!audio) {
        clearInterval(fadeIntervalRef.current);
        return;
      }
      
      const step = 0.05;
      if (Math.abs(audio.volume - targetVolume) < step) {
        audio.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      } else {
        audio.volume += audio.volume < targetVolume ? step : -step;
      }
    }, 50);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audio.paused) {
      // Resume audio - ensure volume is set to 1
      audio.volume = 1;
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          console.error("Failed to resume audio");
        });
    } else {
      // Pause audio with fade effect
      fadeVolume(audio, 0);
      setTimeout(() => {
        if (audio && !audio.paused) {
          audio.pause();
        }
      }, 800);
      setIsPlaying(false);
    }
  };

  const stopMeditation = () => {
    const audio = audioRef.current;
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1; // Reset volume to full
    }
    setIsPlaying(false);
    setStarted(false);
    setTimer(0);
    setPulseCount(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-black text-yellow-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-yellow-400 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-yellow-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-yellow-400 rotate-45 animate-pulse"></div>
      </div>

      <audio ref={audioRef} src="/assets/radha-jaap.mp3" loop preload="auto" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {showAutoplayError && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full text-sm shadow-lg animate-fade-in z-50">
            🔊 Click to allow audio playback — autoplay is blocked
          </div>
        )}

        {!started ? (
          <div className="text-center space-y-6 animate-fade-in flex flex-col justify-center min-h-0">
            {/* Main Logo/Symbol */}
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-spin-slow opacity-60"></div>
              <div className="absolute inset-4 border-2 border-yellow-300 rounded-full animate-spin-reverse opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-yellow-400">ॐ</span>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-yellow-400 tracking-wider relative">
                <span className="relative z-10 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                  RADHA
                </span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-yellow-400 animate-pulse"></div>
              </h1>
              
              <div className="text-2xl md:text-3xl text-yellow-300 font-light tracking-wide">
                M E D I T A T I O N
              </div>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-xl text-yellow-200 leading-relaxed font-light">
                Enter a sacred space of inner peace
              </p>
              <p className="text-lg text-yellow-300 opacity-80 leading-relaxed">
                Center your mind and begin your spiritual journey with the divine vibrations of Radha's name
              </p>
            </div>

            {/* Start Button */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <button
                onClick={startMeditation}
                className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 shadow-2xl transform hover:scale-105 cursor-pointer"
              >
                Begin Journey
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-12 animate-fade-in">
            {/* Central Control Area */}
            <div className="flex justify-center items-center my-4">
              {/* Outer Ring */}
              <div className="relative w-56 h-56">
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-spin-very-slow opacity-40"></div>
                <div className="absolute inset-4 border-2 border-yellow-300 rounded-full animate-spin-reverse opacity-60"></div>
                
                {/* Pulse Circles */}
                {isPlaying && (
                  <>
                    <div className="absolute inset-8 border border-yellow-400 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-12 border border-yellow-400 rounded-full animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute inset-16 border border-yellow-400 rounded-full animate-ping opacity-40" style={{animationDelay: '1s'}}></div>
                  </>
                )}
                
                {/* Center Play/Pause Button - Perfectly Centered */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-20 h-20">
                    <div className={`absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                    <button
                      onClick={toggleAudio}
                      className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-full w-20 h-20 transition-all duration-300 shadow-2xl transform hover:scale-110 cursor-pointer flex items-center justify-center"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-9 h-9" />
                      ) : (
                        <Play className="w-9 h-9 translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Text - Fixed Width */}
            <div className="space-y-3 flex-shrink-0 w-80 mx-auto">
              <div className="h-10 flex items-center justify-center">
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 tracking-wider inline-block min-w-0">
                  {isPlaying ? 'IN MEDITATION' : 'PAUSED'}
                </h1>
              </div>
              
              <div className="h-16 flex flex-col justify-center items-center">
                <p className="text-base text-yellow-300 font-light italic mb-1">
                  "राधे राधे..."
                </p>
                <p className="text-sm text-yellow-200 opacity-80 text-center">
                  Close your eyes and let the divine name guide you
                </p>
              </div>
            </div>

            {/* Timer Display - Fixed Position */}
            <div className="flex justify-center flex-shrink-0">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-yellow-400 rounded-2xl px-5 py-3 w-32 text-center">
                <div className="text-xl md:text-2xl font-mono text-yellow-400 font-bold">
                  {formatTime(timer)}
                </div>
                <div className="text-xs text-yellow-300">
                  Duration
                </div>
              </div>
            </div>

            {/* Breathing Indicator - Fixed Position */}
            <div className="h-6 flex items-center justify-center flex-shrink-0">
              {isPlaying && (
                <div className="flex items-center justify-center space-x-3">
                  <Circle className={`w-2 h-2 text-yellow-400 ${pulseCount % 4 === 0 ? 'animate-ping' : ''}`} />
                  <span className="text-yellow-300 text-xs">Breathe</span>
                  <Circle className={`w-2 h-2 text-yellow-400 ${pulseCount % 4 === 2 ? 'animate-ping' : ''}`} />
                </div>
              )}
            </div>

            {/* Stop Button - Fixed Position */}
            <div className="flex justify-center flex-shrink-0">
              <button
                onClick={stopMeditation}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 cursor-pointer"
              >
                <X className="inline mr-1 w-4 h-4" /> End Session
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in { animation: fade-in 1.2s ease-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
        .animate-spin-very-slow { animation: spin-very-slow 20s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MeditationZone;