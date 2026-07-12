"use client"
import { ProfileForm } from '@/module/settings/components/profile-form'
import { RepositoryList } from '@/module/settings/components/repository-list'
import React from 'react'

const SettingPage = () => {
  return (
    <div className='space-y-6'>
        <div className='text-3xl font-bold tracking-tight'>Settings</div>
        <div className='text-sm text-muted-foreground'>Manage your account settings</div>
        <ProfileForm/>
        <RepositoryList/>
      
    </div>
  )
}

export default SettingPage
