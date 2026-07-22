# AgroRent - Agriculture Machinery Rental System

AgroRent is a MERN stack web application for renting agriculture machinery. It connects farmers, machinery owners, and admins in one platform.

## Features

- Farmer, owner, and admin authentication
- JWT-based login and protected routes
- Farmer and owner registration
- Forgot password with email OTP
- Add, edit, delete, and view machinery
- Machine image upload
- Admin machine verification
- Search machinery by type and location
- Booking request, approval, rejection, cancellation, and completion flow
- PDF invoice generation
- Farmer feedback submission
- Admin dashboard for users, machines, bookings, invoices, and feedback

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcrypt
- File Uploads: Multer
- Email: Nodemailer with Gmail SMTP
- PDF: PDFKit

## Project Structure

```text
AgroRent/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- uploads/
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- index.html
|   `-- package.json
|-- package.json
`-- README.md
```

## Requirements

Install these before running the project:

- Node.js
- npm
- MongoDB Community Server or MongoDB Atlas

## Environment Variables

Create a file named `.env` inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/AgroRent
JWT_SECRET=supersecretkey
SMTP_EMAIL=yourgmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

### Variable Details

| Variable | Description |
| --- | --- |
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection URL |
| `JWT_SECRET` | Secret key used for JWT token generation |
| `SMTP_EMAIL` | Gmail address used to send OTP emails |
| `SMTP_PASSWORD` | Gmail App Password, not the normal Gmail password |

For local MongoDB, use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/AgroRent
```

For MongoDB Atlas, replace `MONGO_URI` with your real Atlas connection string.

## Installation

Clone or download the project, then open the project folder in a terminal.

Install all dependencies from the root folder:

```bash
npm install
```

## Run the Project

Start frontend and backend together:

```bash
npm run dev
```

The application will run at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Run Separately

Backend:

```bash
npm run dev --workspace backend
```

Frontend:

```bash
npm run dev --workspace frontend
```

## Build Frontend

To create the production frontend build:

```bash
npm run build
```

The build output will be created inside:

```text
frontend/dist/
```

## Frontend Environment Variables

The frontend uses these optional Vite variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FILE_BASE_URL=http://localhost:5000
```

If these are not provided, the frontend uses the local backend by default.

## Default Admin Login

Use these credentials for admin login:

```text
Phone/Username: admin
Password: 1234
```

## Upload or Submission Notes

Do not upload these folders/files:

```text
node_modules/
backend/node_modules/
frontend/node_modules/
backend/.env
backend/uploads/
backend/invoices/
frontend/dist/
```

These are already ignored in `.gitignore`.

Before submitting or uploading the project, include:

- Source code
- `package.json`
- `package-lock.json`
- `README.md`
- `.gitignore`

Do not include real passwords, Gmail App Passwords, or private database credentials in the uploaded project.

## Common Issues

### MongoDB connection error

Make sure MongoDB is running locally, or use a valid MongoDB Atlas connection string in `backend/.env`.

### Email OTP not sending

Use a Gmail App Password in `SMTP_PASSWORD`. A normal Gmail password will not work.

### Port already in use

Change the backend port in `backend/.env`:

```env
PORT=5001
```

If you change the backend port, also update the frontend API URL.

## Author

AgroRent - Agriculture Machinery Rental System
