# Customer Management System

A full-stack, production-oriented customer management system built with modern technologies. This project demonstrates enterprise-grade development practices with a strong emphasis on RESTful API design, clean architecture, and responsive frontend implementation.

## 🎯 Project Overview

A comprehensive CRUD application for managing customer data with advanced features including pagination, sorting, filtering, and real-time search. The system is designed with production readiness in mind, featuring Docker containerization, comprehensive error handling, and optimized performance.

### Key Highlights

- **Backend-Focused** - Production-grade Spring Boot REST API with advanced features
- **Modern Frontend** - Next.js 16 with React 19 and TypeScript
- **Dockerized** - Complete containerization for both backend and database
- **Type-Safe** - Full TypeScript on frontend, Java 21 with strong typing on backend
- **API-First Design** - Well-documented REST API with OpenAPI/Swagger
- **Clean Architecture** - Layered design with clear separation of concerns

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js 16 + React 19 + TypeScript + Tailwind CSS         │
│                   (Port 3000)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                       Backend API                            │
│    Spring Boot 4.0.1 + Java 21 + Spring Data JPA           │
│                   (Port 8081)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ JDBC
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      Database                                │
│               MySQL 8.0 (Docker)                            │
│                   (Port 3307)                               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

### Backend

- **Java 21** - Latest LTS with modern features
- **Spring Boot 4.0.1** - Latest Spring framework
- **Spring Data JPA** - Database abstraction
- **MySQL 8.0** - Relational database
- **MapStruct** - Object mapping
- **Lombok** - Code generation
- **SpringDoc OpenAPI** - API documentation
- **Docker** - Containerization
- **Maven** - Build tool

### Frontend

- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - Latest React with new features
- **TypeScript 5** - Static typing
- **Tailwind CSS 4** - Utility-first CSS
- **TanStack React Query 5** - Server state management
- **Axios** - HTTP client
- **React Hook Form** - Form validation

## 📋 Features

### Backend API Features

✅ Complete CRUD operations  
✅ Advanced pagination (configurable 1-100 records/page)  
✅ Multi-field sorting (firstName, lastName, email, status, timestamps)  
✅ Bi-directional ordering (ASC/DESC)  
✅ Full-text search across multiple fields  
✅ UUID-based identifiers  
✅ Email uniqueness validation  
✅ Comprehensive error handling  
✅ Request/Response DTOs  
✅ Specification pattern for dynamic queries  
✅ Global exception handling  
✅ CORS configuration  
✅ OpenAPI/Swagger documentation  
✅ Docker containerization  
✅ Multiple Spring profiles (dev/docker)

### Frontend Features

✅ Responsive customer table  
✅ Create/Edit/Delete operations  
✅ Real-time search  
✅ Pagination controls  
✅ Status management (ACTIVE/INACTIVE)  
✅ Form validation  
✅ Loading states  
✅ Error handling  
✅ Toast notifications  
✅ Confirmation dialogs  
✅ Server-side rendering  
✅ Optimistic updates  
✅ Data caching with React Query

## 🛠️ Quick Start

### Prerequisites

- Java 21+
- Node.js 20+
- Maven 3.8+
- Docker & Docker Compose (recommended)
- MySQL 8.0 (if not using Docker)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**

```bash
git clone <repository-url>
cd customer-management-system
```

2. **Start backend with Docker**

```bash
cd backend/customer-management-system-api
docker-compose up --build
```

This starts:

- MySQL database on port 3307
- Spring Boot API on port 8081

3. **Start frontend**

```bash
cd ../../frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Option 2: Local Development

#### Backend Setup

```bash
cd backend/customer-management-system-api

# Configure environment variables
export DB_NAME=cms_db
export DB_USERNAME=root
export DB_PASSWORD=your_password
export DB_PORT=3306

# Build and run
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📖 Documentation

### API Documentation

Once the backend is running, access:

- **Swagger UI**: `http://localhost:8081/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8081/v3/api-docs`

### Detailed Documentation

- [Backend API Documentation](backend/customer-management-system-api/README.md) - Complete API reference
- [Frontend Documentation](frontend/README.md) - Component and feature details

## 🔌 API Endpoints

### Base URL

```
http://localhost:8081/api/v1
```

### Customer Endpoints

| Method | Endpoint          | Description                                       |
| ------ | ----------------- | ------------------------------------------------- |
| GET    | `/customers`      | Get paginated customers with optional search/sort |
| GET    | `/customers/{id}` | Get customer by ID                                |
| POST   | `/customers`      | Create new customer                               |
| PUT    | `/customers/{id}` | Update existing customer                          |
| DELETE | `/customers/{id}` | Delete customer                                   |

### Example Request

```bash
curl -X GET "http://localhost:8081/api/v1/customers?page=0&size=10&sort=firstName&order=asc&search=john"
```

### Example Response

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
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

## 📁 Project Structure

