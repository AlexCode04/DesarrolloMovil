import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    orderBy,
    query,
    limit,
} from 'firebase/firestore';

const env = import.meta.env;

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerUser = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const onAuthChange = (cb: (user: User | null) => void) =>
    onAuthStateChanged(auth, cb);

export interface UserData {
    points: number;
    missions: { id: number; completed: boolean }[];
    email?: string;
    displayName?: string;
}

export const saveUserData = async (uid: string, data: UserData) => {
    try {
        await setDoc(doc(db, 'users', uid), data, { merge: true });
        localStorage.setItem(`missionquest_${uid}`, JSON.stringify(data));
    } catch (err) {
        localStorage.setItem(`missionquest_${uid}`, JSON.stringify(data));
        console.warn('Firebase save failed, saved locally:', err);
    }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) return snap.data() as UserData;
    } catch (err) {
        console.warn('Firebase read failed, trying local:', err);
    }
    const local = localStorage.getItem(`missionquest_${uid}`);
    return local ? JSON.parse(local) : null;
};

export const getTopUsers = async (): Promise<{ name: string; points: number; uid: string }[]> => {
    try {
        const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(10));
        const snap = await getDocs(q);
        return snap.docs.map((d: any) => ({
            uid: d.id,
            name: (d.data().displayName as string) || (d.data().email as string)?.split('@')[0] || 'Usuario',
            points: (d.data().points as number) || 0,
        }));
    } catch {
        return [];
    }
};