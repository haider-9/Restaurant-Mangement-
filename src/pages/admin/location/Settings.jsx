import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOff, Mail, User, Lock, Phone, User2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const Settings = () => {
  const { userData } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

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

  return (
    <Card className="max-w-5xl mx-auto rounded-2xl p-4 md:p-8 bg-white shadow-xs">
      <div className="flex justify-start mb-4">
        <Button
          variant={isEditing ? "destructive" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
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
              src={avatar || "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"}
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
          <div className="flex flex-col  space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Full Name</Label>
              <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                <User2 className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                <Input
                  value={userData?.firstName + " " + userData?.lastName || ""}
                  className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                  readOnly={!isEditing}
                />
                {isEditing && <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />}
              </div>
            </div>

            {/* Email - Always Readonly */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Email</Label>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full">
                <Mail className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                <Input
                  value={userData?.email || ""}
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
                  value={userData?.phone || ""}
                  className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                  readOnly={!isEditing}
                />
                {isEditing && <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Current Password</Label>
              <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={userData.password || ""}
                  className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                  readOnly={!isEditing}
                />
                {isEditing && <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />}
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
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">New Password</Label>
              <div className="inline-flex items-center gap-2 bg-input px-3 py-2 rounded-lg w-full">
                <Lock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="shadow-none border-none bg-transparent p-0 focus-visible:ring-0"
                  readOnly={!isEditing}

                />
                {isEditing && <Edit className="text-muted-foreground h-4 w-4 flex-shrink-0" />}
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
            <Button className="w-full md:w-auto" disabled={!isEditing}>Save Changes</Button>
          </div>
        </div>
      </div>
    </Card>
  )
};

export default Settings;