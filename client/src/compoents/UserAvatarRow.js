import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const UserAvatarRow = ({users}) => {
    return (
      <Stack direction="row" spacing={2}>
        {users.map((user, index) => (
          <Avatar key={index} alt={user.name} src={user.profileImage} />
        ))}
      </Stack>
    );
  }


  export default UserAvatarRow;

  