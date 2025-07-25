// src/app/components/UserActionsDock.tsx

'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Komponen UI & Ikon
import { FloatingDock } from './ui/floating-dock'
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogIn, UserPlus, LayoutDashboard, Settings, LogOut } from 'lucide-react'

// Komponen ini menangani semua aksi pengguna
export function UserActionsDock() {
  const { user, userData } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const dashboardLink = userData?.role === 'mentor' ? '/mentor' : '/student'

  // Jika belum login, tampilkan dock dengan tombol Login/Register
  if (!user) {
    const guestLinks = [
        {
            title: "Login",
            href: "/login",
            icon: <LogIn className="h-full w-full" />,
        },
        {
            title: "Register",
            href: "/register",
            icon: <UserPlus className="h-full w-full" />,
        },
    ];
    return <FloatingDock items={guestLinks} mobileClassName="p-2 gap-2" desktopClassName="p-3 md:gap-3" />
  }

  // Jika sudah login, tampilkan Avatar dengan Dropdown Menu
  return (
    <div className="bg-background/80 border rounded-full p-1 backdrop-blur-sm">
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