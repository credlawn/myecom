'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { deleteCookie } from 'cookies-next';
import { loginAPI } from '@/app/auth/MyLogin';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserName(user.fullName);
      } else {
        // Redirect to home if not logged in
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await loginAPI.logout();
      
      // Clear client-side cookies
      deleteCookie('user', { path: '/' });
      deleteCookie('visitor_id', { path: '/' });
      
      // Redirect to home page and reload to ensure clean state
      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error("Logout failed. Please check the console for details.", error);
    }
  };

  if (!userName) {
    // Render nothing or a loading spinner while checking auth
    return null;
  }

  return (
    <div className="container-main my-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg mb-6">Welcome, <span className="font-semibold">{userName}</span>!</p>
        <div className="space-y-4">
          <p>This is a sample dashboard page. More features will be added soon.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}