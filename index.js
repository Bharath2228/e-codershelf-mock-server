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

const router = jsonServer.router('./data/db.json');
server.db = router.db;

const middlewares = jsonServer.defaults();
const rules = auth.rewriter({
    products: 444,
    featured_products: 444,
    order: 660,
    users: 600,
});

// Use default middlewares before any custom ones
server.use(middlewares);
server.use(rules);
server.use(auth);
server.use('/api', router);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
});
