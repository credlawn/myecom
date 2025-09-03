"use client";

import { useState } from "react";
import { checkPinData, PincodeData } from "@/lib/checkPinData";
import { motion } from "framer-motion";
import { LocationPinIcon, CloseIcon, LoadingSpinnerIcon, CheckIcon, CashOnDeliveryIcon, AlertIcon, InfoCircleIcon, SearchIcon, EditIcon } from "@/lib/icons";
import { Settings } from "@/myapi/settings";

export default function CheckPin({ settings }: { settings: Settings }) {
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState<PincodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheck = async () => {
    setError("");
    setDelivery(null);

    if (!pincode) {
      setError("Please enter a pincode");
      return;
    }

    setLoading(true);
    try {
      const result = await checkPinData(pincode);
      setDelivery(result);
      setPincode("");
      setIsExpanded(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      {!delivery || !isExpanded ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-300 shadow-sm w-full lg:max-w-sm"
        >
          <div className="flex items-center p-3 gap-2">
            <LocationPinIcon className="h-4 w-4 text-gray-400" />
            <div className="relative flex-grow">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleCheck();
                  }
                }}
                placeholder="Enter delivery pincode"
                className="w-full border-0 px-0 py-0 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                maxLength={6}
              />
              {pincode && (
                <button 
                  onClick={() => setPincode('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              onClick={handleCheck}
              disabled={loading}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
            >
              {loading ? (
                <span className="text-xs">Checking...</span>
              ) : (
                <span>Check</span>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        delivery && isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-lg border border-gray-300 p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-2">
                  <p className="text-base font-medium text-gray-800">
                    Delivery by {delivery.delivery_date}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {delivery.city}, {delivery.state}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-base text-blue-600 hover:text-blue-700 font-medium"
              >
                Change
              </button>
            </div>
            
            {delivery.cod_available && (
              <div className="mt-2 ml-2 flex items-center">
                <CashOnDeliveryIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Cash on Delivery available</span>
              </div>
            )}
            
            {!delivery.serviceable && (
              <div className="mt-2 flex items-center">
                <AlertIcon className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-xs text-red-600">Not serviceable</span>
              </div>
            )}
            
            {delivery.extra_info && (
              <p className="text-xs ml-3 text-gray-600 mt-1 italic">
                <span className="text-red-500 mr-1">*</span>{delivery.extra_info}
              </p>
            )}
          </motion.div>
        )
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 ml-2 text-base font-medium text-red-600"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}