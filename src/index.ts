import Bot from './bot';
new Bot()

import * as express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.json({ app: "working"})
})

app.listen( process.env.PORT || 4000)