# Amrutam Assignment

A full-stack web application built with Next.js frontend and Node.js/Express backend for managing doctor appointments and authentication.

## 🏗️ Project Structure

```
Amrutam/
├── frontend/          # Next.js React application
├── Backend/           # Node.js Express server
└── README.md          # This file
```

## 🚀 Technologies Used

### Frontend
- **Next.js 15.4.6** - React framework
- **React 19.1.0** - UI library
- **Tailwind CSS** - Styling framework
- **Radix UI** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Redis** - Caching (ioredis)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Redis** (optional, for caching)

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Amrutam
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file with your configuration
# (See Environment Setup section above)

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file with your configuration
# (See Environment Setup section above)

# Start development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

## 🏃‍♂️ Running the Application

### Development Mode

#### Backend
```bash
cd Backend
npm run dev
```
- Uses nodemon for auto-restart on file changes
- Server runs on port 5000

#### Frontend
```bash
cd frontend
npm run dev
```
- Hot reload enabled
- Application runs on port 3000

### Production Mode

#### Backend
```bash
cd Backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📚 API Endpoints

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `GET /api/doctors/:id` - Get doctor by ID

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## 🗂️ Project Structure Details

### Backend Structure
```
Backend/
├── controllers/     # Request handlers
├── routes/          # API route definitions
├── models/          # MongoDB schemas
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── jobs/            # Background jobs
├── server.js        # Main server file
└── package.json     # Dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # Reusable React components
│   └── lib/         # Utility functions
├── public/          # Static assets
└── package.json     # Dependencies
```

## 🔍 Available Scripts

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (not configured yet)

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: Available at http://localhost:5000/api

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in the respective `.env` files
   - Kill processes using the ports: `npx kill-port 3000 5000`

2. **MongoDB connection issues**
   - Ensure MongoDB is running
   - Check your connection string in the backend `.env` file

3. **Module not found errors**
   - Run `npm install` in both frontend and backend directories
   - Clear node_modules and reinstall if needed

4. **CORS issues**
   - The backend is configured to allow all origins (`*`)
   - Check if the frontend is making requests to the correct backend URL

## 📝 Notes

- The backend uses MongoDB as the primary database
- Redis is included for potential caching (optional)
- JWT is used for authentication
- The frontend uses Next.js App Router
- Tailwind CSS is used for styling with Radix UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Amrutam assignment.
