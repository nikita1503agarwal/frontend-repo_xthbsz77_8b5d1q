import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur">Local library</span>
        <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-br from-white to-blue-200 text-transparent bg-clip-text">
          Your Videos, Subtitles, and Seasons — All Offline
        </h1>
        <p className="mt-4 text-blue-100/80 max-w-2xl">
          Add episodes with video and subtitle files. Organize by show and season. Everything is saved in your browser — no uploads.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
    </section>
  );
}
