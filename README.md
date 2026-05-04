🎟️ Scalable Booking System (Backend)

A production-inspired booking system built with a **module-based architecture**, designed to handle high concurrency, prevent double bookings, and simulate real-world ticketing platforms like BookMyShow.

This project focuses on **backend engineering fundamentals + advanced system design concepts**, making it ideal for backend interviews.


🚀 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Caching & Locking:** Redis
- **Queue System:** BullMQ
- **Containerization:** Docker
- **API Documentation:** Swagger (Planned)

---

## 🧱 Architecture Style

This project follows a **feature/module-based architecture**, where each domain is self-contained.


src/
├── config/
├── modules/
│ ├── auth/
│ ├── booking/
│ ├── show/
│ ├── seat/
├── common/
│ ├── middlewares/
│ ├── utils/
│ ├── errors/
├── app.js
├── server.js


---

## 📌 Features

### ✅ Core Features
- Search available shows
- View seat availability
- Lock seats temporarily
- Book tickets

### ⚙️ Advanced Backend Features
- Distributed locking using Redis
- Queue-based booking system (BullMQ)
- Retry mechanism for failed jobs
- Payment simulation (success/failure)
- Rate limiting (API protection)
- Idempotency (duplicate prevention)
- MongoDB transactions (data consistency)

### 📊 Production-Level Features
- Structured logging system
- Monitoring (latency & failures)
- Caching (show list, seat availability)
- Dockerized setup
- Swagger API documentation
- Load testing

---

## 🔄 Booking Flow

1. User selects seats
2. Seats are **locked temporarily**
3. Payment is initiated (simulated)
4. Booking request pushed to **queue**
5. Worker processes booking
6. Seats are permanently reserved

---

## 🧠 Key Engineering Concepts

- Concurrency handling
- Distributed locking (Redis)
- Async processing with queues (BullMQ)
- Idempotency keys
- Rate limiting
- Retry strategies
- Database transactions
- Caching strategies

---

## 📅 Development Roadmap

This project follows a **21-day structured plan**:

### Week 1 → Foundation
- System design
- Project setup
- Core models
- Basic APIs
- Seat locking

### Week 2 → Advanced Backend
- Booking flow
- Payment simulation
- Queue integration (BullMQ)
- Retry mechanism
- Rate limiting
- Idempotency
- Transactions

### Week 3 → Production Level
- Logging system
- Monitoring
- Caching
- Dockerization
- API documentation
- Load testing
- Final optimization

---

## 🧪 Running the Project

### 1. Clone the repo
```bash
git clone https://github.com/your-username/booking-system.git
cd booking-system
2. Install dependencies
npm install
3. Setup environment variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_HOST=localhost
REDIS_PORT=6379
4. Run the server
npm run dev
📦 Future Enhancements
Kafka integration (event-driven architecture)
Microservices split
Real payment gateway integration
WebSocket for live seat updates
Horizontal scaling
📸 To Add
Architecture diagram (important for interviews)
API screenshots
Load testing results
System design explanation video
🎯 Why This Project Matters

This project demonstrates:

Real-world backend architecture
Handling concurrency at scale
Production-level thinking
Strong system design fundamentals
👨‍💻 Author

Harsh Vardhan
Aspiring Backend Engineer
