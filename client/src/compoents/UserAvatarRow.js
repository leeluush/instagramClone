import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const UserAvatarRow = ({users}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
 
    >
      <Stack direction="row" spacing={2}>
        {users.slice(0, 8).map((user, index) => (
          <Avatar key={index} alt={user.name} src={user.profileImage} />
        ))}
      </Stack>
    </Box>
  );
}


  export default UserAvatarRow;

  