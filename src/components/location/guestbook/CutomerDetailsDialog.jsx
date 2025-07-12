import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Api from "@/config/api";
import { useSelector } from "react-redux";

export function CustomerDetailsDialog({ customer, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerType: "",
    allergies: "",
    customerZipCode: "",
  });

    const {
      userData: { locationId },
    } = useSelector((state) => state.auth);

  const customerApi = new Api(`/api/locations/${locationId}`);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, noShow: 0, cancelled: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCustomerDetails() {
      if (!customer) return;
      setLoading(true);
      try {
        const res = await customerApi.get(`/customers/${customer}`);
        console.log(res);
        if (res.success) {
          const c = res.customer;
          setFormData({
            customerName: c.customerName || "",
            customerEmail: c.customerEmail || "",
            customerPhone: c.customerPhone || "",
            customerType: c.customerType || "",
            allergies: c.allergies || "",
            customerZipCode: c.customerZipCode || "",
          });
          setHistory(res.reservationsHistory || []);
          setStats(
            res.reservationDetails || { total: 0, noShow: 0, cancelled: 0 }
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerDetails();
  }, [customer]);

  if (!customer) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-5/6 sm:h-[78vh] pr-3">
          <div className="space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold mb-2">{stats.total}</div>
                <div className="text-sm font-medium">Total Reservations</div>
              </div>
              <div className="text-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold mb-2">{stats.noShow}</div>
                <div className="text-sm font-medium">Total No-Shows</div>
              </div>
              <div className="text-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold mb-2">{stats.cancelled}</div>
                <div className="text-sm font-medium">Total Cancellation</div>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6 rounded-lg ">
              <div>
                <Label htmlFor="customerPhone" className="text-sm font-medium">
                  Phone No.
                </Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleInputChange("customerPhone", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerType" className="text-sm font-medium">
                  Tag
                </Label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value) =>
                    handleInputChange("customerType", value)
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="returning">Returning</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="well-spent">Well Spent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* History Section */}
              <h3 className="text-xl font-semibold mb-4">History</h3>
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold">
                        Party Size
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>{record.partySize}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "confirmed"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full p-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <FileText className="size-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{formData.notes || "No notes"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full p-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <TriangleAlert className="size-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{formData.allergies || "No allergies"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="rounded-full"
              >
                Download CSV
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
