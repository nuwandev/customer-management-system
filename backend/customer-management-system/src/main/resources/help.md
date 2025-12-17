API Design (Endpoints)

Base path:

/api/v1/customers

Required Endpoints
Method	Endpoint	Purpose
GET	/customers	Get all customers
GET	/customers/{id}	Get customer by ID
POST	/customers	Create customer
PUT	/customers/{id}	Update customer
DELETE	/customers/{id}	Delete customer
Optional (Strong signals)

GET /customers?search=john

Pagination: ?page=0&size=10

Soft delete using status