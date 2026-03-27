import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateProfileSchema, ChangePasswordSchema } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { User, Lock, Mail, Phone, MapPin } from "lucide-react";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, updateProfile, changePassword, isUpdatingProfile, isChangingPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      address: user?.address || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onProfileSubmit = (data: any) => {
    setMessage(null);
    updateProfile(data, {
      onSuccess: () => {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      },
      onError: (error: Error) => {
        setMessage({ type: "error", text: error.message || "Failed to update profile" });
      },
    });
  };

  const onPasswordSubmit = (data: any) => {
    setMessage(null);
    changePassword(data, {
      onSuccess: () => {
        resetPassword();
        setMessage({ type: "success", text: "Password changed successfully!" });
      },
      onError: (error: Error) => {
        setMessage({ type: "error", text: error.message || "Failed to change password" });
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StickyHeader />
      <div className="flex-1 section-padding py-10">
        <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                Role: {user.role}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 px-4 border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`pb-2 px-4 border-b-2 transition-colors ${
                activeTab === "password"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Profile Form */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...registerProfile("name")}
                      placeholder="Enter your full name"
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-destructive">{profileErrors.name.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...registerProfile("phone")}
                      placeholder="Enter your phone number"
                    />
                    {profileErrors.phone && (
                      <p className="text-sm text-destructive">{profileErrors.phone.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...registerProfile("address")}
                      placeholder="Enter your address"
                    />
                    {profileErrors.address && (
                      <p className="text-sm text-destructive">{profileErrors.address.message as string}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Password Form */}
          {activeTab === "password" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      {...registerPassword("oldPassword")}
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.oldPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.oldPassword.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerPassword("newPassword")}
                      placeholder="Enter your new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.newPassword.message as string}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
