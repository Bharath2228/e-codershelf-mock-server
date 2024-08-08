import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";

const server = express();

// CORS Middleware
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// JSON Server Setup
const router = jsonServer.router('./data/db.json');
server.db = router.db;

const middlewares = jsonServer.defaults();
const rules = auth.rewriter({
    products: 444,
    featured_products: 444,
    order: 660,
    users: 600,
});

// Custom Routes
server.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newUser = { id: Date.now(), username, password, email };
    server.db.get('users').push(newUser).write();
    res.status(201).json(newUser);
});

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = server.db.get('users').find({ username, password }).value();
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Simple example, return the user data
    res.json({ user });
});

// Apply Middlewares and Routes
server.use(middlewares);
server.use(rules);
server.use(auth);
server.use('/api', router);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
});
