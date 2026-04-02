import { Box, Card, CardActionArea, Typography, Chip } from '@mui/material';

const PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', desc: 'Lead Engine' },
  { key: 'medium', label: 'Medium', icon: '✍️', desc: 'Trust Engine' },
  { key: 'substack', label: 'Substack', icon: '📬', desc: 'Trust Engine' },
  { key: 'x', label: 'X (Twitter)', icon: '🐦', desc: 'Attention Engine' },
];

const PlatformSelector = ({ selected, onSelect }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {PLATFORMS.map((p) => {
        const isSelected = selected === p.key;
        return (
          <Card
            key={p.key}
            elevation={0}
            sx={{
              border: '2px solid',
              borderColor: isSelected ? '#16a34a' : 'divider',
              borderRadius: '14px',
              backgroundColor: isSelected ? 'action.selected' : 'background.paper',
              transition: 'all 0.15s ease',
            }}
          >
            <CardActionArea
              onClick={() => onSelect(p.key)}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography fontSize={28}>{p.icon}</Typography>
              <Typography fontWeight={700} fontSize={14} color="text.primary">
                {p.label}
              </Typography>
              <Typography fontSize={11} color="text.secondary">
                {p.desc}
              </Typography>
              {isSelected && (
                <Chip
                  label="Selected"
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    fontSize: 10,
                    height: 20,
                  }}
                />
              )}
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
};

export default PlatformSelector;