'use client';

import { useEffect, useRef } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { api } from "./apiPath";

interface CurrentUserResponse {
  message: {
    status: "success" | "error";
    user?: string | null;
  };
}

export default function VisitorsRecord() {
  const visitStartTime = useRef(Date.now());
  const isInitialLoad = useRef(true);
  const currentUser = useRef<string | null>(null);

  const getConfig = () => {
    const visitorId = getCookie("visitor_id") as string | undefined;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (visitorId && (!getCookie("sid") && !getCookie("session_id"))) headers["X-Visitor-Id"] = visitorId;
    return { headers, withCredentials: true };
  };

  const getCurrentUser = async (): Promise<string | null> => {
    try {
      const response = await axios.post<CurrentUserResponse>(
        api.CU,
        {},
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      const status = response.data.message?.status;
      const user = response.data.message?.user || null;
      if (status === "success" && user) {
        console.log("[getCurrentUser] Logged-in user:", user);
        return user;
      }
      console.log("[getCurrentUser] No logged-in user");
      return null;
    } catch (error) {
      console.warn("[getCurrentUser] Failed to fetch current user", error);
      return null;
    }
  };

  useEffect(() => {
    const getSlug = () => window.location.pathname;

    const ensureVisitorId = (): string => {
      let visitorId = getCookie('visitor_id') as string | undefined;
      if (!visitorId || typeof visitorId !== 'string') {
        visitorId = uuidv4();
        setCookie('visitor_id', visitorId, { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        console.log("[ensureVisitorId] Generated new visitor_id:", visitorId);
      } else {
        console.log("[ensureVisitorId] Existing visitor_id:", visitorId);
      }
      return visitorId;
    };

    const sendVisitorIdToFrappe = async (slug: string) => {
      const user = currentUser.current;
      const visitorId = !user ? getCookie('visitor_id') as string | undefined : null;
      const payload = user ? { user, slug } : { visitor_id: visitorId, slug };
      console.log("[sendVisitorIdToFrappe] Sending payload:", payload);
      try {
        const response = await axios.post(api.VC, payload, getConfig());
        console.log("[sendVisitorIdToFrappe] Response:", response.data);
      } catch (error) {
        console.warn("[sendVisitorIdToFrappe] Failed to send visitor info", error);
      }
    };

    const sendSessionTimeUpdate = async (slug: string) => {
      const user = currentUser.current;
      const visitorId = !user ? getCookie('visitor_id') as string | undefined : null;
      const timeSpent = Math.floor((Date.now() - visitStartTime.current) / 1000);
      const payload = user ? { user, slug, time_spent: timeSpent } : { visitor_id: visitorId, slug, time_spent: timeSpent };
      console.log("[sendSessionTimeUpdate] Sending payload:", payload);
      try {
        const response = await axios.post(api.VR, payload, getConfig());
        console.log("[sendSessionTimeUpdate] Response:", response.data);
      } catch (error) {
        console.warn("[sendSessionTimeUpdate] Failed to update session time", error);
      }
    };

    const initVisitorTracking = async () => {
      currentUser.current = await getCurrentUser();
      const slug = getSlug();
      if (!currentUser.current) ensureVisitorId();
      await sendVisitorIdToFrappe(slug);
    };

    const handleVisibilityChange = async () => {
      const slug = getSlug();
      if (document.visibilityState === 'visible' && !isInitialLoad.current) {
        visitStartTime.current = Date.now();
        await sendVisitorIdToFrappe(slug);
      } else {
        await sendSessionTimeUpdate(slug);
      }
      isInitialLoad.current = false;
    };

    const handleBeforeUnload = async () => {
      const slug = getSlug();
      await sendSessionTimeUpdate(slug);
    };

    initVisitorTracking();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}
