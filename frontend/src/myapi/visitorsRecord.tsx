'use client';

import { useEffect, useRef } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export default function VisitorsRecord() {
  const visitStartTime = useRef(Date.now());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const handleInitialLoad = async () => {
      let visitorId = getCookie('visitor_id');
      if (!visitorId) {
        visitorId = `visitor-${Math.random().toString(36).substring(2)}-${Date.now()}`;
        setCookie('visitor_id', visitorId, { maxAge: 60 * 60 * 24 * 365, path: '/' });
      }
      if (typeof visitorId === 'string') {
        const slug = window.location.pathname;
        sendVisitorIdToFrappe(visitorId, slug);
      }
    };
    handleInitialLoad();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isInitialLoad.current) {
        visitStartTime.current = Date.now();
        const currentVisitorId = getCookie('visitor_id');
        if (typeof currentVisitorId === 'string') {
          const slug = window.location.pathname;
          sendVisitorIdToFrappe(currentVisitorId, slug);
        }
      } else {
        const visitEndTime = Date.now();
        const sessionDuration = Math.round((visitEndTime - visitStartTime.current) / 1000);
        const currentVisitorId = getCookie('visitor_id');
        if (typeof currentVisitorId === 'string') {
          sendSessionTimeUpdate(currentVisitorId, sessionDuration);
        }
      }
      isInitialLoad.current = false;
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    const handleBeforeUnload = () => {
      const visitEndTime = Date.now();
      const sessionDuration = Math.round((visitEndTime - visitStartTime.current) / 1000);
      const currentVisitorId = getCookie('visitor_id');
      if (typeof currentVisitorId === 'string') {
        sendSessionTimeUpdate(currentVisitorId, sessionDuration);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const sendVisitorIdToFrappe = async (id: string, slug: string) => {
    try {
      const frappeApiUrl = `${BASE_URL}.visitors_record.create_or_update_visitor`;
      await axios.post(frappeApiUrl, JSON.stringify({ visitor_id: id, slug }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error sending visitor ID to Frappe:', error);
    }
  };

  const sendSessionTimeUpdate = async (id: string, duration: number) => {
    try {
      const frappeApiUrl = `${BASE_URL}.visitors_record.update_session_time`;
      await axios.post(frappeApiUrl, JSON.stringify({ visitor_id: id, session_time: duration }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error updating session time to Frappe:', error);
    }
  };

  return null;
}
