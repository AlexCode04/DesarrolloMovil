import { useState, useEffect, useRef, useCallback } from "react";
import { User } from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Mission, INITIAL_MISSIONS, calcDistance } from "../services/missions";
import { saveUserData, getUserData } from "../services/firebase";

export interface MissionState {
    missions: Mission[];
    points: number;
    loading: boolean;
    activeGeo: boolean;
    distanceMoved: number;
    zenTimer: number;
    zenActive: boolean;
    completeMission1: () => Promise<void>;
    startMission2: () => Promise<void>;
    startMission3: () => void;
    stopMission3: () => void;
}

export function useMissions(user: User | null): MissionState {
    const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeGeo, setActiveGeo] = useState(false);
    const [distanceMoved, setDistanceMoved] = useState(0);
    const [zenTimer, setZenTimer] = useState(10);
    const [zenActive, setZenActive] = useState(false);

    const originCoords = useRef<{ lat: number; lon: number } | null>(null);
    const geoWatchId = useRef<string | null>(null);
    const zenIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const notifIdRef = useRef(100);

    const pickImageFromBrowser = async (): Promise<boolean> => {
        if (typeof document === "undefined") return false;
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.capture = "environment";
            input.onchange = () => resolve(Boolean(input.files && input.files.length > 0));
            input.oncancel = () => resolve(false);
            input.click();
        });
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        getUserData(user.uid).then((data) => {
            if (data) {
                setPoints(data.points);
                setMissions((prev) =>
                    prev.map((m) => {
                        const saved = data.missions.find((s) => s.id === m.id);
                        const completed = saved?.completed ?? false;
                        const locked =
                            m.id === 3
                                ? !data.missions.find((s) => s.id === 2)?.completed
                                : m.locked;
                        return { ...m, completed, locked };
                    }),
                );
            }
            setLoading(false);
        });
    }, [user]);

    const persist = useCallback(
        async (newMissions: Mission[], newPoints: number) => {
            if (!user) return;
            await saveUserData(user.uid, {
                points: newPoints,
                missions: newMissions.map((m) => ({
                    id: m.id,
                    completed: m.completed,
                })),
                email: user.email ?? "",
                displayName: user.email?.split("@")[0] ?? "Usuario",
            });
        },
        [user],
    );

    const sendNotification = async (title: string, body: string) => {
        try {
            await LocalNotifications.requestPermissions();
            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: notifIdRef.current++,
                        title,
                        body,
                        schedule: { at: new Date(Date.now() + 500) },
                    },
                ],
            });
        } catch {
            console.log("Notification:", title, body);
        }
    };

    const completeMissionById = useCallback(
        async (id: number) => {
            const target = missions.find((m) => m.id === id);
            if (!target || target.completed) return;

            const updated = missions.map((m) => {
                if (m.id === id) return { ...m, completed: true };
                if (m.id === 3 && id === 2) return { ...m, locked: false };
                return m;
            });

            const newPoints = updated
                .filter((m) => m.completed)
                .reduce((acc, m) => acc + m.points, 0);

            setMissions(updated);
            setPoints(newPoints);
            await persist(updated, newPoints);

            const completedCount = updated.filter((m) => m.completed).length;
            const total = updated.length;
            if (completedCount === total) {
                await sendNotification(
                    "¡Todas las misiones completas!",
                    "¡Eres el campeón!",
                );
            } else {
                await sendNotification("Misión completada", "¡Has completado una misión!");
                if (total - completedCount === 1) {
                    await sendNotification(
                        "Casi terminas",
                        "Te falta 1 misión para completar",
                    );
                }
            }
        },
        [missions, persist],
    );

    const completeMission1 = async () => {
        try {
            const perms = await Camera.checkPermissions();
            if (perms.camera !== "granted") {
                const requested = await Camera.requestPermissions({ permissions: ["camera"] });
                if (requested.camera !== "granted") {
                    alert("Permiso de camara denegado.");
                    return;
                }
            }

            const source = Capacitor.getPlatform() === "web"
                ? CameraSource.Photos
                : CameraSource.Prompt;

            const photo = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source,
            });
            if (photo.webPath || photo.dataUrl) {
                await completeMissionById(1);
            }
        } catch (err: any) {
            console.error("Mission 1 (Camera) failed:", err);
            if (
                err?.message?.includes("cancelled") ||
                err?.message?.includes("cancel")
            )
                return;

            const maybeNotImplemented =
                err?.message?.includes("not implemented on web") ||
                err?.message?.includes('"Camera.then()" is not implemented on web');

            if (maybeNotImplemented) {
                const picked = await pickImageFromBrowser();
                if (picked) {
                    await completeMissionById(1);
                    return;
                }
            }

            alert("No se pudo tomar la foto. Revisa permisos de camara.");
        }
    };

    const startMission2 = async () => {
        if (activeGeo) return;
        try {
            const perms = await Geolocation.checkPermissions();
            if (perms.location !== "granted" && perms.coarseLocation !== "granted") {
                const requested = await Geolocation.requestPermissions();
                if (
                    requested.location !== "granted" &&
                    requested.coarseLocation !== "granted"
                ) {
                    alert("Permiso de ubicacion denegado.");
                    return;
                }
            }

            const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
            originCoords.current = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
            };
            setDistanceMoved(0);
            setActiveGeo(true);

            const watchId = await Geolocation.watchPosition(
                { enableHighAccuracy: true },
                (position) => {
                    if (!position || !originCoords.current) return;
                    const dist = calcDistance(
                        originCoords.current.lat,
                        originCoords.current.lon,
                        position.coords.latitude,
                        position.coords.longitude,
                    );
                    setDistanceMoved(Math.round(dist));
                    if (dist >= 30) {
                        completeMissionById(2);
                        Geolocation.clearWatch({ id: watchId }).catch(() => { });
                        setActiveGeo(false);
                        geoWatchId.current = null;
                    }
                },
            );
            geoWatchId.current = watchId;
        } catch (err) {
            console.error("Mission 2 (GPS) failed:", err);
            alert(
                "No se pudo acceder al GPS. Asegúrate de dar permisos de ubicación.",
            );
            setActiveGeo(false);
        }
    };

    const startMission3 = useCallback(() => {
        if (zenActive) return;
        setZenTimer(10);
        setZenActive(true);

        let timeLeft = 10;
        zenIntervalRef.current = setInterval(async () => {
            timeLeft -= 1;
            setZenTimer(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(zenIntervalRef.current!);
                setZenActive(false);
                try {
                    await Haptics.impact({ style: ImpactStyle.Heavy });
                    setTimeout(async () => {
                        await Haptics.impact({ style: ImpactStyle.Heavy });
                    }, 300);
                    setTimeout(async () => {
                        await Haptics.impact({ style: ImpactStyle.Heavy });
                    }, 600);
                } catch {
                    if ("vibrate" in navigator) {
                        navigator.vibrate([200, 100, 200, 100, 300]);
                    }
                }
                await completeMissionById(3);
            }
        }, 1000);
    }, [zenActive, completeMissionById]);

    const stopMission3 = useCallback(() => {
        if (zenIntervalRef.current) {
            clearInterval(zenIntervalRef.current);
            zenIntervalRef.current = null;
        }
        setZenActive(false);
        setZenTimer(10);
    }, []);

    useEffect(() => {
        return () => {
            if (zenIntervalRef.current) clearInterval(zenIntervalRef.current);
            if (geoWatchId.current) {
                Geolocation.clearWatch({ id: geoWatchId.current }).catch(() => { });
            }
        };
    }, []);

    return {
        missions,
        points,
        loading,
        activeGeo,
        distanceMoved,
        zenTimer,
        zenActive,
        completeMission1,
        startMission2,
        startMission3,
        stopMission3,
    };
}
