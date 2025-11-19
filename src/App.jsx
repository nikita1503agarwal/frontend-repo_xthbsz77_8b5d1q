import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Player from './components/Player';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const [current, setCurrent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative">
      <Hero />
      <Uploader onSelect={(item)=>setCurrent(item)} />
      <Player media={current} />
      <Footer />
    </div>
  );
}

export default App
