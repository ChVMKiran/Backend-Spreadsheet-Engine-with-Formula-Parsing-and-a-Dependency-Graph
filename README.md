# Spreadsheet Engine Backend API

## Overview

This project implements a **backend API for a spreadsheet engine** that supports formulas, dependency tracking, and automatic recalculation of cells.

The system behaves similarly to a simplified spreadsheet application such as Excel or Google Sheets. Each cell can store a raw value or a formula referencing other cells. When a cell changes, all dependent cells are automatically recalculated.

This project demonstrates key concepts such as:

* Expression parsing
* Graph-based dependency tracking
* Circular dependency detection
* Reactive computation
* Error propagation
* Containerized application deployment using Docker

---

# Features

### Cell Value Management

* Store numerical or string values in spreadsheet cells
* Retrieve stored cell values through an API

### Formula Evaluation

Supports formulas beginning with `=` including:

* Integers and floating numbers
* Arithmetic operations (`+`, `-`, `*`, `/`)
* Parentheses for grouping
* Cell references (e.g., `=A1+B1`)

Example:

```
=(10 + 5) * 2
```

Result:

```
30
```

---

### Dependency Tracking

When formulas reference other cells, the engine records dependencies between cells.

Example:

```
C1 = A1 + B1
```

Dependency graph:

```
A1 → C1
B1 → C1
```

When `A1` or `B1` changes, `C1` is automatically recalculated.

---

### Automatic Recalculation

Updating a cell triggers recalculation of all dependent cells.

Example:

```
A1 = 10
B1 = 20
C1 = =A1+B1
```

Result:

```
C1 = 30
```

If `A1` is updated:

```
A1 = 15
```

Then:

```
C1 = 35
```

---

### Error Handling

The engine returns spreadsheet-style error values.

| Error     | Description                  |
| --------- | ---------------------------- |
| `#DIV/0!` | Division by zero             |
| `#REF!`   | Invalid cell reference       |
| `#CYCLE!` | Circular dependency detected |

---

### Error Propagation

Errors propagate through dependent cells.

Example:

```
A1 = 10
B1 = 0
C1 = =A1/B1   → #DIV/0!
D1 = =C1*2    → #DIV/0!
```

---

# Project Architecture

The application follows a modular structure.

```
spreadsheet-engine
│
├── src
│   ├── app.js
│   │
│   ├── routes
│   │   └── cells.js
│   │
│   └── services
│       ├── evaluator.js
│       └── sheetService.js
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

### API Layer

Handles HTTP requests and responses.

File:

```
src/routes/cells.js
```

### Sheet Service

Manages spreadsheet storage and dependency relationships.

File:

```
src/services/sheetService.js
```

### Evaluation Engine

Parses and evaluates formulas safely.

File:

```
src/services/evaluator.js
```

---

# Technology Stack

* **Node.js**
* **Express.js**
* **mathjs** (safe formula evaluation)
* **Docker**
* **Docker Compose**

---

# Installation & Setup

## Prerequisites

Install:

* Node.js
* Docker
* Docker Compose

---

# Running the Project with Docker

The application is fully containerized.

### Step 1: Clone the repository

```
git clone <repository-url>
cd spreadsheet-engine
```

---

### Step 2: Create environment file

Create a `.env` file using `.env.example`.

```
API_PORT=8080
```

---

### Step 3: Run the application

```
docker-compose up --build
```

This command will:

* Build the Docker image
* Start the API server
* Run the health check

---

# Health Check

Endpoint:

```
GET /health
```

Response:

```json
{
  "status": "healthy"
}
```

---

# API Endpoints

## Set Cell Value

```
PUT /api/sheets/{sheet_id}/cells/{cell_id}
```

Example:

```
PUT /api/sheets/test_sheet/cells/A1
```

Request Body

```json
{
  "value": 123
}
```

Response

```json
{
  "value": 123
}
```

---

## Set Formula

Example request:

```
PUT /api/sheets/test_sheet/cells/C1
```

Body

```json
{
  "value": "=A1+B1"
}
```

Response

```json
{
  "value": 30
}
```

---

## Get Cell Value

```
GET /api/sheets/{sheet_id}/cells/{cell_id}
```

Example:

```
GET /api/sheets/test_sheet/cells/A1
```

Response

```json
{
  "value": 123
}
```

If the cell does not exist:

```
404 Not Found
```

---

# Example Usage

### Set initial values

```
PUT /cells/A1 → 10
PUT /cells/B1 → 20
```

### Create formula

```
PUT /cells/C1 → =A1+B1
```

Result

```
C1 = 30
```

### Update dependency

```
PUT /cells/A1 → 15
```

Updated result

```
C1 = 35
```

---

# Circular Dependency Example

```
A1 = =B1
B1 = =A1
```

Result:

```
#CYCLE!
```

---

# Limitations

This implementation intentionally excludes:

* Range functions (`SUM(A1:A5)`)
* Spreadsheet functions (`AVERAGE`, `COUNT`)
* Persistent storage

All spreadsheet data is stored **in memory**.

---

# Testing

You can test the API using:

* Postman
* curl
* REST clients

Example:

```
curl http://localhost:8080/health
```

---

# Future Improvements

Possible enhancements:

* Implement true DAG-based topological sorting
* Add spreadsheet functions (SUM, AVG)
* Support cell ranges
* Add persistent database storage
* Implement batch updates

---

# Author

Developed as part of a backend systems project focused on **graph-based computation and spreadsheet engine design**.
