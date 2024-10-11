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
  Grid,
  Divider,
  Button,
} from '@mui/material';
import { useSpring, animated, useTransition } from 'react-spring';
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
import axios from 'axios';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const GitHubCard = ({ userData }) => {
  const [flipped, setFlipped] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState(null);

  const cardRef = useRef(null);

  const transitions = useTransition(flipped, {
    from: { opacity: 0, transform: 'rotateY(180deg)' },
    enter: { opacity: 1, transform: 'rotateY(0deg)' },
    leave: { opacity: 0, transform: 'rotateY(180deg)' },
    config: { mass: 1, tension: 280, friction: 60 },
  });

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

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setFlipped((state) => !state)}>
        {transitions((style) => (
          <animated.div ref={cardRef} style={style} className="w-96 h-[400px] relative">
            <Card className="w-full h-full">
              {flipped ? (
                <CardContent className="flex flex-col p-4">
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
                </CardContent>
              ) : ( 
                <CardContent className="flex flex-col p-4">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Avatar
                        src={userData.avatar_url}
                        alt={userData.login}
                        className="w-24 h-24"
                        sx={{ width: 100, height: 100 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
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
                    </Grid>
                  </Grid>

                  <Divider className="my-4" />

                  <Grid container spacing={2}>
                    {userData.company && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <BusinessIcon fontSize="small" className="mr-2" />
                          {userData.company}
                        </Typography>
                      </Grid>
                    )}
                    {userData.email && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <EmailIcon fontSize="small" className="mr-2" />
                          {userData.email}
                        </Typography>
                      </Grid>
                    )}
                    {userData.blog && (
                      <Grid item xs={12} md={6}>
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
                      </Grid>
                    )}
                    {userData.location && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="flex items-center"
                        >
                          <LocationOnIcon fontSize="small" className="mr-2" />
                          {userData.location}
                        </Typography>
                      </Grid>
                    )}
                    {userData.public_repos > 0 && (
                      <Grid item xs={12} md={4}>
                        <Chip
                          icon={<BookIcon fontSize="small" />}
                          label={`${userData.public_repos} Repositórios`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid>
                    )}
                    {userData.followers > 0 && (
                      <Grid item xs={12} md={4}>
                        <Chip
                          icon={<PeopleIcon fontSize="small" />}
                          label={`${userData.followers} Seguidores`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid>
                    )}
                    {userData.following > 0 && (
                      <Grid item xs={12} md={4}>
                        <Chip
                          icon={<PersonAddIcon fontSize="small" />}
                          label={`${userData.following} Seguindo`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                      >
                        <CodeIcon fontSize="small" className="mr-2" />
                        Criado em: {formatDate(userData.created_at)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                      >
                        <StarIcon fontSize="small" className="mr-2" />
                        Atualizado em: {formatDate(userData.updated_at)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              )} 
            </Card>
          </animated.div>
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={saveCard}
        className="mt-4"
      >
        Salvar Card
      </Button>
    </div>
  );
};

export default GitHubCard;