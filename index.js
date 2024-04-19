const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
const initialData = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const writeToDatabase = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};


const validateRequiredFields = (req, res, next) => {
  const requiredFields = ['title', 'author', 'genre', 'description', 'price'];
  const missingFields = requiredFields.filter(field => !(field in req.body));
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }
  next();
};


app.post('/api/addBook', validateRequiredFields, (req, res) => {
  const newBook = {
    id: initialData.books.length + 1,
    ...req.body,
  };
  initialData.books.push(newBook);
  writeToDatabase(initialData);
  res.status(201).json({
    success: true,
    message: 'Book added successfully.',
    book: newBook,
  });
});


app.get('/api/getBooks', (req, res) => {
  let books = [...initialData.books];

  
  if (req.query.genre) {
    books = books.filter(book => book.genre.toLowerCase() === req.query.genre.toLowerCase());
  }

 
  if (req.query.sortBy === 'price') {
    if (req.query.sortOrder === 'asc') {
      books.sort((a, b) => a.price - b.price);
    } else if (req.query.sortOrder === 'desc') {
      books.sort((a, b) => b.price - a.price);
    }
  }

  res.status(200).json(books);
});


app.delete('/api/deleteBook/:id', (req, res) => {
  const bookIndex = initialData.books.findIndex(book => book.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found.',
    });
  }
  initialData.books.splice(bookIndex, 1);
  writeToDatabase(initialData);
  res.status(200).json({
    success: true,
    message: 'Book deleted successfully.',
  });
});


app.patch('/api/editBook/:id', (req, res) => {
  const bookIndex = initialData.books.findIndex(book => book.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found.',
    });
  }
  initialData.books[bookIndex] = {
    ...initialData.books[bookIndex],
    ...req.body,
  };
  writeToDatabase(initialData);
  res.status(200).json({
    success: true,
    message: 'Book updated successfully.',
    book: initialData.books[bookIndex],
  });
});

module.exports = app;
