'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

export function HomePage() {
  const router = useRouter();

  const handleCreateApp = () => {
    router.push('/editor');
  };

  return (
    <Box>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Mini App Builder
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Создайте свое Telegram Mini App за считанные минуты
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateApp}
          >
            Создать приложение
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 