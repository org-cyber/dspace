import { Users, Clock } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export interface PodMetadata {
    id: string;
    name?: string;
    admin: string;
    members: string[];        // allowed wallet list
    createdAt: number;
    active: boolean;
}

interface PodCardProps {
    pod: PodMetadata;
    onJoin: (id: string) => void;
}

export function PodCard({ pod, onJoin }: PodCardProps) {
    const account = useCurrentAccount();
    const userAddress = account?.address;

    // SECURITY CHECK — is user allowed?
    const isAllowed = userAddress && pod.members?.includes(userAddress);

    return (
        <div
            className="glass-card hover-lift relative"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}
        >
            {/* Hover Gradient Overlay */}
            <div
                style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), transparent)',
                    opacity: 0, transition: 'opacity 0.3s'
                }}
                className="hover-overlay"
            />

            <div
                className="justify-between flex-row"
                style={{ alignItems: 'flex-start', position: 'relative', zIndex: 10 }}
            >
                <div style={{ flex: 1, overflow: 'hidden', paddingRight: '1rem' }}>
                    <h3
                        className="text-xl text-white"
                        style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                        {pod.name || "Untitled Pod"}
                    </h3>

                    <span
                        className="font-mono text-secondary"
                        style={{
                            fontSize: '10px',
                            display: 'inline-block',
                            marginTop: '0.25rem',
                            padding: '0.125rem 0.5rem',
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(51, 65, 85, 0.5)'
                        }}
                    >
                        {pod.id.slice(0, 6)}...{pod.id.slice(-4)}
                    </span>
                </div>

                {/* Active Badge */}
                <span
                    style={{
                        fontSize: '10px',
                        padding: '0.25rem 0.625rem',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontWeight: 500
                    }}
                >
                    <span
                        style={{
                            width: '0.375rem',
                            height: '0.375rem',
                            borderRadius: '50%',
                            background: '#34d399'
                        }}
                    />
                    Active
                </span>
            </div>

            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <div
                    className="flex-row"
                    style={{
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#cbd5e1'
                    }}
                >
                    <Users size={14} style={{ color: '#c084fc' }} />
                    <span className="font-medium">{pod.members?.length || 0} Members</span>
                </div>

                <div
                    className="flex-row"
                    style={{
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#cbd5e1'
                    }}
                >
                    <Clock size={14} style={{ color: '#22d3ee' }} />
                    <span>{new Date(pod.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* JOIN BUTTON */}
            <button
                onClick={() => {
                    if (!isAllowed) {
                        alert("You are not allowed to join this pod.");
                        return;
                    }
                    onJoin(pod.id);
                }}

                disabled={!isAllowed}
                className={`btn btn-gradient w-full hover-scale ${!isAllowed ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{
                    marginTop: '0.5rem',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                {isAllowed ? "Join Pod →" : "Not Allowed"}
            </button>
        </div>
    );
}
