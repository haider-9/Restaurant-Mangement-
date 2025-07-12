import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { div } from "framer-motion/client";
import { useForm } from "react-hook-form";
import Input from "../../common/Input";
import MainButton from "../../common/buttons/MainButton";
import { useDispatch } from "react-redux";
import { useToast } from "../../common/toast/useToast";
import {
  deleteTenant,
  suspendTenant,
} from "../../../store/slices/super-admin/tenants/tenantSlice";

const DeleteSuspendForm = ({ isOpen, onClose, label, id, fetchTenants }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { toast } = useToast();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log("Tenant :", data);
    console.log("Tenant Submitted for deletion:", id);

    let response;
    if (data.type === "Delete") {
      response = await dispatch(deleteTenant(id));
      fetchTenants();
    } else if (data.type === "Suspend") {
      response = await dispatch(suspendTenant(id));
      fetchTenants();
    } else {
      toast({
        title: "Select at least one type",
        variant: "warning",
      });
    }

    if (response.payload?.success === true) {
      toast({
        title: response.payload?.message,
        variant: "success",
      });

      onClose();
    } else {
      toast({
        title: response.payload?.message,
        variant: "destructive",
      });
      onClose();
    }
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute top-0  left-0 w-svw h-svh">
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              className="fixed inset-0 z-40 bg-black"
              onClick={() => onClose()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ x: "70%" }}
              animate={{ x: 0, opacity: 100 }}
              exit={{ x: "70%", opacity: 0 }}
              transition={{ duration: 0.2 }}
              className=" z-50 h-auto w-full max-w-md bg-white rounded-4xl shadow-lg p-6 overflow-y-auto"
            >
              <div className="mb-5">
                <h2 className="text-lg font-bold text-textPrimary">{label}</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Plan Type */}
                <div className="flex w-full items-center">
                  <label className="w-2/6 text-left text-sm text-textSecondary font-medium">
                    Select Type
                  </label>
                  <div className="flex gap-4">
                    {["Suspend", "Delete"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          value={type}
                          {...register("type", { required: true })}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  {/* {errors.type && <p className="text-red-500 text-xs">Select a type</p>} */}
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {" "}
                    <span className="text-red-500 text-[16px]">* </span>This
                    action is permanent, Deleting / Suspending will delete all
                    associate data. It also block all other users and plan bill.
                  </p>
                </div>

                {/* Submit */}
                <div className="pt-4 mb-3 flex justify-end gap-3">
                  <MainButton
                    onClick={() => {
                      onClose();
                      reset();
                    }}
                    className="bg-gray-600 px-3"
                    radius="rounded-xl"
                  >
                    Cancel
                  </MainButton>
                  <MainButton
                    type="submit"
                    className="px-3"
                    radius="rounded-xl"
                  >
                    Save
                  </MainButton>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteSuspendForm;
