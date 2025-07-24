'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase'; // Impor dari file config kita
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('siswa'); // Default role
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
        setError("Semua field wajib diisi.");
        return;
    }

    try {
      // 1. Buat user di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Simpan data user (termasuk role) di Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
        createdAt: serverTimestamp(),
      });
      
      router.push('/login');

    } catch (err: any) {
      // Menampilkan pesan error yang lebih ramah
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah. Minimal 6 karakter.');
      } else {
        setError('Terjadi kesalahan saat pendaftaran.');
        console.error(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Buat Akun Baru</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <div className="text-white">
            <label className="block mb-2 text-sm font-medium">Saya mendaftar sebagai:</label>
            <div className="flex items-center space-x-4">
              <label>
                <input type="radio" value="siswa" checked={role === 'siswa'} onChange={(e) => setRole(e.target.value)} className="mr-2"/>
                Siswa
              </label>
              <label>
                <input type="radio" value="mentor" checked={role === 'mentor'} onChange={(e) => setRole(e.target.value)} className="mr-2"/>
                Mentor (Sukarelawan)
              </label>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Register</Button>
        </form>
         <p className="text-center text-sm text-zinc-400">
          Sudah punya akun?{' '}
          <a href="/login" className="font-medium text-zinc-200 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}