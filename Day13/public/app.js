const { useState, useEffect } = React;

function escapeHtml(unsafe) {
  return unsafe
    ? unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    : "";
}

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState({
    title: "",
    content: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/notes");
      let data = await response.json();
      // Map MongoDB _id to id for frontend
      data = data.map((n) => ({ ...n, id: n._id }));
      setNotes(data);
    } catch (error) {
      alert("Error fetching notes");
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!modalNote.title.trim() || !modalNote.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    if (modalNote.id) {
      // Update
      try {
        await fetch(`http://localhost:3000/api/notes/${modalNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: modalNote.title,
            content: modalNote.content,
          }),
        });
        await fetchNotes();
      } catch {
        alert("Error updating note");
      }
    } else {
      // Create
      try {
        await fetch(`http://localhost:3000/api/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: modalNote.title,
            content: modalNote.content,
          }),
        });
        await fetchNotes();
      } catch {
        alert("Error creating note");
      }
    }
    setModalOpen(false);
    setModalNote({ title: "", content: "", id: null });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "DELETE",
      });
      await fetchNotes();
    } catch {
      alert("Error deleting note");
    }
  }

  function openModal(note = null) {
    if (note) {
      setModalNote({ title: note.title, content: note.content, id: note.id });
    } else {
      setModalNote({ title: "", content: "", id: null });
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalNote({ title: "", content: "", id: null });
  }

  return (
    <div className="container">
      <header>
        <h1>📝 Notes App</h1>
        <button className="btn primary" onClick={() => openModal()}>
          New Note
        </button>
      </header>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div>No notes yet.</div>
          ) : (
            notes.map((note) => (
              <div className="note-card" key={note.id}>
                <div className="created-date">
                  {new Date(note.created).toLocaleDateString()}
                </div>
                <h3>{escapeHtml(note.title)}</h3>
                <p>{escapeHtml(note.content)}</p>
                <div className="card-actions">
                  <button className="btn" onClick={() => openModal(note)}>
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Modal */}
      <div className={"modal" + (modalOpen ? " show" : "")}>
        <div className="modal-content">
          <input
            type="text"
            className="note-title"
            placeholder="Note Title"
            value={modalNote.title}
            onChange={(e) =>
              setModalNote({ ...modalNote, title: e.target.value })
            }
          />
          <textarea
            className="note-content"
            placeholder="Write your note here..."
            value={modalNote.content}
            onChange={(e) =>
              setModalNote({ ...modalNote, content: e.target.value })
            }
          ></textarea>
          <div className="modal-actions">
            <button className="btn primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<NotesApp />);
