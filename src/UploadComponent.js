import React, { useState } from 'react';
import { storage, db } from './firebase-config';
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { Button, TextField, Box, CircularProgress, Typography } from '@mui/material';
import Axios from 'axios';

const integration_url = "https://hook.eu2.make.com/wrtswsezv9nshwpugfkaibx6x7iahscm";
const headers = {
  "Content-Type": "application/json",
  "Custom-Header": "CustomValue",
};

function UploadComponent({ userAccountName, userEmail, onUploadSuccess }) {
  // function UploadComponent({ userAccountName, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  let pic_id = 0;

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !caption) return;
    setUploading(true);

    const uploads = files.map(async (file) => {
      const nowTime = new Date();
      const timestamp = `${nowTime.getFullYear()}${(nowTime.getMonth() + 1).toString().padStart(2, '0')}${nowTime.getDate().toString().padStart(2, '0')}${nowTime.getHours().toString().padStart(2, '0')}${nowTime.getMinutes().toString().padStart(2, '0')}${nowTime.getSeconds().toString().padStart(2, '0')}${pic_id}`;
      const fileRef = ref(storage, `uploads/${userAccountName}/${timestamp}_${file.name}`);
      pic_id = pic_id + 1;
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    Promise.all(uploads).then(async (urls) => {
      await addDoc(collection(db, "uploads"), {
        userAccountName,
        caption,
        photoURLs: urls,
        timestamp: new Date().toISOString(),
        adminComment: "",
      });
      if (onUploadSuccess){onUploadSuccess();}
      pic_id = 0;
      try {
        const response = await Axios.post(integration_url + `?email=${userEmail}`, {
          method: 'POST',
          headers: headers,
        });
        if (response.ok) {
          console.log("Request sent successfully!");
        } else {
          console.error(`Failed to send request. Status code: ${response.status_code}, Response: ${await response.text()}`);
        }
      } catch (error) {
        console.error("Error sending request:", error);
      }
      setUploading(false);
      setFiles([]);
      setCaption('');
    });
  };

  return (
    <Box sx={{ '& > *': { m: 1 }, width: '100%', maxWidth: 500, textAlign: 'center' }}>
      <Typography variant="body1">選擇複數檔案上傳</Typography>
      <TextField
        type="file"
        inputProps={{ multiple: true }}
        onChange={handleFileChange}
        disabled={uploading}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="評論"
        variant="outlined"
        fullWidth
        value={caption}
        onChange={handleCaptionChange}
        placeholder="撰寫觀察評論（必填）"
        disabled={uploading}
      />
      <Button
        onClick={handleUpload}
        variant="contained"
        disabled={uploading || files.length === 0 || !caption}
        startIcon={uploading ? <CircularProgress size={24} /> : null}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </Box>
  );
}

export default UploadComponent;
