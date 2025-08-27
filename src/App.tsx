import React, { useEffect, useRef, useState } from "react";
import { Heart, Play, Pause, Volume2, VolumeX, Star, Sparkles, Gift, Music } from "lucide-react";

/* -------------------- NEW: Instagram 4:5 Video Section -------------------- */
function InstaVideoSection() {
  const vRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);
  const [fs, setFs] = useState(false);
  const [err, setErr] = useState(false);

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const onToggle = async () => {
    const v = vRef.current; if (!v) return;
    try { if (v.paused) { await v.play(); } else { v.pause(); } } catch { setErr(true); }
  };
  const onMute = () => { const v = vRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };
  const onBar = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = vRef.current; if (!v || !dur) return;
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    v.currentTime = pct * dur;
  };
  const onFS = () => {
    const v = vRef.current; if (!v) return;
    if (!document.fullscreenElement) v.requestFullscreen?.().then(() => setFs(true));
    else document.exitFullscreen?.().then(() => setFs(false));
  };

  useEffect(() => {
    const v = vRef.current; if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);
    const onErr = () => setErr(true);
    const onMeta = () => { setErr(false); setDur(v.duration || 0); setMuted(v.muted); };
    const onTime = () => setCur(v.currentTime || 0);
    const onFSChange = () => setFs(!!document.fullscreenElement);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", onErr);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnd);
      v.removeEventListener("error", onErr);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      document.removeEventListener("fullscreenchange", onFSChange);
    };
  }, []);

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          
         
        </div>

        <div className="group relative rounded-3xl border border-pink-500/20 bg-black/40 p-6 shadow-2xl backdrop-blur-xl md:p-8 ">
          {/* 4:5 container */}
          <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-pink-900 aspect-[4/5]">
            <video
              ref={vRef}
              className="h-full w-full object-cover"
              preload="metadata"
              playsInline
              controls={false}
              // poster="/photos/1.jpg"
            >
              <source src="/videos/insta1.mp4" type="video/mp4" />
            </video>

            {!playing && !err && (
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20"
                onClick={onToggle}
                tabIndex={0}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onToggle()}
                role="button"
                aria-label="Play video"
              >
                <button className="z-10 rounded-full bg-pink-500 p-5 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-600 hover:shadow-pink-500/50">
                  <Play size={36} />
                </button>
              </div>
            )}

            {err && (
              <div className="absolute inset-0 grid place-items-center bg-black/50 text-white">
                <div className="text-center">
                  <p className="text-lg mb-1">Video not found</p>
                  <p className="text-sm opacity-75">Place your file at /public/videos/insta1.mp4</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between rounded-lg bg-black/50 p-3 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <button onClick={onToggle} className="text-pink-400 transition-colors hover:text-pink-300">
                    {playing ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={onMute} className="text-purple-400 transition-colors hover:text-purple-300">
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>

                <div className="mx-4 flex-1">
                  <div className="h-2 cursor-pointer overflow-hidden rounded-full bg-purple-900/50" onClick={onBar}>
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-[width] duration-200"
                      style={{ width: dur ? `${(cur / dur) * 100}%` : "0%" }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="min-w-[110px] text-right text-sm text-purple-300">
                    {fmt(cur)} / {fmt(dur)}
                  </div>
                  <button onClick={onFS} className="text-purple-400 transition-colors hover:text-purple-300" title="Fullscreen">
                    {fs ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15H5v4h4m6-4h4v4h-4m0-10h4V5h-4M9 9H5V5h4" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M16 4h4v4M4 16v4h4m12-4v4h-4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ----------------------------- Your App ----------------------------- */
function App() {
  // --- UI State ---
  const [showMessage, setShowMessage] = useState(false);

  // --- Video State ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- Helpers ---
  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const toggleVideo = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
        v.muted = false;
        v.volume = 1;
        setIsMuted(false);
        await v.play();
      } else {
        v.pause();
      }
    } catch (err) {
      console.error("Error playing video:", err);
      setVideoError(true);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;

    if (!document.fullscreenElement) {
      v.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  };

  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = pct * duration;
  };

  // Wire up media + fullscreen events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnd = () => setIsVideoPlaying(false);
    const handleError = () => setVideoError(true);
    const handleLoaded = () => {
      setVideoError(false);
      setDuration(v.duration || 0);
      setIsMuted(v.muted);
    };
    const handleTime = () => setCurrent(v.currentTime || 0);
    const fsChange = () => setIsFullscreen(!!document.fullscreenElement);

    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("ended", handleEnd);
    v.addEventListener("error", handleError);
    v.addEventListener("loadedmetadata", handleLoaded);
    v.addEventListener("timeupdate", handleTime);
    document.addEventListener("fullscreenchange", fsChange);

    return () => {
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("ended", handleEnd);
      v.removeEventListener("error", handleError);
      v.removeEventListener("loadedmetadata", handleLoaded);
      v.removeEventListener("timeupdate", handleTime);
      document.removeEventListener("fullscreenchange", fsChange);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-purple-900 to-pink-900">
      {/* Floating Hearts Animation */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Heart className="text-pink-400 opacity-20" size={Math.floor(Math.random() * 20) + 10} />
          </div>
        ))}
      </div>

      {/* Sparkle Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={`spark-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Sparkles className="text-purple-300 opacity-30" size={Math.floor(Math.random() * 15) + 8} />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex min-h-screen items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 transform transition-transform duration-500 hover:scale-105">
              <Gift className="mx-auto mb-4 animate-bounce text-pink-400" size={80} />
            </div>

            <h1 className="animate-pulse-glow bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 bg-clip-text text-6xl font-bold text-transparent md:text-8xl">
              Happy Birthday
            </h1>

            <div className="animate-slide-up mb-8 mt-4 text-4xl font-light text-pink-300 md:text-6xl">আমার শখের নারী</div>

            <div className={`transform transition-all duration-1000 ${showMessage ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              
            </div>

            <div className="mt-12 flex justify-center space-x-4">
              <div className="animate-float-delay-1">
                <Heart className="text-pink-500" size={30} />
              </div>
              <div className="animate-float-delay-2">
                <Star className="text-purple-400" size={28} />
              </div>
              <div className="animate-float-delay-3">
                <Heart className="text-pink-400" size={32} />
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Instagram 4:5 video section */}
        <InstaVideoSection />

        {/* Love Message Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="transform rounded-3xl border border-purple-500/20 bg-black/30 p-8 shadow-2xl backdrop-blur-lg transition-all duration-700 hover:scale-105 hover:shadow-purple-500/20 md:p-12">
              <div className="mb-8 text-center">
                <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  থেকে যেও আজীবন
                </h2>
              </div>

              <div className="prose prose-invert max-w-none prose-xl">
                <p className="mb-6 text-center text-lg leading-relaxed text-purple-100 md:text-xl">
                  তোমার সাথে কাটানো প্রতিটি মুহূর্তই যেন অমৃতের মতো। হয়তো আমরা হাজার হাজার মাইল দূরে আছি, কিন্তু আমি তোমাকে প্রতিটিক্ষণ অনুভব করি।
                  অনেক কষ্ট হয় যখন ভাবি যে তোমাকে চাইলে আমি ছুঁতে পারি না।
                  <br /><br />
                  কিন্তু তোমাকে একদিন আমার পাশে আজীবনের জন্য দেখার এই বিশ্বাস রেখেই বেঁচে আছি।
                </p>
              </div>

              <div className="mt-8 flex justify-center space-x-6">
                {[...Array(5)].map((_, i) => (
                  <Heart key={`pulse-${i}`} className="animate-pulse text-pink-500" size={24} style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Video Player Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                অসীম এই মায়ার নেই কোনো তল
              </h2>
              <p className="text-xl text-purple-200 mt-5">তোমার মায়াতে হারিয়েই শেষ নিঃশ্বাস ফেলতে চাই</p>
            </div>

            <div className="group relative">
              <div className="transform rounded-3xl border border-pink-500/20 bg-black/40 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 hover:scale-105 hover:shadow-pink-500/30 md:p-8">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-pink-900">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    preload="metadata"
                    playsInline
                    controls={false}
                  >
                    {/* Put your file in public/videos/মায়া.mp4 */}
                    <source src="/videos/মায়া.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Overlay (entire area clickable) */}
                  {!isVideoPlaying && !videoError && (
                    <div
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20"
                      onClick={toggleVideo}
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggleVideo()}
                      role="button"
                      aria-label="Play video"
                    >
                      <button className="z-10 rounded-full bg-pink-500 p-6 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-600 hover:shadow-pink-500/50">
                        <Play size={40} />
                      </button>
                    </div>
                  )}

                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <p className="mb-2 text-lg">Video not found</p>
                        <p className="text-sm opacity-75">Make sure the file exists at /public/videos/মায়া.mp4</p>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between rounded-lg bg-black/50 p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <button onClick={toggleVideo} className="text-pink-400 transition-colors hover:text-pink-300">
                          {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button onClick={toggleMute} className="text-purple-400 transition-colors hover:text-purple-300">
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                      </div>

                      {/* Progress */}
                      <div className="mx-4 flex-1">
                        <div className="h-2 cursor-pointer overflow-hidden rounded-full bg-purple-900/50" onClick={onBarClick}>
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-[width] duration-200"
                            style={{ width: duration ? `${(current / duration) * 100}%` : "0%" }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="min-w-[110px] text-right text-sm text-purple-300">
                          {formatTime(current)} / {formatTime(duration)}
                        </div>
                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className="text-purple-400 transition-colors hover:text-purple-300" title="Fullscreen">
                          {isFullscreen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15H5v4h4m6-4h4v4h-4m0-10h4V5h-4M9 9H5V5h4" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M16 4h4v4M4 16v4h4m12-4v4h-4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Memory Gallery Section (real photos) */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                তুমি আমি আমরা
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"].map((file, i) => (
                <div key={i} className="group">
                  <div className="transform rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-4 shadow-xl transition-all duration-500 hover:rotate-1 hover:scale-105 hover:shadow-purple-500/30 backdrop-blur-lg">
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <img
                        src={`/photos/${file}`}
                        alt={`Memory ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Message Section (black hearts float up) */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-8 shadow-2xl backdrop-blur-xl md:p-12">
              <div className="mb-8">
                {/* Floating black hearts container */}
                <div className="relative mb-6 flex h-24 justify-center overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <Heart
                      key={i}
                      className="absolute bottom-0 text-black/80 drop-shadow-lg animate-float-up"
                      size={20 + Math.floor(Math.random() * 12)}
                      style={{
                        left: `${Math.random() * 90}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${4 + Math.random() * 3}s`,
                      }}
                    />
                  ))}
                </div>

                <h2 className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl ">
                  চিরকাল শুধুই তোমার
                </h2>

                <p className="text-2xl font-light leading-relaxed text-purple-200 md:text-3xl mt-9">
                  "তুমি এসে বলে দাও, আছি আমি পাশে, করো না কিছুতেই ভয়"
                </p>

                <div className="mt-8 text-lg text-pink-300">Happy Birthday, আমার সবকিছু 🖤</div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="animate-pulse absolute inset-0 rounded-full bg-pink-500 blur" />
                  <Heart className="relative animate-bounce text-pink-400" size={60} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Inline animation CSS so you don't need Tailwind config edits */}
      <style>{`
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-12px) } 100% { transform: translateY(0) } }
        .animate-float { animation: float 4.5s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float 4.5s ease-in-out infinite; animation-delay: .2s; }
        .animate-float-delay-2 { animation: float 4.5s ease-in-out infinite; animation-delay: .4s; }
        .animate-float-delay-3 { animation: float 4.5s ease-in-out infinite; animation-delay: .6s; }

        @keyframes sparkle { 0%,100% { opacity: .15; transform: scale(.9) } 50% { opacity: .45; transform: scale(1) } }
        .animate-sparkle { animation: sparkle 2.8s ease-in-out infinite; }

        @keyframes pulseGlow { 0%,100% { text-shadow: 0 0 20px rgba(236,72,153,.25) } 50% { text-shadow: 0 0 40px rgba(168,85,247,.35) } }
        .animate-pulse-glow { animation: pulseGlow 2.6s ease-in-out infinite; }

        @keyframes slideUp { 0% { opacity: 0; transform: translateY(16px) } 100% { opacity: 1; transform: translateY(0) } }
        .animate-slide-up { animation: slideUp .8s ease-out both; }

        .animate-spin-slow { animation: spin 8s linear infinite; }

        /* Floating black hearts bottom -> up */
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0) scale(0.9); opacity: .75; }
          40% { transform: translateY(-50px) translateX(-6px) scale(1); opacity: 1; }
          80% { transform: translateY(-110px) translateX(6px) scale(1.05); opacity: .9; }
          100% { transform: translateY(-140px) translateX(0) scale(1.1); opacity: 0; }
        }
        .animate-float-up { animation: floatUp 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default App;
