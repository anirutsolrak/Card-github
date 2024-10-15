import { useState } from 'react';
import GitHubCard from './componentes/GitHubCard'; // Importe o componente GitHubCard
import styled from 'styled-components';
import { Alert, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
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
    <Container>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />

      <Button
        onClick={fetchUserData}
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

      {userData && (
        <GitHubCard userData={userData} />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid white;
  height: 100svh;
  gap: 20px;
  color: #FFFFFF;

  @media screen and (min-width: 638px)
  {
    min-width: 60%;
  }
`

const Input = styled.input`
  padding: 5px;
`

/*
const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
`

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
` */