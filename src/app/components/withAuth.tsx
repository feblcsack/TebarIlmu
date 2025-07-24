'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; // Sesuaikan path jika perlu

// Komponen wrapper untuk melindungi rute berdasarkan peran
export default function withAuth(
  WrappedComponent: React.ComponentType, 
  allowedRoles: Array<'siswa' | 'mentor'>
) {
  const AuthComponent = (props: any) => {
    const { user, userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return; // Jangan lakukan apa-apa selagi loading

      // Jika tidak ada user, tendang ke halaman login
      if (!user) {
        router.replace('/login');
        return;
      }

      // Jika ada user, tapi perannya tidak diizinkan
      if (userData && !allowedRoles.includes(userData.role)) {
        // Arahkan ke dashboard mereka sendiri atau halaman utama
        const homePath = userData.role === 'mentor' ? '/mentor' : '/student';
        router.replace(homePath);
      }
    }, [user, userData, loading, router]);

    // Tampilkan loading spinner jika perlu
    if (loading || !user || (userData && !allowedRoles.includes(userData.role))) {
      return (
        <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
          Memuat...
        </div>
      );
    }
    
    // Jika semua pengecekan lolos, tampilkan komponen halaman
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
}