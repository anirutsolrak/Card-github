import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  Chip,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { GitHub, Business, Email, Language, LocationOn, Star, Code } from '@mui/icons-material';
import axios from 'axios';
import ShareButton from './ShareButton';

const GitHubCard = ({ userData }) => {
  // ... (código existente)

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
        {/* ... (conteúdo existente) */}
        
        <Divider className="my-4" />

        <Grid container spacing={2}>
          {/* ... (conteúdo existente) */}
        </Grid>

        <div className="mt-4 flex justify-center">
          <ShareButton userData={userData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubCard;