🚗 Smart Parking Management System
Real-Time Slot Detection | YOLOv8 | Dual Booking | React + Flask + MongoDB

A Smart Parking System that uses YOLOv8 object detection and computer vision to detect free vs. occupied parking slots in real-time using CCTV or sample video.
It also provides online slot booking, QR-based entry, and a real-time dashboard for users and admins.

📌 Features

    🔍 Real-Time Parking Slot Detection using YOLOv8
  
    🎥 Supports CCTV Live Feed or Sample Testing Video

    🌐 User Web Portal built with React.js

    🔐 Secure Login, Registration, OTP/Email Verification

    📊 Admin Dashboard – live slot status, users, bookings

    🧾 Dual Booking System:

      Pre-book online

      Direct walk-in booking

    💳 Online Payment Integration (Stripe/UPI)

    📱 QR Code Generation for entry & exit

    ⚡ Live Updates using Socket.IO

    🗄️ MongoDB Database for users, bookings & history

🎯 Problem Statement

Finding parking in urban cities leads to:

    Time wastage,Traffic congestion,Fuel loss,No real-time slot availability

Traditional sensor-based parking systems are:

  Expensive,Hard to scale,Require complex hardware

💡 Our Solution

We replace the entire sensor-based system with:

    AI-based camera detection
    Live dashboard
    Online booking + automated slot management

This reduces:

  Cost
  Hardware
  Human involvement 

And provides:
  Accurate real-time availability
  Better user experience
  Smart city–ready infrastructure

🧠 Technology Stack
Frontend

  React.js
  HTML, CSS
  qrcode.js
  
Backend

  Flask (YOLO inference + real-time slot update)
  Express.js (user auth + booking API)
  Socket.IO

AI / Computer Vision

  YOLOv8
  OpenCV
  Custom parking dataset

Database
  MongoDB

🏗️ System Architecture
Frontend
    Shows live layout → users choose slot → booking → payment → QR generated
Backend
    Receives video → YOLO detects slot status → sends real-time updates → stores in DB
Database
Stores:
  Users
  Bookings
  Payments
  Slot availability
  QR code validation

🔄 Workflow

  User logs in
  Views live parking layout
  Selects slot & time
  Completes online payment
  Receives QR code
  On arrival → scans QR
  System confirms booking
  Slot marked as occupied
  After exit → slot marked free again

📦 Installation

1.Clone the repo
    git clone https://github.com/your-username/smart-parking
    cd smart-parking
2.Backend setup
    pip install -r requirements.txt
    python app.py
3.Frontend setup
    cd frontend
    npm install
    npm start

🧪 Model Training
    Collected parking images from CCTV/Sample videos
    Annotated slot status (free/occupied)
    Trained YOLOv8
    Evaluated using Accuracy, Precision, Recall

🛠️ Future Enhancements

    AR-based navigation to guide users to nearest free slot
    Multi-level parking support
    Automatic number plate recognition (ANPR)
    Prediction of future slot availability
