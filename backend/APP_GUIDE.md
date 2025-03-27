# npm install express mssql body-parser cors multer dotenv

# API Guide

This guide provides information on the available API endpoints, including sample requests and payloads.

## Base URL

```
ngrok http --url=outgoing-troll-neatly.ngrok-free.app ${PORT}
```

```
ngrok http --url=outgoing-troll-neatly.ngrok-free.app 3000
```

## Test Query Endpoint

```
POST http://localhost:3000/test
Content-Type: application/json

{
  "query": "SELECT * FROM dbo.Complaint WHERE CONVERT(DATE, created_at) <= CONVERT(DATE, GETDATE())"
}

```

## Endpoints

### 0. Login

POST http://localhost:3000/login
Accept: application/json
Content-Type: application/json

{
"username": "admin",
"password": "password123"
}

### 1. Get All Complaints

**Endpoint:** `GET /complaints`

**Description:** Fetches all complaints from the database.

**Sample Request:**

```bash
curl -X GET http://localhost:3000/complaints
```

**Sample Response:**

```json
[
  {
    "complaint_id": 1,
    "newspaper_name": "Example Newspaper",
    "publication_date": "2023-01-01",
    "issue_category": "Category 1",
    "issue_description": "Description of the issue",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  ...
]
```

### 2. Get Complaint by ID

**Endpoint:** `GET /complaints/:id`

**Description:** Fetches a specific complaint by its ID.

**Sample Request:**

```bash
curl -X GET http://localhost:3000/complaints/1
```

**Sample Response:**

```json
{
  "complaint_id": 1,
  "newspaper_name": "Example Newspaper",
  "publication_date": "2023-01-01",
  "issue_category": "Category 1",
  "issue_description": "Description of the issue",
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### 3. Create a New Complaint

**Endpoint:** `POST /complaints`

**Description:** Inserts a new complaint into the database.

**Sample Request:**

```bash
curl -X POST http://localhost:3000/complaints -H "Content-Type: application/json" -d '{
  "newspaper_name": "Newspaper Name",
  "publication_date": "2023-01-01",
  "issue_category": "Category",
  "issue_description": "Description",
  "created_at": "2023-01-01T00:00:00.000Z"
}'
```

```Http-CLient
POST http://localhost:3000/complaints
Content-Type: application/json

{
"newspaper_name": "EENADU",
"publication_date": "2025-03-25",
"issue_category": "HEALTH",
"issue_description": "Ponds need to be cleaned",
"created_at": "2025-03-25"
}

```

**Sample Response:**

```json
{
  "message": "Complaint inserted successfully"
}
```

### 4. Create a New Resolution

**Endpoint:** `POST /resolutions`

**Description:** Inserts a new resolution into the database.

**Sample Request:**

```bash
curl -X POST http://localhost:3000/resolutions -H "Content-Type: application/json" -d '{
  "complaint_id": 1,
  "status": "Resolved",
  "action_description": "Description of the action taken",
  "resolution_date": "2023-01-02",
  "resolution_proof": "Proof of the resolution"
}'
```

**Sample Response:**

```json
{
  "message": "Resolution inserted successfully"
}
```

### 5. Upload Files

**Endpoint:** `POST /uploads/upload`

**Description:** Uploads files to the server.

**Sample Request:**

```bash
curl -X POST http://localhost:3000/uploads/upload -H "Content-Type: multipart/form-data" -F "files=@path/to/file1" -F "files=@path/to/file2"
```

**Sample Response:**

```json
[
  {
    "url": "http://localhost:3000/uploads/1615467891234_file1.jpg",
    "name": "file1.jpg"
  },
  {
    "url": "http://localhost:3000/uploads/1615467895678_file2.jpg",
    "name": "file2.jpg"
  }
]
```

### 6. Serve Uploaded Files

**Endpoint:** `GET /uploads/:filename`

**Description:** Serves uploaded files.

**Sample Request:**

```bash
curl -X GET http://localhost:3000/uploads/1615467891234_file1.jpg
```

**Sample Response:**

The file will be returned as a binary stream.

---

## Error Handling

All endpoints will return appropriate HTTP status codes and a JSON object with an `error` key if an error occurs.

**Sample Error Response:**

```json
{
  "error": "Error message describing the issue"
}
```

---

## Notes

- Ensure the server is running before making any requests.
- Replace `localhost:3000` with the actual server URL in a production environment.
- Use appropriate HTTP methods (`GET`, `POST`, etc.) as specified for each endpoint.