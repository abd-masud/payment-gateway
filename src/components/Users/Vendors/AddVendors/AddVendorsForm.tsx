"use client";

import { Modal } from "antd";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Select, { StylesConfig } from "react-select";
import success from "../../../../../public/images/success.webp";

type StatusOption = {
  label: string;
  value: string;
};

type FormValues = {
  vendor_id: string;
  name: string;
  email: string;
  contact: string;
  status: string;
  password: string;
};

export const AddVendorsForm = () => {
  const instanceId = useId();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendor_id, setVendorId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userMessage, setUserMessage] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<FormValues>({
    vendor_id: "",
    name: "",
    email: "",
    contact: "",
    status: "",
    password: "",
  });

  useEffect(() => {
    const generateVendorId = () => {
      const random = Math.floor(100000 + Math.random() * 900000);
      return `VN${random}`;
    };

    setVendorId(generateVendorId());
  }, [user]);

  const statusOptions: StatusOption[] = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formValues,
      vendor_id: vendor_id,
      role: "vendor",
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("This email already exists");
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating employee:", error);
      setUserMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setTimeout(() => setUserMessage(null), 5000);
      setLoading(false);
    }
  };

  const handleOkay = () => {
    setShowSuccessModal(false);
    router.push("/users/vendors");
  };

  const handleCloseMessage = () => {
    setUserMessage(null);
  };

  const handleSelectChange =
    (field: keyof FormValues) => (selected: StatusOption | null) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: selected?.value || "",
      }));
    };

  const generalSelectStyles: StylesConfig<StatusOption, false> = {
    control: (base) => ({
      ...base,
      borderColor: "#E5E7EB",
      "&:hover": {
        borderColor: "#E5E7EB",
      },
      minHeight: "48px",
      fontSize: "14px",
      boxShadow: "none",
      backgroundColor: "#F2F4F7",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected ? "#F2F4F7" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#F2F4F7",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <main className="bg-white p-5 mt-6 rounded-lg border shadow-md">
      {userMessage && (
        <div className="left-1/2 top-10 transform -translate-x-1/2 fixed z-50">
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800 text-red-400 border-2 border-red-400 mx-auto">
            <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {userMessage}
            </div>
            <button
              onClick={handleCloseMessage}
              className="ml-3 focus:outline-none hover:text-red-300"
            >
              <FaXmark className="text-[14px]" />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center pb-5">
        <div className="h-2 w-2 bg-[#1E2639] rounded-full mr-2"></div>
        <h2 className="text-[13px] font-[500]">Add Vendor Form</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="vendor_id">
              Vendor ID
            </label>
            <input
              placeholder="Enter Vendor id"
              className="border text-[14px] py-3 px-[10px] w-full bg-gray-300 text-gray-500 hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              type="text"
              id="vendor_id"
              value={vendor_id}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="name">
              Vendor Name
            </label>
            <input
              placeholder="Enter vendor name"
              maxLength={50}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              type="text"
              id="name"
              value={formValues.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="email">
              Email Address
            </label>
            <input
              placeholder="Enter email address"
              maxLength={50}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              type="email"
              id="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="contact">
              Contact Number
            </label>
            <input
              placeholder="Enter contact number"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="contact"
              value={formValues.contact}
              onChange={handleChange}
              minLength={11}
              maxLength={11}
              required
              onKeyDown={(e) => {
                if (
                  !/[0-9+]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "Tab" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="status">
              Status
            </label>
            <Select
              instanceId={`${instanceId}-status`}
              inputId="status"
              className="mt-2"
              options={statusOptions}
              value={statusOptions.find(
                (opt) => opt.value == formValues.status
              )}
              onChange={handleSelectChange("status")}
              placeholder="Select Status"
              styles={generalSelectStyles}
              isClearable
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="password">
              Password
            </label>
            <input
              placeholder="Enter password"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <input
            className="text-[14px] font-[500] py-2 w-40 rounded cursor-pointer transition-all duration-300 mt-4 text-white bg-[#1E2639] hover:bg-[#1E2639] focus:bg-[#1E2639]"
            type="submit"
            value={`${loading ? "Submitting..." : "Submit"}`}
          />
        </div>
      </form>

      <Modal
        open={showSuccessModal}
        onCancel={handleOkay}
        footer={[
          <button
            key="okay"
            onClick={handleOkay}
            className="text-[14px] font-[500] py-2 w-20 rounded cursor-pointer transition-all duration-300 mt-2 text-white bg-[#1E2639] hover:bg-[#1E2639] focus:bg-[#1E2639]"
          >
            Okay
          </button>,
        ]}
        centered
        width={400}
      >
        <div className="flex flex-col items-center pt-5">
          <Image src={success} alt="Success" width={80} height={80} />
          <h3 className="text-xl font-semibold mt-2">Success!</h3>
          <p className="text-gray-600 text-center">
            Vendor has been added successfully.
          </p>
        </div>
      </Modal>
    </main>
  );
};
