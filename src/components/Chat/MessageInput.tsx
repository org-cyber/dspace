import { useState } from "react";
import { Send } from "lucide-react";

export function MessageInput({ onSend }: { onSend: (text: string) => void }) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return (

        <form onSubmit={handleSubmit} className="flex-row" style={{ width: '100%', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field"
                    style={{ borderRadius: '9999px', padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.6)' }}
                />
            </div>
            <button
                type="submit"
                disabled={!text.trim()}
                className="btn btn-gradient hover-scale"
                style={{
                    width: '3.5rem', height: '3.5rem', borderRadius: '50%', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <Send size={24} style={{ marginLeft: text.trim() ? '2px' : 0 }} />
            </button>
        </form>
    );

}
