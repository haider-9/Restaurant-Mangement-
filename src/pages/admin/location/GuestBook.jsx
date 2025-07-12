import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import Api from "@/config/api";
import Layout from "@/components/common/Layout";
import { SearchAndFilters } from "@/components/location/guestbook/SearchAndFilter";
import { CustomerTable } from "@/components/location/guestbook/CustomerTable";
import { CustomerDetailsDialog } from "@/components/location/guestbook/CutomerDetailsDialog";

function GuestBook() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");
  const [lastVisitFilter, setLastVisitFilter] = useState("all");
  const [customers, setCustomers] = useState([]);
  
  const {
    userData: { locationId },
  } = useSelector((state) => state.auth);
  
  const customersApi = new Api(`/api/locations/${locationId}`);
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await customersApi.get(`/customers`);
        const data = response?.data || response;
        setCustomers(data.customers || []);
      } catch (error) {
        console.error(error);
        setCustomers([]);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.customerPhone?.includes(searchTerm);

    const matchesClientType =
      clientTypeFilter === "all" || customer.customerType === clientTypeFilter;

    const matchesLastVisit =
      lastVisitFilter === "all" ||
      (lastVisitFilter === "recent" &&
        new Date(customer.lastVisited) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (lastVisitFilter === "old" &&
        new Date(customer.lastVisited) <=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesClientType && matchesLastVisit;
  });

  return (
    <Layout title="Guestbook">
      <div className="p-3 bg-background rounded-3xl border-4 ">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          clientTypeFilter={clientTypeFilter}
          onClientTypeChange={setClientTypeFilter}
          lastVisitFilter={lastVisitFilter}
          onLastVisitChange={setLastVisitFilter}
        />

        <CustomerTable
          customers={filteredCustomers}
          onCustomerSelect={setSelectedCustomer}
          restartPagination={
            !!(
              searchTerm ||
              clientTypeFilter !== "all" ||
              lastVisitFilter !== "all"
            )
          }
        />

        {!!selectedCustomer && (
          <CustomerDetailsDialog
            customer={selectedCustomer}
            open={!!selectedCustomer}
            onOpenChange={(open) => !open && setSelectedCustomer(null)}
          />
        )}
      </div>
    </Layout>
  );
}

export default GuestBook;
