import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import { Share } from '@mui/icons-material';

const ShareButton = ({ userData }) => {
  const [open, setOpen] = useState(false);

  const handleShare = () => {
    const shareData = {
      username: userData.login,
      timestamp: new Date().toISOString()
    };

    const shareUrl = `${window.location.origin}/share?data=${encodeURIComponent(JSON.stringify(shareData))}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setOpen(true);
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Share />}
        onClick={handleShare}
      >
        Compartilhar
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Link copiado para a área de transferência!"
      />
    </>
  );
};

export default ShareButton;