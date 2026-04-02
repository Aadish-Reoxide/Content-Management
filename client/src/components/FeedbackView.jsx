import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-hot-toast';
import { getFeedback, downloadFeedback } from '../api/apiClient';

const PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'medium', label: 'Medium', icon: '✍️' },
  { key: 'substack', label: 'Substack', icon: '📬' },
  { key: 'x', label: 'X (Twitter)', icon: '🐦' },
];

const FeedbackView = () => {
  const [platform, setPlatform] = useState('linkedin');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['feedback', platform],
    queryFn: () => getFeedback(platform),
    retry: 1,
    staleTime: 0,
  });

  const feedbackList = data?.feedback ?? [];

  const handleDownload = () => {
    toast.success(`Downloading ${platform} feedback report...`, {
      duration: 3000,
      icon: '📥',
    });
    downloadFeedback(platform);
  };

  const handleTabChange = (_, val) => {
    setPlatform(val);
    toast(`Switched to ${val.charAt(0).toUpperCase() + val.slice(1)}`, {
      duration: 1500,
      icon: PLATFORMS.find((p) => p.key === val)?.icon,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            💬 Platform Feedback
          </Typography>
          <Typography fontSize={13} color="text.secondary" mt={0.3}>
            View audience feedback per platform. Download as Word doc.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            backgroundColor: '#16a34a',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '12px',
            px: 3,
            '&:hover': { backgroundColor: '#15803d' },
          }}
        >
          Download as Word
        </Button>
      </Box>

      {/* Platform Tabs */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={platform}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { backgroundColor: '#16a34a' } }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13,
              color: 'text.secondary',
              minHeight: 44,
            },
            '& .Mui-selected': { color: '#16a34a !important' },
          }}
        >
          {PLATFORMS.map((p) => (
            <Tab key={p.key} value={p.key} label={`${p.icon} ${p.label}`} />
          ))}
        </Tabs>
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#16a34a' }} />
        </Box>
      )}

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          Failed to load feedback — {error?.message || 'Is the backend running on port 5000?'}
        </Alert>
      )}

      {/* Empty */}
      {!isLoading && !isError && feedbackList.length === 0 && (
        <Alert severity="warning" sx={{ borderRadius: '12px' }}>
          No feedback found for {platform}.
        </Alert>
      )}

      {/* Feedback Cards */}
      {!isLoading && feedbackList.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {feedbackList.map((item, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '14px',
                backgroundColor: 'background.paper',
                transition: 'box-shadow 0.15s',
                '&:hover': { boxShadow: 3 },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography fontWeight={700} fontSize={14} color="text.primary">
                    {item.user}
                  </Typography>
                  <Chip
                    label={item.date}
                    size="small"
                    sx={{
                      fontSize: 11,
                      backgroundColor: 'action.hover',
                      color: 'text.secondary',
                      height: 22,
                    }}
                  />
                </Box>
                <Typography fontSize={14} color="text.secondary" lineHeight={1.7}>
                  {item.comment}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FeedbackView;