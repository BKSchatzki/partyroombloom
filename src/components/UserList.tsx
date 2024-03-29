import { useState } from 'react';

import {
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { UserFormData } from '../pages/GuestBook';

type UserFormProps = {
  onSubmit: (user: UserFormData) => void;
};

const UserForm = ({ onSubmit }: UserFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, name });
    setEmail('');
    setName('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant={'h2'}
            fontSize={'2rem'}
          >
            Create User
          </Typography>
          <TextField
            label={'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth={true}
          />
          <TextField
            label={'Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth={true}
          />
          <Button
            variant={'contained'}
            type={'submit'}
            sx={{ width: '16rem' }}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default UserForm;
