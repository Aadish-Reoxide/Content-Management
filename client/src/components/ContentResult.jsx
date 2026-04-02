import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { generateContent } from '../api/apiClient';

const ContentResult = ({ platform, tone, content: initialContent }) => {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(initialContent);

  const { mutate: regenerate, isPending: regenerating } = useMutation({
    mutationFn: () => generateContent(platform, tone),
    onMutate: () => {
      toast.loading('Regenerating content...', { id: 'regen' });
    },
    onSuccess: (data) => {
      setContent(data.content);
      toast.success('Fresh content generated!', { id: 'regen', duration: 3000 });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.error || 'Regeneration failed. Is Ollama running?',
        { id: 'regen', duration: 4000 }
      );
    },
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography fontWeight={700} color="text.primary" sx={{ textTransform: 'capitalize' }}>
            {platform} Content
          </Typography>
          {tone && (
            <Typography fontSize={12} color="text.secondary" mt={0.3} sx={{ textTransform: 'capitalize' }}>
              Tone: {tone}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Regenerate */}
          <Button
            size="small"
            variant="outlined"
            startIcon={
              regenerating ? (
                <CircularProgress size={12} sx={{ color: 'inherit' }} />
              ) : (
                <RefreshIcon />
              )
            }
            onClick={() => regenerate()}
            disabled={regenerating}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: 'divider',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: 12,
              '&:hover': {
                borderColor: '#16a34a',
                color: '#16a34a',
                backgroundColor: 'action.hover',
              },
            }}
          >
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>

          {/* Copy */}
          <Button
            size="small"
            variant="outlined"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopy}
            disabled={regenerating}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: copied ? '#16a34a' : 'divider',
              color: copied ? '#16a34a' : 'text.secondary',
              fontWeight: 600,
              fontSize: 12,
              '&:hover': {
                borderColor: '#16a34a',
                backgroundColor: 'action.hover',
              },
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* Content */}
      <Box sx={{ p: 3, position: 'relative' }}>
        {regenerating && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'background.paper',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              borderRadius: '0 0 16px 16px',
            }}
          >
            <CircularProgress sx={{ color: '#16a34a' }} />
          </Box>
        )}
        <Typography
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: 14,
            color: 'text.primary',
            lineHeight: 1.75,
          }}
        >
          {content}
        </Typography>
      </Box>
    </Card>
  );
};

export default ContentResult;