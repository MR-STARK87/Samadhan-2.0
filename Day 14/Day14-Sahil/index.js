

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

const JWT_SECRET = 'your-super-secret-and-strong-key-12345';

app.use(express.json());

const users = [];


app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

       
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        
        
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists." });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = {
            id: users.length + 1, 
            username: username,
            password: hashedPassword,
        };
        users.push(newUser);

        console.log('Users in "DB":', users);

        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "An error occurred on the server." });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        
        const user = users.find(u => u.username === username);
        if (!user) {
            
            return res.status(401).json({ message: "Invalid credentials." });
        }

        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const payload = {
            id: user.id,
            username: user.username,
        };

        
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            message: "Login successful!",
            token: token,
        });

    } catch (error) {
        res.status(500).json({ message: "An error occurred on the server." });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});