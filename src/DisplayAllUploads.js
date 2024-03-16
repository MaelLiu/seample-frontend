import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, query, getDocs, where } from "firebase/firestore";
import { Box, Grid, Card, CardMedia, CardContent, Typography, Dialog, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

function DisplayUploadsComponent({ userAccountName }) {
  const [uploads, setUploads] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchUploads = async () => {
      const q = query(collection(db, "uploads"), where("caption", "!=", null));
      const querySnapshot = await getDocs(q);
      const uploadsData = querySnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ensure uploads are sorted if timestamp is available
      setUploads(uploadsData);
    };

    fetchUploads();
    const intervalId = setInterval(() => {
      fetchUploads();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [userAccountName]);

  const handleOpen = (upload) => {
    setSelectedUpload(upload);
    setImageIndex(0); // Ensure the first image is selected
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % selectedUpload.photoURLs.length);
  };

  const handlePrev = () => {
    setImageIndex((prevIndex) => (prevIndex - 1 + selectedUpload.photoURLs.length) % selectedUpload.photoURLs.length);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {uploads.map((upload) => ( // Ensure only up to 3 uploads are shown
          <Grid item xs={12} sm={6} md={4} key={upload.id} onClick={() => handleOpen(upload)}>
            <Card sx={{ maxWidth: 345, cursor: 'pointer' }}>
              <CardMedia
                component="img"
                height="140"
                image={upload.photoURLs[0]} // Assuming the first image as preview
                alt="Upload preview"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {upload.caption}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin Comment: {upload.adminComment || "Not yet commented"}
                </Typography>
                <Typography variant="body2">
                  Rating: {upload.rating || "Not rated"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog onClose={handleClose} open={open} maxWidth="lg">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {selectedUpload && (
          <Box sx={{ position: 'relative', width: 'auto', height: 'auto', padding: 2 }}>
            <img src={selectedUpload.photoURLs[imageIndex]} alt="Upload" style={{ width: '100%', height: 'auto' }} />
            <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '3rem', boxShadow: '2px 2px 10px rgba(0,0,0,1)', backgroundColor: 'black'}}>
              <ArrowBackIosNewIcon sx={{ fontSize: '2rem', color: "white"}}/>
            </IconButton>
            <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '3rem', boxShadow: '2px 2px 10px rgba(0,0,0,1)', backgroundColor: 'black'}}>
              <ArrowForwardIosIcon sx={{ fontSize: '2rem', color: "white"}}/>
            </IconButton>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default DisplayUploadsComponent;
