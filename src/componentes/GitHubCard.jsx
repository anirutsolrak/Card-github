import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  Chip,
  CircularProgress,
  Alert,
  Grid2,
  Divider,
  Button,
  TextField,
} from '@mui/material';
import { useSpring, animated } from 'react-spring';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import styled from 'styled-components';
import {CardFrontRight, CardFrontLeft} from '../styles/CardFrontStyled'

// Estilos styled-components
const StyledCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-top: 20px;
  padding: 25px;
  gap: 5px;
  background: #2c3e50;
  display: flex;
  min-width: 500px;
  max-width: 550px;
  min-height: 290px;
`;

const StyledAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const GitHubCard = ({ userData }) => {
  const [flipped, setFlipped] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoadingRepos(true);
      setErrorRepos(null);
      try {
        const response = await axios.get(
          `https://api.github.com/users/${userData.login}/repos?sort=stars&per_page=5`
        );
        setRepos(response.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setErrorRepos('Erro ao carregar repositórios');
      } finally {
        setLoadingRepos(false);
      }
    };

    if (userData && userData.login) {
      fetchRepos();
    }
  }, [userData.login]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const saveCard = async () => {
    if (cardRef.current) {
      // 1. Captura a frente do cartão primeiro:
      const frontCanvas = await html2canvas(cardRef.current, { scale: 2 });

      // 2. Vira para o verso:
      setFlipped(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Captura o verso:
      const backCanvas = await html2canvas(cardRef.current, { scale: 2 });

      // 4. Volta para a frente (opcional, mas recomendado para a interface):
      setFlipped(false);

      const canvas = document.createElement('canvas');
      canvas.width = frontCanvas.width * 2;
      canvas.height = frontCanvas.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(frontCanvas, 0, 0);
        ctx.drawImage(backCanvas, frontCanvas.width, 0);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${userData.login}_github_card.png`);
        }
      });
    }
  };

  const generateEmbedCode = () => {
    const cardWidth = 350; // Ajuste a largura do cartão
    const cardHeight = 400; // Ajuste a altura do cartão

    const embedCode = `<iframe
      src="${window.location.origin}/" 
      width="${cardWidth}" 
      height="${cardHeight}"
      style="border: none; overflow: hidden;"
    ></iframe>`;

    setEmbedCode(embedCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  useEffect(() => {
    generateEmbedCode(); // Gera o código de embed ao carregar o componente
  }, []);

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setFlipped((state) => !state)}>
        <div
          ref={cardRef}
          style={{
            transform: flipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
            transformOrigin: '50% 50%',
          }}
          className="w-96 h-[400px] relative transition-transform duration-500 ease-in-out"
        >
          <StyledCard>
            {flipped ? (
              <div>
                <h6>Verso do card</h6>
              </div>
            ) : (
              <>
                <CardFrontRight>
                  <StyledAvatar src={userData.avatar_url} alt={userData.name}/>
                      <h2>{userData.name || ''}</h2>
                      <h3>
                        <a
                          href={userData.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          >
                          {userData.login}
                        </a>{' '}
                      </h3>
                      {userData.bio && (
                        <span>
                          {userData.bio}
                        </span>
                          
                      )}
                </CardFrontRight>

                <CardFrontLeft>
                  <p>Followers: {userData.followers}</p>
                  <p>Following: {userData.following}</p>
                  <EmailIcon fontSize="small" className="mr-2" />
                  email: {userData.email}
                  <LocationOnIcon fontSize="small" className="mr-2" />
                  {userData.location}
                </CardFrontLeft>
              </>
            )}
          </StyledCard>
        </div>
      </div>

    
    
    
    
    
    
    {/*
      <div className="cursor-pointer" onClick={() => setFlipped((state) => !state)}>
        <animated.div
          ref={cardRef}
          style={{
            transform: flipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
            transformOrigin: '50% 50%', // Define o ponto de rotação no centro
          }}
          className="w-96 h-[400px] relative transition-transform duration-500 ease-in-out"
        >
          <StyledCard className="w-full h-full">
            <CardContent className="flex flex-col p-4">
              {/* Conteúdo que será renderizado no verso *//*}
              {flipped ? (
                <div>
                  <Typography variant="h6">Verso do Cartão</Typography>
                  {loadingRepos ? (
                    <CircularProgress />
                  ) : errorRepos ? (
                    <Alert severity="error">{errorRepos}</Alert>
                  ) : (
                    <div>
                      <Typography variant="subtitle1">Top 5 Repositórios:</Typography>
                      <ul>
                        {repos.map((repo) => (
                          <li key={repo.id}>
                            <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                              {repo.name}
                            </Link>
                            {' - '}
                            <StarIcon fontSize="small" />
                            {repo.stargazers_count}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : ( // Conteúdo que será renderizado na frente
                <div>
                  <Grid2 container spacing={2} alignItems="center">
                    <Grid2 item xs={12} md={3}>
                      <StyledAvatar
                        src={userData.avatar_url}
                        alt={userData.login}
                        className="w-24 h-24"
                      />
                    </Grid2>
                    <Grid2 item xs={12} md={9}>
                      <Typography variant="h6" component="div">
                        <Link
                          href={userData.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {userData.login}
                        </Link>{' '}
                        ({userData.name || ''})
                      </Typography>
                      {userData.bio && (
                        <Typography variant="body2" color="text.secondary">
                          {userData.bio}
                        </Typography>
                      )}
                    </Grid2>
                  </Grid2>

                  <Divider className="my-4" />

                  <Grid2 container spacing={2}>
                    {userData.company && (
                      <Grid2 item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <BusinessIcon fontSize="small" className="mr-2" />
                          {userData.company}
                        </Typography>
                      </Grid2>
                    )}
                    {userData.email && (
                      <Grid2 item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <EmailIcon fontSize="small" className="mr-2" />
                          {userData.email}
                        </Typography>
                      </Grid2>
                    )}
                    {userData.blog && (
                      <Grid2 item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <LanguageIcon fontSize="small" className="mr-2" />
                          <Link
                            href={userData.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {userData.blog}
                          </Link>
                        </Typography>
                      </Grid2>
                    )}
                    {userData.location && (
                      <Grid2 item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <LocationOnIcon fontSize="small" className="mr-2" />
                          {userData.location}
                        </Typography>
                      </Grid2>
                    )}
                    {userData.public_repos > 0 && (
                      <Grid2 item xs={12} md={4}>
                        <Chip
                          icon={<BookIcon fontSize="small" />}
                          label={`${userData.public_repos} Repositórios`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid2>
                    )}
                    {userData.followers > 0 && (
                      <Grid2 item xs={12} md={4}>
                        <Chip
                          icon={<PeopleIcon fontSize="small" />}
                          label={`${userData.followers} Seguidores`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid2>
                    )}
                    {userData.following > 0 && (
                      <Grid2 item xs={12} md={4}>
                        <Chip
                          icon={<PersonAddIcon fontSize="small" />}
                          label={`${userData.following} Seguindo`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid2>
                    )}
                    <Grid2 item xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                      >
                        <CodeIcon fontSize="small" className="mr-2" />
                        Criado em: {formatDate(userData.created_at)}
                      </Typography>
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                      >
                        <StarIcon fontSize="small" className="mr-2" />
                        Atualizado em: {formatDate(userData.updated_at)}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </div>
              )}
            </CardContent>
          </StyledCard>
        </animated.div>
      </div>
      */}

      <div className="flex gap-2 mt-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={saveCard}
        >
          Salvar Card
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ContentCopyIcon />}
          onClick={copyToClipboard}
          disabled={embedCode === ''} // Desabilita se o código não estiver pronto
        >
          Copiar Embed
        </Button>
      </div>

      {copied && (
        <Alert severity="success" className="mt-2">
          Código de embed copiado para a área de transferência!
        </Alert>
      )}
    </div>
  );
};

export default GitHubCard;