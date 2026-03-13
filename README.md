# 🤖 ERP AI Copilot

An AI-powered ERP chatbot that converts natural language into SQL queries and fetches real-time data from a PostgreSQL database.

🔗 **Live Demo**: [https://erp-ai-copilot.vercel.app](https://erp-ai-copilot.vercel.app)

---

## 🚀 Features

- 💬 Natural language to SQL conversion using OpenAI GPT-4o-mini
- 🗄️ Real-time PostgreSQL database queries (Supabase)
- 📧 AI-powered email drafting
- 🧠 General knowledge Q&A
- 💾 Multi-session chat history
- ⚡ Serverless backend deployed on Vercel

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite) |
| Backend | Node.js Serverless Functions |
| Database | PostgreSQL (Supabase) |
| AI Model | OpenAI GPT-4o-mini |
| Deployment | Vercel |
| Styling | Inline CSS / Custom UI |

---

## 📁 Project Structure

```
ai-project/
├── api/
│   ├── chat.js        # AI + DB query handler
│   └── purchases.js   # Purchases API
├── client/
│   ├── src/
│   │   └── DemoChat.jsx  # Main chat UI
│   ├── index.html
│   └── vite.config.js
├── vercel.json
└── README.md
```

---

## 💡 How It Works

1. User types a message in natural language
2. Message is sent to `/api/chat` serverless function
3. OpenAI GPT-4o-mini decides:
   - **Database query** → generates SQL → executes on Supabase → returns results
   - **Email request** → generates formatted email
   - **General question** → answers directly
4. Response is displayed in the chat UI

---

## 🗄️ Database Schema

```sql
-- Users Table
CREATE TABLE rb_users (
  userid SERIAL PRIMARY KEY,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  city VARCHAR(100)
);

-- Purchase Table
CREATE TABLE purchase (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  amount NUMERIC,
  status VARCHAR(50)
);
```

---

## 🧪 Example Queries

| User Input | AI Response |
|-----------|-------------|
| "Show all users" | Fetches all users from database |
| "Show all purchases" | Fetches all purchase records |
| "Draft an email to John about project update" | Generates formatted email |
| "What is the capital of India?" | Answers: New Delhi |

---

## ⚙️ Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
POSTGRES_URL=your_supabase_connection_string
```

---

## 🏃 Run Locally

```bash
# Clone the project
git clone https://github.com/your-username/ai-project.git

# Install dependencies
cd ai-project
npm install

cd client
npm install

# Add .env file with your keys
# Start frontend
npm run dev

# Start backend (in separate terminal)
cd api
node server.js
```

---

## 👩‍💻 Developer

**Jigna Gajjar**
- 📧 jigna.gajjar.tech@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/your-profile)
- 🐙 [GitHub](https://github.com/your-username)

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
