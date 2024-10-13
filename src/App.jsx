import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, CircularProgress, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null)

  const fetchUserData = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError(null);

    setLoading(true)
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
      setLoading(false)
    }
  };

  const [loading, setLoading] = useState(false);

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
        > {loading ? <CircularProgress size={24}/> : 'Buscar perfil'}
      </Button>

      {error && (
        <Alert severity="error" className="mt-2">
          {error}
        </Alert>
      )}

      {userData && (
        <Card>
          <Avatar src={userData.avatar_url} alt={userData.name} />
          <h2>{userData.name}</h2>
          <p>{userData.bio}</p>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>localização: {userData.location}</p>
          <EmailIcon fontSize="small" className="mr-2" />
          email: {userData.email}

          <LocationOnIcon fontSize="small" className="mr-2" />
          {userData.location}
        </Card>
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
  @media screen and (min-width: 638px)
  {
    width: 50%;  
  }
`

const Input = styled.input`
  padding: 5px;
`

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  color: white;
`

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`