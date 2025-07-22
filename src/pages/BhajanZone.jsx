import React, { useEffect, useState, useRef } from "react";
import { fetchSpotifyTrack } from "../utils/fetchSpotifyTrack";
import PlayerFooter from "../components/PlayerFooter"; // adjust path

import { Play, Pause , Shuffle , Repeat } from "lucide-react";

const bhajans = [
  {
    spotifyId: "6LVP4zbpCnWLKgKsMCCOpz", // Radhe radhe japa karo
    audio:
      "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687aa70500311d3ce817/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "5aMLADD1Ho6Ogq8s8mIzB9",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b5c5a0019f716fab6/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "0IuX43ftV0QdtAp6fTwQ1M",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b5cc1001267da141a/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "78JoUq3GxxhDScBpzH97WI",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b5d4600089a9958e1/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "7c3UtLQYpASog3tnpsdPk4",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b5daa001c649afe54/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "0deMpKVl1vJ5v8VtE116TT",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b5ec2001d64d27c07/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "03n5TMyjR5HnaXYHSMKBjM",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b5f44000b17b9ac80/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "1XQQCuphi07NnV6wAmUSk7",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b60720037f36d014a/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "1M9EuCHuMl8jlqrblu3Jyf",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6129002d63755f30/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "6nKkY9lW1LrK5wfkZLnpdg",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b61f4001deba43add/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "6DwBCjospi1c9WsRVfoCwN",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b62d3001c6d8baec1/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "2pBtf4a7ltkD9hAoCXBrjg",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b636c003cd9520d15/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "735bRwgZ4sTH5Vs3iFVnDr",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6435003170f78cb3/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "69qKVdIkwx1LPb6TTyHzJO",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b655b00340557e4c6/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "73cimh6ADzNovoACZ5HEqS",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b65c2000048a60a9b/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "26FcIpP07okvolse1vUzXo",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b66b8003150402ad4/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "6H7fLdt0AeWpuxUKXuXWrx",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b67950016c2f3a6ee/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "5foZa8IFoSN9tyh5JPUXlE",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6850002a6ad8df06/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "0248iEY7P2bN8ty9i109Yy",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b68cd0020cc9637ff/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "78sAza7dOlNPSgqKr3JOVx",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b696a002ec834f831/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "5ozrde9hfAamlaIFJT1T8r",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b69c500004b66c8a5/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "78nxU66lDvH9StVgy9B1YJ",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6b000015c20f9ae2/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "3yPxXveSK0HW2coIvqo618",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6ba7001eb44dfb05/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "4caG3rDBMXGLWzCzhXZ92c",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6c81002f4adafcc6/view?project=687a9e3200280b661bfa&mode=admin",
  },
  {
    spotifyId: "23imqDJhhCZ6H3RKxEmnFa",
    audio: "https://fra.cloud.appwrite.io/v1/storage/buckets/687aa01e0029630487d1/files/687b6d98000a483af52f/view?project=687a9e3200280b661bfa&mode=admin",
  },
];

