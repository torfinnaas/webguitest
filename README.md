# Database GUI Project Setup Guide

## Project Overview
This project is a web-based GUI for managing a MySQL database with a simple user management system. It consists of:

1. **React Frontend**: A TypeScript-based React application with CRUD functionality
2. **Express Backend**: A Node.js API server that connects to a MySQL database
3. **MySQL Database**: Schema for storing user records with ID, Name, and Age fields

## Setup Instructions

### Database Setup

1. **Create MySQL Database**:
   - Connect to your AWS RDS MySQL instance
   - Run the SQL script in `database-setup.sql` to create the database schema and sample data
  
   - Connection: webguidb-cluster-instance-1.clcicqykwlte.eu-north-1.rds.amazonaws.com
   - Usr: torfinn/vanlig

2. **Configure Backend**:
   - Navigate to the backend directory: `cd backend`
   - Copy the environment template: `cp .env.example .env`
   - Edit `.env` file with your AWS RDS connection details:
     ```
     DB_HOST=your-rds-endpoint.amazonaws.com
     DB_USER=your-username
     DB_PASSWORD=your-password
     DB_NAME=user_management
     DB_PORT=3306
     ```
   - Install dependencies: `npm install`
   - Start the backend server: `npm run dev`

3. **Configure Frontend**:
   - Navigate to the frontend directory: `cd ../database-gui`
   - Create a `.env` file with the backend API URL:
     ```
     REACT_APP_API_URL=http://your-backend-url:3001/api
     ```
   - Install dependencies: `pnpm install`
   - Start the development server: `pnpm run dev`

## Deployment Instructions

### Backend Deployment
1. Deploy the Express backend to an AWS service like Elastic Beanstalk, EC2, or Lambda+API Gateway
2. Ensure the backend has network access to your RDS instance
3. Set environment variables for database connection

### Frontend Deployment to S3
1. Build the React application: `cd database-gui && pnpm run build`
2. Upload the contents of the `dist` directory to an S3 bucket
3. Configure the S3 bucket for static website hosting
4. Set up CloudFront (optional) for HTTPS and better performance

## Project Structure

### Frontend Structure
```
database-gui/
├── public/
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # React components
│   │   ├── UserForm.tsx      # Form for creating/editing users
│   │   ├── UserManagement.tsx # Main component for user management
│   │   ├── UserTable.tsx     # Table for displaying users
│   │   └── ui/              # UI components from shadcn/ui
│   ├── hooks/        # Custom React hooks
│   ├── lib/          
│   │   └── api.ts    # API service for database communication
│   ├── App.tsx       # Main App component
│   └── main.tsx      # Entry point
└── package.json      # Project dependencies
```

### Backend Structure
```
backend/
├── server.js         # Express server with API endpoints
├── package.json      # Project dependencies
└── .env.example      # Environment variables template
```

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/health` - Check database connection

## Future Enhancements

1. Add user authentication and authorization
2. Implement pagination for large datasets
3. Add search and filtering capabilities
4. Create more advanced form validation
5. Add unit and integration tests
6. Implement data caching for better performance
