const express = require('express');
const app = express();
const PORT = 3001;

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Simple server running on http://127.0.0.1:${PORT}`);
});