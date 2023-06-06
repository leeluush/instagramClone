import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useState } from 'react';

const Reels = () => {
  const [reels, setReels] = useState([])
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"

    >
      <Stack direction="row" spacing={2}>
        {reels.map((reels, index) => (
          <Avatar key={index} alt={reels.name} src={reels.profileImage} />
        ))}
      </Stack>
    </Box>
  );
}


export default Reels;

