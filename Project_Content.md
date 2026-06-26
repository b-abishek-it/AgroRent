# 🌾 Agriculture Machinery Rental System – AgroRent

## Introduction

**AgroRent** is a web-based **Agricultural Machinery Rental System** developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** to simplify the process of renting agricultural machinery.

The system connects **Farmers**, **Machinery Owners**, and **Administrators** on a single platform, enabling efficient machinery sharing and management. Farmers can search and book machines, machinery owners can register and manage their machinery with driver details, while administrators verify machinery, monitor bookings, and manage users.

The system provides a centralized solution that improves machinery accessibility, reduces operational costs for farmers, and increases machinery utilization.

---

# Homepage

The homepage serves as the entry point of the AgroRent system.

### Features

- Responsive Navigation Bar
- Home
- Login
- Register
- Language Switch (English / Tamil)

### Homepage Sections

- Agriculture Banner
- Get Started Button
- Search Machinery Button
- About AgroRent
- Services
- Contact

The **Language Switch** enables users to switch between **English** and **Tamil** throughout the application.

---

# User Registration

Farmers and Machinery Owners can create their accounts using the registration page.

## Registration Fields

- Full Name
- Email Address
- Phone Number
- Location
- User Role
- Password
- Confirm Password

After successful registration, the system automatically generates unique IDs.

## Auto Generated IDs

| Entity | Format |
|---------|---------|
| Farmer ID | F001 |
| Machinery Owner ID | M001 |
| Machine ID | MA001 |
| Driver ID | D001 |
| Booking ID | B001 |
| Feedback ID | FB001 |

All user information is securely stored in **MongoDB**.

---

# User Login

Users can log into the system using:

- User Role
- Phone Number
- Password

### Features

- Secure Login
- Forgot Password
- Email-based Password Recovery
- JWT Authentication
- Redirect to Respective Dashboard

---

# Farmer Dashboard

The Farmer Dashboard enables farmers to rent agricultural machinery.

## Features

- Search Machinery
- View Machine Details
- Send Booking Request
- View Booking History
- Download Invoice
- Cancel Booking
- Submit Feedback
- Logout

### Booking Status

- Pending
- Approved
- Paid
- Completed
- Cancelled

---

# Machinery Owner Dashboard

The Machinery Owner Dashboard allows machinery owners to manage their equipment.

## Features

- Add Machinery
- Edit Machinery
- Delete Machinery
- View Machinery List
- Manage Booking Requests
- Approve Booking
- Reject Booking
- Download Invoice
- Logout

Owners can also monitor machine availability and booking schedules.

---

# Admin Dashboard

The Admin Dashboard provides complete control over the AgroRent platform.

## Features

- View Total Farmers
- View Total Machinery Owners
- View Total Machines
- View Total Bookings
- View Total Revenue
- Verify Machinery
- Verify Driver Details
- Manage Users
- Block / Unblock Users
- View Feedback
- Monitor Entire System

> **Only verified machines become visible to farmers.**

---

# Search Machinery

Farmers can search agricultural machinery using:

- Machine Type
- District
- Location

## Search Results

Each result displays:

- Machine Image
- Machine Name
- Machine Type
- Rental Price
- Availability Status
- View Details Button

### Availability Status

🟢 Available

🔴 Not Available

---

# Machine Details

Each machine displays:

- Machine Name
- Machine Type
- Description
- Registration Number
- Rental Price
- Location
- Machine Image

## Driver Details

- Driver ID
- Driver Name
- License Number
- Phone Number

---

# Booking Module

Farmers can submit booking requests by selecting:

- Booking Date
- Start Time
- End Time
- Duration

The system automatically calculates rental charges.

Bookings are processed using the **First Come First Serve (FCFS)** algorithm.

## Booking Status

- Pending
- Approved
- Rejected
- Paid
- Completed
- Cancelled

---

# Machine Availability Validation

The system uses an **Availability Checking Algorithm** before confirming bookings.

### Functions

- Prevents duplicate bookings
- Checks overlapping date and time
- Updates machine availability automatically
- Releases machine after booking completion

---

# Booking Cancellation

Farmers can cancel bookings before the rental period.

After cancellation:

- Booking status becomes **Cancelled**
- Machine becomes **Available**
- Machinery Owner receives notification

If payment has already been completed, the refund process is initiated.

---

# Payment Module

After booking approval, the **Proceed to Payment** button becomes available.

### Payment Page Displays

- Booking Information
- Payment Amount
- Admin Commission
- Machinery Owner Amount

### Payment Distribution

| Recipient | Percentage |
|------------|------------|
| Admin | 5% |
| Machinery Owner | 95% |

