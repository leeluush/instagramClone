import { Typography, Avatar } from '@mui/material';


function Comment ({comment}) {
    const {content,userName,profileImage} = comment

    return(
        <div className = "comment">
            <Avatar alt= {userName} src={profileImage}/>
            <div className={"commentDetails"}>
                <Typography variant="body2" component='p'>
                    {content}
                </Typography>
            </div>
            </div>
    )


}

export default Comment;