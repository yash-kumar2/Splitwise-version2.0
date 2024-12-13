import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TextField, Button } from '@mui/material';

const ProfilePage = () => {
  const token = useSelector((state) => state.auth.token); // Get token from redux store
  const BASEURL = 'http://localhost:3000';

  // State for user profile details
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASEURL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in header
          },
        });
        setUser(response.data); // Set the fetched user data to state
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      console.log(user)
      const response = await axios.patch(`${BASEURL}/users/me`, {name:user.name,email:user.email,password:user.password}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Update the user state with the new data
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // Update input values in state
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Page</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleProfileUpdate}
          style={{ marginTop: '20px' }}
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
