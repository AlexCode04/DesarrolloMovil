import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "../services/firebase";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthChange((u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    return { user, loading };
}
