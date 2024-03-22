// src/HomePage.js
import React from 'react';
import UploadComponent from './UploadComponent';
import DisplayUploadsComponent from './DisplayUploadsComponent';
import DisplayAllUploads from './DisplayAllUploads'
import AdminComment from './AdminComment';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // If you're using react-router for navigation
// import Axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

function HomePage() {
  const navigate = useNavigate();
  const { userAccountName, userRole, userEmail } = useAuth();
  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...');

    // Redirect to login page or do other cleanup
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hi, {userAccountName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {userRole === 'teacher' && <UploadComponent userAccountName={userAccountName} userEmail={userEmail}/>}
      {/* {userRole === 'teacher' && <UploadComponent userAccountName={userAccountName}/>} */}
      {userRole === 'teacher' && <DisplayUploadsComponent userAccountName={userAccountName}/>}
      {userRole === 'admin' && <AdminComment userAccountName={userAccountName}/>}
      {userRole === 'admin' && <DisplayAllUploads userAccountName={userAccountName}/>}
      
    </div>
  );
}

export default HomePage;