const formatDuration = (ms) => {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const BhajanZone = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const loadData = async () => {
      const bhajanDetails = await Promise.all(
        bhajans.map(async (b) => {
          const meta = await fetchSpotifyTrack(b.spotifyId);
          return { ...meta, audio: b.audio };
        })
      );
      setData(bhajanDetails);
    };

    loadData();
    return () => audioRef.current.pause();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (isRepeating) handlePlay(currentIndex);
      else if (isShuffling) handlePlay(Math.floor(Math.random() * data.length));
      else handlePlay((currentIndex + 1) % data.length);
    };
    const handleError = () => {
      alert("Failed to load audio. Try another track.");
      setIsPlaying(false);
    };
    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [currentIndex, data, isShuffling, isRepeating]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === "ArrowRight") {
        handlePlay((currentIndex + 1) % data.length);
      } else if (e.key === "ArrowLeft") {
        handlePlay((currentIndex - 1 + data.length) % data.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, data]);

  const handlePlay = (index) => {
    const audio = audioRef.current;
    const isSameTrack = currentIndex === index;
    if (!data[index]?.audio) return;

    if (isSameTrack) {
      audio.paused ? audio.play() : audio.pause();
      setIsPlaying(!audio.paused);
    } else {
      audio.pause();
      audio.src = data[index].audio;
      audio.load();
      audio.oncanplay = () => {
        audio.play();
        setCurrentIndex(index);
        setIsPlaying(true);
        audio.oncanplay = null;
      };
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
    setIsPlaying(!audio.paused);
  };

return (
   <div className="relative flex flex-col gap-4 p-4 sm:p-6 bg-black text-white min-h-screen pb-[100px] overflow-y-auto no-scrollbar">
      {/* Blur Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none z-0" />

      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 sm:mb-6 text-center z-10">
        Bhajan Zone
      </h2>

      <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-3 sm:gap-4 z-10">
        {[{
          active: isShuffling,
          toggle: () => setIsShuffling(!isShuffling),
          Icon: Shuffle,
          label: "Shuffle",
        }, {
          active: isRepeating,
          toggle: () => setIsRepeating(!isRepeating),
          Icon: Repeat,
          label: "Repeat",
        }].map(({ active, toggle, Icon, label }, i) => (
          <button
            key={i}
            onClick={toggle}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm sm:text-base ${
              active
                ? "bg-yellow-400 text-black border-yellow-300 scale-105 hover:cursor-pointer"
                : "bg-gray-800 text-yellow-400 border-gray-600 hover:bg-gray-700 hover:scale-105 hover:cursor-pointer"
            }`}
            title={`Toggle ${label}`}
          >
            <Icon size={18} className={active ? "text-black" : "text-yellow-400 group-hover:text-yellow-300"} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center mt-10 z-10">
          <div className="h-6 w-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        data.map((item, index) => {
          const isCurrent = currentIndex === index;
          return (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-200 hover:scale-[1.01] ${
                isCurrent ? "ring-2 ring-yellow-400/60 ring-offset-2 ring-offset-black" : ""
              } z-10`}
            >
              <div className="flex items-center sm:items-start justify-center sm:justify-start gap-3 w-full sm:w-auto">
                <span className="hidden sm:inline text-sm text-neutral-500 w-5">{index + 1}.</span>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-24 h-24 sm:w-16 sm:h-16 rounded-md object-cover"
                />
              </div>
              <div className="flex-1 w-full overflow-hidden">
                <h3 className="text-base sm:text-lg font-semibold text-yellow-300 truncate flex items-center justify-center sm:justify-start gap-2">
                  {item.title}
                  {isCurrent && (
                    <span className="text-xs bg-green-500/90 text-white px-2 py-0.5 rounded-full">
                      Now Playing
                    </span>
                  )}
                </h3>
                <p className="text-sm text-neutral-300 truncate">{item.artist}</p>
                {item.duration && (
                  <p className="text-xs text-neutral-400">{formatDuration(item.duration)}</p>
                )}
              </div>
              <button
                onClick={() => handlePlay(index)}
                aria-label={`Play ${item.title}`}
                className={`p-3 sm:p-2 mt-2 sm:mt-0 rounded-full transition-all duration-150 ${
                  isCurrent && isPlaying
                    ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer"
                    : "bg-gray-700 text-yellow-300 hover:bg-gray-600 hover:cursor-pointer"
                }`}
              >
                {isCurrent && isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          );
        })
      )}

      <PlayerFooter
        currentTrack={data[currentIndex]}
        audioRef={audioRef}
        isPlaying={isPlaying}
        currentTime={currentTime}
        onPlayPause={handlePlayPause}
        onNext={() => handlePlay((currentIndex + 1) % data.length)}
        onPrev={() => handlePlay((currentIndex - 1 + data.length) % data.length)}
      />
    </div>
  );
};

export default BhajanZone;
