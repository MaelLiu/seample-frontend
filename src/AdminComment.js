// src/Comment.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // For navigation after submitting a comment

function AdminComment({ userAccountName }) {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUncommentedUploads();
    const intervalId = setInterval(() => {
      fetchUncommentedUploads();
      return () => clearInterval(intervalId);
    }, 5000);
  }, []);

  const fetchUncommentedUploads = async () => {
    const q = query(collection(db, "uploads"), where("adminComment", "==", ""));
    const querySnapshot = await getDocs(q);
    const uploadsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setUploads(uploadsData);
  };

  const handleSubmit = async () => {
    if (!selectedUpload || !comment.trim() || !rating.trim()) return;
    const uploadDocRef = doc(db, "uploads", selectedUpload.id);
    await updateDoc(uploadDocRef, {
      admin: userAccountName,
      adminComment: comment,
      rating: rating
    });

    setComment('');
    setRating('');
    setSelectedUpload(null);
    navigate('/'); // Adjust the path as needed
  };

  return (
    <div>
      <h2>Uncommented Uploads</h2>
      <select onChange={(e) => setSelectedUpload(JSON.parse(e.target.value))} value={JSON.stringify(selectedUpload)}>
        <option value="">Select an Upload</option>
        {uploads.map((upload) => (
          <option key={upload.id} value={JSON.stringify(upload)}>{upload.caption}</option>
        ))}
      </select>
      {selectedUpload && (
        <>
          <textarea placeholder="Write a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <input type="text" placeholder="Rating 1-10" value={rating} onChange={(e) => setRating(e.target.value)} />
          <button onClick={handleSubmit}>Submit Comment</button>
        </>
      )}
    </div>
  );
}

export default AdminComment;
