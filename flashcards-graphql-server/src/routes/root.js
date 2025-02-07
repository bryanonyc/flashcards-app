import express from 'express';
const rootRouter = express.Router();

rootRouter.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export default rootRouter;
