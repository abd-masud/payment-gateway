"use client";

import { Modal } from "antd";
import { EditUserModalProps } from "@/types/users";
import { useEffect, useId, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import Select, { StylesConfig } from "react-select";

type StatusOption = {
  label: string;
  value: string;
};

export const EditMerchantModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
}) => {
  const instanceId = useId();
  const [merchantId, setMerchantId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("");
  const [userMessage, setUserMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setMerchantId(currentUser.merchant_id);
      setName(currentUser.name);
      setEmail(currentUser.email);
      setContact(currentUser.contact);
      setStatus(currentUser.status);
    }
  }, [currentUser]);

  const statusOptions: StatusOption[] = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleSubmit = async () => {
    if (!currentUser) return;

    if (!name.trim() || !email.trim() || !contact.trim() || !status.trim()) {
      setUserMessage("Fill in all fields");
      setTimeout(() => setUserMessage(null), 5000);
      return;
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setUserMessage("Invalid email address");
    //   setTimeout(() => setUserMessage(null), 5000);
    //   return;
    // }
    // if (contact.length !== 11) {
    //   setUserMessage("Contact number must be 11 digits");
    //   setTimeout(() => setUserMessage(null), 5000);
    //   return;
    // }

    try {
      const updatedSupplier = {
        ...currentUser,
        merchantId,
        name,
        email,
        contact,
        status,
      };

      await onSave(updatedSupplier);
    } catch (err) {
      console.error(err);
      setUserMessage("Failed to update supplier");
    } finally {
      setTimeout(() => setUserMessage(null), 5000);
    }
  };

  const handleCloseMessage = () => {
    setUserMessage(null);
  };

  const handleSelectChange = (selected: StatusOption | null) => {
    setStatus(selected?.value || "");
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
    <Modal open={isOpen} onOk={handleSubmit} onCancel={onClose} okText="Save">
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
      <div className="flex items-center pb-3">
        <div className="h-2 w-2 bg-[#307EF3] rounded-full mr-2"></div>
        <h2 className="text-[13px] font-[500]">Edit Merchant</h2>
      </div>
      <div className="mb-2">
        <label className="text-[14px]" htmlFor="merchant_id">
          Merchant ID
        </label>
        <input
          placeholder="Enter supplier id"
          className="border text-[14px] py-3 px-[10px] w-full bg-gray-300 text-gray-500 hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
          type="text"
          id="merchant_id"
          value={merchantId}
          readOnly
        />
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
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
            value={contact}
            minLength={11}
            maxLength={11}
            onChange={(e) => setContact(e.target.value)}
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
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-[14px]" htmlFor="status">
            Status
          </label>
          <Select
            instanceId={`${instanceId}-status`}
            inputId="status"
            className="mt-2"
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value == status.trim())}
            onChange={handleSelectChange}
            placeholder="Select Status"
            styles={generalSelectStyles}
            isClearable
            required
          />
        </div>
      </div>
    </Modal>
  );
};
