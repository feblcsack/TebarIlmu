'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Cek role user dan redirect
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        router.push(userData.role === 'mentor' ? '/mentor' : '/student');
      } else {
        // Kasus aneh: user ada di Auth tapi tidak di Firestore
        setError("Gagal menemukan data pengguna. Silakan hubungi support.");
        auth.signOut();
      }

    } catch (err: any) {
      setError("Email atau password salah.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // Jika user baru pertama kali login via Google
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: 'siswa', // Default role untuk pendaftar Google
                createdAt: serverTimestamp(),
            });
        }
        
        // Redirect ke dashboard siswa (default untuk Google sign-in)
        router.push('/student'); 

    } catch (error) {
        console.error("Error during Google sign-in", error);
        setError("Gagal login dengan Google.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-700" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-zinc-900 text-zinc-400">Atau</span></div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          Lanjutkan dengan Google
        </Button>
        <p className="text-center text-sm text-zinc-400">
          Belum punya akun?{' '}
          <a href="/register" className="font-medium text-zinc-200 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}