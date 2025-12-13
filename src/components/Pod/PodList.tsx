import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase.ts";
import { PodCard, type PodMetadata } from "./PodCard.tsx";
import { Loader2 } from "lucide-react";

export function PodList({ onJoin }: { onJoin: (id: string) => void }) {
    const [pods, setPods] = useState<PodMetadata[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const podsRef = ref(db, "pods");
        const unsubscribe = onValue(podsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedPods: PodMetadata[] = [];
                Object.values(data).forEach((podData: any) => {
                    if (podData.metadata && podData.metadata.active !== false) {
                        loadedPods.push(podData.metadata);
                    }
                });
                // Sort by newest first
                loadedPods.sort((a, b) => b.createdAt - a.createdAt);
                setPods(loadedPods);
            } else {
                setPods([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin spinner-glow text-purple-500" size={40} />
            </div>
        );
    }

    if (pods.length === 0) {
        return (
            <div className="text-center p-12 glass-card rounded-2xl border-2 border-dashed border-slate-600">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-secondary text-lg">No active pods found</p>
                <p className="text-muted text-sm mt-2">Create one to get started!</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
        }}>
            {pods.map((pod, index) => (
                <div
                    key={pod.id}
                    className="animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <PodCard pod={pod} onJoin={onJoin} />
                </div>
            ))}
        </div>
    );
}
