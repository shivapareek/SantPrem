import React, { useState, useEffect, useRef } from "react";
import {
  Pencil, Trash2, Smile, Frown, Meh, Heart, Zap,
  Bold, Italic, Mic, MicOff, X, Download, Plus, Minus,
  Underline, AlignLeft, AlignCenter, AlignRight,
  CheckCircle, AlertCircle, Info, Loader2
} from "lucide-react";

// Toast Message Component
const ToastMessage = ({ type = 'default', title, message, isVisible, onClose, duration = 5000 }) => {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onClose();
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-900/20 to-emerald-800/20',
          border: 'border-emerald-500/30',
          accent: 'bg-emerald-500',
          icon: CheckCircle,
          iconColor: 'text-emerald-400'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-900/20 to-red-800/20',
          border: 'border-red-500/30',
          accent: 'bg-red-500',
          icon: AlertCircle,
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-900/20 to-amber-800/20',
          border: 'border-amber-500/30',
          accent: 'bg-amber-500',
          icon: AlertCircle,
          iconColor: 'text-amber-400'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-900/20 to-blue-800/20',
          border: 'border-blue-500/30',
          accent: 'bg-blue-500',
          icon: Info,
          iconColor: 'text-blue-400'
        };
      case 'loading':
        return {
          bg: 'bg-gradient-to-r from-slate-900/20 to-slate-800/20',
          border: 'border-slate-500/30',
          accent: 'bg-slate-500',
          icon: Loader2,
          iconColor: 'text-slate-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-900/20 to-gray-800/20',
          border: 'border-gray-500/30',
          accent: 'bg-gray-500',
          icon: Info,
          iconColor: 'text-gray-400'
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <div 
        className={`
          relative overflow-hidden rounded-xl backdrop-blur-xl
          ${styles.bg} ${styles.border}
          border shadow-2xl transform transition-all duration-500 ease-out
          hover:scale-[1.02] hover:shadow-3xl
        `}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px) saturate(150%)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-0.5 bg-white/10 w-full">
          <div 
            className={`h-full ${styles.accent} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.iconColor} mt-0.5`}>
            <IconComponent 
              size={20} 
              className={type === 'loading' ? 'animate-spin' : ''}
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm leading-tight mb-1">
              {title}
            </h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-md hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Subtle Glow Effect */}
        <div 
          className={`absolute inset-0 opacity-5 ${styles.accent} pointer-events-none`}
          style={{
            background: `radial-gradient(circle at 20% 20%, currentColor 0%, transparent 70%)`
          }}
        />
      </div>
    </div>
  );
};

