import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadResume } from '../services/api';

const Uploader = ({ setAnalysisData, setIsLoading, setError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await uploadResume(file);
      setAnalysisData(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to process resume. Please ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`glass-panel uploader animate-fade ${isDragging ? 'dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('resume-upload').click()}
    >
      <UploadCloud className="upload-icon" />
      <h2>Drop your resume here</h2>
      <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>Support for .PDF or .DOCX format</p>
      
      <input 
        type="file" 
        id="resume-upload" 
        className="file-input" 
        accept=".pdf,.docx" 
        onChange={onChange}
      />
      
      <button className="upload-btn">Browse Files</button>
    </div>
  );
};

export default Uploader;
