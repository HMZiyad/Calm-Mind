# 🧘 Calm Mind

**Calm Mind** is an intelligent, AI-powered meditation application designed to generate personalized meditation sessions based on your current mood and needs.

Built with **Next.js 14**, **Tailwind/Custom CSS**, and **Google Gemini AI**, it offers a seamless, beautiful experience to help you find peace in a busy world.

## ✨ Features

- **🤖 AI-Generated Meditations**: Uses Google's Gemini 1.5 Flash to write unique scripts tailored to your specific mood (e.g., "Anxious about work", "Can't sleep").
- **🗣️ Smart Session Player**: 
  - **Sentence-by-Sentence TTS**: Reads the script to you in a natural, paced rhythm.
  - **"Read-then-Speak" Sync**: Displays the full sentence for you to absorb before it is spoken (Dual Coding Theory).
  - **Ambient Sounds**: Toggle background sounds (Rain, Ocean) for immersion.
- **📊 Progress Tracking**: 
  - Track your "Mindful Minutes".
  - Log your mood before and after sessions.
  - View streak and history stats.
- **🔐 Secure Authentication**: Custom JWT-based auth with session-only persistence (auto-logout on close).
- **🎨 Premium UI/UX**: A calm, "Lattice-inspired" design system with glassmorphism, smooth animations (Framer Motion), and a fully responsive layout.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Model**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: Standard CSS Modules + Global Design System (Variables)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key
- A PostgreSQL Database URL (Local or Supabase/Neon/Railway)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/calm-mind.git
   cd calm-mind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/calmmind"

   # AI Configuration
   GEMINI_API_KEY="your_google_gemini_api_key"

   # Authentication
   JWT_SECRET_KEY="your_secure_random_string_here"
   NODE_ENV="development"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
