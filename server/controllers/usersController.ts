import connectPrisma from '../utils/connectPrisma';

const prisma = connectPrisma();

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  },
  createUser: async (req, res) => {
    try {
      const { email, name } = req.body; // Destructure data from request body
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating user' }); // Handle specific errors like duplicate email
    }
  },
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { email, name } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email,
          name,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error updating user' }); // Handle specific errors like duplicate email
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  },
};

export default usersController;
