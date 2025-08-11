# E-Commerce Full-Stack Application

A complete e-commerce web application built with React frontend and Node.js backend, featuring user authentication, product management, shopping cart, and order processing.

## Features

- **User Authentication**: JWT-based login/register system with protected routes
- **Product Management**: Browse, search, and filter products with pagination
- **Shopping Cart**: Persistent cart functionality with quantity management
- **Order Processing**: Complete checkout flow with order history
- **Admin Panel**: Product management for administrators
- **Responsive Design**: Mobile-first responsive UI
- **AWS S3 Integration**: Product image upload and storage

## Tech Stack

- **Frontend**: React 18, React Router, Axios, React Toastify
- **Backend**: Node.js, Express, Sequelize ORM, JWT Authentication
- **Database**: PostgreSQL
- **File Storage**: AWS S3
- **Containerization**: Docker & Docker Compose

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── .env.example
├── postgres-data/
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- AWS S3 bucket (for image uploads)

## Quick Start

### 1. Clone the repository

```bash
git clone <https://github.com/mohamed5adel/ecommerce-app.git>
cd ecommerce-app
```

### 2. Start PostgreSQL Database

```bash
# Start the database
docker-compose up -d

# Stop the database
docker-compose down
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - Database credentials (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
# - JWT secret (JWT_SECRET, JWT_EXPIRES_IN)
# - AWS S3 credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET)
# - Server config (NODE_ENV, PORT)

# Run database migrations
npm run migrate

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with backend API URL
REACT_APP_API_URL=http://localhost:5000

# Start the frontend development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket-name

# Server Configuration
NODE_ENV=development
PORT=5000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## Database Configuration

The PostgreSQL database is configured with:
- **Service name**: postgres
- **Host**: localhost (or postgres in Docker)
- **Port**: 5432
- **Database**: mydb
- **Username**: myuser
- **Password**: mypassword

## Demo Accounts

After running the seed script, you'll have access to:

- **Admin User**: admin@example.com / admin123
- **Regular User**: user@example.com / user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get products with search/pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Docker Deployment

### Backend Container

```bash
cd backend
docker build -t ecommerce-backend .
docker run -p 5000:5000 --env-file .env ecommerce-backend
```

### Full Stack with Docker Compose

Create a `docker-compose.full.yml` for the complete application:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=myuser
      - DB_PASSWORD=mypassword
      - DB_NAME=mydb
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check database credentials in `.env` file
- Verify database is accessible: `docker-compose exec postgres psql -U myuser -d mydb`

### Frontend API Issues
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure CORS is properly configured

### AWS S3 Issues
- Verify AWS credentials in backend `.env`
- Check S3 bucket permissions
- Ensure bucket region matches `AWS_REGION`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
