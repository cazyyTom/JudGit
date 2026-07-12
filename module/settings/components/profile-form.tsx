"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";
import {updateUserProfile} from "@/module/settings/action";
import {toast} from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/module/settings/action";

export function ProfileForm() {

    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['user-Profile'],
        queryFn: async () => getUserProfile(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        
    });
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name || "");
            setEmail(userProfile.email || "");
        }
    }, [userProfile]);

const updateMutation = useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
        return await updateUserProfile(data);
    },
    onSuccess:(result) => {
        if (result.success) {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({queryKey: ['user-Profile']});
        } else {
            toast.error("Failed to update profile");
        }
    }
})

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ name, email }); 
}

if(isLoading){
    return (
<Card>
    <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your user profile information</CardDescription>
    </CardHeader>
    <CardContent>
        <div className="text-center">Please wait while we load your profile information.</div>
    </CardContent>
</Card>

    );
}

return(
    <Card>
        <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your user profile information</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        disabled={updateMutation.isPending}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={updateMutation.isPending}
                    />
                </div>
                <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
            </form>
        </CardContent>
    </Card>
)
}