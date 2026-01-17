# Customer Management System API

A production-ready RESTful API built with Spring Boot 4.0.1 for managing customer data with advanced features including pagination, sorting, filtering, and comprehensive validation.

## 🚀 Tech Stack

- **Java 21** - Latest LTS version with modern language features
- **Spring Boot 4.0.1** - Production-grade framework
- **Spring Data JPA** - Database abstraction and ORM
- **MySQL 8.0** - Relational database
- **MapStruct 1.6.3** - Type-safe bean mapping
- **Lombok** - Boilerplate code reduction
- **SpringDoc OpenAPI 3** - API documentation (Swagger UI)
- **Docker** - Containerization and deployment
- **Maven** - Dependency management and build tool

## 📋 Features

### Core Functionality

- **CRUD Operations** - Complete Create, Read, Update, Delete for customer entities
- **Advanced Pagination** - Configurable page size (1-100 records per page)
- **Multi-field Sorting** - Sort by firstName, lastName, email, status, createdAt, updatedAt
- **Bi-directional Ordering** - Ascending and descending sort options
- **Full-text Search** - Search across firstName, lastName, and email fields
- **UUID-based IDs** - Secure, distributed-friendly identifiers

### Data Validation

- Email uniqueness constraint
- Input validation using Jakarta Bean Validation
- Custom error handling with detailed error responses
- Request DTOs with validation annotations

### Architecture & Design

- **Layered Architecture** - Clear separation: Controller → Service → Repository
- **DTO Pattern** - Decoupled request/response models
- **Specification Pattern** - Dynamic query building for complex searches
- **Custom Converters** - Type-safe enum parameter binding
- **Exception Handling** - Global exception handler with proper HTTP status codes
- **CORS Configuration** - Frontend integration ready

## 🏗️ Project Structure

```
src/main/java/com/nuwandev/cms/
├── Main.java                          # Application entry point
├── config/                            # Configuration classes
│   ├── CustomerSortFieldConverter.java
│   ├── SortDirectionConverter.java
│   └── WebConfig.java                 # CORS and converter registration
├── controller/
│   └── CustomerController.java        # REST endpoints
├── domain/
│   └── Customer.java                  # JPA entity with lifecycle callbacks
├── dto/                               # Data Transfer Objects
│   ├── CustomerCreateRequestDto.java
│   ├── CustomerUpdateRequestDto.java
│   ├── CustomerResponseDto.java
│   ├── CustomerPageResponseDto.java
│   └── ErrorResponse.java
├── enums/
│   ├── Status.java                    # ACTIVE, INACTIVE
│   ├── CustomerSortField.java         # Sortable fields enum
│   └── SortDirection.java             # ASC, DESC
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── CustomerNotFoundException.java
│   └── CustomerAlreadyExistsException.java
├── mapper/
│   └── CustomerMapper.java            # MapStruct interface
├── repository/
│   └── CustomerRepository.java        # JPA repository with Specification
├── service/
│   ├── CustomerService.java           # Service interface
│   └── CustomerServiceImpl.java       # Business logic implementation
└── specification/
    └── CustomerSpecification.java     # Dynamic query builder
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:8081/api/v1
```

### Endpoints

#### Get All Customers (Paginated)

```http
GET /customers?page=0&size=10&sort=createdAt&order=asc&search=john
```

**Query Parameters:**

- `page` (default: 0) - Page index (zero-based)
- `size` (default: 10, max: 100) - Records per page
- `sort` (default: createdAt) - Sort field: firstName, lastName, email, status, createdAt, updatedAt
- `order` (default: asc) - Sort direction: asc, desc
- `search` (optional) - Search term for firstName, lastName, email

**Response:**

```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "status": "ACTIVE",
      "createdAt": "2026-01-15T10:30:00",
      "updatedAt": "2026-01-15T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

#### Get Customer by ID

```http
GET /customers/{id}
```

#### Create Customer

```http
POST /customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE"
}
```

#### Update Customer

```http
PUT /customers/{id}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+1234567890",
  "status": "INACTIVE"
}
```

#### Delete Customer

```http
DELETE /customers/{id}
```

## 📊 Database Schema

### Customer Table

```sql
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);
```

## 🛠️ Setup & Installation

### Prerequisites

- Java 21 or higher
- Maven 3.8+
- MySQL 8.0
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd backend/customer-management-system-api
```

2. **Set up MySQL database**

```bash
mysql -u root -p
CREATE DATABASE cms_db;
```

3. **Configure environment variables**

```bash
export DB_NAME=cms_db
export DB_USERNAME=root
export DB_PASSWORD=your_password
export DB_PORT=3306
```

4. **Build the project**

```bash
mvn clean install
```

5. **Run the application**

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at `http://localhost:8081`

### Docker Deployment

1. **Build and run with Docker Compose**

```bash
docker-compose up --build
```

This will start:

- MySQL database on port 3307 (mapped from container port 3306)
- Spring Boot API on port 8081 (mapped from container port 8080)

2. **Verify the services**

```bash
docker ps
```

3. **View logs**

```bash
docker-compose logs -f backend
```

## 📖 API Documentation

### Swagger UI

Once the application is running, access the interactive API documentation:

```
http://localhost:8081/swagger-ui.html
```

### OpenAPI Specification

Raw OpenAPI JSON:

```
http://localhost:8081/v3/api-docs
```

## 🧪 Testing

Run the test suite:

```bash
mvn test
```

## 🔧 Configuration Profiles

### Development Profile (`dev`)

- SQL logging enabled
- Local MySQL connection
- Port: 8081
- Database auto-update

### Docker Profile (`docker`)

- SQL logging disabled
- Container-based MySQL connection
- Port: 8080
- Production-optimized settings

## 🐛 Error Handling

The API uses consistent error responses:

```json
{
  "timestamp": "2026-01-17T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found with id: 550e8400-e29b-41d4-a716-446655440000",
  "path": "/api/v1/customers/550e8400-e29b-41d4-a716-446655440000"
}
```

### HTTP Status Codes

- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors, invalid parameters
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email
- `500 Internal Server Error` - Server errors

## 🚀 Production Considerations

### Security (To Implement)

- Add Spring Security for authentication/authorization
- Implement JWT-based authentication
- Add rate limiting
- Enable HTTPS/TLS

### Monitoring (To Implement)

- Add Spring Boot Actuator for health checks
- Integrate application monitoring (Prometheus, Grafana)
- Add structured logging with ELK stack

### Performance

- Database indexing on email, status, createdAt fields
- Connection pooling configured
- Pagination prevents large data loads

## 📝 Environment Variables

| Variable                 | Description       | Default   | Required |
| ------------------------ | ----------------- | --------- | -------- |
| `DB_HOST`                | Database host     | localhost | No       |
| `DB_PORT`                | Database port     | 3306      | No       |
| `DB_NAME`                | Database name     | cms_db    | Yes      |
| `DB_USERNAME`            | Database user     | root      | Yes      |
| `DB_PASSWORD`            | Database password | -         | Yes      |
| `SPRING_PROFILES_ACTIVE` | Active profile    | dev       | No       |

## 🤝 Contributing

This is a portfolio project demonstrating production-grade API development practices.

## 📄 License

This project is part of a learning portfolio.

## 👤 Author

Developed by NuwanDev - Focused on production-oriented backend development practices.
