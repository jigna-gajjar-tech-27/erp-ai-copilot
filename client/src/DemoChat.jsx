import { useState, useRef, useEffect } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [sessions, setSessions] = useState([
    { id: 1, messages: [] } // initial session
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [pendingNewChat, setPendingNewChat] = useState(false);

  const sendMessage = async () => 
  {
    if (!message.trim()) return;

    let sessionId = currentSessionId;

    // If there is a pending new chat, create session now
    if (pendingNewChat) {
      const newId = sessions.length + 1;
      const newSession = { id: newId, messages: [] };
      setSessions(prev => [...prev, newSession]);
      sessionId = newId;
      setCurrentSessionId(newId);
      setPendingNewChat(false);
    }

    const userMessage = { sender: "user", text: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    setSessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, messages: [...s.messages, userMessage] }
        : s
    ));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const botMessage = {
        sender: "bot",
        text: data.sql
          ? `SQL Query:\n${data.sql}\n\nResult:\n${Array.isArray(data.reply) 
              ? data.reply.map(u => u.Name?.FullName).join(", ") 
              : data.reply}`
          : data.reply
      };
      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, botMessage] }
          : s
      ));
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const createNewChat = () => {
    const newId = sessions.length + 1; // new session id
    setSessions([{ id: newId, messages: [] },...sessions]);
    setCurrentSessionId(newId);
  };

  // const handleNewChatClick = () => {
  //   setMessage("");        // clear input
  //   setPendingNewChat(true); // mark that next user input will create a session
  // };
  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6", fontFamily: "Segoe UI, sans-serif" }}>
      
      <div style={{
      width: 260,
      minWidth: 260,
      flexShrink: 0,
      background: "#111827",
      color: "#fff",
      padding: 20,
      display: "flex",
      flexDirection: "column"
    }}>
        <h3 style={{ marginBottom: 20 }}>ERP AI</h3>
      <a href="https://yourportfolio.com"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "block",
    padding: "8px 12px",
    borderRadius: 8,
    background: "rgba(37, 99, 235, 0.08)",
    color: "#2563eb",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 12,
    border: "1px solid rgba(37, 99, 235, 0.2)",
    transition: "background 0.2s",
  }}
  onMouseEnter={e => e.currentTarget.style.background = "rgba(37, 99, 235, 0.15)"}
  onMouseLeave={e => e.currentTarget.style.background = "rgba(37, 99, 235, 0.08)"}
>
  🔗 My Portfolio
</a>
        <button onClick={createNewChat} style={{
          padding: 10,
          borderRadius: 8,
          border: "none",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
          marginBottom: 20
        }}>
          + New Chat
        </button>

        <div style={{
            flexGrow: 1,
            fontSize: 14,
            overflowY: "auto",
            overflowX: "hidden",
            marginTop: 10
          }}>
        {sessions.map(s => (
          <div
            key={s.id}
            onClick={() => setCurrentSessionId(s.id)}
            style={{
              padding: "8px 10px",
              marginBottom: 5,
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {s.messages.length === 0
              ? ``
              : s.messages[0].text.slice(0, 25) + (s.messages[0].text.length > 25 ? "..." : "")
            }
          </div>
        ))}
      </div>
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        
        <div style={{
          padding: 15,
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: 600,
          fontSize: 18
        }}>
          ERP AI Copilot
        </div>

        <div style={{ flexGrow: 1, overflowY: "auto", background: "#fff", padding: 20 }}>
          {messages.length === 0 && <div style={{ textAlign: "center", color: "#888" }}>How can I help you today?</div>}
         {sessions.find(s => s.id === currentSessionId)?.messages.map((msg, i) => (
            <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 15
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                maxWidth: "65%",
                background: msg.sender === "user" ? "#2563eb" : "#e5e7eb",
                color: msg.sender === "user" ? "#fff" : "#111",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.text}
            </div>
          </div>
          ))}
          {loading && <div style={{ padding: 10, background: "#e9ecef", borderRadius: 8 }}>Typing...</div>}
          <div ref={chatEndRef}></div>
        </div>

        <div style={{
          padding: 15,
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", gap: 10 }}>
            <textarea
              rows="1"
              placeholder="Ask ERP AI something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{
                flexGrow: 1,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                resize: "none"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;