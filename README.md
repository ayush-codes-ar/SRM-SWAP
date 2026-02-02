# SRM Swap 🚀
### The Futuristic Barter & Trade Hub for SRM University AP

SRM Swap is a high-performance P2P platform designed exclusively for students of SRM University AP. It facilitates secure, supervised trading, lending, and bartering of items, featuring a "Cyber-Campus" UI/UX, real-time negotiation rooms, and a robust trust-based rating system.

---

## ✨ Key Features

-   **@srmap.edu.in Exclusive**: Mandatory student verification via university email domain.
-   **Hybrid Trade Engine**: Support for pure barter, direct selling, or hybrid deals (Money + Physical Item).
-   **Real-Time Negotiation**: Feature-rich chat rooms with socket-powered message delivery and "Close Deal" workflows.
-   **Supervised Physical Trade**: Integrated supervisor/member oversight for physical meetups on campus.
-   **Trust & Integrity System**: Multi-party ratings (Buyer, Seller, Supervisor) that dynamicallly update a user's Trust Score.
-   **Issue Management**: Built-in dispute resolution system with dedicated dashboards for team members.
-   **Hostel Prep Mode**: Specialized wizard for freshers to get hostel-ready essentials.
-   **Gen-Z UI/UX**: Dark-mode first design with glassmorphism, micro-animations, and a sleek "Control Center" dashboard.

---

## 🛠 Tech Stack

**Frontend:**
-   **Core**: React 18 + Vite
-   **Style**: Tailwind CSS (Glassmorphism & Custom Tokens)
-   **State**: Zustand (Atomic State Management)
-   **Motion**: Framer Motion
-   **Icons**: Lucide React

**Backend:**
-   **Runtime**: Node.js + TypeScript
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Real-time**: Socket.IO
-   **Security**: JWT + BcryptJS

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL DB
-   npm or yarn

### Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd srm-swap
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Create .env file based on example
    # DATABASE_URL="postgresql://user:password@localhost:5432/srm_swap"
    # JWT_SECRET="your_secret_key"
    npx prisma generate
    npx prisma db push
    npm run dev
    ```

3.  **Client Setup**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

---

## 🔑 Default Credentials (Development)

-   **Student**: Register with any `@srmap.edu.in` email.

---

## 🛡 Security & Verification

-   All API routes are protected via JWT middleware.
-   Strict domain validation for registration.
-   Prisma transactions ensure atomic updates for deal closures.

Developed with ❤️ for the SRM AP Campus.
