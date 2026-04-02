import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

const TONES = [
  { key: 'professional', label: '👔 Professional', desc: 'Formal & authoritative' },
  { key: 'casual', label: '😊 Casual', desc: 'Friendly & relaxed' },
  { key: 'bold', label: '🔥 Bold', desc: 'Punchy & high energy' },
];

const ToneSelector = ({ selected, onSelect }) => {
  return (
    <Box>
      <Typography fontSize={13} fontWeight={600} color="text.secondary" mb={1.5}>
        Select Tone
      </Typography>
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={(_, val) => val && onSelect(val)}
        sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
      >
        {TONES.map((tone) => (
          <ToggleButton
            key={tone.key}
            value={tone.key}
            sx={{
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              px: 2,
              py: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.3,
              flex: 1,
              textTransform: 'none',
              transition: 'all 0.15s ease',
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                borderColor: '#16a34a !important',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography fontSize={14} fontWeight={700} color="text.primary">
              {tone.label}
            </Typography>
            <Typography fontSize={11} color="text.secondary">
              {tone.desc}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ToneSelector;