```
customer-management-system/
├── backend/
│   └── customer-management-system-api/
│       ├── src/
│       │   └── main/
│       │       ├── java/com/nuwandev/cms/
│       │       │   ├── config/          # Configuration classes
│       │       │   ├── controller/       # REST controllers
│       │       │   ├── domain/          # JPA entities
│       │       │   ├── dto/             # Data Transfer Objects
│       │       │   ├── enums/           # Enumerations
│       │       │   ├── exception/       # Exception handling
│       │       │   ├── mapper/          # MapStruct mappers
│       │       │   ├── repository/      # JPA repositories
│       │       │   ├── service/         # Business logic
│       │       │   └── specification/   # JPA specifications
│       │       └── resources/
│       │           └── application.yml  # Configuration
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── pom.xml
│       └── README.md
│
└── frontend/
    ├── app/
    │   ├── customers/              # Customer pages
    │   ├── layout.tsx              # Root layout
    │   ├── page.tsx                # Homepage
    │   └── providers.tsx           # React Query provider
    ├── components/
    │   ├── customers/              # Customer components
    │   └── ui/                     # Reusable UI components
    ├── lib/
    │   ├── api/                    # API client
    │   └── types/                  # TypeScript types
    ├── package.json
    └── README.md
```

## 🎯 Learning Outcomes

This project demonstrates proficiency in:

### Backend Development

- RESTful API design principles
- Spring Boot ecosystem mastery
- JPA and database design
- DTO pattern implementation
- Exception handling strategies
- Specification pattern for dynamic queries
- Clean architecture principles
- Docker containerization
- API documentation with OpenAPI

### Frontend Development

- Modern React with hooks
- Next.js App Router
- Server-side rendering
- TypeScript strict mode
- State management with React Query
- Form handling and validation
- Responsive design with Tailwind CSS
- Component composition

### Full-Stack Integration

- API consumption
- CORS configuration
- Error handling across layers
- Data validation (client + server)
- Pagination implementation
- Real-time search functionality

## 🐛 Error Handling

### Backend

- Global exception handler
- Custom exceptions (CustomerNotFoundException, CustomerAlreadyExistsException)
- Validation errors with detailed messages
- Proper HTTP status codes

### Frontend

- React Query error handling
- Toast notifications for user feedback
- Form validation errors
- Loading and error states

## 🔒 Security Considerations

### Current Implementation

- Input validation on both frontend and backend
- Email uniqueness constraint
- CORS configuration for frontend integration
- SQL injection prevention via JPA

### Future Enhancements

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting
- HTTPS/TLS
- Input sanitization middleware
- CSRF protection

## 🚀 Performance Optimizations

### Backend

- Pagination to limit data transfer
- Database indexing on frequently queried fields
- Connection pooling
- Efficient JPA queries with Specification pattern

### Frontend

- React Query caching
- Optimistic updates
- Server-side rendering
- Code splitting
- Lazy loading

## 📊 Database Schema

```sql
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

## 🧪 Testing

### Backend

```bash
cd backend/customer-management-system-api
mvn test
```

### Frontend

```bash
cd frontend
npm run lint
```

## 📦 Production Deployment

### Backend (Docker)

```bash
# Build image
docker build -t cms-backend:1.0 .

# Run container
docker run -p 8081:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e DB_HOST=mysql \
  -e DB_PORT=3306 \
  -e DB_NAME=cms_db \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=password \
  cms-backend:1.0
```

### Frontend

```bash
npm run build
npm start
```

## 🔧 Environment Variables

### Backend

| Variable                 | Description                 | Required |
| ------------------------ | --------------------------- | -------- |
| `DB_HOST`                | Database host               | Yes      |
| `DB_PORT`                | Database port               | Yes      |
| `DB_NAME`                | Database name               | Yes      |
| `DB_USERNAME`            | Database user               | Yes      |
| `DB_PASSWORD`            | Database password           | Yes      |
| `SPRING_PROFILES_ACTIVE` | Active profile (dev/docker) | No       |

### Frontend

| Variable              | Description     | Required                        |
| --------------------- | --------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | No (defaults to localhost:8081) |

## 📈 Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] User management system
- [ ] Advanced filtering (date ranges, multiple statuses)
- [ ] Export functionality (CSV, PDF)
- [ ] Import customers from file
- [ ] Email notifications
- [ ] Activity logging/audit trail
- [ ] Dashboard with statistics
- [ ] Customer notes/comments
- [ ] File uploads (profile pictures)
- [ ] Soft delete with archive
- [ ] Bulk operations
- [ ] Advanced search with filters
- [ ] Dark mode theme

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development capabilities. Feedback and suggestions are welcome!

## 📄 License

This project is part of a learning portfolio and is available for educational purposes.

## 👤 Author

**NuwanDev**

A full-stack developer focused on building production-ready applications with clean architecture, comprehensive error handling, and modern development practices. This project showcases expertise in:

- Backend API development with Spring Boot
- Modern React/Next.js frontend development
- Docker containerization
- RESTful API design
- Database design and optimization
- Full-stack integration

---

## 🎓 Project Context

This Customer Management System was built as a portfolio project to demonstrate:

1. **Production-oriented development** - Focus on code quality, error handling, and best practices
2. **API-first design** - Well-documented, RESTful API with comprehensive features
3. **Modern technology stack** - Latest versions of Spring Boot, React, and Next.js
4. **Full-stack capabilities** - From database design to frontend implementation
5. **DevOps practices** - Docker containerization and deployment readiness

The emphasis was placed on backend development, showcasing advanced Spring Boot features including custom specifications, global exception handling, DTO patterns, and comprehensive API design.

---

**Built with ❤️ and a focus on production-grade code quality**
