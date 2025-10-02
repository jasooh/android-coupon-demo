"use client";

import { useState } from "react";

// Sample coupon data for demo
const sampleCoupons = [
  {
    id: "save20",
    title: "20% Off Your Next Purchase",
    code: "SAVE20NOW",
    discount: "20%",
    validUntil: "December 31, 2024",
    icon: "%",
    description: "Get 20% off on any purchase over $50",
  },
  {
    id: "freecoffee",
    title: "Free Coffee",
    code: "FREECOFFEE",
    discount: "100%",
    validUntil: "January 15, 2025",
    icon: "☕",
    description: "Complimentary coffee with any pastry purchase",
  },
  {
    id: "lunchdeal",
    title: "Lunch Special",
    code: "LUNCH50",
    discount: "50%",
    validUntil: "February 28, 2025",
    icon: "🍽️",
    description: "50% off lunch items Monday-Friday",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState(sampleCoupons[0]);

  const handleAddToWallet = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Call our backend API to create the wallet pass
      const response = await fetch("/api/wallet/add-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCoupon),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add coupon to wallet");
      }

      if (data.success && data.saveUrl) {
        // Open the Google Wallet save URL
        window.open(data.saveUrl, "_blank");
        setResult(data.message);
      } else {
        setResult(
          "✅ Coupon created successfully! Check your Google Wallet app."
        );
      }
    } catch (error) {
      console.error("Wallet API error:", error);

      // Check if it's a configuration error
      if (error instanceof Error && error.message.includes("not configured")) {
        setResult(
          "⚠️ Google Wallet API not configured. This is a demo - the coupon would be added to your wallet in production."
        );
      } else {
        setResult(
          "❌ Error adding coupon to wallet: " + (error as Error).message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Digital Placemaking
          </h1>
          <h2 className="text-xl text-gray-900 dark:text-white mb-2">
            Android Wallet API Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Testing Coupon Integration
          </p>
        </div>

        {/* Coupon Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
            Choose a Coupon to Test:
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {sampleCoupons.map((coupon) => (
              <button
                key={coupon.id}
                onClick={() => setSelectedCoupon(coupon)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedCoupon.id === coupon.id
                    ? "border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-800 dark:bg-slate-200 rounded-full flex items-center justify-center text-white dark:text-slate-800 text-sm font-bold">
                    {coupon.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {coupon.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {coupon.code}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Coupon Card */}
        <div className="bg-white dark:bg-gray-800 border-2 border-slate-800 dark:border-slate-200 rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 dark:bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white dark:text-slate-800 text-2xl font-bold">
                {selectedCoupon.icon}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {selectedCoupon.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {selectedCoupon.description}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Valid until {selectedCoupon.validUntil}
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 border border-slate-800 dark:border-slate-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Coupon Code:
              </p>
              <p className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
                {selectedCoupon.code}
              </p>
            </div>
          </div>
        </div>

        {/* Add to Wallet Button */}
        <button
          onClick={handleAddToWallet}
          disabled={isLoading}
          className="w-full bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white dark:text-slate-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-slate-800 mr-2"></div>
              Adding to Wallet...
            </div>
          ) : (
            `Add "${selectedCoupon.title}" to Android Wallet`
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-slate-800 dark:border-slate-200">
            <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
              {result}
            </p>
          </div>
        )}

        {/* Testing Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This is a testing interface for Android Wallet API integration.
            <br />
            Open this page on an Android device for full functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
