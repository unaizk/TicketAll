
# Online Ticketing Platform

A comprehensive online ticketing platform built with a microservice architecture for modularity, scalability, and fault tolerance.

## Key Features

- **Microservice Architecture**: Utilized microservices to ensure modularity and scalability.
- **Kubernetes Deployment**: Managed microservices with Kubernetes, enhancing scalability and fault tolerance. Employed ingress-nginx for load balancing and routing.
- **Common Package (@unaiztickets/common)**: Shared npm package to centralize common code for improved maintainability across services.
- **Automated Testing with Jest**: Extensive automated testing integrated into the CI pipeline for high code quality and supporting test-driven development practices.
- **Strict Typing with Typescript**: Utilized Typescript for strict typing, contributing to robust and maintainable code.
- **Dockerized Services**: Containerized services with Docker for a consistent environment and easy scalability across development, testing, and production.
- **Custom Error Handling**: Incorporated custom error handling mechanism to gracefully manage and report exceptions, enhancing user experience.
- **Version Control with Git**: Leveraged Git for version control, facilitating collaborative development and efficient code management.
- **Specialized Services**:
  - Auth Service: Secure JWT-based authentication.
  - Payments Service: Stripe-integrated transaction processing.
  - Client Service: Interactive Next.js front-end.
  - Orders and Tickets Services: Managing the lifecycle of purchases.
  - Expiration Service: Timing operations with Redis.

## API Documentation

### `GET /api/users/currentuser`

Description: Get current user.

### `POST /api/users/signin`

Description: User sign in.

### `POST /api/users/signout`

Description: User sign out.

### `POST /api/users/signup`

Description: User sign up.

### `DELETE /api/orders/:orderId`

Description: Delete order.

### `GET /api/orders`

Description: Get all orders of the user.

### `POST /api/orders`

Description: Create new order.

### `GET /api/orders/:orderId`

Description: Get specific order.

### `POST /api/payment`

Description: Create payment.

### `GET /api/tickets`

Description: Get all tickets.

### `POST /api/tickets`

Description: Create new ticket.

### `GET /api/tickets/:id`

Description: Get specific ticket with ID.

### `PUT /api/tickets/:id`

Description: Update specific ticket by ID.

