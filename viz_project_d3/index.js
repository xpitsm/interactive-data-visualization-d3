const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve fonts from the "fonts" directory
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Handle requests for the root URL
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/charts.html', (req, res) => res.sendFile(path.join(__dirname, 'charts.html')));


// Handle requests for character-specific pages
app.get('/HarryPotter', (req, res) => {
  // Send the "harrypotter.html" file
  res.sendFile(path.join(__dirname, 'HarryPotter.html'));
});

app.get('/HermioneGranger', (req, res) => {
    // Send the "harrypotter.html" file
    res.sendFile(path.join(__dirname, 'HermioneGranger.html'));
  });

app.get('/AlbusDumbledore', (req, res) => {
    // Send the "harrypotter.html" file
    res.sendFile(path.join(__dirname, 'AlbusDumbledore.html'));
  });

app.get('/RonWeasley', (req, res) => {
    // Send the "harrypotter.html" file
    res.sendFile(path.join(__dirname, 'RonWeasley.html'));
  });

app.get('/RubeusHagrid', (req, res) => {
    // Send the "harrypotter.html" file
    res.sendFile(path.join(__dirname, 'RubeusHagrid.html'));
  });

app.get('/developmentStats', (req, res) => {
    // Send the "harrypotter.html" file
    res.sendFile(path.join(__dirname, 'developmentStats.html'));
  });


// Start the server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
