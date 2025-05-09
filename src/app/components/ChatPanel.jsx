







// D:\New folder (2)\app\components\ChatPanel.jsx

'use client';
import { useEffect, useState, useRef } from 'react';

export default function ChatPanel() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pastChats, setPastChats] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewChat = async () => {
    try {
      const res = await fetch('/api/proxy/chat/start', {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.Chat?.id) {
        setChatId(data.Chat.id);
        setMessages([
          {
            from: 'system',
            text: '🩺 New diagnostic session started. You may begin typing.',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to start new chat:', err);
    }
  };

  useEffect(() => {
    startNewChat();
  }, []);

  useEffect(() => {
    const loadPastChats = async () => {
      try {
        const res = await fetch('/api/proxy/chat/list', {
          credentials: 'include',
        });
        const data = await res.json();
        if (Array.isArray(data.Chats)) {
          setPastChats(data.Chats);
        }
      } catch (err) {
        console.error('Failed to fetch past chats', err);
      }
    };

    loadPastChats();
  }, []);

  const loadChatById = async (id) => {
    try {
      const res = await fetch(`/api/proxy/chat/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.ChatHistory) {
        const parsed = data.ChatHistory.map((line) => {
          const [from, ...msgParts] = line.split(':');
          return {
            from: from.toLowerCase().includes('user') ? 'user' : 'system',
            text: msgParts.join(':').trim(),
          };
        });

        setMessages(parsed);
        setChatId(id);
      }
    } catch (err) {
      console.error('[LOAD CHAT] Failed to load chat by ID:', err);
    }
  };

  const handleSend = async () => {
    if (!input || !chatId || loading) return;

    setLoading(true);
    const userMsg = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(
        `/api/proxy/chat/answer/${chatId}?user_input=${encodeURIComponent(input)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      const data = await res.json();

      const history = data.ChatHistory || [];
      let reply = 'No response';
      const lastAgentReply = history.reverse().find((line) =>
        line.toLowerCase().startsWith('agent:')
      );

      if (lastAgentReply) {
        reply = lastAgentReply.split(':').slice(1).join(':').trim();
      }

      const botMsg = { from: 'system', text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('[SEND] Error:', err);
      setMessages((prev) => [...prev, { from: 'system', text: 'Error sending message.' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button onClick={() => setShowHistory(!showHistory)} style={styles.toggleBtn}>
          {showHistory ? '⬆ Hide Past Chats' : '📜 Show Past Chats'}
        </button>
        <button onClick={startNewChat} style={styles.newChatBtn}>
          ➕ New Chat
        </button>
      </div>

      {showHistory && (
        <div style={styles.historyBox}>
          {pastChats.map((chat) => (
            <button
              key={chat.id}
              style={styles.historyBtn}
              onClick={() => loadChatById(chat.id)}
            >
              #{chat.id} - {chat.name || 'Unnamed'}
            </button>
          ))}
        </div>
      )}

      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <div style={styles.emptyMsg}>No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={msg.from === 'user' ? styles.userMsg : styles.systemMsg}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          style={styles.sendBtn}
          disabled={loading || !input}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh', // ensures full vertical space on mobile
    maxHeight: '100dvh',
    backgroundColor: '#f5f5f5',
    fontFamily: `'Segoe UI', sans-serif`,
    overflow: 'hidden', 
    paddingBottom: '00px',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    zIndex: 2,
    marginTop: '50px', // ⬅️ Add this line
  },
  
  toggleBtn: {
    backgroundColor: '#e7e7e7',
    border: '1px solid #ccc',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  newChatBtn: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: '500',
  },
  historyBox: {
    flexShrink: 0,
    maxHeight: '160px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
    padding: '10px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  
  historyBtn: {
    display: 'block',
    width: '100%',
    marginBottom: '8px',
    padding: '8px 12px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
  chatBox: {
    flex: 1,
    minHeight: 0, // 🧠 necessary for scrollable child in flex container
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fefefe',
  },
  
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#dbeafe',
    color: '#1e1e1e',
    padding: '10px 14px',
    margin: '6px 0',
    borderRadius: '16px 16px 0 16px',
    maxWidth: '80%',
    wordBreak: 'break-word',
    fontSize: '15px',
  },
  systemMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    color: '#1e1e1e',
    padding: '10px 14px',
    margin: '6px 0',
    borderRadius: '16px 16px 16px 0',
    maxWidth: '80%',
    wordBreak: 'break-word',
    fontSize: '15px',
  },
  emptyMsg: {
    textAlign: 'center',
    color: '#888',
    marginTop: '30px',
    fontStyle: 'italic',
  },
  inputRow: {
    display: 'flex',
    padding: '14px 16px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  sendBtn: {
    marginLeft: '12px',
    padding: '10px 18px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background 0.2s',
    fontWeight: '500',
  },
};
