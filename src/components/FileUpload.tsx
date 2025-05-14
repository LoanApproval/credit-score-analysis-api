
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  isLoading,
  accept = ".csv",
  maxSize = 10, // 10MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size exceeds the maximum limit of ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    onFileSelected(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`file-upload-area flex flex-col items-center justify-center ${
            isDragging ? "active" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept={accept}
            disabled={isLoading}
          />
          
          <UploadCloud
            className={`h-12 w-12 mb-4 ${
              isDragging ? "text-primary" : "text-muted-foreground"
            }`}
          />
          
          {fileName ? (
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Selected file:</p>
              <p className="text-primary font-semibold mb-4">{fileName}</p>
              {isLoading ? (
                <div className="flex justify-center space-x-1 mt-2">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="mt-2">
                  Change File
                </Button>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-1">
                Drag & Drop your CSV file
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center space-x-1">
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                  </div>
                ) : (
                  "Select CSV File"
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
