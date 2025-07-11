import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EyeOff,
  Mail,
  Lock,
  Phone,
  User2,
  Edit,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Settings = () => {
  const { userData } = useSelector((state) => state.auth);
  const [tenantData, setTenantData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [planType, setPlanType] = useState("basic");
  const [billingType, setBillingType] = useState("monthly");
  const [unsubscribePassword, setUnsubscribePassword] = useState("");
  const fileInputRef = useRef(null);

  // Initialize API instance
  const tenantApi = new Api("/api/tenants");

  // Get tenant ID from localStorage
  const tenantId = userData.tenantId;
  console.log(tenantId);
  // Fetch tenant data
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

      const response = await tenantApi.getById("", tenantId);

      if (response.success) {
        // Support both response.data and response.tenant for compatibility
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
          currentPassword: "",
          newPassword: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch tenant data",
          variant: "destructive",
        });
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

      // Only include password if both current and new passwords are provided
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Include avatar if changed
      if (avatar && avatar !== tenantData.avatar) {
        updateData.avatar = avatar;
      }

      const response = await tenantApi.put("", tenantId, updateData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
          variant: "default",
        });
        setIsEditing(false);
        // Refresh data
        await fetchTenantData();
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
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
      currentPassword: "",
      newPassword: "",
    });
    setAvatar(tenantData.avatar || null);
  };

  // Load data on component mount
  useEffect(() => {
    fetchTenantData();
  }, []);

  if (loading) {
    return (
      <Card className="max-w-5xl mx-auto rounded-2xl p-4 md:p-8 bg-white shadow-xs">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </Card>
    );
  }

  return (
    <Layout title="Settings">
      <Card className="max-w-5xl mx-auto rounded-2xl p-4 md:p-8 bg-white shadow-xs">
        <div className="flex justify-start mb-4">
          <Button
            variant={isEditing ? "destructive" : "outline"}
            onClick={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row justify-evenly">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="size-32 rounded-full border overflow-hidden mb-4">
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
                <Button variant={"outline"} onClick={handleUploadClick}>
                  Change Picture
                </Button>
              </>
            )}
          </div>

          {/* Form Fields */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col space-y-6">
              {/* First Name */}
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

              {/* Last Name */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Last Name</Label>
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

              {/* Email - Always Readonly */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Email</Label>
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full">
                  <Mail className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <Input
                    value={formData.email}
                    className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                    readOnly
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Phone</Label>
                <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                  <Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                    readOnly={!isEditing}
                  />
                  {isEditing && (
                    <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Current Password
                </Label>
                <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                  <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                    placeholder={isEditing ? "Enter current password" : ""}
                    className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                    readOnly={!isEditing}
                  />
                  {isEditing && (
                    <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  )}
                  {showPassword ? (
                    <Eye
                      className="text-muted-foreground h-4 w-4 flex-shrink-0 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      className="text-muted-foreground h-4 w-4 flex-shrink-0 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  New Password
                </Label>
                <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                  <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    placeholder={isEditing ? "Enter new password" : ""}
                    className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                    readOnly={!isEditing}
                  />
                  {isEditing && (
                    <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  )}
                  {showPassword ? (
                    <Eye
                      className="text-muted-foreground h-4 w-4 flex-shrink-0 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      className="text-muted-foreground h-4 w-4 flex-shrink-0 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
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
        <div className="mt-8 border-t pt-8 w-full">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Label className="w-40">Plan Type:</Label>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-40">Billing Type:</Label>
              <Select value={billingType} onValueChange={setBillingType}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-40">Next Billing:</Label>
              <span>January 1, 2024</span>
            </div>

            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-40">
                    Unsubscribe
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Unsubscription</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Please enter your password to Unsubscribe:</p>
                    <Input
                      type="password"
                      value={unsubscribePassword}
                      onChange={(e) => setUnsubscribePassword(e.target.value)}
                      className="w-full"
                    />
                    <Button variant="destructive" className="w-full">
                      Confirm Unsubscribe
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-40">Upgrade Plan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Available Plans</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {planType === "basic" && billingType === "monthly" && (
                        <>
                          <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold">
                              Pro Plan - $29/month
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Advanced features for professionals
                            </p>
                          </div>
                          <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold">
                              Enterprise Plan - $99/month
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Complete solution for large teams
                            </p>
                          </div>
                        </>
                      )}
                      {planType === "basic" && billingType === "yearly" && (
                        <>
                          <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold">
                              Pro Plan - $290/year
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Advanced features for professionals
                            </p>
                          </div>
                          <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold">
                              Enterprise Plan - $990/year
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Complete solution for large teams
                            </p>
                          </div>
                        </>
                      )}
                      {planType === "pro" && billingType === "monthly" && (
                        <div className="p-6 border rounded-lg">
                          <h3 className="text-lg font-semibold">
                            Enterprise Plan - $99/month
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Complete solution for large teams
                          </p>
                        </div>
                      )}
                      {planType === "pro" && billingType === "yearly" && (
                        <div className="p-6 border rounded-lg">
                          <h3 className="text-lg font-semibold">
                            Enterprise Plan - $990/year
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Complete solution for large teams
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Settings;