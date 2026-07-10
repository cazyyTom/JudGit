"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, StarCheck, Settings, Moon, Sun, LogOut } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { GithubIcon } from "@/module/auth/components/login-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logout } from "@/module/auth/components/logout";

export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      icon: <StarCheck className="w-4 h-4" />,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/dashboard");
  };

  if (!mounted || !session) {
    return null;
  }

  const user = session.user;
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const userAvatar = user?.image || userInitials;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {/* Removed asChild from Trigger to bypass the TS error. 
                  It now renders a native button wrapping our SidebarMenuButton (which renders a div). */}
              <DropdownMenuTrigger className="w-full focus:outline-none">
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className="w-full justify-start cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div>
                    <Avatar className="h-8 w-8 mr-2 rounded-lg">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="rounded-lg">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col items-start overflow-hidden text-sm leading-tight text-left">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="cursor-pointer"
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span>Toggle Theme</span>
                </DropdownMenuItem>

                <SidebarSeparator className="my-1" />

                <DropdownMenuItem className="cursor-pointer bg-red-950 text-red-500 focus:text-red-500 ">
                  <LogOut />
                  <Logout className="cursor-pointer bg-red-950 text-red-500 focus:text-red-500 hover:bg-red-950 hover:text-red-500">
                    Logout
                  </Logout>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
