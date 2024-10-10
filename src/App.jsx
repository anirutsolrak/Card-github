import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import UserProfileInput from './componentes/UserProfileInput';
import GitHubCard from './componentes/GitHubCard';
import axios from 'axios';

// ... (temas existentes)

function App() {
  const [userData, setUserData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');

    if (sharedData) {
      try {
        const { username } = JSON.parse(decodeURIComponent(sharedData));
        fetchUserData(username);
      } catch (error) {
        console.error('Error parsing shared data:', error);
      }
    }
  }, []);

  const fetchUserData = async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching shared user data:', error);
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          Toggle Theme
        </button>
        <UserProfileInput setUserData={setUserData} />
        {userData && <GitHubCard userData={userData} />}
      </div>
    </ThemeProvider>
  );
}

export default App;