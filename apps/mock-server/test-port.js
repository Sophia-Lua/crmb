const express = require('express');
const app = express();
const PORT = 8080;

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World on 8080!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});