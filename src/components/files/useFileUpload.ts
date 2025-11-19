import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseFileUploadProps {
  onClose: () => void;
}

/**
 * Hook for file upload logic
 * Handles file selection, removal, upload progress, and upload simulation
 */
export const useFileUpload = ({ onClose }: UseFileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Handle file selection from input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  /**
   * Remove a file from the selected files list
   */
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Handle file upload
   * TODO: Replace with actual API call
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    // TODO: Replace with actual upload API call
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success(`${selectedFiles.length} file(s) uploaded successfully!`);
          setSelectedFiles([]);
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  /**
   * Calculate total size of selected files
   */
  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

  return {
    selectedFiles,
    uploading,
    uploadProgress,
    totalSize,
    handleFileSelect,
    handleRemoveFile,
    handleUpload,
  };
};