Payments are processed using **Razorpay Test Mode**.

---

# Payment Success

After successful payment:

- Booking Status → Paid
- Payment Success Message
- Download Invoice Button Enabled
- Booking Updated Automatically

Invoices become available for:

- Farmer
- Machinery Owner
- Admin

---

# Refund Module

If the farmer cancels a booking after payment:

- Refund Request Initiated
- Payment Status Updated
- Refund Notification Sent
- Booking Marked as Cancelled

---

# Invoice Generation

The system automatically generates a **PDF Invoice** after successful payment.

## Invoice Includes

- Booking ID
- Farmer Name
- Farmer Phone Number
- Machinery Owner Name
- Machinery Owner Phone Number
- Machine Name
- Machine Type
- Machine Registration Number
- Driver ID
- Driver Name
- Driver License Number
- Driver Phone Number
- Location
- Booking Date
- From Time
- To Time
- Duration
- Total Amount
- Admin Commission (5%)
- Machinery Owner Amount (95%)
- Payment Status

Invoice download is available for:

- Farmer
- Machinery Owner
- Admin

---

# Feedback Module

After booking completion, farmers can submit feedback.

## Feedback Includes

- Feedback ID
- Booking ID
- Rating
- Comments

The Admin can review all submitted feedback.

---

# Language Translation Module

The AgroRent system supports bilingual functionality.

## Supported Languages

- English
- Tamil

The language switch updates:

- Homepage
- Login
- Registration
- Dashboards
- Search Page
- Booking Pages
- Payment Page
- Invoice
- Admin Dashboard
- Buttons
- Messages
- Notifications

---

# Notification Module

The system provides real-time notifications.

## Notifications

- Booking Request Sent
- Booking Approved
- Booking Rejected
- Payment Successful
- Invoice Generated
- Booking Cancelled
- Refund Initiated

---

# Algorithms Used

## 1. Availability Checking Algorithm

- Checks machine availability
- Prevents duplicate bookings
- Detects overlapping bookings
- Updates availability automatically

---

## 2. First Come First Serve (FCFS)

- Processes bookings in order of request
- Ensures fair allocation
- Eliminates booking conflicts

---

# Technologies Used

## Frontend

- React.js
- HTML5
- CSS3
- Bootstrap
- JavaScript

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## Authentication

- JWT Authentication

## Payment Gateway

- Razorpay Test Mode

## PDF Generation

- jsPDF

## Version Control

- Git
- GitHub

---

# Project Features

- User Registration & Login
- Farmer Dashboard
- Machinery Owner Dashboard
- Admin Dashboard
- Machine Search
- Machine Details
- Driver Management
- Automatic ID Generation
- Date & Time Based Booking
- Availability Validation
- FCFS Booking Allocation
- Razorpay Payment Integration
- PDF Invoice Generation
- 5% Admin Commission Calculation
- 95% Machinery Owner Settlement
- Booking Cancellation
- Refund Management
- Feedback & Rating System
- Multilingual Support (English & Tamil)
- Responsive User Interface
- Role-Based Access Control
- Real-Time Booking Status
- Centralized Database Management

---

# Project Workflow

```text
Home Page
     │
     ▼
User Registration
     │
     ▼
User Login
     │
     ▼
Role-Based Dashboard
     │
     ├───────────────┐
     │               │
     ▼               ▼
Farmer          Machinery Owner
     │               │
     ▼               ▼
Search Machine   Add Machinery
     │               │
     ▼               ▼
Book Machine     Approve Booking
     │               │
     └──────┬────────┘
            ▼
     Availability Check
            ▼
      Booking Approved
            ▼
         Payment
            ▼
     Invoice Generated
            ▼
    Booking Completed
            ▼
     Feedback Submitted
```

---

# Future Enhancements

- GPS Tracking for Machinery
- Live Machine Location
- AI-based Machinery Recommendation
- Online Chat Support
- UPI Payment Integration
- SMS Notifications
- Weather-Based Booking Suggestions
- Mobile Application (Android & iOS)
- Predictive Maintenance Alerts

---

# Conclusion

AgroRent provides a complete digital platform for agricultural machinery rental by connecting **Farmers**, **Machinery Owners**, and **Administrators** in a single system.

The application simplifies machinery booking, improves equipment utilization, supports secure payment processing, generates automated invoices, and ensures transparent management through role-based dashboards.

With multilingual support, booking validation, automated payment management, and centralized administration, AgroRent offers a reliable, scalable, and user-friendly solution that enhances agricultural productivity and promotes digital transformation in the farming sector.

---
