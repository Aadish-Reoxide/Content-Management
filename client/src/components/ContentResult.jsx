import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Chip,
  TextField,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { generateContent } from '../api/apiClient';
import axios from 'axios';

const BEST_TIMES = {
  linkedin: { times: 'Tue–Thu, 8–10 AM & 12 PM', tip: 'Professionals browse LinkedIn during morning commute and lunch.' },
  medium: { times: 'Mon–Wed, 9–11 AM', tip: 'Readers engage most with long-form content early in the week.' },
  substack: { times: 'Tue & Thu, 7–9 AM', tip: 'Newsletter open rates peak on weekday mornings before work.' },
  x: { times: 'Weekdays, 9 AM & 5–6 PM', tip: 'X engagement spikes during morning scroll and post-work hours.' },
};

const ContentStats = ({ content, platform }) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  const limits = {
    linkedin: { words: 150, label: '150 words recommended' },
    medium: { words: 600, label: '600 words recommended' },
    substack: { words: 400, label: '400 words recommended' },
    x: { chars: 1400, label: '5 tweets × 280 chars' },
  };
  const limit = limits[platform];
  const isX = platform === 'x';
  const isOverLimit = isX ? chars > limit.chars : words > limit.words * 1.2;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        px: 3,
        py: 1.5,
        backgroundColor: 'action.hover',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography fontSize={12} color="text.secondary">
          📝 <strong>{words}</strong> words
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          🔤 <strong>{chars}</strong> characters
        </Typography>
      </Box>
      <Chip
        label={limit.label}
        size="small"
        sx={{
          fontSize: 11,
          height: 22,
          backgroundColor: isOverLimit ? '#fee2e2' : '#dcfce7',
          color: isOverLimit ? '#dc2626' : '#16a34a',
          fontWeight: 600,
        }}
      />
    </Box>
  );
};

const BestTimeCard = ({ platform }) => {
  const info = BEST_TIMES[platform];
  if (!info) return null;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        px: 3,
        py: 2,
        backgroundColor: 'action.hover',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <AccessTimeIcon sx={{ fontSize: 18, color: '#16a34a', mt: 0.2 }} />
      <Box>
        <Typography fontSize={12} fontWeight={700} color="text.primary">
          Best time to post on {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </Typography>
        <Typography fontSize={12} color="#16a34a" fontWeight={600}>{info.times}</Typography>
        <Typography fontSize={11} color="text.secondary" mt={0.3}>{info.tip}</Typography>
      </Box>
    </Box>
  );
};

