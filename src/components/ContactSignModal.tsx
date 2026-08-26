import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  CheckCircle2, 
  HeartPulse, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  PenTool, 
  MessageSquare, 
  Clock, 
  Sparkles,
  FileSignature
} from 'lucide-react';

interface ContactSignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSignModal: React.FC<ContactSignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<'editorial' | 'clinical' | 'video' | 'general' | 'partnership'>('editorial');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [digitalSign, setDigitalSign] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate verified clinical message signing
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setDigitalSign('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="contact-sign-modal"
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-900 bg-neutral-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-emerald-500/20">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                Contact &amp; Clinical Sign
              </h2>
              <p className="text-xs text-neutral-400">
                Reach our medical editorial board &amp; video directors
              </p>
            </div>
          </div>

          <button
            id="close-contact-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close Contact Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Message &amp; Sign Received
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-emerald-400 font-semibold">{name}</span>. Your dispatch has been securely signed {digitalSign ? `as "${digitalSign}"` : ''} and delivered to the <span className="text-white font-medium">Health is everything</span> clinical review desk.
              </p>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-left text-xs text-neutral-400 max-w-md mx-auto space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Dispatch ID:</span>
                  <span className="text-emerald-400">#HIE-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Reply:</span>
                  <span className="text-neutral-200">Within 24 Hours</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Topic Selector Pills */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Select Inquiry Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'editorial', label: 'Editorial Research Pitch' },
                    { id: 'clinical', label: 'Clinical Review Question' },
                    { id: 'video', label: 'Video Masterclass Proposal' },
                    { id: 'partnership', label: 'Research Partnership' },
                    { id: 'general', label: 'General Health Query' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTopic(t.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                        topic === t.id
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-sm'
                          : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Your Name / Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Julian Vance, MD"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-emerald-500 text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian.vance@clinic.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-emerald-500 text-white text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiring about Autophagy trial citations in Longevity article"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-emerald-500 text-white text-xs outline-none transition-colors"
                />
              </div>

              {/* Message Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Message Details <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your clinical inquiry, video proposal, or feedback in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-emerald-500 text-white text-xs outline-none transition-colors resize-none"
                />
              </div>

              {/* Digital Signature / Sign Box */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Digital Signature / Sign Seal (Optional)</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400">AUTHENTICATED</span>
                </div>
                <input
                  type="text"
                  value={digitalSign}
                  onChange={(e) => setDigitalSign(e.target.value)}
                  placeholder="Type full legal name or credentials to sign (e.g. Julian Vance, MD, PhD)"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-emerald-300 font-mono text-xs outline-none"
                />
                <p className="text-[10px] text-neutral-500">
                  Signing attaches your verified sender stamp to our medical communications directory.
                </p>
              </div>

              {/* Direct Contacts Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-neutral-400 border-t border-neutral-900">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">contact@healthis-everything.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Clinical Research Board Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sign &amp; Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
