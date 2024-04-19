<h1 style="color:#18181a">
Node-Intermediate-Books-Manager
</h1>

<h2 style="color:#215dc8">
Maximum Marks: 21
</h2>

```
✅ Able to submit the application - 1 mark (minimum score)
✅ should add a new book - 2 mark
✅ should return 400 Bad Request if the book has missing fields - 2 mark
✅ should edit a book - 2 mark
✅ should handle invalid book edit request - 2 mark
✅ should delete a book - 2 mark
✅ should get books sorted by price in ascending order - 2 mark
✅ should get books sorted by price in descending order - 2 mark
✅ should get books filtered by genre - 2 mark
✅ should get books filtered and sorted by price in descending order - 2 mark
```

Initialize a backend project using the right command for it and create an express application for Books Manager with the following API endpoints:

<h2 style="color:#215dc8">
1. /api/addBook (for adding a book)
</h2>

- **Method:** `POST`
- **Endpoint:** `/api/addBook`
- **Description:** This route is responsible for `adding a new book` to the database in our case which is the `db.json` file.
- **Status Code:** 201(indicating a resource has been created)

#### Sample Request Object

```json
{
  "title": "Maus", // Title of the book
  "author": "Art Spiegelman", // Author of the book
  "genre": "Comic", // Genre categorizing the book
  "description": "A graphic novel recounting the experiences of the author's father during the Holocaust.", // Description providing additional details about the book
  "price": 19.99 // Price of the book
}
```

Implement a validation logic to ensure that all required fields exist in the incoming request object. If any of the required fields are missing, respond with a status code of `400(indicating a Bad Request)`

```json
{
  "success": false,
  "message": `Missing required fields: (missing field separated by coma).`
}
```

If the validation process is successful, proceed to add the book to the database. Send the following response object with a status code of `201(indicating a resource has been created)` upon successful addition:

```json
{
  "success": true,
  "message": "Book added successfully.",
  "book": "(added book object)"
}
```

<h2 style="color:#215dc8">
2. /api/getBooks (for retrieving all books)
</h2>

- **Method:** `GET`
- **Endpoint:** `/api/getBooks`
- **Description:** This route retrieves books from the database (in this case, the `db.json` file).

- **Response:**

  - **Status Code:** 200 (indicating request succeeded)
  - **Body:** Array of books

- Users can fetch books with the option to sort them by price and filter them based on genre.
- If the query includes `{genre: "Fiction"}`, the response will contain all filtered books of the specified genre.
- If the query includes `{sortBy: "price", sortOrder: "asc"}`, the response will include all books sorted by price in ascending order.
- <p style="color:red">Sorting and filtering can be combined, allowing users to retrieve books that are both sorted and filtered simultaneously.</p>

<h2 style="color:#215dc8">
3. /api/deleteBook/:id (for deleting a book)
</h2>

- **Method:** `DELETE`
- **Endpoint:** `/api/deleteBook/:id`
- **Description:** This route deletes a book from the database (in this case, the `db.json` file).
- **Response:**

  - **Status Code:** 200 (indicating request succeeded)
  - **Body:**

  ```json
  {
    "success": true,
    "message": "Book deleted successfully."
  }
  ```

<h2 style="color:#215dc8">
4. /api/editBook/:id (for editing a book)
</h2>

- **Method:** `PATCH`
- **Endpoint:** `/api/editBook/:id`
- **Description:** This route edits a book from the database (in this case, the `db.json` file).
- **Response:**

  - **Status Code:** 200 (indicating request succeeded)
  - **Body:**

  ```json
  {
    "success": true,
    "message": "Book updated successfully.",
    "book": (updated book object),
  }
  ```

<h3 style="color:red">
All the readFile operations should be synchronous.
</h3>

<h3 style="color:red">
Important Points to keep in mind
</h3>

- You don't have to run the server (listen to the server), you just have to export it at the end.
- You are not supposed to use `nodemon` as you are going to export the server.

```
module.exports = app
```

- To test the things locally you might need to run the server, but while testing on CP just comment out the `server.listen()` and just export the server.
- All the file operations are going to be synchronous, this point is very important.

Your solution should be well-organized and easy to understand, with clear and concise comments explaining the logic behind each step.

<h2 style="color:#215dc8">
Installation
</h2>

- Node version v16.16.0 is mandatory to use
- please make sure you do not push package-lock.json

```
npm install

//Complete functions on index.js

// test locally
npm run test
```

<h2 style="color:#215dc8">
Requirements
</h2>

- The code should be written in Node.js.
- Use the built-in modules and external modules that are required.
- Add comments throughout your code to explain the logic behind each step

<h2 style="color:#215dc8">
Evaluation Criteria
</h2>

- Correct implementation of all the routes
- Proper handling of edge cases
- Code readability and organization
- Comments explaining the logic behind each step

<h2 style="color:#215dc8">
General guidelines
</h2>

- The system on cp.masaischool.com may take between 1-20 minutes to respond,
- so we request you to read the problem carefully and debug it before itself
- we also request you not just submit it last minute
- try to keep one submission at a time
