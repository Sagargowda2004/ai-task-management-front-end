import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";

const PRIORITY_STYLES = {
  HIGH: {
    badge: "bg-rose-50 text-rose-600 border border-rose-200",
    dot: "bg-rose-500",
  },
  MEDIUM: {
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    dot: "bg-amber-400",
  },
  LOW: {
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const STATUS_STYLES = {
  TODO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-50 text-blue-600 border border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  status: "TODO",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskModal({
  show,
  editingTaskId,
  taskData,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-box"
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          padding: "30px 30px 26px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            {editingTaskId ? "Edit Task" : "New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#f5f5f5",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 18,
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ebebeb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              name="title"
              placeholder="What needs to be done?"
              value={taskData.title}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              placeholder="Add details..."
              value={taskData.description}
              onChange={onChange}
              rows={3}
              className="form-input"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={onChange}
                className="form-input"
                style={{ cursor: "pointer" }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={taskData.status}
                onChange={onChange}
                className="form-input"
                style={{ cursor: "pointer" }}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 6,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                background: "transparent",
                color: "#555",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTaskId ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AiModal({
  show,
  onClose,
  chatMessages,
  aiLoading,
  aiMessage,
  onMessageChange,
  onSend,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (show) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.40)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 640,
          height: "80vh",
          borderRadius: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                }}
              >
                <div className="ai-avatar">✧</div>
              </div>

              <div>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  TaskFlow AI
                </h2>

                <p
                  style={{
                    fontSize: 13,
                    color: "#aaa",
                    margin: "2px 0 0",
                  }}
                >
                  Productivity Assistant
                </p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#aaa", margin: "2px 0 0" }}>
              Productivity Assistant
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#f9f9f9",
          }}
        >
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 18px",
                  borderRadius: 18,
                  fontSize: 14,
                  lineHeight: 1.45,
                  whiteSpace: "pre-line",
                  background: msg.role === "user" ? "#1a1a1a" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#333",
                  boxShadow:
                    msg.role === "assistant"
                      ? "0 2px 8px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "12px 18px",
                  borderRadius: 18,
                  fontSize: 14,
                  color: "#888",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid #ebebeb",
            background: "#fff",
            display: "flex",
            gap: 10,
          }}
        >
          <input
            type="text"
            placeholder="Ask about productivity, tasks, priorities..."
            value={aiMessage}
            onChange={onMessageChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !aiLoading) onSend();
            }}
            style={{
              flex: 1,
              border: "1.5px solid #e2e8f0",
              borderRadius: 24,
              padding: "10px 18px",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              transition: "border-color 0.18s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={aiLoading}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: 24,
              fontSize: 14,
              fontWeight: 600,
              cursor: aiLoading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              opacity: aiLoading ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "#555",
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();

  // Task state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Task modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskData, setTaskData] = useState(EMPTY_FORM);

  // AI modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi 👋 I'm your AI productivity assistant. Ask me about your tasks, priorities, deadlines, or productivity insights.",
    },
  ]);

  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  // ─── API helpers ─────────────────────────────────────────────────────────────

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tasks", authHeader());
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ─── Auth ─────────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  // ─── Task form ────────────────────────────────────────────────────────────────

  const handleChange = (e) =>
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setTaskData(EMPTY_FORM);
    setEditingTaskId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // ─── CRUD ─────────────────────────────────────────────────────────────────────

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/tasks", taskData, authHeader());
      closeModal();
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/tasks/${editingTaskId}`, taskData, authHeader());
      closeModal();
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`, authHeader());
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  // ─── AI chat ──────────────────────────────────────────────────────────────────

  const handleAiChat = async () => {
    if (!aiMessage.trim()) return;

    const userMessage = aiMessage;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setAiMessage("");
    setAiLoading(true);

    try {
      const response = await api.post(
        "/api/ai/chat",
        { message: userMessage },
        authHeader(),
      );
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data },
      ]);
    } catch (error) {
      console.error(error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI service is temporarily unavailable.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f5f4f0", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .task-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .task-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
        }

        .btn-primary {
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover {
          background: #333;
          transform: translateY(-1px);
        }

        .btn-danger {
          background: transparent;
          color: #e53e3e;
          border: 1.5px solid #fed7d7;
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-danger:hover {
          background: #fff5f5;
          border-color: #fc8181;
        }

        .btn-edit {
          background: transparent;
          color: #3182ce;
          border: 1.5px solid #bee3f8;
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-edit:hover {
          background: #ebf8ff;
          border-color: #90cdf4;
        }

        .form-input {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: #fafafa;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
          resize: none;
        }
        .form-input:focus {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.08);
          background: #fff;
        }

        .modal-overlay { animation: fadeIn 0.2s ease; }
        .modal-box { animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 18px 22px;
          border: 1px solid #ebebeb;
        }

        .logout-btn {
          background: transparent;
          color: #e53e3e;
          border: 1.5px solid #fed7d7;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover { background: #fff5f5; }

        .ai-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #fff;
          border: none;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 150;
        }
        .ai-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 36px rgba(0,0,0,0.32);
        }
        .markdown-body p {
  margin: 4px 0;
}

.markdown-body ul {
  margin: 4px 0;
  padding-left: 18px;
}

.markdown-body li {
  margin-bottom: 4px;
}

.markdown-body strong {
  font-weight: 700;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin: 6px 0;
  font-size: 15px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 2px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #666;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.7);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ai-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
}
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #ebebeb",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "#1a1a1a",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 16 }}>✦</span>
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "-0.3px",
              }}
            >
              TaskFlow
            </span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              My Tasks
            </h1>
            <p style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
              {counts.total} task{counts.total !== 1 ? "s" : ""} total
            </p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            + New Task
          </button>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[
            { label: "Total", value: counts.total, color: "#1a1a1a" },
            { label: "To Do", value: counts.todo, color: "#718096" },
            {
              label: "In Progress",
              value: counts.inProgress,
              color: "#3182ce",
            },
            { label: "Completed", value: counts.completed, color: "#38a169" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#aaa",
                  marginTop: 4,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #e2e8f0",
                borderTopColor: "#1a1a1a",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                margin: "0 auto 14px",
              }}
            />
            <p style={{ fontSize: 14 }}>Loading tasks...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid #ebebeb",
              padding: "60px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 6px",
              }}
            >
              No tasks yet
            </h3>
            <p style={{ color: "#aaa", fontSize: 14, margin: "0 0 20px" }}>
              Create your first task to get started.
            </p>
            <button className="btn-primary" onClick={openCreateModal}>
              + New Task
            </button>
          </div>
        )}

        {/* Task grid */}
        {!loading && tasks.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {tasks.map((task) => {
              const p =
                PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM;
              const s = STATUS_STYLES[task.status] || STATUS_STYLES.TODO;
              return (
                <div
                  key={task.id}
                  className="task-card"
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #ebebeb",
                    padding: "22px 22px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  {/* Top */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        margin: 0,
                        lineHeight: 1.3,
                        flex: 1,
                        paddingRight: 10,
                      }}
                    >
                      {task.title}
                    </h3>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                      className={p.badge}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                        className={p.dot}
                      />
                      {task.priority}
                    </span>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#777",
                        margin: "0 0 14px",
                        lineHeight: 1.55,
                      }}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Due date */}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#aaa",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span>📅</span>
                    <span>Due {task.dueDate}</span>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: 14,
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                      className={s}
                    >
                      {STATUS_LABELS[task.status] || task.status}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn-edit"
                        onClick={() => openEditModal(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── AI FLOATING BUTTON (outside all modals) ── */}
      <button
        type="button"
        className="ai-fab"
        onClick={() => setShowAiModal(true)}
        aria-label="Open AI assistant"
      >
        ✦
      </button>

      {/* ── TASK MODAL (create / edit) ── */}
      <TaskModal
        show={showModal}
        editingTaskId={editingTaskId}
        taskData={taskData}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask}
      />

      {/* ── AI MODAL ── */}
      <AiModal
        show={showAiModal}
        onClose={() => setShowAiModal(false)}
        chatMessages={chatMessages}
        aiLoading={aiLoading}
        aiMessage={aiMessage}
        onMessageChange={(e) => setAiMessage(e.target.value)}
        onSend={handleAiChat}
      />
    </div>
  );
}

export default Dashboard;
