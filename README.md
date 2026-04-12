# OrchidHackX 2026 - Backend

The robust, highly-secured Node.js REST API powering the OrchidHackX 2026 registration portal.

## 🚀 Tech Stack
- **Runtime:** Node.js
- **Server:** Express.js
- **Database:** MongoDB & Mongoose
- **Security Middleware:** Helmet, express-rate-limit, express-mongo-sanitize, CORS

## 🛡️ Security Features
This backend is fortified against the most common web exploits:
- **NoSQL Injection Protection:** `express-mongo-sanitize` strips out operator injections (`$`, `.`).
- **DDoS Mitigation:** `express-rate-limit` enforces a strict 100 request / 15-minute quota.
- **HTTP/XSS Headers:** `helmet` auto-injects 14 secure headers to prevent clickjacking and sniffing.
- **Cross-Origin Restrictions (CORS):** Reject interactions originating from unauthorized domains.
- **Strong Typing & Coercion:** Mongoose schemas rigorously enforce required fields and data typings.

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a root `.env` file referencing `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Server
Use `nodemon` for hot-reloading during development:
```bash
npm run dev
```
*(Runs on `http://localhost:5000`)*

## 📦 Production Deployment (Render)

1. Connect this repository to your Render Dashboard (Create a new `Web Service`).
2. Set the **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure your **Environment Variables**:
   - `MONGO_URI`: Your production MongoDB Atlas string.
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g. `https://orchidhack-portal.vercel.app`).
6. **Deploy!**

*Important: Remember to whitelist `0.0.0.0/0` in your MongoDB Atlas Network Access rules so Render can successfully authenticate!*
