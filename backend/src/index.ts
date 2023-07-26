import express from 'express';
// const dotenv = require('dotenv');

// dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
