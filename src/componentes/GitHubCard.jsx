import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useSpring, animated, useTransition } from 'react-spring';
import {
  Github,
  Linkedin,
  MapPin,
  Book,
  Users,
  UserPlus,
  Business,
  Email,
  Language,
  LocationOn,
  Star,
  Code,
} from '@mui/icons-material';
import axios from 'axios';

const GitHubCard = ({ userData }) => {
  const [flipped, setFlipped] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState(null);

  const transitions = useTransition(flipped, {
    from: { opacity: 0, transform: 'perspective(600px) rotateY(180deg)' },
    enter: { opacity: 1, transform: 'perspective(600px) rotateY(0deg)' },
    leave: { opacity: 0, transform: 'perspective(600px) rotateY(180deg)' },
    config: { mass: 5, tension: 500, friction: 80 },
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

  return (
    <div
      className="cursor-pointer"
      onClick={() => setFlipped((state) => !state)}
    >
      {userData ? (
        transitions((style, item) =>
          item ? (
            <animated.div style={style} className="fade-in">
              <Card className="w-96 h-auto relative">
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
                          <Business fontSize="small" className="mr-2" />
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
                          <Email fontSize="small" className="mr-2" />
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
                          <Language fontSize="small" className="mr-2" />
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
                          <LocationOn fontSize="small" className="mr-2" />
                          {userData.location}
                        </Typography>
                      </Grid>
                    )}
                    {userData.public_repos > 0 && (
                      <Grid item xs={12} md={4}>
                        <Chip
                          icon={<Book fontSize="small" />}
                          label={`${userData.public_repos} Repositórios`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid>
                    )}
                    {userData.followers > 0 && (
                      <Grid item xs={12} md={4}>
                        <Chip
                          icon={<Users fontSize="small" />}
                          label={`${userData.followers} Seguidores`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid>
                    )}
                    {userData.following > 0 && (
                      <Grid item xs={12} md={4}>
                        <Chip
                          icon={<UserPlus fontSize="small" />}
                          label={`${userData.following} Seguindo`}
                          variant="outlined"
                          className="w-full"
                        />
                      </Grid>
                    )}
                    {/* Informações adicionais (commits e estrelas) */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                      >
                        <Code fontSize="small" className="mr-2" />
                        Criado em: {formatDate(userData.created_at)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                      >
                        <Star fontSize="small" className="mr-2" />
                        Atualizado em: {formatDate(userData.updated_at)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* ... (código para exibir repositórios, se necessário) */}
                </CardContent>
              </Card>
            </animated.div>
          ) : null
        )
      ) : (
        <div>Carregando dados do usuário...</div>
      )}
    </div>
  );
};

export default GitHubCard;