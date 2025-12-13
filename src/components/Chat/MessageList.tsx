import { useEffect, useRef } from "react";


export interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
}

export function MessageList({ messages, currentAddress }: { messages: Message[]; currentAddress: string }) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{ padding: '0 0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg) => {
                const isMe = msg.sender === currentAddress;
                return (
                    <div key={msg.id} className="animate-slide-in-up" style={{ display: 'flex', width: '100%', justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        <div
                            className={isMe ? "hover-lift" : "glass-card hover-lift"}
                            style={{
                                maxWidth: '80%', padding: '1rem', borderRadius: '1rem', position: 'relative', wordBreak: 'break-word',
                                borderTopRightRadius: isMe ? '0.125rem' : '1rem', borderTopLeftRadius: isMe ? '1rem' : '0.125rem',
                                background: isMe ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'white',
                                color: isMe ? 'white' : 'var(--text-primary)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: '-0.75rem',
                                [isMe ? 'right' : 'left']: '-0.5rem',
                                width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isMe ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'linear-gradient(to right, #06b6d4, #3b82f6)',
                                fontSize: '10px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                {isMe ? 'ME' : '👤'}
                            </div>

                            <div className="font-mono text-xs" style={{ opacity: 0.7, marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', color: isMe ? '#e9d5ff' : 'var(--text-secondary)' }}>
                                <span>{msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}</span>
                                {isMe && <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '0.125rem 0.375rem', borderRadius: '9999px' }}>Owner</span>}
                            </div>

                            <div style={{ fontSize: '0.9375rem', lineHeight: 1.6, fontWeight: 300, letterSpacing: '0.01em' }}>{msg.text}</div>

                            <div style={{ fontSize: '10px', marginTop: '0.5rem', display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', color: isMe ? '#ddd6fe' : '#94a3b8' }}>
                                <span style={{ opacity: 0.75 }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
