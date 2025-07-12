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
import { Plus } from "lucide-react";
import { CustomTimePicker } from "@/components/tenant/setting/TimePicker";

const LocationForm = ({
  formData,
  timezones,
  timeFormat,
  setTimeFormat,
  isLoading,
  editingLocation,
  adminEmailError,
  isCheckingEmail,
  mealTimingErrors,
  handleInputChange,
  handleSelectChange,
  handleTimeChange,
  handleCloseDialog,
  handleSubmit,
  smsVariables,
  insertSmsVariable,
  smsTemplateRef,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time Format Selection */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <Label className="text-base font-semibold">Time Format</Label>
        <RadioGroup
          value={timeFormat}
          onValueChange={setTimeFormat}
          className="flex gap-6"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="12h" id="12h" disabled={isLoading} />
            <Label htmlFor="12h">12 Hour (AM/PM)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="24h" id="24h" disabled={isLoading} />
            <Label htmlFor="24h">24 Hour</Label>
          </div>
        </RadioGroup>
      </div>

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
              className={`text-xs ${
                adminEmailError === "Email Found"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {adminEmailError}
            </div>
          )}
        </div>
      )}

      {/* SMS Template with Variable Tags */}
      <div className="space-y-3">
        <Label htmlFor="smsTemplate">SMS Template</Label>
        <Textarea
          ref={smsTemplateRef}
          id="smsTemplate"
          name="smsTemplate"
          value={formData.smsTemplate}
          onChange={handleInputChange}
          placeholder="Enter SMS template for this location."
          rows={4}
          required
          disabled={isLoading}
          className="resize-none"
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Plus size={16} />
          <span className="font-medium">Add Fields</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {smsVariables.map((variable, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertSmsVariable(variable.value)}
              disabled={isLoading}
              className="h-8 px-3 py-1 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors"
              tabIndex={0}
            >
              {variable.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Zone */}
      <div className="space-y-2">
        <Label htmlFor="timeZone">Time Zone</Label>
        <Select
          value={formData.timeZone}
          onValueChange={(value) => handleSelectChange("timeZone", value)}
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
        <CustomTimePicker
          label="Opening Hours"
          value={formData.openingTime}
          onChange={(value) => handleTimeChange("openingTime", value)}
          format={timeFormat}
          required
          disabled={isLoading}
        />
        <CustomTimePicker
          label="Closing Hours"
          value={formData.closingTime}
          onChange={(value) => handleTimeChange("closingTime", value)}
          format={timeFormat}
          required
          disabled={isLoading}
        />
      </div>

      {/* Meal Timings Section */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Meal Timings (Optional)
        </Label>
        {/* Breakfast Timing */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Breakfast</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomTimePicker
              label="From"
              value="07:00"
              onChange={(value) => handleTimeChange("breakfastFrom", value)}
              format={timeFormat}
              disabled={isLoading}
            />
            <CustomTimePicker
              label="To"
              value="12:00"
              onChange={(value) => handleTimeChange("breakfastTo", value)}
              format={timeFormat}
              disabled={isLoading}
            />
          </div>
          {mealTimingErrors.breakfast && (
            <div className="text-xs text-red-500">
              {mealTimingErrors.breakfast}
            </div>
          )}
        </div>
        {/* Lunch Timing */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Lunch</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomTimePicker
              label="From"
              value="15:00"
              onChange={(value) => handleTimeChange("lunchFrom", value)}
              format={timeFormat}
              disabled={isLoading}
            />
            <CustomTimePicker
              label="To"
              value="18:00"
              onChange={(value) => handleTimeChange("lunchTo", value)}
              format={timeFormat}
              disabled={isLoading}
            />
          </div>
          {mealTimingErrors.lunch && (
            <div className="text-xs text-red-500">{mealTimingErrors.lunch}</div>
          )}
        </div>
        {/* Dinner Timing */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Dinner</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomTimePicker
              label="From"
              value="19:00"
              onChange={(value) => handleTimeChange("dinnerFrom", value)}
              format={timeFormat}
              disabled={isLoading}
            />
            <CustomTimePicker
              label="To"
              value="21:00"
              onChange={(value) => handleTimeChange("dinnerTo", value)}
              format={timeFormat}
              disabled={isLoading}
            />
          </div>
          {mealTimingErrors.dinner && (
            <div className="text-xs text-red-500">
              {mealTimingErrors.dinner}
            </div>
          )}
        </div>
      </div>

      {/* Turn Over */}
      <div className="space-y-3">
        <Label>Turn Over</Label>
        <RadioGroup
          value={String(formData.turnOverTime)}
          onValueChange={(value) => handleSelectChange("turnOverTime", value)}
          className="flex flex-wrap gap-6"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30" id="30" disabled={isLoading} />
            <Label htmlFor="30">30 minutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="60" id="60" disabled={isLoading} />
            <Label htmlFor="60">60 minutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="90" id="90" disabled={isLoading} />
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
            (adminEmailError && adminEmailError !== "Email Found") ||
            isCheckingEmail ||
            Object.keys(mealTimingErrors).length > 0
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
  );
};

export default LocationForm;
