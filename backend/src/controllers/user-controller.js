import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { hashPassword, withHashedPassword, stripPassword, verifyPassword } from '../utils/password-security.js';
// import { PrismaClient } from '@prisma/client';


// const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'thisismysecret';
import {userSchema, userPatchSchema} from '../validators/schemas.js'

//Create one or more users
export const createUsers = async (req, res) => {
  const user = await prisma.user.create({ data: await withHashedPassword(userSchema.parse(req.body)) });
  res.status(201).json(stripPassword(user));
}
//Get all users
export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  res.json(users.map(stripPassword));
}

// Find a user by id
export const getSingleUser = async (req, res) => {
  const userID = Number(req.params.id );
  const user = await prisma.user.findUnique({ where: { id: userID} });
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json(stripPassword(user));
}

// Update a user
export const updateUser = async (req, res) => {
const userID = Number(req.params.id );
  const user = await prisma.user.update({
    where: { id: userID },
    data: await withHashedPassword(userSchema.parse(req.body))
  });
  res.json(stripPassword(user));
}

//Delete a user
export const deleteUser = async (req, res) => {
  const userID = Number(req.params.id );
  await prisma.user.delete({ where: { id: userID } });
  res.status(204).end();
}
//Edit one or more user details
export const editUser = async (req, res) => {
  const userID = Number(req.params.id );
  const user = await prisma.user.update({
    where: { id: userID },
    data: await withHashedPassword(userPatchSchema.parse(req.body)),
  });
  res.json(stripPassword(user));
}

//New


export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true } // Exclude password
  });
  res.json(users);
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      addresses: true,
      cart: true,
      orders: { select: { id: true, orderNumber: true, status: true, grandTotal: true } }
    }
  });

  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(stripPassword(user));
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  const user = await prisma.user.create({
    data: await withHashedPassword({ name, email, password })
  });
  
  res.status(201).json(stripPassword(user));
};


// User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role = 'USER' } = req.body;

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(409).json({ error: 'Email already registered.' });

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        return res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Failed to register user.' });
    }
};

// User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

        // Compare passwords
        const isPasswordValid = await verifyPassword(
            password,
            user.password,
            (passwordHash) => prisma.user.update({
                where: { id: user.id },
                data: { password: passwordHash }
            })
        );

        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password.' });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' } // Adjust expiration time as needed
        );

        // Optionally, send a welcome email (skip this for now or configure nodemailer)
        // await sendEmail(user.email, 'Welcome!', `Hello ${user.name}, your account is now registered.`);

        return res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Failed to log in.' });
    }
};

// User Logout
export const logoutUser = async (req, res) => {
    try {
        // For a simple JWT approach, you don't need to do much on the server side.
        // Just inform the client to clear their token.

        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ error: 'Failed to log out.' });
    }
};
