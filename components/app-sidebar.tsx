'use client';
import React from 'react'
import { useTheme } from 'next-themes';
import {GithubIcon} from "@/module/auth/components/login-ui";
import {BookOpen, Settings, Moon, Sun, LogOut} from "lucide-react";
import {useState, useEffect} from "react";
import {usePathname} from "next/navigation";
import {useSession} from "@/lib/auth-client";
import {Sidebar, SidebarTrigger, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator} from "@/components/ui/sidebar";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Logout} from "@/module/auth/components/logout";
export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const {data: session} = useSession();
  useEffect(() => {
    setMounted(true);
  }, [])
  const navigationItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Repository",
      url: "/dashboard/repository",
      icon: <GithubIcon className="w-4 h-4" />,
    },
    {
      name: "Reviews",
      url: "/dashboard/reviews",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];
  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/dashboard");
  }
  if (!mounted || !session) {
return null;
  }
  const user = session.user;
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const userAvatar = user?.image || userInitials;

return (
  <Sidebar>
    <SidebarContent>
      {/* Optional but standard in shadcn: SidebarGroup wrappers */}
      <SidebarMenu>
        {navigationItems.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton  isActive={isActive(item.url)}>
             
              <a href={item.url}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" >
          <div className="flex flex-col space-y-2 p-2">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
          <SidebarSeparator />


          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <button variant="ghost" className="flex items-center gap-2 w-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>Toggle Theme</span>
            </button>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  </Sidebar>
);
};


