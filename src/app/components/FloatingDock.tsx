'use client'

import React, { useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'
import { FloatingDock } from "../components/ui/floating-dock";
import {
  IconHome,
  IconSearch,
  IconInfoCircle,
  IconLogin,
  IconUserPlus,
  IconLogout,
  IconDashboard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { BookMarked } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar"

export function FloatingDockDemo() {
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

  const UserProfile = () => {
    if (!user) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.photoURL || ''} alt={userData?.name} />
              <AvatarFallback className="text-xs">{getInitials(userData?.name)}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={dashboardLink}>
              <IconDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <IconSettings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <IconLogout className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };


  const baseLinks = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Find Mentor",
      icon: (
        <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/#hero",
    },
    {
      title: "Tentang Kami",
      icon: (
        <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/about",
    },
    {
        title: "Tebar Ilmu",
        icon: (
          <img
            src="/logo/logo.png"
            width={20}
            height={20}
            alt="Tebar Ilmu"
          />
        ),
        href: "#",
      },
    {
      title: "Free Learning",
      icon: (
        <BookMarked className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/student",
    },
  ];

  // Links untuk user yang belum login
  const authLinks = [
    {
      title: "Login",
      icon: (
        <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/login",
    },
    {
      title: "Register",
      icon: (
        <IconUserPlus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/register",
    },
  ];

  // Links untuk user yang sudah login
  const userLinks = [
    {
      title: "Dashboard",
      icon: (
        <IconDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: dashboardLink,
    },
    {
      title: "Profile",
      icon: <UserProfile />,
      href: "#", 
      isUserProfile: true,  
    },
  ];

  const links = user 
    ? [...baseLinks, ...userLinks]
    : [...baseLinks, ...authLinks];

  return (

      <FloatingDock
        items={links}
        mobileClassName="p-2 gap-2"
        desktopClassName="p-3 md:gap-3"
      />
   
  );
}