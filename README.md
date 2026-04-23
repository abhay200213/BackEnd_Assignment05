# Backend Assignment 5 API

## Project Overview

This API is a backend service for managing event registrations. It allows users to create, update, retrieve, and delete events while enforcing validation rules and maintaining structured data integrity. Each event includes details such as name, date, capacity, registration count, status, and category.

The project demonstrates real-world backend practices including request validation with Joi, API documentation using OpenAPI (Swagger), and security enhancements using Helmet and CORS. It solves the problem of inconsistent data handling and lack of documentation in APIs by providing a well-structured, secure, and fully documented service.

This API is intended for developers building event-based applications or learning backend API design with Node.js, Express, and TypeScript.

---

## Installation Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- Git

### Clone the Repository

git clone https://github.com/abhay200213/BackEnd_Assignment05.git  
cd BackEnd_Assignment05

### Install Dependencies

npm install

### Environment Variables

Create a `.env` file in the root directory.

Example:

PORT=3000  
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500

(Refer to `.env.example` if provided)

### Start the Server

npm run dev

Server will run at:

http://localhost:3000

---

## API Request Examples

### 1. Create Event

Request:

curl -X POST http://localhost:3000/api/v1/events \
-H "Content-Type: application/json" \
-d '{
"name": "Tech Conference 2026",
"date": "2026-06-15T10:00:00.000Z",
"capacity": 100
}'

Response (201 Created):

{
"message": "Event created",
"data": {
"id": "abc123",
"name": "Tech Conference 2026",
"date": "2026-06-15T10:00:00.000Z",
"capacity": 100,
"registrationCount": 0,
"status": "active",
"category": "general"
}
}

### 2. Get All Events

Request:

curl -X GET http://localhost:3000/api/v1/events

Response (200 OK):

{
"message": "Events retrieved",
"count": 1,
"data": [
{
"id": "abc123",
"name": "Tech Conference 2026",
"date": "2026-06-15T10:00:00.000Z",
"capacity": 100,
"registrationCount": 0,
"status": "active",
"category": "general"
}
]
}

### 3. Update Event

Request:

curl -X PUT http://localhost:3000/api/v1/events/abc123 \
-H "Content-Type: application/json" \
-d '{
"capacity": 120
}'

Response (200 OK):

{
"message": "Event updated",
"data": {
"id": "abc123",
"capacity": 120
}
}

### 4. Delete Event

Request:

curl -X DELETE http://localhost:3000/api/v1/events/abc123

Response (200 OK):

{
"message": "Event deleted"
}

---

## Public API Documentation

Full API documentation is available at:

https://abhay200213.github.io/BackEnd_Assignment05/

---

## Local Documentation Access

When running locally, access Swagger UI at:

http://localhost:3000/api-docs

---

## Features

- RESTful API design  
- Joi validation with detailed error handling  
- OpenAPI (Swagger) documentation  
- Helmet.js security headers  
- Custom CORS configuration  
- Environment-based configuration using dotenv  
- GitHub Pages deployment for API docs  

---

## Author

Abhay Singh