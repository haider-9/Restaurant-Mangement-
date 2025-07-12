import React, { useState, useEffect, useRef } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
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
import LocationForm from "@/components/tenant/setting/LocationForm";
import DeleteLocationDialog from "@/components/tenant/setting/DeleteLocationDialog";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeFormat, setTimeFormat] = useState("24h"); // '12h' or '24h'

  // Ref for SMS template textarea to handle cursor position
  const smsTemplateRef = useRef(null);

  const {
    userData: { tenantId },
  } = useSelector((state) => state.auth);

  // Initialize API instance
  const locationApi = new Api(`/api/locations/all/tenants/${tenantId}`);
  const userApi = new Api("/api/users");
  const addLocationApi = new Api(`/api/tenants/${tenantId}/locations`);

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
    mealTimings: {
      breakfast: { start: "", end: "" },
      lunch: { start: "", end: "" },
      dinner: { start: "", end: "" },
    },
  });

  // For adminEmail validation
  const [adminEmailError, setAdminEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const debounceTimeout = useRef(null);

  //  For meal timing validation
  const [mealTimingErrors, setMealTimingErrors] = useState({});

  // SMS Template variables
  const smsVariables = [
    { label: "Customer Name", value: "{{customer_name}}" },
    { label: "Reservation Date", value: "{{reservation_date}}" },
    { label: "Reservation Time", value: "{{reservation_time}}" },
    { label: "Party Size", value: "{{party_size}}" },
    { label: "Location Name", value: "{{location_name}}" },
    { label: "Location Address", value: "{{location_address}}" },
  ];

  // Helper function to convert time to 24h format for comparison
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "";

    // If already in 24h format (HH:mm), return as is
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }

    // If in 12h format, convert to 24h
    const time = moment(timeStr, ["h:mm A", "hh:mm A"]);
    return time.isValid() ? time.format("HH:mm") : timeStr;
  };

  // Function to insert variable into SMS template at cursor position
  const insertSmsVariable = (variable) => {
    const textarea = smsTemplateRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = formData.smsTemplate;

    const newValue =
      currentValue.substring(0, start) + variable + currentValue.substring(end);

    setFormData((prev) => ({
      ...prev,
      smsTemplate: newValue,
    }));

    // Set cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variable.length,
        start + variable.length
      );
    }, 0);
  };

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await locationApi.get("");
        console.log(response);
        if (response && response.locations) {
          console.log(response.locations);
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

  // Validate meal timings for overlaps
  const validateMealTimings = () => {
    const errors = {};
    const timings = [];

    // Helper to compare time strings and convert to 24h format
    const isBefore = (a, b) => convertTo24Hour(a) < convertTo24Hour(b);
    const to24h = (time) => convertTo24Hour(time);

    // Define meal periods
    const mealPeriods = [
      {
        name: "Breakfast",
        from: formData.breakfastFrom,
        to: formData.breakfastTo,
      },
      { name: "Lunch", from: formData.lunchFrom, to: formData.lunchTo },
      { name: "Dinner", from: formData.dinnerFrom, to: formData.dinnerTo },
    ];

    // Collect valid meal timings
    mealPeriods.forEach((meal) => {
      if (meal.from && meal.to) {
        timings.push({
          name: meal.name,
          from: to24h(meal.from),
          to: to24h(meal.to),
        });

        // Check if from time is before to time
        if (!isBefore(meal.from, meal.to)) {
          errors[
            meal.name.toLowerCase()
          ] = `${meal.name} start time must be before end time`;
        }
      }
    });

    // Check for overlaps between meals
    timings.forEach((meal1, i) => {
      timings.slice(i + 1).forEach((meal2) => {
        if (
          (meal1.from < meal2.to && meal1.to > meal2.from) ||
          (meal2.from < meal1.to && meal2.to > meal1.from)
        ) {
          const errorMsg = `${meal1.name} and ${meal2.name} timings overlap`;
          errors[meal1.name.toLowerCase()] = errorMsg;
          errors[meal2.name.toLowerCase()] = errorMsg;
        }
      });
    });

    // Check if meal times are within opening/closing times
    const opening = to24h(formData.openingTime);
    const closing = to24h(formData.closingTime);

    if (opening && closing) {
      mealPeriods.forEach((meal) => {
        if (meal.from) {
          const mealFromTime = to24h(meal.from);
          if (mealFromTime < opening || mealFromTime > closing) {
            errors[
              meal.name.toLowerCase()
            ] = `${meal.name} start time must be within opening and closing hours`;
          }
        }
        if (meal.to) {
          const mealToTime = to24h(meal.to);
          if (mealToTime < opening || mealToTime > closing) {
            errors[
              meal.name.toLowerCase()
            ] = `${meal.name} end time must be within opening and closing hours`;
          }
        }
      });
    }

    setMealTimingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate meal timings whenever relevant form data changes
  useEffect(() => {
    if (isDialogOpen) {
      validateMealTimings();
    }
  }, [
    formData.breakfastFrom,
    formData.breakfastTo,
    formData.lunchFrom,
    formData.lunchTo,
    formData.dinnerFrom,
    formData.dinnerTo,
    formData.openingTime,
    formData.closingTime,
    isDialogOpen,
  ]);

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

  const handleTimeChange = (name, value) => {
    // Convert time to 24h format for storage
    const time24h = value ? convertTo24Hour(value) : "";
    setFormData((prev) => ({
      ...prev,
      [name]: time24h,
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
      breakfastFrom: "",
      breakfastTo: "",
      lunchFrom: "",
      lunchTo: "",
      dinnerFrom: "",
      dinnerTo: "",
    });
    setAdminEmailError("");
    setMealTimingErrors({});
    setTimeFormat("24h"); // Reset to default format
    setIsDialogOpen(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setFormData({
      locationName: location.locationName || "",
      address: location.address || "",
      timeZone: location.timeZone || "",
      openingTime: location.openingTime || "",
      closingTime: location.closingTime || "",
      turnOverTime: location.turnOverTime || 30,
      adminEmail: location.adminEmail || "",
      smsTemplate: location.smsTemplate || "",
      breakfastFrom: location.breakfastFrom || "",
      breakfastTo: location.breakfastTo || "",
      lunchFrom: location.lunchFrom || "",
      lunchTo: location.lunchTo || "",
      dinnerFrom: location.dinnerFrom || "",
      dinnerTo: location.dinnerTo || "",
    });
    setAdminEmailError("");
    setMealTimingErrors({});
    setTimeFormat("24h"); // Reset to default format
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

    // Validate meal timings
    if (!validateMealTimings()) {
      toast.error("Please fix meal timing errors before submitting.");
      return;
    }

    // Build mealTimings object
    const mealTimings = {
      breakfast: {
        start: convertTo24Hour(formData.breakfastFrom) || "07:00",
        end: convertTo24Hour(formData.breakfastTo) || "10:00",
      },
      lunch: {
        start: convertTo24Hour(formData.lunchFrom) || "12:00",
        end: convertTo24Hour(formData.lunchTo) || "15:00",
      },
      dinner: {
        start: convertTo24Hour(formData.dinnerFrom) || "18:00",
        end: convertTo24Hour(formData.dinnerTo) || "22:00",
      },
    };

    // Build payload according to backend schema
    const payload = {
      locationName: formData.locationName,
      address: formData.address,
      openingTime: convertTo24Hour(formData.openingTime),
      closingTime: convertTo24Hour(formData.closingTime),
      timeZone: formData.timeZone || "France/Paris",
      turnOverTime: Number(formData.turnOverTime),
      smsTemplate: formData.smsTemplate || "New location has been created!",
      status: "active",
      tenantId,
      timeFormatPreference: timeFormat === "12h" ? "12-hour" : "24-hour",
      mealTimings,
      adminEmail: formData.adminEmail,
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
                  ...payload,
                  updatedAt: new Date().toISOString(),
                }
              : location
          )
        );
        toast.success("Location updated successfully.");
      } else {
        // Create new location
        const response = await addLocationApi.post("", payload);
        console.log(response);
        const newLocation = response?.location || {
          ...payload,
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
                  ...payload,
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
    setMealTimingErrors({});
    setTimeFormat("24h"); // Reset format on close
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
                  <Plus size={18} className="mr-1" />
                  Add New Location
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLocation ? "Edit Location" : "Add Location"}
                  </DialogTitle>
                </DialogHeader>
                <LocationForm
                  formData={formData}
                  setFormData={setFormData}
                  timezones={timezones}
                  timeFormat={timeFormat}
                  setTimeFormat={setTimeFormat}
                  isLoading={isLoading}
                  editingLocation={editingLocation}
                  adminEmailError={adminEmailError}
                  isCheckingEmail={isCheckingEmail}
                  mealTimingErrors={mealTimingErrors}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleTimeChange={handleTimeChange}
                  handleCloseDialog={handleCloseDialog}
                  handleSubmit={handleSubmit}
                  smsVariables={smsVariables}
                  insertSmsVariable={insertSmsVariable}
                  smsTemplateRef={smsTemplateRef}
                />
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
                      colSpan={7}
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
                      <TableCell className="max-w-[200px] truncate">
                        {location.address}
                      </TableCell>
                      <TableCell>
                        {formatTimezoneDisplay(
                          location.timeZone || location.timezone
                        )}
                      </TableCell>
                      <TableCell>
                        {location.openingTime
                          ? moment(location.openingTime, "HH:mm").format(
                              "h:mm A"
                            )
                          : location.openingTime}
                      </TableCell>
                      <TableCell>
                        {location.closingTime
                          ? moment(location.closingTime, "HH:mm").format(
                              "h:mm A"
                            )
                          : location.closingTime}
                      </TableCell>

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
          <DeleteLocationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            isLoading={isLoading}
            onCancel={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Location;
