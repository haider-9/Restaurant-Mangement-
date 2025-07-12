import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Phone, User2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import Api from "@/config/api";
import { useSelector } from "react-redux";
import Layout from "@/components/common/Layout";
import SectionFive from "@/components/landingPageComponents/section5/SectionFive";

const Settings = () => {
  const { userData } = useSelector((state) => state.auth);
  const [tenantData, setTenantData] = useState({});
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
  const [planType, setPlanType] = useState("");
  const [billingType, setBillingType] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [unsubscribePassword, setUnsubscribePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  // Change password handler
  // Remove handleChangePassword, move logic to updateTenantData
  const fileInputRef = useRef(null);

  const tenantApi = new Api("/api/tenants");

  const tenantId = userData.tenantId;
  const fetchTenantData = async () => {
    try {
      setLoading(true);
      if (!tenantId) {
        toast({
          title: "Error",
          description: "Tenant ID not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      // Fetch tenant profile
      const response = await tenantApi.getById("", tenantId);
      if (response.success) {
        const data = response.data || response.tenant;
        setTenantData(data);
        setFormData({
          firstName: data.firstName || data.tenantName?.split(" ")[0] || "",
          lastName:
            data.lastName ||
            data.tenantName?.split(" ").slice(1).join(" ") ||
            "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch tenant data",
          variant: "destructive",
        });
      }

      // Fetch subscription info
      const subApi = new Api(`/api/tenants/${tenantId}/subscription`);
      const subRes = await subApi.get("");
      if (
        subRes.success &&
        subRes.subscription &&
        subRes.subscription.length > 0
      ) {
        const sub = subRes.subscription[0];
        setPlanType(sub.plan?.planName || "");
        setBillingType(sub.subscriptionType || "");
        setNextBillingDate(
          sub.nextBillingDate
            ? new Date(sub.nextBillingDate).toLocaleDateString()
            : ""
        );
      }
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tenant data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update tenant data
  const updateTenantData = async () => {
    try {
      setSaving(true);

      if (!tenantId) {
        toast({
          title: "Error",
          description: "Tenant ID not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      // Prepare update data (exclude empty password fields)
      const updateData = {
        tenantName: formData.firstName + " " + formData.lastName,
        phone: formData.phone,
      };

      // Include avatar if changed
      if (avatar && avatar !== tenantData.avatar) {
        updateData.avatar = avatar;
      }

      // Password change logic
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

      const response = await tenantApi.put("", tenantId, updateData);

      if (response.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Refresh data
        await fetchTenantData();
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
        }));
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating tenant data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      firstName: tenantData.firstName || "",
      lastName: tenantData.lastName || "",
      email: tenantData.email || "",
      phone: tenantData.phone || "",
    });
    setAvatar(tenantData.avatar || null);
  };

  // Load data on component mount
  useEffect(() => {
    fetchTenantData();
  }, []);

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
                        <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          placeholder="Enter current password"
                          readOnly={!isEditing}
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
                        <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          placeholder="Enter new password"
                          readOnly={!isEditing}
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
                        <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <Input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                          placeholder="Confirm new password"
                          readOnly={!isEditing}
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
                    onClick={updateTenantData}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          {/* Plan & Billing Section */}
          <Card className="rounded-2xl  p-6 md:p-10 shadow-xs">
            <h2 className="font-semibold text-lg text-gray-700 mb-6">
              Subscription & Billing
            </h2>
            <div className="flex flex-col w-1/2 gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <Label className="sm:w-32 font-medium text-gray-700">
                  Plan
                </Label>
                <span className="text-gray-800 capitalize font-semibold">
                  {planType || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <Label className="sm:w-32 font-medium text-gray-700">
                  Billing
                </Label>
                <span className="text-gray-800 font-semibold capitalize">
                  {billingType || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <Label className="sm:w-32 font-medium text-gray-700">
                  Next Billing
                </Label>
                <span className="text-gray-800 font-semibold">
                  {nextBillingDate || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      Unsubscribe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Confirm Unsubscription</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700">
                        Please enter your password to unsubscribe:
                      </p>
                      <Input
                        type="password"
                        value={unsubscribePassword}
                        onChange={(e) => setUnsubscribePassword(e.target.value)}
                        className="w-full"
                        placeholder="Password"
                      />
                      <Button variant="destructive" className="w-full">
                        Confirm Unsubscribe
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* Upgrade Plan: Show SectionFive in a dialog when button is clicked */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                      Upgrade Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="w-full max-w-[95vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-0 bg-white shadow-lg overflow-y-auto rounded-lg"
                    style={{ maxHeight: "90vh" }}
                  >
                    <div className="p-2 md:p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
                      <SectionFive />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
