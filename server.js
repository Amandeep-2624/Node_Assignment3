const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public')); // Assuming 'users.html' is in the 'public' directory
app.use(express.static('views')); // Assuming 'users.html' is in the 'views' directory

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false }));

// Set the view engine to ejs
app.set('view engine', 'ejs');


// Route to display list of users
app.get('/users', (req, res) => {
    fs.readFile('users.txt', 'utf8', (err, data) => { // Read the users.txt file asynchronously
      if (err) {
        console.error(err); // Log any errors to the console
        return;
      }
      const users = data.split('\n').filter(user => user.trim() !== ''); // Split the file contents by newline and remove any empty lines
      if (users.length === 0) { // If no users found, redirect to the create page
        res.redirect('/create');
        return;
      }
      res.render('users',{users}); // Render the 'users' view with the list of users
    });
  });
  

// Route to display the form to create a new user
app.get('/create', (req, res) => {
    res.sendFile(__dirname + '/views/create.html'); // Send the create.html file as the response
});



// Route to handle form submission to add a new user
app.post('/add', (req, res) => {
    const { userName } = req.body; // Extract the username from the request body
    fs.appendFile('users.txt', userName + '\n', (err) => { // Append the username to the users.txt file
        if (err){
            console.error(err); // Log any errors to the console
            res.status(500).send('Error adding user.'); // Send an error response if there's an error
            }
        else{
            console.log('User added!'); // Log a success message to the console
            res.redirect('/users'); // Redirect to the users page after adding the user
        }
    });
});

// Route to display the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html'); // Send the index.html file as the response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating that the server is running
});
