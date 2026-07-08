import React from 'react'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = (
    {children}: {children: React.ReactNode}
) => {
  return (
    <SidebarProvider>
        <AppSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between p-4">
          <SidebarTrigger className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"/>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <main className="flex-1 overflow-auto p-4 md:p-6">
      {children}
          </main>
        </header>
      </SidebarInset>
 
    
    </SidebarProvider>
  )
}

export default DashboardLayout
