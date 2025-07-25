// src/app/components/UnifiedFloatingDock.tsx

'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Komponen UI & Ikon dari Navbar dan Dock sebelumnya
import { FloatingDock } from './ui/floating-dock'
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Home, Search, Info, LogIn, UserPlus, LayoutDashboard, Settings, LogOut } from 'lucide-react'

export function UnifiedFloatingDock() {
  const { user, userData } = useAuth()
  const router = useRouter()

  // --- Definisi Link dan Fungsi dari Navbar ---
  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const dashboardLink = userData?.role === 'mentor' ? '/mentor' : '/student'
  
  const navLinks = [
    { title: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Cari Mentor", href: "/#find-mentor", icon: <Search className="h-5 w-5" /> },
    { title: "Tentang Kami", href: "/about", icon: <Info className="h-5 w-5" /> },
  ];

  // --- Bagian Utama: Render Kondisional ---

  // 1. Jika pengguna BELUM LOGIN, tampilkan satu FloatingDock dengan semua link
  if (!user) {
    const guestLinks = [
      ...navLinks,
      { title: "Login", href: "/login", icon: <LogIn className="h-5 w-5" /> },
      { title: "Register", href: "/register", icon: <UserPlus className="h-5 w-5" /> },
    ];
    return <FloatingDock items={guestLinks.map(link => ({...link, icon: <div className="h-full w-full">{link.icon}</div>}))} mobileClassName="p-2 gap-2" desktopClassName="p-3 md:gap-3" />
  }

  // 2. Jika pengguna SUDAH LOGIN, tampilkan wadah kustom dengan link navigasi + Avatar Menu
  return (
    <div className="flex items-center gap-1 p-2 border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full">
      {/* Render link navigasi sebagai tombol ikon */}
      {navLinks.map((item) => (
        <Link href={item.href} key={item.href}>
          <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-full" aria-label={item.title}>
            {item.icon}
          </Button>
        </Link>
      ))}
      
      {/* Garis pemisah visual */}
      <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Render Avatar dengan Dropdown Menu, persis di sebelahnya */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full">
            <Avatar className="h-full w-full">
              <AvatarImage src={user.photoURL || ''} alt={userData?.name} />
              <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={dashboardLink}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}