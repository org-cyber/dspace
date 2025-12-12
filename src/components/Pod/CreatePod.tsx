import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME } from "../../lib/sui.ts";

import { Loader2 } from "lucide-react";
import { ref, set } from "firebase/database";
import { db } from "../../lib/firebase.ts";

export function CreatePod({ onCreated }: { onCreated: (podId: string) => void }) {
    const [name, setName] = useState("");
    const [members, setMembers] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const account = useCurrentAccount();
    const client = useSuiClient();

    const handleCreate = () => {
        if (!account) return;
        if (!name.trim()) {
            alert("Please enter a pod name.");
            return;
        }
        setLoading(true);

        const memberList = members.split(",").map((m) => m.trim()).filter((m) => m.length > 0);
        if (!memberList.includes(account.address)) {
            memberList.push(account.address);
        }

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::create_pod`,
            arguments: [tx.pure.vector("address", memberList)],
        });

        // ⚡ Minimal TS Fix: cast transaction argument to any
        signAndExecuteTransaction(
            {
                transaction: tx,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
            } as any,
            {
                onSuccess: async (result) => {
                    console.log("Transaction result:", result);

                    // ⚡ Minimal TS Fix: cast effects to any
                    let effects: any = result.effects;
                    let created = effects?.created?.[0]?.reference?.objectId;

                    // Fallback: if effects are missing but we have a digest, fetch it
                    if (!created && result.digest) {
                        try {
                            const txResp: any = await client.waitForTransaction({
                                digest: result.digest,
                                options: { showEffects: true }
                            });
                            created = txResp.effects?.created?.[0]?.reference?.objectId;
                        } catch (e) {
                            console.error("Failed to fetch transaction details:", e);
                        }
                    }

                    if (created) {
                        // Save metadata to Firebase
                        set(ref(db, `pods/${created}/metadata`), {
                            id: created,
                            name: name.trim(),
                            admin: account.address,
                            members: memberList,
                            createdAt: Date.now(),
                            active: true
                        }).then(() => {
                            setLoading(false);
                            onCreated(created);
                        }).catch(err => {
                            console.error("Firebase save failed", err);
                            setLoading(false);
                            if (err.code === 'PERMISSION_DENIED') {
                                alert("Firebase Permission Denied. Update your rules or implement auth backend.");
                            }
                            onCreated(created);
                        });
                    } else {
                        setLoading(false);
                        console.error("Could not find created object ID", result);
                        alert("Pod created on-chain, but could not retrieve ID. Please check your wallet history.");
                    }
                },
                onError: (err) => {
                    setLoading(false);
                    console.error(err);
                    alert("Failed to create pod: " + err.message);
                },
            }
        );
    };

    if (!account) return null;

    return (
        <div className="glass-card zoom-in">
            <h2 className="text-xl text-white flex-row mb-4">
                Create a Pod
            </h2>

            <div className="input-group">
                <label className="input-label">
                    Pod Name
                </label>
                <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Hackathon Team"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label">
                    Allowed Members (comma separated addresses)
                </label>
                <textarea
                    className="input-field"
                    rows={3}
                    placeholder="0x..., 0x..."
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    style={{ resize: 'none' }}
                />
            </div>
            <button
                onClick={handleCreate}
                disabled={loading}
                className={`btn btn-primary w-full ${loading ? 'opacity-50' : ''}`}
            >
                {loading ? (
                    <Loader2 className="spinner" size={20} />
                ) : (
                    <span></span>
                )}
                <span>{loading ? 'Creating...' : 'Create Pod'}</span>
            </button>
        </div>
    );
}
