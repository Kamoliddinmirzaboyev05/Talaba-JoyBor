import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Plus,
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { authAPI, mediaUrl, Complaint, ComplaintCategory, ComplaintTargetRole, ComplaintType } from '../services/api';

const STATUS_UI: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Kutilmoqda',
    className: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    icon: <Clock className="w-4 h-4" />,
  },
  in_progress: {
    label: 'Jarayonda',
    className: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  resolved: {
    label: 'Hal qilindi',
    className: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  rejected: {
    label: 'Rad etildi',
    className: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  room: 'Xona',
  food: 'Ovqat',
  staff: 'Xodimlar',
  noise: 'Shovqin',
  cleanliness: 'Tozalik',
  wifi: 'Wi-Fi',
  equipment: 'Jihoz (chiroq, mebel...)',
  security: 'Xavfsizlik',
  tariff: 'Tarif/toʻlov',
  system: 'Platforma/tizim',
  other: 'Boshqa',
};

const ALL_CATEGORIES: ComplaintCategory[] = ['room', 'food', 'staff', 'noise', 'cleanliness', 'wifi', 'equipment', 'security', 'tariff', 'system', 'other'];

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [target, setTarget] = useState<ComplaintTargetRole>('admin');
  const [type, setType] = useState<ComplaintType>('complaint');
  const [category, setCategory] = useState<ComplaintCategory>('room');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [floor, setFloor] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.getMyComplaints();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklashda xatolik');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user) load();
  }, [user, load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await authAPI.sendComplaint(target, {
        type,
        category,
        title: title.trim(),
        description: description.trim(),
        floor: floor ? Number(floor) : undefined,
        image,
      });
      setTitle('');
      setDescription('');
      setFloor('');
      setImage(null);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yuborishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors duration-150"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2 truncate">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-brand-500 shrink-0" />
                <span className="truncate">Shikoyat va takliflar</span>
              </h1>
              <p className="text-xs sm:text-sm text-surface-500 mt-0.5">Yotoqxona adminiga yoki platforma bo&apos;yicha superadminga murojaat yuboring</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={load}
              className="p-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150"
              title="Yangilash"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors duration-150"
            >
              <Plus className="w-4 h-4" />
              Yangi
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 text-sm">
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 space-y-3 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="text-surface-500 dark:text-surface-400">Kimga</span>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as ComplaintTargetRole)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                >
                  <option value="admin">Yotoqxona admini</option>
                  <option value="superadmin">Superadmin (platforma)</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="text-surface-500 dark:text-surface-400">Turi</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ComplaintType)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                >
                  <option value="complaint">Shikoyat</option>
                  <option value="suggestion">Taklif</option>
                </select>
              </label>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sarlavha"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 outline-none focus:ring-2 focus:ring-brand-500/40"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
              {target === 'admin' && (
                <input
                  type="number"
                  min={0}
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="Qavat (ixtiyoriy)"
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                />
              )}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Batafsil yozing..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 outline-none focus:ring-2 focus:ring-brand-500/40"
              required
            />

            <label className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              {image ? image.name : "Rasm biriktirish (ixtiyoriy)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold disabled:opacity-50 hover:bg-brand-700"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Murojaatlar yo'q"
            description="Muammo yoki taklifingiz bo'lsa, yangi murojaat yuboring"
            action={{ label: 'Yangi murojaat', onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="space-y-3">
            {items.map((c) => {
              const st = STATUS_UI[c.status] || STATUS_UI.pending;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">{c.title}</h3>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {c.type_display || (c.type === 'suggestion' ? 'Taklif' : 'Shikoyat')}
                        {' · '}
                        {c.target_role_display || (c.target_role === 'superadmin' ? 'Superadmin' : 'Admin')}
                        {c.category_display ? ` · ${c.category_display}` : ''}
                        {c.floor_name ? ` · ${c.floor_name}` : ''}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.className}`}
                    >
                      {st.icon}
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-2 whitespace-pre-wrap">
                    {c.description}
                  </p>
                  {c.image && (
                    <img
                      src={mediaUrl(c.image)}
                      alt=""
                      className="max-h-40 rounded-xl border border-surface-200 dark:border-surface-700 mb-2"
                    />
                  )}
                  {c.admin_response && (
                    <p className="text-sm text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3">
                      Javob: {c.admin_response}
                    </p>
                  )}
                  {c.created_at && (
                    <p className="text-xs text-surface-400 mt-2">
                      {new Date(c.created_at).toLocaleString('uz-UZ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