// Version Timeline
const VersionTimeline = ({ history, currentIndex, onSelect }) => {
  if (history.length <= 1) return null;

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography fontSize={11} fontWeight={600} color="text.secondary" mb={1.2}>
        VERSION HISTORY
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {history.map((_, index) => {
          const isActive = index === currentIndex;
          const label = index === 0 ? 'Original' : `Edit v${index}`;
          return (
            <Tooltip
              key={index}
              title={index === 0 ? 'Original generated content' : `Edit version ${index}`}
              placement="top"
            >
              <Chip
                label={label}
                size="small"
                onClick={() => onSelect(index)}
                sx={{
                  fontSize: 11,
                  height: 24,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: isActive
                    ? index === 0 ? '#dcfce7' : '#dbeafe'
                    : 'action.hover',
                  color: isActive
                    ? index === 0 ? '#16a34a' : '#2563eb'
                    : 'text.secondary',
                  border: '1px solid',
                  borderColor: isActive
                    ? index === 0 ? '#16a34a' : '#2563eb'
                    : 'divider',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: index === 0 ? '#dcfce7' : '#dbeafe',
                    borderColor: index === 0 ? '#16a34a' : '#2563eb',
                  },
                }}
              />
            </Tooltip>
          );
        })}

        {/* Connector line visual */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
          <Typography fontSize={11} color="text.secondary">
            {currentIndex === 0
              ? '← viewing original'
              : `← edit ${currentIndex} of ${history.length - 1}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ContentResult = ({ platform, tone, topic, content: initialContent }) => {
  const [history, setHistory] = useState([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');
  const [showEditBar, setShowEditBar] = useState(false);

  const content = history[historyIndex];
  const versionLabel = historyIndex === 0 ? 'Original' : `Edit v${historyIndex}`;

  const pushToHistory = (newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const { mutate: regenerate, isPending: regenerating } = useMutation({
    mutationFn: () => generateContent(platform, tone, topic),
    onMutate: () => toast.loading('Regenerating content...', { id: 'regen' }),
    onSuccess: (data) => {
      setHistory([data.content]);
      setHistoryIndex(0);
      setShowEditBar(false);
      toast.success('Fresh content generated!', { id: 'regen', duration: 3000 });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Regeneration failed.', { id: 'regen', duration: 4000 });
    },
  });

  const { mutate: requestEdit, isPending: editing } = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/content/edit', {
        platform,
        tone,
        original: content,
        instruction: editInstruction,
      });
      return res.data;
    },
    onMutate: () => toast.loading('AI is applying edit...', { id: 'edit' }),
    onSuccess: (data) => {
      pushToHistory(data.content);
      setEditInstruction('');
      toast.success('Edit applied! Keep refining or pick a version below.', {
        id: 'edit',
        duration: 3000,
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Edit failed.', { id: 'edit', duration: 4000 });
    },
  });

  const handleEditSubmit = () => {
    if (!editInstruction.trim()) return;
    requestEdit();
  };

  const isWorking = regenerating || editing;

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight={700} color="text.primary" sx={{ textTransform: 'capitalize' }}>
              {platform} Content
            </Typography>
            <Chip
              label={versionLabel}
              size="small"
              sx={{
                fontSize: 10,
                height: 20,
                backgroundColor: historyIndex === 0 ? '#dcfce7' : '#dbeafe',
                color: historyIndex === 0 ? '#16a34a' : '#2563eb',
                fontWeight: 700,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            {tone && (
              <Typography fontSize={12} color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                Tone: {tone}
              </Typography>
            )}
            {topic && (
              <Typography fontSize={12} color="text.secondary">
                · Topic: {topic.length > 40 ? topic.slice(0, 40) + '...' : topic}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={regenerating ? <CircularProgress size={12} sx={{ color: 'inherit' }} /> : <RefreshIcon />}
            onClick={() => regenerate()}
            disabled={isWorking}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: 'divider',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: 12,
              '&:hover': { borderColor: '#16a34a', color: '#16a34a', backgroundColor: 'action.hover' },
            }}
          >
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setShowEditBar((prev) => !prev)}
            disabled={isWorking}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: showEditBar ? '#16a34a' : 'divider',
              color: showEditBar ? '#16a34a' : 'text.secondary',
              fontWeight: 600,
              fontSize: 12,
              '&:hover': { borderColor: '#16a34a', color: '#16a34a', backgroundColor: 'action.hover' },
            }}
          >
            Edit with AI
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopy}
            disabled={isWorking}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: copied ? '#16a34a' : 'divider',
              color: copied ? '#16a34a' : 'text.secondary',
              fontWeight: 600,
              fontSize: 12,
              '&:hover': { borderColor: '#16a34a', backgroundColor: 'action.hover' },
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </Box>
      </Box>

      {/* Edit Bar */}
      {showEditBar && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !editing && handleEditSubmit()}
              placeholder='e.g. "Make it shorter", "Add India stats", "More casual"'
              disabled={editing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontSize: 13,
                  '&.Mui-focused fieldset': { borderColor: '#16a34a' },
                },
              }}
            />
            <Typography fontSize={11} color="text.secondary" mt={0.8}>
              Editing <strong>{versionLabel}</strong>. New edit will be saved as{' '}
              <strong>Edit v{historyIndex + 1}</strong>.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={editing || !editInstruction.trim()}
            sx={{
              backgroundColor: '#16a34a',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              px: 2.5,
              py: 1,
              '&:hover': { backgroundColor: '#15803d' },
              '&.Mui-disabled': { backgroundColor: 'action.disabledBackground' },
            }}
          >
            {editing ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Apply Edit'}
          </Button>
        </Box>
      )}

      <Divider />

      {/* Content */}
      <Box sx={{ p: 3, position: 'relative' }}>
        {isWorking && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'background.paper',
              opacity: 0.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              borderRadius: '8px',
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

      {/* Version Timeline */}
      <VersionTimeline
        history={history}
        currentIndex={historyIndex}
        onSelect={(index) => {
          setHistoryIndex(index);
          toast(`Viewing ${index === 0 ? 'Original' : `Edit v${index}`}`, {
            duration: 1500,
            icon: index === 0 ? '📄' : '✏️',
          });
        }}
      />

      {/* Stats */}
      <ContentStats content={content} platform={platform} />

      {/* Best Time */}
      <BestTimeCard platform={platform} />
    </Card>
  );
};

export default ContentResult;