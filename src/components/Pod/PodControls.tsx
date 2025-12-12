import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME } from "../../lib/sui.ts";
import { Loader2, Trash2, Eraser, DollarSign } from "lucide-react";

interface PodControlsProps {
    podId: string;
    isAdmin: boolean;
    onDeletePod: () => void;
    onClearHistory: () => void;
    compact?: boolean;
}

export function PodControls({ podId, isAdmin, onDeletePod, onClearHistory, compact = false }: PodControlsProps) {
    const [payRecipient, setPayRecipient] = useState("");
    const [payAmount, setPayAmount] = useState("");
    const [paying, setPaying] = useState(false);
    const [showPay, setShowPay] = useState(!compact); // Access state for payment form
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const handlePay = () => {
        if (!payRecipient || !payAmount) return;
        setPaying(true);

        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(BigInt(parseFloat(payAmount) * 1e9))]); // Assuming SUI (9 decimals)

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::pay_member`,
            arguments: [
                coin,
                tx.object(podId),
                tx.pure.address(payRecipient)
            ],
        });

        signAndExecuteTransaction(
            { transaction: tx },
            {
                onSuccess: () => {
                    setPaying(false);
                    alert("Payment sent!");
                    setPayRecipient("");
                    setPayAmount("");
                    if (compact) setShowPay(false);
                },
                onError: (err) => {
                    setPaying(false);
                    console.error(err);
                    alert("Payment failed: " + err.message);
                },
            }
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s' }} className={compact ? '' : 'glass-card'}>
            <div className="justify-between flex-row" style={{ flexWrap: 'wrap' }}>
                {!compact && (
                    <h3 className="text-xl text-white flex-row">
                        <span>⚙️</span>
                        Pod Controls
                    </h3>
                )}

                <div className="flex-row" style={{ width: compact ? '100%' : 'auto', justifyContent: compact ? 'space-between' : 'flex-start', flexWrap: 'wrap' }}>
                    {compact && (
                        <button
                            onClick={() => setShowPay(!showPay)}
                            className="btn"
                            style={{
                                background: showPay ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                color: showPay ? '#34d399' : '#94a3b8',
                                border: showPay ? '1px solid rgba(16, 185, 129, 0.5)' : 'none',
                                fontSize: '0.75rem', padding: '0.375rem 0.75rem'
                            }}
                        >
                            <DollarSign size={14} />
                            <span>Send Crypto</span>
                        </button>
                    )}

                    <div className="flex-row" style={{ gap: '0.5rem' }}>
                        <button
                            onClick={onClearHistory}
                            className="btn btn-secondary text-xs"
                            style={{ background: 'linear-gradient(to right, #f59e0b, #f97316)', border: 'none', color: 'white' }}
                        >
                            <Eraser size={14} />
                            <span>Clear History</span>
                        </button>
                        {isAdmin && (
                            <button
                                onClick={onDeletePod}
                                className="btn btn-danger text-xs"
                                style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)', border: 'none', color: 'white' }}
                            >
                                <Trash2 size={14} />
                                <span>Delete Pod</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Collapsible Payment Form */}
            {showPay && (
                <div style={{
                    display: 'flex', flexDirection: 'row', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap',
                    borderTop: compact ? 'none' : '1px solid rgba(255,255,255,0.1)', paddingTop: compact ? '0.5rem' : '1.25rem'
                }} className={compact ? 'animate-slide-in-up' : ''}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label className="input-label" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient Address</label>
                        <input
                            type="text"
                            value={payRecipient}
                            onChange={(e) => setPayRecipient(e.target.value)}
                            placeholder="0x..."
                            className="input-field font-mono text-sm"
                        />
                    </div>
                    <div style={{ width: '120px' }}>
                        <label className="input-label" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount (SUI)</label>
                        <input
                            type="number"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            placeholder="0.1"
                            className="input-field font-mono text-sm"
                        />
                    </div>
                    <button
                        onClick={handlePay}
                        disabled={paying}
                        className="btn hover-scale"
                        style={{ background: 'linear-gradient(to right, #10b981, #059669)', color: 'white', minWidth: '100px' }}
                    >
                        {paying ? <Loader2 className="spinner" size={16} /> : <DollarSign size={16} />}
                        <span>Send</span>
                    </button>
                </div>
            )}
        </div>
    );
}
