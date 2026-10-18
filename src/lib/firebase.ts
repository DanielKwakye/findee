import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics, type EventParams } from "firebase/analytics";

let analyticsPromise: Promise<Analytics | null> | undefined;

/** Provides the shared browser Analytics instance when Firebase is configured and supported. */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
    if (typeof window === "undefined") return Promise.resolve(null);

    analyticsPromise ??= (async () => {
        try {
            if (!(await isSupported())) return null;

            const existingApp = getApps().find(app => app.name === "[DEFAULT]");
            const config = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            };

            if (!existingApp && (!config.apiKey || !config.projectId || !config.appId || !config.measurementId)) {
                return null;
            }

            return getAnalytics(existingApp ?? initializeApp(config));
        } catch {
            return null;
        }
    })();

    return analyticsPromise;
}

/** Sends custom browser events without interrupting the app when Analytics is unavailable. */
export async function trackEvent(name: string, parameters?: EventParams): Promise<void> {
    const analytics = await getFirebaseAnalytics();
    if (!analytics) return;

    try {
        logEvent(analytics, name, parameters);
    } catch {
        // Analytics failures must not interrupt the user's action.
    }
}
