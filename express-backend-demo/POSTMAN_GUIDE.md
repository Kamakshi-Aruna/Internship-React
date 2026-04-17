# Testing with Postman / Thunder Client

## Start the server first
```bash
cd express-backend-demo
npm install
npm run dev
```

---

## Endpoints to test

### 1. Health Check
- Method: `GET`
- URL: `http://localhost:5000/health`
- Expected: `{ "status": "ok" }`

---

### 2. Get all candidates
- Method: `GET`
- URL: `http://localhost:5000/api/candidates`
- Expected: array of 4 candidates

---

### 3. Filter by stage
- Method: `GET`
- URL: `http://localhost:5000/api/candidates?stage=Interview`
- Expected: only candidates in Interview stage

---

### 4. Get one candidate by ID
- Method: `GET`
- URL: `http://localhost:5000/api/candidates/1`
- Expected: Alice Johnson's data

### 4b. Test 404
- URL: `http://localhost:5000/api/candidates/999`
- Expected: `{ "success": false, "message": "Candidate 999 not found" }`

---

### 5. Add a new candidate (POST)
- Method: `POST`
- URL: `http://localhost:5000/api/candidates`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Eve Turner",
  "role": "React Developer",
  "stage": "Applied",
  "email": "eve@example.com",
  "experience": 4
}
```
- Expected: `{ "success": true, "data": { "id": 5, ... } }`

### 5b. Test validation (missing name)
```json
{ "role": "Designer" }
```
- Expected: `400 Bad Request` — name and role are required

---

### 6. Delete a candidate
- Method: `DELETE`
- URL: `http://localhost:5000/api/candidates/1`
- Expected: `{ "success": true, "message": "Candidate 1 deleted" }`