import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    label: string;
    onChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange }) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center bg-black/30 hover:bg-black/50 transition cursor-pointer relative">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm">Click to upload or drag & drop</span>
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                />
            </div>
        </div>
    );
};

export default FileUpload;