const DiaryZone = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [currentFontSize, setCurrentFontSize] = useState(16);
  const [currentAlign, setCurrentAlign] = useState('left');
  const [currentColor, setCurrentColor] = useState('#fef3c7');
  const [toasts, setToasts] = useState([]);
  const editorRef = useRef(null);
  const [lastEditedIndex, setLastEditedIndex] = useState(null);

  // Toast functions
  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message, isVisible: true }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const moods = [
    { icon: <Heart className="w-5 h-5" />, name: "happy", color: "text-pink-400", label: "Happy" },
    { icon: <Smile className="w-5 h-5" />, name: "excited", color: "text-yellow-400", label: "Excited" },
    { icon: <Meh className="w-5 h-5" />, name: "neutral", color: "text-gray-400", label: "Neutral" },
    { icon: <Frown className="w-5 h-5" />, name: "sad", color: "text-blue-400", label: "Sad" },
    { icon: <Zap className="w-5 h-5" />, name: "angry", color: "text-red-400", label: "Angry" }
  ];

  useEffect(() => {
    loadEntries();
    initializeSpeechRecognition();
  }, []);

  const loadEntries = () => {
    try {
      // Using in-memory storage instead of localStorage for artifacts
      const stored = window.diaryEntries || [];
      setEntries(stored);
      if (stored.length > 0) {
        showToast('info', 'Entries Loaded', `Successfully loaded ${stored.length} previous entries from your spiritual journey.`);
      }
    } catch (err) {
      console.error("Failed to load entries:", err);
      setEntries([]);
      showToast('error', 'Loading Failed', 'Unable to load your previous entries. Starting fresh.');
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();

      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const currentText = editorRef.current?.innerText || entry;
        const newText = currentText + ' ' + transcript;

        setEntry(newText);
        if (editorRef.current) {
          editorRef.current.innerText = newText;
        }
        setIsRecording(false);
        showToast('success', 'Voice Captured', 'Your spoken words have been transcribed successfully.');
      };

      speechRecognition.onend = () => setIsRecording(false);
      speechRecognition.onerror = (event) => {
        setIsRecording(false);
        showToast('error', 'Voice Recognition Error', `Unable to process voice input: ${event.error}`);
      };

      setRecognition(speechRecognition);
    } else {
      showToast('warning', 'Voice Feature Unavailable', 'Voice-to-text is not supported in your browser.');
    }
  };

  const handleSubmit = () => {
    const currentText = editorRef.current?.innerHTML || entry;

    if (editorRef.current?.innerText.trim().length < 5) {
      showToast('warning', 'Entry Too Short', 'Please write a bit more to capture your thoughts properly.');
      return;
    }

    if (!selectedMood) {
      showToast('info', 'Mood Required', 'Please select how you\'re feeling to complete your entry.');
      return;
    }

    const time = new Date().toLocaleString();
    const updatedEntries = [...entries];

    const entryData = {
      text: currentText,
      time,
      mood: selectedMood,
      fontSize: currentFontSize,
      textAlign: currentAlign,
      textColor: currentColor
    };

    if (editIndex !== null) {
      updatedEntries[editIndex] = entryData;
      setLastEditedIndex(editIndex);
      setEditIndex(null);
      showToast('success', 'Entry Updated', 'Your spiritual reflection has been successfully updated.');
    } else {
      updatedEntries.unshift(entryData);
      showToast('success', 'Entry Saved', 'Your thoughts have been preserved in your spiritual journal.');
    }

    const limitedEntries = updatedEntries.slice(0, 100);
    setEntries(limitedEntries);
    // Store in memory instead of localStorage
    window.diaryEntries = limitedEntries;

    // Clear form
    setEntry("");
    setSelectedMood("");
    setCurrentColor('#fef3c7');
    if (editorRef.current) {
      editorRef.current.innerText = "";
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (deleteIndex !== null) {
      const updated = [...entries];
      updated.splice(deleteIndex, 1);
      setEntries(updated);
      window.diaryEntries = updated;
      showToast('info', 'Entry Deleted', 'Your diary entry has been permanently removed.');
    }
    setShowModal(false);
    setDeleteIndex(null);
  };

  const handleEdit = (index) => {
    const entryData = entries[index];
    setEntry(entryData.text);
    setSelectedMood(entryData.mood || "");
    setCurrentFontSize(entryData.fontSize || 16);
    setCurrentAlign(entryData.textAlign || 'left');
    setCurrentColor(entryData.textColor || '#fef3c7');
    setEditIndex(index);
    if (editorRef.current) {
      editorRef.current.innerHTML = entryData.text;
    }
    showToast('info', 'Editing Mode', 'You can now modify your selected diary entry.');
  };

  const formatText = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      showToast('success', 'Text Formatted', `Applied ${command} formatting to your text.`);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      showToast('error', 'Voice Unavailable', 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      showToast('info', 'Recording Stopped', 'Voice recording has been stopped.');
    } else {
      try {
        recognition.start();
        setIsRecording(true);
        showToast('loading', 'Listening...', 'Speak now to convert your voice to text.');
      } catch (error) {
        showToast('error', 'Recording Failed', 'Could not start voice recognition. Please try again.');
        setIsRecording(false);
      }
    }
  };

  const exportToJSON = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diary-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Backup Created', 'Your spiritual journal has been exported successfully.');
  };

  const adjustFontSize = (increment) => {
    const newSize = Math.max(12, Math.min(24, currentFontSize + increment));
    setCurrentFontSize(newSize);
    showToast('info', 'Font Size Changed', `Text size adjusted to ${newSize}px for better readability.`);
  };

  const handleEditorInput = (e) => {
    setEntry(e.target.innerHTML);
  };

  const getMoodIcon = (moodName) => {
    const mood = moods.find(m => m.name === moodName);
    return mood ? <span className={mood.color}>{mood.icon}</span> : null;
  };

  const renderFormattedText = (text, fontSize, align, color) => (
    <div
      className="whitespace-pre-wrap break-words leading-relaxed"
      style={{
        fontSize: `${fontSize || 16}px`,
        textAlign: align || 'left',
        color: color || '#ffffff',
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  return (
    <div className="relative min-h-screen max-h-screen overflow-y-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl top-10 left-10 z-0 pointer-events-none"></div>
      <div className="absolute w-56 h-56 bg-blue-500/10 rounded-full blur-2xl bottom-20 right-10 z-0 pointer-events-none"></div>
      <div className="absolute w-60 h-60 bg-purple-500/10 rounded-full blur-2xl -bottom-10 left-1/2 transform -translate-x-1/2 z-0 pointer-events-none"></div>
      
      <h2 className="text-4xl font-bold text-yellow-400 mb-6">Man Ki Baat</h2>

      <p className="text-neutral-400 max-w-xl mb-8 text-center text-base">
        यह पवित्र स्थान आपके मन की गहराइयों से जुड़ने का अवसर है। अपने दुख, चिंताएं या कोई भी भावना बिना झिझक यहाँ लिखें। यह जगह केवल आपके और ईश्वर के बीच की है।
      </p>

      {/* Mood Selector */}
      <div className="mb-4">
        <p className="text-sm text-gray-300 mb-2 text-center">How are you feeling?</p>
        <div className="flex gap-3 justify-center">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => {
                setSelectedMood(mood.name);
                showToast('success', 'Mood Selected', `You're feeling ${mood.label.toLowerCase()} today.`);
              }}
              className={`p-2 rounded-full transition-all hover:cursor-pointer ${
                selectedMood === mood.name 
                  ? 'bg-yellow-400/20 ring-2 ring-yellow-400' 
                  : 'hover:bg-neutral-800'
              }`}
              title={mood.label}
            >
              <span className={mood.color}>{mood.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rich Text Editor Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-neutral-900 rounded-lg border border-yellow-500/20">
        <button
          onClick={() => formatText('bold')}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-yellow-400 transition hover:cursor-pointer"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-yellow-400 transition hover:cursor-pointer"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => formatText('underline')}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-yellow-400 transition hover:cursor-pointer"
          title="Underline"
        >
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-600 mx-1"></div>
        <button
          onClick={() => setCurrentAlign('left')}
          className={`p-2 rounded transition ${currentAlign === 'left' ? 'bg-yellow-400 text-black hover:cursor-pointer' : 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400 hover:cursor-pointer'}`}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => setCurrentAlign('center')}
          className={`p-2 rounded transition ${currentAlign === 'center' ? 'bg-yellow-400 text-black hover:cursor-pointer' : 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400 hover:cursor-pointer'}`}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => setCurrentAlign('right')}
          className={`p-2 rounded transition ${currentAlign === 'right' ? 'bg-yellow-400 text-black hover:cursor-pointer' : 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400 hover:cursor-pointer'}`}
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        <div className="w-px bg-gray-600 mx-1"></div>
        <button
          onClick={() => adjustFontSize(-2)}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-yellow-400 transition hover:cursor-pointer"
          title="Decrease Font Size"
        >
          <Minus size={18} />
        </button>
        <span className="px-2 py-2 text-sm text-yellow-400 flex items-center">
          {currentFontSize}px
        </span>
        <button
          onClick={() => adjustFontSize(2)}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-yellow-400 transition hover:cursor-pointer"
          title="Increase Font Size"
        >
          <Plus size={18} />
        </button>
        <div className="w-px bg-gray-600 mx-1"></div>
        
        <button
          onClick={toggleRecording}
          className={`p-2 rounded transition ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse hover:cursor-pointer' 
              : 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400 hover:cursor-pointer'
          }`}
          title={isRecording ? "Stop Recording" : "Voice to Text"}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>

      {/* Rich Text Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        className="w-full max-w-2xl h-48 p-4 bg-neutral-900 border border-yellow-500/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition overflow-y-auto"
        style={{ 
          fontSize: `${currentFontSize}px`,
          textAlign: currentAlign,
          minHeight: '12rem'
        }}
        data-placeholder="Type your thoughts here..."
        suppressContentEditableWarning={true}
      />

      <button
        onClick={handleSubmit}
        className="mt-5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out shadow-lg hover:cursor-pointer"
      >
        {editIndex !== null ? "Update " : "Save "}
      </button>

      <button
        onClick={exportToJSON}
        className="mt-3 text-sm text-yellow-300 underline hover:text-yellow-400 hover:underline-offset-2 transition flex items-center gap-1 hover:cursor-pointer"
      >
        <Download size={16} />
        Download Backup
      </button>

      {entries.length === 0 && (
        <p className="mt-20 text-yellow-400 text-center text-sm opacity-50">
          No entries yet. Start writing your first thoughts above.
        </p>
      )}

      {entries.length > 0 && (
        <div className="mt-12 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold text-yellow-300 mb-6 text-center">
            Previous Entries ({entries.length})
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {entries.map((item, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border border-yellow-500/10 bg-neutral-900 shadow-md hover:shadow-lg transition-all ${index === lastEditedIndex ? "animate-flash" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getMoodIcon(item.mood)}
                    <span className="text-xs text-gray-400 capitalize">{item.mood}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                
                {renderFormattedText(item.text, item.fontSize, item.textAlign)}
                
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(index)}
                    title="Edit"
                    className="text-gray-400 hover:text-yellow-400 transition hover:cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(index)}
                    title="Delete"
                    className="text-gray-400 hover:text-red-400 transition hover:cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
          <div className="bg-neutral-900 border border-yellow-400 rounded-xl p-6 w-[90%] max-w-sm shadow-2xl text-center">
            <h2 className="text-xl font-semibold text-yellow-300 mb-3">Delete Entry?</h2>
            <p className="text-sm text-gray-300 mb-5">
              Are you sure you want to delete this entry? This cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition text-white font-semibold hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      {toasts.map(toast => (
        <ToastMessage
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <style>{`
        @keyframes flash {
          0% { background-color: rgba(250, 204, 21, 0.2); }
          100% { background-color: transparent; }
        }
        .animate-flash {
          animation: flash 2s ease-out;
        }
        
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
        
        [contenteditable] {
          outline: none;
        }
        
        [contenteditable] b, [contenteditable] strong {
          font-weight: bold;
        }
        
        [contenteditable] i, [contenteditable] em {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default DiaryZone;