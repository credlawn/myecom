'use client';

import { useEffect, useRef, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export default function VisitorsRecord() {
  const visitStartTime = useRef(Date.now());
  const isInitialLoad = useRef(true);
  const [currentSlug, setCurrentSlug] = useState('');

  useEffect(() => {
    // Set current slug after component mounts (client-side only)
    setCurrentSlug(window.location.pathname);
    
    const handleInitialLoad = async () => {
      let visitorId = getCookie('visitor_id');
      if (!visitorId) {
        visitorId = `${uuidv4()}`;
        setCookie('visitor_id', visitorId, { maxAge: 60 * 60 * 24 * 365, path: '/' });
      }
      if (typeof visitorId === 'string' && currentSlug) {
        sendVisitorIdToFrappe(visitorId, currentSlug);
      }
    };
    
    handleInitialLoad();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isInitialLoad.current) {
        visitStartTime.current = Date.now();
        setCurrentSlug(window.location.pathname);
        const currentVisitorId = getCookie('visitor_id');
        if (typeof currentVisitorId === 'string' && currentSlug) {
          sendVisitorIdToFrappe(currentVisitorId, currentSlug);
        }
      } else {
        const currentVisitorId = getCookie('visitor_id');
        if (typeof currentVisitorId === 'string' && currentSlug) {
          sendSessionTimeUpdate(currentVisitorId, currentSlug);
        }
      }
      isInitialLoad.current = false;
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    const handleBeforeUnload = () => {
      const currentVisitorId = getCookie('visitor_id');
      if (typeof currentVisitorId === 'string' && currentSlug) {
        sendSessionTimeUpdate(currentVisitorId, currentSlug);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSlug]);

  const sendVisitorIdToFrappe = async (id: string, slug: string) => {
    try {
      const frappeApiUrl = `${BASE_URL}.visitors_record.create_or_update_visitor`;
      await axios.post(frappeApiUrl, ({ visitor_id: id, slug }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error sending visitor ID to Frappe:', error);
    }
  };

  const sendSessionTimeUpdate = async (id: string, slug: string) => {
    try {
      const frappeApiUrl = `${BASE_URL}.visitors_record.update_session_time`;
      await axios.post(frappeApiUrl, ({ visitor_id: id, slug }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error updating session time to Frappe:', error);
    }
  };

  return null;
}