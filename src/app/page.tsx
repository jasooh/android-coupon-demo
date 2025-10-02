"use client";

import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAddToWallet = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Check if Android Wallet API is available
      if ("navigator" in window && "serviceWorker" in navigator) {
        // Simulate Android Wallet API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock response for testing
        setResult("✅ Coupon successfully added to Android Wallet!");
      } else {
        setResult("❌ Android Wallet API not available in this environment");
      }
    } catch (error) {
      setResult(
        "❌ Error adding coupon to wallet: " + (error as Error).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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

        {/* Coupon Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">%</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              20% Off Your Next Purchase
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Valid until December 31, 2024
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Coupon Code:
              </p>
              <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                SAVE20NOW
              </p>
            </div>
          </div>
        </div>

        {/* Add to Wallet Button */}
        <button
          onClick={handleAddToWallet}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding to Wallet...
            </div>
          ) : (
            "Add to Android Wallet"
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-center text-sm font-medium">{result}</p>
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
