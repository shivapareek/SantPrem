import React, { useEffect, useRef, useState } from "react";

// Original Reels List
const originalReels = [
  { videoId: "pBwpvBKpIvE" },
  { videoId: "CdGc1x7KyM4" },
  { videoId: "Yeczf7Dp6Co" },
  { videoId: "1EZWZ2ZC-Y0" },
  { videoId: "PJ6BbnT04Oo" },
  { videoId: "tT0HxC0rCww" },
  { videoId: "d_D0AwG5kmQ" },
  { videoId: "MCYyt7f5twA" },
  { videoId: "9b8FDeKhwP0" },
  { videoId: "LE0U0EaSChM" },
  { videoId: "Gs85Gm5WNo4" },
  { videoId: "lo1n1dmWN6o" },
  { videoId: "9jSwFQJ6Ljg" },
  { videoId: "GOeiWdsOyCc" },
  { videoId: "jRZeoBzKaak" },
  { videoId: "A74SRPXNGkg" },
  { videoId: "hjA_eLHslpQ" },
  { videoId: "TjZKjjSADiQ" },
  { videoId: "FaoULeeeSN4" },
  { videoId: "JjkDdSrz47s" },
  { videoId: "JpQkkingtdA" },
  { videoId: "F94WyBn488Y" },
  { videoId: "ehIBd2vqqbM" },
  { videoId: "qLKi5qGJY0o" },
  { videoId: "_WFu44deo4M" },
  { videoId: "779MFMtOhrg" },
  { videoId: "mhH_GENOMqY" },
  { videoId: "KKxOfAUZ0no" },
  { videoId: "fN8Vib_UqCM" },
  { videoId: "3e1IhN5baag" },
  { videoId: "3kpe4cFd0m4" },
  { videoId: "udug3MXRSuY" },
  { videoId: "znFoi9H3kdU" },
  { videoId: "8dyWwpjpurw" },
  { videoId: "2F_0_NvsrIM" },
  { videoId: "pSX4rbsmfqU" },
  { videoId: "4uAz1IVw5F8" },
  { videoId: "KtnWxK4rJUQ" },
  { videoId: "t-9LJlKHxJM" },
];

// Shuffle helper
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const VaaniZone = () => {
  const [reels, setReels] = useState([]);
  const playersRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Shuffle once on mount
    setReels(shuffleArray(originalReels));
  }, []);

  useEffect(() => {
    if (reels.length === 0) return;

    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = initPlayers;
    if (window.YT && window.YT.Player) {
      initPlayers();
    }
  }, [reels]);

  const initPlayers = () => {
    reels.forEach((reel, index) => {
      playersRef.current[index] = new window.YT.Player(`player-${index}`, {
        videoId: reel.videoId,
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: reel.videoId,
        },
      });
    });

    setupObserver();
  };

  const setupObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));

          playersRef.current.forEach((player, i) => {
            if (i === index && entry.isIntersecting) {
              player?.playVideo?.();
            } else {
              player?.pauseVideo?.();
            }
          });
        });
      },
      { threshold: 0.6 }
    );

    const elements = containerRef.current.querySelectorAll(".reel-box");
    elements.forEach((el) => observer.observe(el));
  };

  if (reels.length === 0) {
    return (
      <div className="bg-black text-white h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Loading Reels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="snap-y snap-mandatory h-full overflow-y-scroll no-scrollbar"
      >
        {reels.map((reel, index) => (
          <div
            key={`${reel.videoId}-${index}`}
            data-index={index}
            className="reel-box snap-start h-screen flex items-center justify-center"
          >
            <div className="w-[360px] h-[640px] overflow-hidden rounded-xl relative border border-yellow-500/20 shadow-lg">
              <div className="absolute inset-0">
                <div id={`player-${index}`} className="w-full h-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaaniZone;
