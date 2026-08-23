'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Search,
} from 'lucide-react';

const API =
  process.env.NEXT_PUBLIC_API_URL || 'https://steps-accademy-backend-production.up.railway.app/api';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  'https://steps-accademy-backend-production.up.railway.app';

export default function Chat({ user, selectedUserId = null }) {
  const [socket, setSocket] = useState(null);
  const [people, setPeople] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const [searching, setSearching] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  /*
   * Socket connection
   */
  useEffect(() => {
    if (!user?._id && !user?.id) return;

    const s = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(s);

    s.on('connect_error', (error) => {
      console.error('CHAT SOCKET ERROR:', error.message);
    });

    s.on('message', (message) => {
      setMessages((current) => {
        const exists = current.some(
          (item) => item._id && item._id === message._id
        );

        if (exists) return current;

        return [...current, message];
      });
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [user]);

  /*
   * Auto-scroll
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  /*
   * Open selected user if this component receives an ID.
   */
  useEffect(() => {
    if (!selectedUserId || !user) return;

    async function loadSelectedUser() {
      try {
        const r = await fetch(
          `${API}/chat/user/${selectedUserId}`,
          {
            credentials: 'include',
          }
        );

        const x = await r.json().catch(() => ({}));

        if (r.ok && x.user) {
          openConversation(x.user);
        }
      } catch {
        // Ignore.
      }
    }

    loadSelectedUser();
  }, [selectedUserId, user]);

  async function searchPeople(value) {
    const q = value.trim();

    if (q.length < 2) {
      setPeople([]);
      return;
    }

    setSearching(true);

    try {
      const r = await fetch(
        `${API}/chat/users?q=${encodeURIComponent(q)}`,
        {
          credentials: 'include',
        }
      );

      const x = await r.json().catch(() => ({}));

      if (r.ok) {
        setPeople(x.users || []);
      }
    } catch {
      setPeople([]);
    } finally {
      setSearching(false);
    }
  }

  async function openConversation(person) {
    if (!person || !socket) return;

    setActive(person);
    setMessages([]);
    setLoadingHistory(true);

    socket.emit('joinConversation', {
      userId: person._id,
    });

    try {
      const r = await fetch(
        `${API}/chat/messages/${person._id}`,
        {
          credentials: 'include',
        }
      );

      const x = await r.json().catch(() => ({}));

      if (r.ok) {
        setMessages(x.messages || []);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  }

  function sendMessage() {
    const clean = text.trim();

    if (
      !clean ||
      !active ||
      !socket ||
      sending
    ) {
      return;
    }

    setSending(true);

    socket.emit(
      'sendMessage',
      {
        to: active._id,
        text: clean,
      },
      () => {
        setSending(false);
      }
    );

    setText('');

    setTimeout(() => {
      setSending(false);
    }, 1200);
  }

  return (
    <div
      className="card chat-layout"
      style={{
        overflow: 'hidden',
      }}
    >
      {/* PEOPLE */}
      <div className="chat-list">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--line)',
            padding: '0 12px',
            background: 'var(--bg)',
          }}
        >
          <Search size={17} color="var(--muted)" />

          <input
            placeholder="Search name or ID…"
            onChange={(e) =>
              searchPeople(e.target.value)
            }
            style={{
              width: '100%',
              border: 0,
              outline: 0,
              padding: '13px 0',
              background: 'transparent',
              color: 'var(--text)',
            }}
          />
        </div>

        {searching && (
          <p
            style={{
              color: 'var(--muted)',
              fontSize: 12,
              marginTop: 12,
            }}
          >
            Searching…
          </p>
        )}

        <div
          className="list"
          style={{
            marginTop: 15,
          }}
        >
          {people.map((person) => (
            <button
              type="button"
              key={person._id}
              onClick={() =>
                openConversation(person)
              }
              className="list-row"
              style={{
                width: '100%',
                background:
                  active?._id === person._id
                    ? 'var(--panel2)'
                    : 'transparent',
                color: 'var(--text)',
                border:
                  active?._id === person._id
                    ? '1px solid var(--gold)'
                    : '1px solid var(--line)',
                textAlign: 'left',
              }}
            >
              <span>
                <b>
                  {person.name ||
                    person.username}
                </b>

                <small
                  style={{
                    display: 'block',
                    color: 'var(--muted)',
                    marginTop: 3,
                  }}
                >
                  {person.role}
                </small>
              </span>

              <span>→</span>
            </button>
          ))}

          {!searching &&
            people.length === 0 && (
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: 12,
                  lineHeight: 1.6,
                  padding: 10,
                }}
              >
                Search by name, username or ID.
              </p>
            )}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="chat-window">
        {!active ? (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              height: '100%',
              minHeight: 500,
              padding: 30,
              textAlign: 'center',
              color: 'var(--muted)',
            }}
          >
            <div>
              <MessageIcon />

              <h3
                style={{
                  color: 'var(--text)',
                  marginTop: 15,
                }}
              >
                Start a secure conversation
              </h3>

              <p>
                Search for an academy member from
                the left side.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div
              className="card-body"
              style={{
                borderBottom:
                  '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 15,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  {active.name ||
                    active.username}
                </div>

                <div
                  style={{
                    color: 'var(--muted)',
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  {active.role}
                </div>
              </div>

              <span className="tag">
                SECURE CHAT
              </span>
            </div>

            {/* MESSAGES */}
            <div className="messages">
              {loadingHistory ? (
                <div
                  style={{
                    color: 'var(--muted)',
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  Loading conversation…
                </div>
              ) : messages.length === 0 ? (
                <div
                  style={{
                    color: 'var(--muted)',
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  No previous messages.
                  <br />
                  Start the conversation below.
                </div>
              ) : (
                messages.map((message) => {
                  const myId =
                    user._id || user.id;

                  const isMe =
                    String(message.from) ===
                    String(myId);

                  return (
                    <div
                      className={`bubble ${
                        isMe ? 'me' : ''
                      }`}
                      key={
                        message._id ||
                        `${message.from}-${message.at}`
                      }
                    >
                      {message.text}

                      <small
                        style={{
                          display: 'block',
                          opacity: 0.55,
                          marginTop: 5,
                          fontSize: 9,
                        }}
                      >
                        {message.at
                          ? new Date(
                              message.at
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute:
                                  '2-digit',
                              }
                            )
                          : ''}
                      </small>
                    </div>
                  );
                })
              )}

              <div ref={bottomRef} />
            </div>

            {/* COMPOSER */}
            <div className="chat-compose">
              <button
                type="button"
                className="icon-btn"
                title="Attach file"
                onClick={() =>
                  alert(
                    'File upload will be connected in the next upload module.'
                  )
                }
              >
                <Paperclip size={17} />
              </button>

              <button
                type="button"
                className="icon-btn"
                title="Send image"
                onClick={() =>
                  alert(
                    'Image upload will be connected in the next upload module.'
                  )
                }
              >
                <ImageIcon size={17} />
              </button>

              <input
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Write a message…"
              />

              <button
                type="button"
                className="btn primary"
                onClick={sendMessage}
                disabled={
                  sending ||
                  !text.trim()
                }
                title="Send message"
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageIcon() {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: '1px solid var(--gold)',
        display: 'grid',
        placeItems: 'center',
        margin: 'auto',
        color: 'var(--gold2)',
        fontSize: 24,
      }}
    >
      💬
    </div>
  );
}