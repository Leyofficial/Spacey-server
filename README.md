# Spacey Server 🚀

Spacey is the backend server for the Spacey project — a modern, scalable Node.js API designed to support real-time communication, secure authentication, file uploads, and robust rate limiting. Built with Express, MongoDB, Redis, and Socket.IO, Spacey ensures a fast and reliable experience.

---

## Features ✨

- **Real-time communication** with Socket.IO  
- **User authentication & authorization** using JWT  
- **File uploads** managed via Multer and GridFS  
- **Email notifications** with SendGrid & Mailgun integration  
- **Rate limiting** and security with Helmet & express-rate-limit  
- **Data persistence** using MongoDB & Redis caching  
- **Scheduled tasks** handled by node-cron  
- **Extensive logging** using Morgan  
- Environment configuration via dotenv  
- Input validation with Validator  

---

## Tech Stack 🛠️

- Node.js 18.x  
- Express.js  
- MongoDB (Mongoose & GridFS)  
- Socket.IO (client & server)  
- SendGrid & Mailgun (email services)  
- Multer (file uploads)  
- bcryptjs (password hashing)  
- JWT for authentication  
- Helmet for security headers  

---

## Getting Started

### Prerequisites

- Node.js 18.x  
- npm 7.x  
- MongoDB  
- Redis  

### Installation

```
bash
git clone https://github.com/yourusername/spacey-server.git
cd spacey-server
npm install
```

Running the server
```
npm start
```
This will start the server with nodemon monitoring index.cjs
