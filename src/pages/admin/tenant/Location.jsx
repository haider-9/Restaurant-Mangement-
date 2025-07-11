import React, { useState, useEffect, useRef } from "react";
import { Edit, Trash2 } from "lucide-react";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Api from "@/config/api";

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    userData: { tenantId },
  } = useSelector((state) => state.auth);

  // Initialize API instance
  const locationApi = new Api(`/api/locations/all/tenants/${tenantId}`);
  const userApi = new Api("/api/users");

  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
    timeZone: "",
    openingTime: "",
    closingTime: "",
    turnOverTime: 30,
    adminEmail: "",
    twilioNumber: "",
    smsTemplate: "",
  });

  // For adminEmail validation
  const [adminEmailError, setAdminEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const debounceTimeout = useRef(null);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await locationApi.get("");
        console.log(response);
        if (response && response.locations) {
          setLocations(response.locations);
        } else {
          setLocations([]);
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setLocations([]);
        toast.error("Failed to fetch locations.");
      } finally {
        setIsLoading(false);
      }
    };

    if (tenantId) {
      fetchLocations();
    }
  }, [tenantId]);

  // Get timezones using moment-timezone
  useEffect(() => {
    const tzNames = moment.tz.names();
    const remainingTimezones = tzNames.map((tz) => {
      const offset = moment.tz(tz).format("Z");
      const abbreviation = moment.tz(tz).format("z");
      return {
        value: tz,
        label: `${tz.replace(/_/g, " ")} (${abbreviation} ${offset})`,
        offset: offset,
      };
    });
    setTimezones(remainingTimezones);
  }, []);

  // Debounced check for adminEmail
  useEffect(() => {
    if (!isDialogOpen) return;

    if (!formData.adminEmail) {
      setAdminEmailError("");
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(true);
    setAdminEmailError("");

    // Clear any previous debounce
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    // Debounce the API call
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await userApi.get("/check", {
          email: formData.adminEmail,
        });

        if (!response) {
          setAdminEmailError("Error checking email. Please try again.");
        } else if (response.success === false) {
          setAdminEmailError(
            response.message || "Error checking email. Please try again."
          );
        } else if (response.success === true) {
          setAdminEmailError("Email Found"); // Email is present and valid
        } else {
          setAdminEmailError("Error checking email. Please try again.");
        }
      } catch (err) {
        console.error("Email check error:", err);
        setAdminEmailError("Error checking email. Please try again.");
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [formData.adminEmail, isDialogOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "adminEmail") {
      setAdminEmailError("");
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormData({
      locationName: "",
      address: "",
      timeZone: "",
      openingTime: "",
      closingTime: "",
      turnOverTime: 30,
      adminEmail: "",
      smsTemplate: "",
    });
    setAdminEmailError("");
    setIsDialogOpen(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setFormData({
      locationName: location.locationName || "",
      address: location.address || "",
      timeZone: location.timeZone || location.timezone || "",
      openingTime: location.openingTime || "",
      closingTime: location.closingTime || "",
      turnOverTime: location.turnOverTime || 30,
      adminEmail: location.adminEmail || "",

      smsTemplate: location.smsTemplate || "",
    });
    setAdminEmailError("");
    setIsDialogOpen(true);
  };

  const handleDeleteLocation = (id) => {
    setDeleteLocationId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteLocationId) return;

    try {
      setIsLoading(true);
      const deleteApi = new Api(`/api/tenants/${tenantId}/locations`);
      await deleteApi.delete("", deleteLocationId);
      setLocations((prev) =>
        prev.filter((location) => location._id !== deleteLocationId)
      );
      toast.success("Location deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      // Still remove from UI if backend fails
      setLocations((prev) =>
        prev.filter((location) => location._id !== deleteLocationId)
      );
      toast.error("Failed to delete location from backend, removed locally.");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteLocationId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only validate adminEmail for new location
    if (!editingLocation) {
      if (
        !formData.adminEmail ||
        (adminEmailError && adminEmailError !== "Email Found")
      ) {
        setAdminEmailError(
          adminEmailError || "Admin email is required and must be valid."
        );
        toast.error("Admin email is required and must be valid.");
        return;
      }
    }

    const payload = {
      locationName: formData.locationName,
      address: formData.address,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      timeZone: formData.timeZone,
      turnOverTime: Number(formData.turnOverTime),
      adminEmail: formData.adminEmail,
      smsTemplate: formData.smsTemplate,
    };

    try {
      setIsLoading(true);

      if (editingLocation) {
        const updateApi = new Api(`/api/locations/`);

        await updateApi.put(`${editingLocation._id}`, "", payload);
        setLocations((prev) =>
          prev.map((location) =>
            location._id === editingLocation._id
              ? {
                ...location,
                ...formData,
                turnOverTime: Number(formData.turnOverTime),
                smsTemplate: formData.smsTemplate,
              }
              : location
          )
        );
        toast.success("Location updated successfully.");
      } else {
        // Create new location
        const response = await locationApi.post("", payload);
        console.log(response);
        const newLocation = response?.location || {
          ...payload,
          tenantId,
        };

        setLocations((prev) => [...prev, newLocation]);
        toast.success("Location added successfully.");
      }
    } catch (err) {
      console.error("Submit error:", err);

      if (editingLocation) {
        // Still update UI for edit
        setLocations((prev) =>
          prev.map((location) =>
            location._id === editingLocation._id
              ? {
                ...location,
                ...formData,
                turnOverTime: Number(formData.turnOverTime),
                smsTemplate: formData.smsTemplate,
                updatedAt: new Date().toISOString(),
              }
              : location
          )
        );
        toast.error("Failed to update location in backend, updated locally.");
      } else {
        toast.error("Failed to add location.");
      }
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setEditingLocation(null);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLocation(null);
    setAdminEmailError("");
  };

  // Helper function to format timezone display
  const formatTimezoneDisplay = (timezone) => {
    if (!timezone) return "";
    const offset = moment.tz(timezone).format("Z");
    const abbreviation = moment.tz(timezone).format("z");
    return `${timezone.replace(/_/g, " ")} (${abbreviation} ${offset})`;
  };

  return (
    <div className="w-full px-2 md:px-6 py-2">
      <h1 className="pb-6 pt-3 text-center text-2xl font-bold text-black/70">
        Location
      </h1>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-x-4">
          <div className="flex justify-between items-center w-full">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAddLocation}
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={isLoading}
                >
                  Add New Location
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLocation ? "Edit Location" : "Add Location"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location Name */}
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Name</Label>
                    <Input
                      id="locationName"
                      name="locationName"
                      value={formData.locationName}
                      onChange={handleInputChange}
                      placeholder="Enter location name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Admin Email */}
                  {!editingLocation && (
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        name="adminEmail"
                        type="email"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        placeholder="Enter admin email"
                        required
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      {isCheckingEmail && (
                        <div className="text-xs text-muted-foreground">
                          Checking email...
                        </div>
                      )}
                      {adminEmailError && (
                        <div
                          className={`text-xs ${adminEmailError === "Email Found"
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {adminEmailError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SMS Template */}
                  <div className="space-y-2">
                    <Label htmlFor="smsTemplate">SMS Template</Label>
                    <Textarea
                      id="smsTemplate"
                      name="smsTemplate"
                      value={formData.smsTemplate}
                      onChange={handleInputChange}
                      placeholder="Enter SMS template for this location"
                      rows={3}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Time Zone */}
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Select
                      value={formData.timeZone}
                      onValueChange={(value) =>
                        handleSelectChange("timeZone", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Time Zone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Opening and Closing Hours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openingTime">Opening Hours</Label>
                      <Input
                        type="time"
                        id="openingTime"
                        name="openingTime"
                        value={formData.openingTime}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closingTime">Closing Hours</Label>
                      <Input
                        type="time"
                        id="closingTime"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Turn Over */}
                  <div className="space-y-3">
                    <Label>Turn Over</Label>
                    <RadioGroup
                      value={String(formData.turnOverTime)}
                      onValueChange={(value) =>
                        handleSelectChange("turnOverTime", value)
                      }
                      className="flex flex-wrap gap-6"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="30"
                          id="30"
                          disabled={isLoading}
                        />
                        <Label htmlFor="30">30 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="60"
                          id="60"
                          disabled={isLoading}
                        />
                        <Label htmlFor="60">60 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="90"
                          id="90"
                          disabled={isLoading}
                        />
                        <Label htmlFor="90">90 minutes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Dialog Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        (adminEmailError &&
                          adminEmailError !== "Email Found") ||
                        isCheckingEmail
                      }
                    >
                      {isLoading
                        ? "Processing..."
                        : editingLocation
                          ? "Update Location"
                          : "Add Location"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardTitle className="text-start px-2 md:px-6 text-2xl">
          Location List
        </CardTitle>
        <CardContent>
          {isLoading && !isDialogOpen && (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px] w-full">
              <TableHeader>
                <TableRow className="*:text-start">
                  <TableHead className="min-w-[100px] md:w-[200px]">
                    Twilio Number
                  </TableHead>
                  <TableHead className="min-w-[160px] md:w-[200px]">
                    Location Name
                  </TableHead>
                  <TableHead className="min-w-[150px] md:w-[250px]">
                    Address
                  </TableHead>
                  <TableHead className="min-w-[120px] md:w-[150px]">
                    Time Zone
                  </TableHead>
                  <TableHead className="min-w-[120px] md:w-[150px]">
                    Opening Hours
                  </TableHead>
                  <TableHead className="min-w-[120px] md:w-[150px]">
                    Closing Hours
                  </TableHead>
                  <TableHead className="min-w-[80px] md:w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="*:text-start">
                {locations.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No locations found. Add your first location to get
                      started.
                    </TableCell>
                  </TableRow>
                ) : (
                  locations.map((location) => (
                    <TableRow key={location._id}>
                      <TableCell className="font-medium">
                        {location.twilioNumber || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {location.locationName}
                      </TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>
                        {formatTimezoneDisplay(
                          location.timeZone || location.timezone
                        )}
                      </TableCell>
                      <TableCell>{location.openingTime}</TableCell>
                      <TableCell>{location.closingTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLocation(location)}
                            className="h-8 w-8 p-0"
                            disabled={isLoading}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLocation(location._id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            disabled={isLoading}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Location</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>
                  Are you sure you want to delete this location? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationList;