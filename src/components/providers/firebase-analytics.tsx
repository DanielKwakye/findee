"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

/** Starts automatic Analytics collection for the current browser session. */
export function FirebaseAnalytics() {
    useEffect(() => {
        void getFirebaseAnalytics();
    }, []);

    return null;
}
