'use client';

import { useEffect, useRef } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { api } from "./apiPath";

export default function VisitorsRecord() {
  const visitStartTime = useRef(Date.now());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const getSlug = () => window.location.pathname;

    const ensureVisitorId = (): string | null => {
      let visitorId = getCookie('visitor_id');
      if (!visitorId || typeof visitorId !== 'string') {
        visitorId = uuidv4();
        try {
          setCookie('visitor_id', visitorId, {
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
        } catch {
          return null;
        }
      }
      return visitorId;
    };

    const sendVisitorIdToFrappe = async (id: string, slug: string) => {
      try {
        await axios.post(api.VC, { visitor_id: id, slug },
          { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
        );
      } catch (error) {
        console.warn('[VisitorsRecord] Failed to send visitor ID', error);
      }
    };

    const sendSessionTimeUpdate = async (id: string, slug: string) => {
      const timeSpent = Math.floor((Date.now() - visitStartTime.current) / 1000);
      try {
        await axios.post(api.VR,
          { visitor_id: id, slug, time_spent: timeSpent },
          { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
        );
      } catch (error) {
        console.warn('[VisitorsRecord] Failed to update session time', error);
      }
    };

    const handleInitialLoad = () => {
      const visitorId = ensureVisitorId();
      const slug = getSlug();
      if (visitorId && slug) {
        sendVisitorIdToFrappe(visitorId, slug);
      }
    };

    const handleVisibilityChange = () => {
      const visitorId = getCookie('visitor_id');
      const slug = getSlug();
      if (!visitorId || typeof visitorId !== 'string' || !slug) return;

      if (document.visibilityState === 'visible' && !isInitialLoad.current) {
        visitStartTime.current = Date.now();
        sendVisitorIdToFrappe(visitorId, slug);
      } else {
        sendSessionTimeUpdate(visitorId, slug);
      }
      isInitialLoad.current = false;
    };

    const handleBeforeUnload = () => {
      const visitorId = getCookie('visitor_id');
      const slug = getSlug();
      if (typeof visitorId === 'string' && slug) {
        sendSessionTimeUpdate(visitorId, slug);
      }
    };

    handleInitialLoad();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}