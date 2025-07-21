import React, { useState, useEffect, useRef } from "react";
import { NotebookPen, Pencil, Trash2 } from "lucide-react";

const DiaryZone = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("diaryEntries") || "[]");
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch (err) {
      console.error("Failed to parse diary entries:", err);
    }
  }, []);

  useEffect(() => {
    if (editIndex !== null && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editIndex]);

  const saveToStorage = (data) => {
    localStorage.setItem("diaryEntries", JSON.stringify(data));
  };

  const setStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleSubmit = () => {
    if (entry.trim() === "") return;
    const time = new Date().toLocaleString();
    const updatedEntries = [...entries];

    if (editIndex !== null) {
      updatedEntries[editIndex] = { ...updatedEntries[editIndex], text: entry, time };
      setEditIndex(null);
      setStatus("Entry updated");
    } else {
      updatedEntries.unshift({ text: entry, time });
      setStatus("Entry saved");
    }

    const limitedEntries = updatedEntries.slice(0, 100);
    setEntries(limitedEntries);
    saveToStorage(limitedEntries);
    setEntry("");
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
      saveToStorage(updated);
      setStatus("Entry deleted");
    }
    setShowModal(false);
    setDeleteIndex(null);
  };

  const handleEdit = (index) => {
    setEntry(entries[index].text);
    setEditIndex(index);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex flex-col items-center overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <NotebookPen size={30} className="text-yellow-400" />
        <h2 className="text-4xl font-bold text-yellow-400">Diary Zone</h2>
      </div>

      <p className="text-neutral-400 max-w-xl mb-8 text-center text-base">
        Your private space to reflect and express. Write freely and honestly.
      </p>

      <textarea
        ref={textareaRef}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your thoughts here..."
        className="hide-scrollbar w-full max-w-2xl h-48 p-4 bg-neutral-900 text-yellow-100 border border-yellow-500/30 rounded-lg shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      <button
        onClick={handleSubmit}
        className="mt-5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out shadow-lg cursor-pointer"
      >
        {editIndex !== null ? "Update Entry" : "Save Entry"}
      </button>

      {statusMessage && (
        <p className="mt-4 text-green-400 font-medium">{statusMessage}</p>
      )}

      {entries.length > 0 && (
        <div className="mt-12 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold text-yellow-300 mb-6 text-center">
            Previous Entries
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {entries.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-yellow-500/10 bg-neutral-900 shadow-md hover:shadow-lg transition-all"
              >
                <p className="text-yellow-100 whitespace-pre-wrap break-words mb-4 text-sm leading-relaxed">
                  {item.text}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{item.time}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(index)}
                      title="Edit"
                      className="hover:text-yellow-400 transition cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(index)}
                      title="Delete"
                      className="hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
          <div className="bg-neutral-900 border border-yellow-400 rounded-xl p-6 w-[90%] max-w-sm animate-slide-up shadow-2xl text-center">
            <h2 className="text-xl font-semibold text-yellow-300 mb-3">Delete Entry?</h2>
            <p className="text-sm text-gray-300 mb-5">
              Are you sure you want to delete this entry? This cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition text-white font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryZone;
