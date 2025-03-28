const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve static files
app.use(express.static('public'));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// API routes would go here (but excluded per requirements)

// Serve Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`n8n clone running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`);
});
