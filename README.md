# Library Management System

## Overview
This **Library Management System** was developed to streamline library operations by enabling users to manage book collections, borrow and return books, and secure access via authentication. It includes advanced features such as role-based access control, data validation, and centralized error handling.

### Key Features
- **Authentication and Authorization**: Implemented role-based access control (admin and user) using JWT tokens. Only authenticated admins can create, update, or delete books, while authenticated users can view and borrow books. Expired tokens prompt re-authentication.
- **Custom Pipes**: Created custom validation pipes for data sanitization and validation on DTOs, such as `GenreValidationPipe`, `PaginationPipe`, and `HashPasswordPipe`.
- **Custom Exception Filters**: Defined `CustomNotFoundException` and other global filters to manage errors systematically.
- **Guards**: `VerifyAdminGuard` ensures only admins can modify book data.
- **Interceptor**: `VerifyJwtInterceptor` to verify user jwt before borrow or returning a book
- **MONGO DB** : implemented two schemas models For user and other for books 
- **API Testing**: All endpoints were tested with Postman, and Jest testing is underway.

## Development Timeline

- **Day 3**: Implemented core features, including user registration, book creation, updates, and borrow/return functionalities.
- **Day 4-6**: Enhanced the system with custom validation pipes,custom exception handling, global filters, and pagination for book listings.EndPoints testing with Postman, unit test with jest (working on it)

---

## API Endpoints


### **Authentication**

1. **Register a User**
   - **URL**: `http://localhost:3000/api/auth/registerUser`
   - **Method**: `POST`
   - **Description**: Registers a new user.
    - **Request Body**:
     ```json
     {
       "firstName": "Ans",
       "lastName": "Qazzafi",
       "email": "ans@gmail.com",
       "password": "11111111",
       "role": "role", // default are user
      
     }
     ```

2. **Login**
   - **URL**: `http://localhost:3000/api/auth/login`
   - **Method**: `POST`
   - **Description**: Authenticates a user and returns a JWT tokens and save them in cookies for refreshing or verify.
    - **Request Body**:
     ```json
     {
       "email": "ans@gmail.com",
       "password": "11111111",
     }

3. **Refresh Token**
   - **URL**: `http://localhost:3000/api/auth/refresh-token`
   - **Method**: `GET`
   - **Description**: Get token from cookies and verify it if expired then Issues a new token upon expiry of the previous one.


### **Books Management**

1. **Create a Book** (Admin Only)
   - **URL**: `http://localhost:3000/api/books/createBook`
   - **Method**: `POST`
   - **Description**: Creates a new book entry.
   - **Request Body**:
     ```json
     {
       "bookName": "Adventure in Wonderland",
       "bookDescription": "An engaging adventure novel.",
       "authorName": "John Doe",
       "publishedDate": "2022-05-20",
       "genre": "FANTASY", // genre must be from defined Enum
       "numberOfCopiesAvailable": 50
     }
     ```

2. **Update a Book** (Admin Only)
   - **URL**: `http://localhost:3000/api/books/updateBook/:bookid`
   - **Method**: `PUT`
   - **Description**: Updates details of an existing book.
   - **Parameters**: `:id` - Book ID
   - **requestBody**:
   ```json
   {
    "autherName":"Luke"
   }
   ```

3. **Delete a Book** (Admin Only)
   - **URL**: `http://localhost:3000/api/books/deleteBook/:bookid`
   - **Method**: `DELETE`
   - **Description**: Removes a book from the library.
   - **Parameters**: `:id` - Book ID

4. **List All Books**
   - **URL**: `http://localhost:3000/api/books/list?page=page&limit=limit`
   - **Method**: `GET`
   - **Description**: Fetches a paginated list of books.
   - **Query Parameters**:
     - `page`: Page number
     - `limit`: Number of items per page

5. **Search Book by Name**
   - **URL**: `http://localhost:3000/api/books/findByName?name=:name`
   - **Method**: `GET`
   - **Description**: Finds books by name or partial name.
   - **Query Parameters**: `name` - Book name

6. **Borrow a Book**
   - **URL**: `http://localhost:3000/api/books/borrowBook/:userId/:bookId`
   - **Method**: `POST`
   - **Description**: Allows a user to borrow a book.
   - **Parameters**:
     - `userId`: User ID
     - `bookId`: Book ID

7. **Return a Book**
   - **URL**: `http://localhost:3000/api/books/returnBook/:userId/:bookId`
   - **Method**: `POST`
   - **Description**: Allows a user to return a borrowed book.
   - **Parameters**:
     - `userId`: User ID
     - `bookId`: Book ID

---


---



