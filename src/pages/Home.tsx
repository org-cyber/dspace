import { useState } from "react";
import { CreatePod } from "../components/Pod/CreatePod.tsx";
import { ChatRoom } from "../components/Chat/ChatRoom.tsx";
import { PodList } from "../components/Pod/PodList.tsx";
import { ConnectButton, useCurrentAccount, useWallets, useConnectWallet } from "@mysten/dapp-kit";
import { ExternalLink, Info, Globe, Zap, Copy, Check } from "lucide-react";

export function Home() {
    const [podId, setPodId] = useState<string | null>(null);
    const [joinId, setJoinId] = useState("");
    const account = useCurrentAccount();
    const [isIframe] = useState(() => window.self !== window.top);

    const wallets = useWallets();
    const [copied, setCopied] = useState(false);
    const { mutate: connect } = useConnectWallet();

    const handleCopyAddress = async () => {
        if (account?.address) {
            try {
                await navigator.clipboard.writeText(account.address);
                console.log("Address copied:", account.address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
                // Fallback for some browsers or insecure contexts
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = account.address;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (fallbackErr) {
                    console.error("Fallback copy failed:", fallbackErr);
                    alert("Could not copy address automatically.");
                }
            }
        }
    };

    const handleWebLogin = () => {
        console.log("Available wallets:", wallets.map(w => w.name));
        // Look for Stashed or similar web wallets
        const webWallet = wallets.find(w => w.name.toLowerCase().includes('stashed') || w.name.toLowerCase().includes('google'));

        if (webWallet) {
            connect({ wallet: webWallet });
        } else {
            // Fallback to Burner if available
            const burner = wallets.find(w => w.name.toLowerCase().includes('burner'));
            if (burner) {
                if (confirm("Connect with a temporary Burner Wallet instead?")) {
                    connect({ wallet: burner });
                }
            } else {
                alert(`Web wallet not found. Available wallets: ${wallets.map(w => w.name).join(', ') || 'None'}. Please try 'Open in New Tab'.`);
            }
        }
    };

    if (!account) {
        return (
            <div className="flex-col center-content" style={{ minHeight: '100vh', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
                {/* Animated Background Elements */}
                <div className="particles">
                    {/* Particles implementation handled in CSS or strictly visual divs */}
                </div>

                {/* Main Content */}
                <div className="glass-card animate-slide-in-up" style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
                    {/* Logo/Title */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <img
                                src="/dspace writeup.png"
                                alt="Dspace"
                                style={{ height: 'auto', maxWidth: '280px', width: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <p className="text-secondary">Connect your wallet to start chatting</p>
                    </div>

                    <div className="flex-col gap-4">
                        <div className="w-full">
                            <ConnectButton className="w-full" />
                        </div>

                        <div className="flex-row center-content" style={{ margin: '1rem 0' }}>
                            <span className="text-muted text-xs font-medium">OR LOGIN WITH</span>
                        </div>

                        <button
                            onClick={handleWebLogin}
                            className="btn btn-secondary w-full"
                        >
                            <Globe size={20} />
                            <span> Burner Wallet</span>
                        </button>


                        <div className="glass w-full" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                            <div className="flex-row" style={{ alignItems: 'flex-start' }}>
                                <Zap size={16} style={{ color: '#facc15', marginTop: '2px' }} />
                                <span className="text-xs text-muted">
                                    <strong style={{ color: '#facc15' }}>Burner Wallet Enabled:</strong> Use a temporary wallet for instant access.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* iframe Warning */}
                {isIframe && (
                    <div className="glass-card animate-scale-in" style={{ marginTop: '2rem', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                        <h3 className="flex-row" style={{ color: '#facc15', marginBottom: '0.75rem' }}>
                            <Info size={20} />
                            Wallet Not Detected?
                        </h3>
                        <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                            Browser extensions cannot run inside the preview frame.
                            Please open the app in a new tab.
                        </p>
                        <a
                            href={window.location.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <ExternalLink size={18} />
                            Open in New Tab
                        </a>
                    </div>
                )}
            </div>
        );
    }

    if (podId) {
        return (
            <div className="container" style={{ minHeight: '100vh' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="justify-between flex-row" style={{ marginBottom: '1rem' }}>
                        <button onClick={() => setPodId(null)} className="btn btn-secondary text-xs">Back to Dashboard</button>
                        <ConnectButton />
                    </div>
                    <ChatRoom podId={podId} onExit={() => setPodId(null)} />
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            {/* Header */}
            <div className="glass-panel sticky" style={{ top: '1rem', zIndex: 100, padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="justify-between flex-row">
                    <div className="flex-row" style={{ gap: '0.75rem' }}>
                        <img
                            src="/dspace logo.png"
                            alt="DSpace Logo"
                            style={{ height: '32px', width: 'auto' }}
                        />
                        <h1 className="text-2xl text-primary">
                            <span style={{ opacity: 0.8 }}>D</span>
                            <span className="gradient-text">Space</span>
                        </h1>
                    </div>
                    <div className="flex-row" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        {account && (
                            <button
                                onClick={handleCopyAddress}
                                className="glass center-content"
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    height: '36px',
                                    width: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Copy Wallet Address"
                            >
                                {copied ? (
                                    <Check size={16} color="#4ade80" />
                                ) : (
                                    <Copy size={16} color="rgba(255,255,255,0.7)" />
                                )}
                            </button>
                        )}
                        <ConnectButton />
                    </div>
                </div>
            </div>

            <div className="dashboard-grid animate-slide-in-up">
                {/* Sidebar / Command Center */}
                <div className="flex-col sidebar">
                    {/* Create Pod Section */}
                    <div className="relative">
                        <CreatePod onCreated={(id) => setPodId(id)} />
                    </div>

                    {/* Join Pod Section */}
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
                            <Globe size={100} />
                        </div>
                        <h2 className="text-xl text-primary flex-row" style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                            Join a Pod
                        </h2>
                        <p className="text-sm text-secondary" style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                            Have an ID? Paste it below to jump straight into the action.
                        </p>
                        <div className="flex-row" style={{ position: 'relative', zIndex: 1 }}>
                            <input
                                type="text"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                                placeholder="Enter Object ID..."
                                className="input-field font-mono text-sm"
                            />
                            <button
                                onClick={() => {
                                    if (joinId.trim()) setPodId(joinId.trim());
                                }}
                                className="btn btn-primary"
                            >
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content / Marketplace */}
                <div className="main-content">
                    <div className="justify-between flex-row" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="text-2xl text-primary flex-row">
                            <span className="text-2xl"></span>
                            Active Pods
                        </h2>
                        <div className="text-sm text-secondary glass" style={{ padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                            Live Feed
                        </div>
                    </div>
                    <PodList onJoin={(id) => setPodId(id)} />
                </div>
            </div>
        </div>
    );
}
