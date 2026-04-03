import { useState, createContext, useContext, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  createTheme,
  ThemeProvider,
  CssBaseline,
  TextField,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PlatformSelector from './components/PlatformSelector';
import ToneSelector from './components/ToneSelector';
import ContentResult from './components/ContentResult';
import FeedbackView from './components/FeedbackView';
import { generateContent } from './api/apiClient';

const queryClient = new QueryClient();

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

const Generator = () => {
  const [platform, setPlatform] = useState('linkedin');
  const [tone, setTone] = useState('professional');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const toastId = toast.loading('Connecting to Ollama...');
    try {
      setTimeout(() => toast.loading('AI is writing content...', { id: toastId }), 2000);
      const data = await generateContent(platform, tone, topic);
      setResult(data);
      toast.success(
        `${platform.charAt(0).toUpperCase() + platform.slice(1)} content generated!`,
        { id: toastId, duration: 3000 }
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.error || 'Something went wrong. Is Ollama running?',
        { id: toastId, duration: 4000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography variant="h6" fontWeight={800}>
          ⚡ Content Generator
        </Typography>
        <Typography fontSize={13} color="text.secondary" mt={0.3}>
          Select a platform and tone, optionally add a topic, then generate content.
        </Typography>
      </Box>

      {/* Platform Selector */}
      <PlatformSelector selected={platform} onSelect={setPlatform} />

      {/* Tone Selector */}
      <ToneSelector selected={tone} onSelect={setTone} />

      {/* Optional Topic Input */}
      <Box>
        <Typography fontSize={13} fontWeight={600} color="text.secondary" mb={1.5}>
          Topic <span style={{ fontWeight: 400 }}>(optional)</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
          placeholder="e.g. India's carbon market hitting $1B valuation by 2026..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              fontSize: 14,
              '&.Mui-focused fieldset': { borderColor: '#16a34a' },
            },
          }}
        />
        <Typography fontSize={11} color="text.secondary" mt={0.8}>
          Leave blank to generate general Reoxide brand content.
        </Typography>
      </Box>

      {/* Generate Button */}
      <Button
        variant="contained"
        startIcon={loading ? null : <BoltIcon />}
        onClick={handleGenerate}
        disabled={loading}
        fullWidth
        sx={{
          backgroundColor: '#16a34a',
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '12px',
          py: 1.5,
          fontSize: 15,
          '&:hover': { backgroundColor: '#15803d' },
          '&.Mui-disabled': { backgroundColor: 'action.disabledBackground' },
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: '#fff' }} />
        ) : (
          `Generate ${platform.charAt(0).toUpperCase() + platform.slice(1)} Content`
        )}
      </Button>

      {/* Loading message */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography fontWeight={600}>AI is generating content...</Typography>
          <Typography fontSize={13} color="text.secondary" mt={0.5}>
            This may take 30–90 seconds with a local model.
          </Typography>
        </Box>
      )}

      {/* Result */}
      {result && !loading && (
        <ContentResult
          platform={result.platform}
          tone={tone}
          topic={topic}
          content={result.content}
        />
      )}
    </Box>
  );
};

const AppShell = () => {
  const [mode, setMode] = useState(() => localStorage.getItem('colorMode') || 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem('colorMode', next);
          return next;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: { default: '#f9fafb', paper: '#ffffff' },
                text: { primary: '#111827', secondary: '#6b7280' },
              }
            : {
                background: { default: '#0f172a', paper: '#1e293b' },
                text: { primary: '#f1f5f9', secondary: '#94a3b8' },
              }),
          primary: { main: '#16a34a' },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiCard: {
            styleOverrides: { root: { backgroundImage: 'none' } },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: mode === 'dark' ? '#1e293b' : '#ffffff',
              color: mode === 'dark' ? '#f1f5f9' : '#111827',
              border: `1px solid ${mode === 'dark' ? '#334155' : '#e5e7eb'}`,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <BrowserRouter>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar />
            <Box sx={{ maxWidth: '1000px', mx: 'auto', px: { xs: 2, sm: 4 }, py: 4 }}>
              <Routes>
                <Route path="/" element={<Generator />} />
                <Route path="/feedback" element={<FeedbackView />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppShell />
  </QueryClientProvider>
);

export default App;