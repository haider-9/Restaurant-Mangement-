import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, User2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";
import Api from "@/config/api";
import { useSelector } from "react-redux";
import Layout from "@/components/common/Layout";

const Settings = () => {
  const { userData } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  // Change password handler

  const fileInputRef = useRef(null);

  const getUser = new Api("/api/users");

  const userEmail = userData.email;
  const fetchUserData = async () => {
    try {
      setLoading(true);
      if (!userEmail) {
        toast.error("User Email not found. Please login again.");
        return;
      }

      const response = await getUser.get("/check", { email: userEmail });

      if (response.success) {
        // Handle the actual response structure
        const data = response.user;
        setUserDetails(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
        });
        setAvatar(data.avatar || null);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUserData = async () => {
    try {
      setSaving(true);

      if (!userDetails._id) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      // Include avatar if changed
      if (avatar && avatar !== userDetails.avatar) {
        updateData.avatar = avatar;
      }

      const response = await getUser.put(`/${userData._id}`, "", updateData);

      if (response.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Refresh data
        await fetchUserData();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        toast({
          title: "Error",
          description: "Please fill all password fields.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      try {
        const api = new Api(`/api/users/${userData._id}/security`);
        const response = await api.put("", "", {
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
        if (response.success) {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to change password.",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to change password.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: userDetails.firstName || "",
      lastName: userDetails.lastName || "",
      email: userDetails.email || "",
      phone: userDetails.phone || "",
    });
    setAvatar(userDetails.avatar || null);
  };

  // Load data on component mount
  useEffect(() => {
    fetchUserData();
  }, [userEmail]); // Remove fetchUserData from dependency array to avoid infinite loop

  return (
    <Layout title="Settings">
      <div className="max-w-[75rem] mx-auto py-10 px-2 md:px-0">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Profile Section */}
          <Card className="rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Avatar & Edit Button */}
              <div className="flex flex-col items-center gap-4 md:w-1/4">
                <div className="size-32 rounded-full border overflow-hidden">
                  <img
                    src={
                      avatar ||
                      "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    }
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button variant="outline" onClick={handleUploadClick}>
                      Change Picture
                    </Button>
                  </>
                )}
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  onClick={() =>
                    isEditing ? handleCancelEdit() : setIsEditing(true)
                  }
                  className="flex items-center gap-2 w-full"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
              {/* Info & Password Section */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      Personal Info
                    </h2>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        First Name
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                        <User2 className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          readOnly={!isEditing}
                        />
                        {isEditing && (
                          <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Last Name
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                        <User2 className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          readOnly={!isEditing}
                        />
                        {isEditing && (
                          <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Email
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full">
                        <Mail className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          value={formData.email}
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Phone
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                        <Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          readOnly={!isEditing}
                        />
                        {isEditing && (
                          <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Password Section */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      Change Password
                    </h2>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Current Password
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                        {/* Password input fields can be added here if needed */}
                        <Input
                          type="password"
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          placeholder="Enter current password"
                          readOnly={!isEditing}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        {isEditing && (
                          <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        New Password
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                        <Input
                          type="password"
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          placeholder="Enter new password"
                          readOnly={!isEditing}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {isEditing && (
                          <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Confirm New Password
                      </Label>
                      <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                        <Input
                          type="password"
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          placeholder="Confirm new password"
                          readOnly={!isEditing}
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                        {isEditing && (
                          <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button
                    className="w-full md:w-auto"
                    disabled={!isEditing || saving}
                    onClick={updateUserData}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
