import { useEffect, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { ref, push, onValue, remove, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "../../lib/firebase.ts";
import { PACKAGE_ID, MODULE_NAME } from "../../lib/sui.ts";
import { MessageList, type Message } from "./MessageList.tsx";
import { MessageInput } from "./MessageInput.tsx";
import { PodControls } from "../Pod/PodControls.tsx";
import { Loader2 } from "lucide-react";

export function ChatRoom({ podId, onExit }: { podId: string; onExit: () => void }) {
    const account = useCurrentAccount();
    const [messages, setMessages] = useState<Message[]>([]);
    const [podName, setPodName] = useState("");
    const [loading, setLoading] = useState(true);
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();


    useEffect(() => {
        if (!podId) return;

        // Fetch pod name
        const nameRef = ref(db, `pods/${podId}/metadata/name`);
        get(nameRef).then((snapshot) => {
            if (snapshot.exists()) {
                setPodName(snapshot.val());
            }
        });

        const messagesRef = ref(db, `pods/${podId}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgList = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val,
                }));
                setMessages(msgList.sort((a, b) => a.timestamp - b.timestamp));
            } else {
                setMessages([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [podId]);

    const handleSendMessage = (text: string) => {
        if (!account) return;
        const messagesRef = ref(db, `pods/${podId}/messages`);
        push(messagesRef, {
            sender: account.address,
            text,
            timestamp: Date.now(),
        });
    };

    const handleClearHistory = async () => {
        if (!account) return;
        if (!confirm("Are you sure you want to delete all your messages in this pod?")) return;

        const messagesRef = ref(db, `pods/${podId}/messages`);
        const q = query(messagesRef, orderByChild("sender"), equalTo(account.address));

        try {
            const snapshot = await get(q);
            if (snapshot.exists()) {
                const updates: Promise<void>[] = [];
                snapshot.forEach((childSnapshot) => {
                    updates.push(remove(childSnapshot.ref));
                });
                await Promise.all(updates);
                alert("History cleared.");
            } else {
                alert("No messages to clear.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to clear history.");
        }
    };

    const handleDeletePod = () => {
        if (!confirm("Are you sure you want to delete this pod? This action is irreversible.")) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::delete_pod`,
            arguments: [tx.object(podId)],
        });

        signAndExecuteTransaction(
            { transaction: tx },
            {
                onSuccess: async () => {
                    // Delete from Firebase
                    try {
                        await remove(ref(db, `pods/${podId}`));
                        alert("Pod deleted successfully.");
                        onExit();
                    } catch (e) {
                        console.error(e);
                        alert("Pod deleted on-chain, but failed to remove from Firebase.");
                    }
                },
                onError: (err) => {
                    console.error(err);
                    alert("Failed to delete pod: " + err.message);
                },
            }
        );
    };

    if (loading) {
        return <div className="center-content p-6"><Loader2 className="spinner" /></div>;
    }

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '85vh', maxWidth: '1000px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
            {/* Header */}
            <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="flex-row">
                    <div style={{ padding: '0.75rem', background: 'linear-gradient(to top right, #3b82f6, #8b5cf6)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>💬</span>
                    </div>
                    <div>
                        <h2 className="text-xl text-white" style={{ margin: 0 }}>{podName || "Chat Pod"}</h2>
                        <span className="font-mono text-secondary" style={{ fontSize: '0.75rem' }}>ID: {podId.slice(0, 6)}...{podId.slice(-4)}</span>
                    </div>
                </div>
                <button onClick={onExit} className="btn btn-secondary text-sm">Back</button>
            </div>

            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                <PodControls
                    podId={podId}
                    isAdmin={true} // For MVP, showing to everyone. Contract will enforce permission.
                    onDeletePod={handleDeletePod}
                    onClearHistory={handleClearHistory}
                    compact={true}
                />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <MessageList messages={messages} currentAddress={account?.address || ""} />
                </div>
                <div style={{ padding: '1rem' }}>
                    <MessageInput onSend={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}
