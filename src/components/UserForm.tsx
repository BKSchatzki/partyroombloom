import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';

type User = {
  id: string;
  email: string;
  name: string;
};

type UserListProps = {
  users: User[];
};

const UserList = ({ users }: UserListProps) => {
  return (
    <List>
      {users.map((user, index) => (
        <ListItem key={index}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={6}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>{user.email}</Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <Typography sx={{ textAlign: 'end' }}>{user.name}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
