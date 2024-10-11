import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';

const UserProfileInput = ({ setUserData, setUsername }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      setUsername(usernameInput);
      const response = await axios.get(`https://api.github.com/users/${usernameInput}`);
      setUserData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Usuário não encontrado');
      } else {
        setError('Erro ao buscar dados do usuário');
      }
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col items-center">
      <TextField
        label="Nome de usuário do GitHub"
        variant="outlined"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        className="mb-2"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Buscar perfil'}
      </Button>
      {error && (
        <Alert severity="error" className="mt-2">
          {error}
        </Alert>
      )}
    </form>
  );
};

export default UserProfileInput;