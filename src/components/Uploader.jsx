import { useEffect, useRef, useState } from 'react';
import { addEpisode, getAllEpisodes, deleteEpisode, updateEpisode } from '../lib/db';
import { Upload, Film, FileText, Trash2, Edit3, Save, X } from 'lucide-react';

function fileToObjectURL(file) {
  return file ? URL.createObjectURL(file) : '';
}

function randomId() {
  return 'ep_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Uploader({ onSelect }) {
  const [form, setForm] = useState({ show: '', season: 1, episode: 1, title: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const list = await getAllEpisodes();
      setItems(list.sort((a,b)=>b.createdAt - a.createdAt));
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert('Please choose a video file');

    const id = randomId();
    const videoURL = fileToObjectURL(videoFile);
    const subtitleURL = fileToObjectURL(subtitleFile);

    const payload = {
      id,
      show: form.show || 'My Show',
      season: Number(form.season) || 1,
      episode: Number(form.episode) || 1,
      title: form.title || videoFile.name,
      videoURL,
      subtitleURL,
    };
    await addEpisode(payload);
    setItems(prev => [payload, ...prev]);
    setForm({ show: '', season: 1, episode: 1, title: '' });
    setVideoFile(null); setSubtitleFile(null);
    if (videoRef.current) videoRef.current.value = '';
  };

  const handleDelete = async (id) => {
    await deleteEpisode(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSaveEdit = async (id) => {
    const item = items.find(i => i.id === id);
    await updateEpisode(id, item);
    setEditingId(null);
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-24">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-12 items-end">
          <div className="md:col-span-3">
            <label className="text-sm text-blue-100/80">Show</label>
            <input value={form.show} onChange={e=>setForm({...form, show:e.target.value})} className="w-full mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-blue-200/40" placeholder="e.g. My Series" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-blue-100/80">Season</label>
            <input type="number" value={form.season} onChange={e=>setForm({...form, season:e.target.value})} className="w-full mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-blue-100/80">Episode</label>
            <input type="number" value={form.episode} onChange={e=>setForm({...form, episode:e.target.value})} className="w-full mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-blue-100/80">Title</label>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="Optional" />
          </div>
          <div className="md:col-span-6">
            <label className="text-sm text-blue-100/80 flex items-center gap-2"><Film size={16}/> Video file</label>
            <input ref={videoRef} type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0]||null)} className="w-full mt-1 bg-slate-900/60 border border-dashed border-blue-400/40 rounded-lg px-3 py-2 text-white" />
          </div>
          <div className="md:col-span-4">
            <label className="text-sm text-blue-100/80 flex items-center gap-2"><FileText size={16}/> Subtitle (.vtt)</label>
            <input type="file" accept=".vtt,.srt" onChange={e=>setSubtitleFile(e.target.files?.[0]||null)} className="w-full mt-1 bg-slate-900/60 border border-dashed border-blue-400/40 rounded-lg px-3 py-2 text-white" />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button className="mt-6 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"><Upload size={16}/> Add</button>
          </div>
        </form>

        <div className="mt-6 divide-y divide-white/10">
          {items.length === 0 && (
            <p className="text-blue-100/60 text-sm">No episodes yet. Add one above.</p>
          )}
          {items.map(item => (
            <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input value={item.show} onChange={e=>setItems(prev=>prev.map(p=>p.id===item.id?{...p, show:e.target.value}:p))} className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
                    <input type="number" value={item.season} onChange={e=>setItems(prev=>prev.map(p=>p.id===item.id?{...p, season:Number(e.target.value)}:p))} className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
                    <input type="number" value={item.episode} onChange={e=>setItems(prev=>prev.map(p=>p.id===item.id?{...p, episode:Number(e.target.value)}:p))} className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
                    <input value={item.title} onChange={e=>setItems(prev=>prev.map(p=>p.id===item.id?{...p, title:e.target.value}:p))} className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
                  </div>
                ) : (
                  <div className="text-blue-100">
                    <div className="font-semibold">{item.show} • S{item.season}E{item.episode}</div>
                    <div className="text-sm text-blue-200/70">{item.title}</div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>onSelect(item)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg">Play</button>
                {editingId === item.id ? (
                  <>
                    <button onClick={()=>handleSaveEdit(item.id)} className="text-xs inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-lg"><Save size={14}/> Save</button>
                    <button onClick={()=>setEditingId(null)} className="text-xs inline-flex items-center gap-1 bg-white/10 text-white px-3 py-2 rounded-lg"><X size={14}/> Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>setEditingId(item.id)} className="text-xs inline-flex items-center gap-1 bg-white/10 text-white px-3 py-2 rounded-lg"><Edit3 size={14}/> Edit</button>
                    <button onClick={()=>handleDelete(item.id)} className="text-xs inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 px-3 py-2 rounded-lg"><Trash2 size={14}/> Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
