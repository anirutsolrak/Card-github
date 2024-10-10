import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import UserProfileInput from './componentes/UserProfileInput';
import GitHubCard from './componentes/GitHubCard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#002233',
    },
    secondary: {
      main: '#FF5555',
    },
    background: {
      default: '#000000',
      paper: '#001122',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#800080',
    },
    secondary: {
      main: '#FFC0CB',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F0F0F0',
    },
  },
});

function App() {
  const [userData, setUserData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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