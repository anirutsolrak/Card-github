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
import axios from 'axios';

const GitHubCard = ({ userData }) => {
  const [flipped, setFlipped] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState(null);

  // Ref para o cartão
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

  // Forçar o reflow do layout antes da animação
  useEffect(() => {
    if (cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      console.log("Largura do cartão:", cardWidth); // Apenas para depuração
    }
  }, [flipped]); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  console.log("userData dentro de GitHubCard:", userData);
  console.log("flipped:", flipped);

  return (
    <div className="cursor-pointer" onClick={() => setFlipped((state) => !state)}>
      {transitions((style) => (
        // Adicionando ref ao cartão e definindo altura fixa
        <animated.div ref={cardRef} style={style} className="w-96 h-[400px] relative"> 
          <Card className="w-full h-full">
            {flipped ? ( 
              <CardContent className="flex flex-col p-4">
                <Typography variant="h6">Verso do Cartão</Typography>
                {/* ... (adicione informações adicionais aqui) */}
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
                  {/* Informações adicionais (commits e estrelas) */}
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
  );
};

export default GitHubCard;