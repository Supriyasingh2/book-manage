const request = require("supertest");
const fs = require("fs");
const app = require("../index");

const initialData = {
  books: [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      description: "A novel about the American Dream in the Roaring Twenties.",
      price: 15.99,
    },
    {
      id: 2,
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      genre: "Science",
      description:
        "A comedic science fiction series about the misadventures of an unwitting human and his alien friend.",
      price: 12.49,
    },
    {
      id: 3,
      title: "Maus",
      author: "Art Spiegelman",
      genre: "Comic",
      description:
        "A graphic novel recounting the experiences of the author's father during the Holocaust.",
      price: 19.99,
    },
  ],
};

global.score = 1;
beforeAll(() => {
  fs.writeFileSync("db.json", JSON.stringify(initialData));
});

// beforeEach(() => {});

describe("Node-Intermediate-Books-Manager", () => {
  // Test for retrieving all books
  it("should get all books", async () => {
    const response = await request(app).get("/api/getBooks");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(3);
    expect(response.body).toEqual(initialData.books);

    global.score += 2;
  });

  // Test for adding a new book
  it("should add a new book", async () => {
    const newBookData = {
      title: "New Book",
      author: "New Author",
      genre: "Fiction",
      description: "A new book description.",
      price: 25.99,
    };

    const initialBooksLength = 3;

    const response = await request(app)
      .post("/api/addBook")
      .set("Content-Type", "application/json")
      .send(newBookData);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Book added successfully.");

    const addedBook = response.body.book;
    expect(addedBook).toMatchObject(newBookData); // Check if the added book matches the posted object
    expect(addedBook).toHaveProperty("id");

    // Check if the length of the books array in db.json has increased by 1
    const updatedDbData = JSON.parse(fs.readFileSync("db.json", "utf8"));
    expect(updatedDbData.books.length).toBe(initialBooksLength + 1);

    global.score += 2;
  });

  it("should return 400 Bad Request if book has missing fields", async () => {
    const incompleteBookData = {
      title: "Incomplete Book",
      author: "Missing Author",
      // Missing genre, description, and price fields intentionally
    };

    const response = await request(app)
      .post("/api/addBook")
      .send(incompleteBookData);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Missing required fields/);

    global.score += 2;
  });

  // Test for editing a book
  it("should edit a book", async () => {
    addedBookId = 2;
    const response = await request(app)
      .patch(`/api/editBook/${addedBookId}`)
      .send({
        title: "Updated Book Title",
        author: "Updated Author",
        genre: "Science Fiction",
        description: "An updated book description.",
        price: 29.99,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Book updated successfully.");
    expect(response.body.book).toHaveProperty("id", addedBookId);
    expect(response.body.book.title).toBe("Updated Book Title");

    global.score += 2;
  });

  // Test for handling invalid book edit request (book not found)
  it("should handle invalid book edit request", async () => {
    const response = await request(app).patch("/api/editBook/999").send({
      title: "Updated Book Title",
      author: "Updated Author",
      genre: "Science Fiction",
      description: "An updated book description.",
      price: 29.99,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Book not found.");

    global.score += 2;
  });

  // Test for deleting a book
  it("should delete a book", async () => {
    addedBookId = 3;
    const initialBooksLength = 4; // Save initial length of books array

    const response = await request(app).delete(
      `/api/deleteBook/${addedBookId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Book deleted successfully.");

    // Check if the length of the books array in db.json has decreased by 1
    const updatedDbData = JSON.parse(fs.readFileSync("db.json", "utf8"));
    expect(updatedDbData.books.length).toBe(initialBooksLength - 1);

    global.score += 2;
  });

  it("should get books sorted by price in ascending order", async () => {
    const response = await request(app)
      .get("/api/getBooks")
      .query({ sortBy: "price", sortOrder: "asc" });

    const books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        description:
          "A novel about the American Dream in the Roaring Twenties.",
        price: 15.99,
      },
      {
        id: 2,
        title: "Updated Book Title",
        author: "Updated Author",
        genre: "Science Fiction",
        description: "An updated book description.",
        price: 29.99,
      },
      {
        id: 4,
        title: "New Book",
        author: "New Author",
        genre: "Fiction",
        description: "A new book description.",
        price: 25.99,
      },
    ];
    books.sort((a, b) => a.price - b.price);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(books);

    global.score += 2;
  });

  it("should get books sorted by price in descending order", async () => {
    const response = await request(app)
      .get("/api/getBooks")
      .query({ sortBy: "price", sortOrder: "desc" });

    const books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        description:
          "A novel about the American Dream in the Roaring Twenties.",
        price: 15.99,
      },
      {
        id: 2,
        title: "Updated Book Title",
        author: "Updated Author",
        genre: "Science Fiction",
        description: "An updated book description.",
        price: 29.99,
      },
      {
        id: 4,
        title: "New Book",
        author: "New Author",
        genre: "Fiction",
        description: "A new book description.",
        price: 25.99,
      },
    ];
    books.sort((a, b) => b.price - a.price);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(books);

    global.score += 2;
  });

  // Test for filtering books
  it("should get books filtered by genre", async () => {
    const response = await request(app)
      .get("/api/getBooks")
      .query({ genre: "Fiction" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        description:
          "A novel about the American Dream in the Roaring Twenties.",
        price: 15.99,
      },
      {
        id: 4,
        title: "New Book",
        author: "New Author",
        genre: "Fiction",
        description: "A new book description.",
        price: 25.99,
      },
    ]);

    global.score += 2;
  });

  // Test for sorting and filtering books together
  it("should get books filtered and sorted by price in descending order", async () => {
    const response = await request(app)
      .get("/api/getBooks")
      .query({ sortBy: "price", sortOrder: "desc", genre: "Fiction" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // Add your additional assertions based on the expected filtered and sorted books
    global.score += 2;
  });
});

afterAll((done) => {
  done();
  console.log("Final Score is", global.score);
  fs.writeFileSync("db.json", JSON.stringify(initialData));
});
