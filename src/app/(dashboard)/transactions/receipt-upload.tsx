"use client";
import { useState, useCallback, type ChangeEvent, type DragEvent } from "react";
import {
  Upload,
  Camera,
  DollarSign,
  ShoppingCart,
  Calendar,
  Loader2,
  FileImage,
} from "lucide-react";

type ReceiptItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ReceiptData = {
  storeName: string;
  date: string;
  totalAmount: number;
  items: ReceiptItem[];
};

export default function ReceiptScanner() {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]!);
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]!);
    }
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* Upload Card */}
      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-md">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Upload Receipt
          </h2>

          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-green-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="text-gray-600">
                {isDragging
                  ? "Drop your receipt here"
                  : "Drag & drop your receipt or click to browse"}
              </p>
              <input
                type="file"
                id="receipt-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="receipt-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                <FileImage className="h-4 w-4" />
                Select File
              </label>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
