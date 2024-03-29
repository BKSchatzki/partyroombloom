import {
  useEffect,
  useState,
} from 'react';

import { Container } from '@mui/material';

import UserList from '../components/UserForm';
import UserForm from '../components/UserList';

type User = {
  id: string;
  email: string;
  name: string;
};

export type UserFormData = {
  email: string;
  name: string;
};

const GuestBook = () => {
  const [users, setUsers] = useState<User[]>([]);

  const serverUrl = import.meta.env.SERVER_URL || 'http://localhost:9876';

  const getUsers = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/users`);
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.error(`Error fetching users: ${error}`);
    }
  };

  useEffect(() => {
    getUsers();
  });

  const addUser = async (newUser: UserFormData) => {
    try {
      const response = await fetch(`${serverUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error(`Error creating user: ${response.statusText}`);
      }
      const createdUser = await response.json();
      setUsers([...users, createdUser]);
    } catch (error) {
      console.error(`Error creating user: ${error}`);
    }
  };

  return (
    <>
      <Container
        maxWidth={'xs'}
        sx={{ marginTop: '2rem' }}
      >
        <UserForm onSubmit={addUser} />
      </Container>
      <Container
        maxWidth={'sm'}
        sx={{ marginTop: '2rem' }}
      >
        <UserList users={users} />
      </Container>
    </>
  );
};

export default GuestBook;
