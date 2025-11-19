import { useEffect, useRef, useState } from 'react';
import { Maximize, Pause, Play, RotateCcw, Settings, Volume2 } from 'lucide-react';

export default function Player({ media }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pipSupported, setPipSupported] = useState(false);

  useEffect(() => {
    setPipSupported(!!document.pictureInPictureEnabled);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress((v.currentTime / v.duration) * 100 || 0);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [media]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play(); else v.pause();
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
  }, [volume]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [media?.id]);

  const toggleFull = () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen(); else document.exitFullscreen();
  };

  const skip = (sec) => {
    const v = videoRef.current; if (!v) return; v.currentTime += sec;
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 mt-8 mb-16">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="relative bg-black">
          <video ref={videoRef} className="w-full aspect-video" src={media?.videoURL || ''} controls={false} crossOrigin="anonymous">
            {media?.subtitleURL && (
              <track label="Subtitles" kind="subtitles" srcLang="en" src={media.subtitleURL} default />
            )}
          </video>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <div className="flex items-center gap-3">
              <button onClick={()=>setPlaying(p=>!p)} className="p-2 rounded bg-white/10 text-white hover:bg-white/20">
                {playing ? <Pause size={18}/> : <Play size={18}/>}
              </button>
              <input type="range" min="0" max="100" value={progress} onChange={e=>{ const v=videoRef.current; if(!v) return; const pct=Number(e.target.value); v.currentTime = (pct/100)*v.duration; setProgress(pct); }} className="flex-1 accent-blue-500" />
              <div className="flex items-center gap-2 text-white">
                <Volume2 size={16}/>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e=>setVolume(Number(e.target.value))} className="w-28 accent-blue-500" />
              </div>
              <button onClick={()=>skip(-10)} className="px-2 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20">-10s</button>
              <button onClick={()=>skip(10)} className="px-2 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20">+10s</button>
              <div className="relative">
                <select value={playbackRate} onChange={e=>setPlaybackRate(Number(e.target.value))} className="bg-white/10 text-white text-sm rounded px-2 py-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r=>(<option key={r} value={r}>{r}x</option>))}
                </select>
              </div>
              <button onClick={toggleFull} className="p-2 rounded bg-white/10 text-white hover:bg-white/20"><Maximize size={18}/></button>
              {pipSupported && (
                <button onClick={()=> videoRef.current && videoRef.current.requestPictureInPicture()} className="p-2 rounded bg-white/10 text-white hover:bg-white/20"><Settings size={18}/></button>
              )}
              <button onClick={()=>{ const v=videoRef.current; if(v){ v.currentTime=0; setProgress(0); } }} className="p-2 rounded bg-white/10 text-white hover:bg-white/20"><RotateCcw size={18}/></button>
            </div>
          </div>
        </div>
        {media && (
          <div className="p-4 text-blue-100/80 text-sm flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{media.show} • S{media.season}E{media.episode}</div>
              <div className="opacity-80">{media.title}</div>
            </div>
            <div className="opacity-60">Local playback</div>
          </div>
        )}
      </div>
    </section>
  );
}
