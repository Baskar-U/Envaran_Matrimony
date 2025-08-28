# Envaran Matrimony - Second Chance Matrimony Platform

A comprehensive matrimony platform designed specifically for individuals seeking second chances in life - whether divorced, widowed, separated, or single. Features advanced profile matching, secure messaging, premium subscriptions, event management, and mobile-responsive design with enterprise-grade security and privacy protection.

## 🚀 Features

- **Advanced Profile Matching & Discovery System**
- **Secure Real-time Messaging & Communication Platform**
- **Premium Subscription Management with Payment Processing**
- **Profile Verification & Identity Management System**
- **Event Management & Vendor Directory**
- **Mobile-First Responsive Design**
- **Enterprise-Grade Security & Privacy Protection**
- **Multi-language Support (English & Tamil)**
- **Like & Match Algorithm System**
- **Admin Dashboard for User & Payment Management**

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Node.js, Express, Firebase (Auth, Firestore, Storage)
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **State Management**: React Query (TanStack)
- **Routing**: Wouter
- **Validation**: Zod

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Firebase project
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SecondChanceMatrimony.git
cd SecondChanceMatrimony
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Server Configuration
PORT=3001
NODE_ENV=development
SESSION_SECRET=your_session_secret_here

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password_here
```

### 4. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore Database, and Storage
3. Get your Firebase configuration from Project Settings
4. Update the environment variables with your Firebase config

### 5. Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run database migrations:

```bash
npm run db:push
```

### 6. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## 🚀 Deployment

### Environment Variables for Production

Make sure to set up the following environment variables in your production environment:

- `DATABASE_URL`: Production PostgreSQL connection string
- `FIREBASE_API_KEY`: Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `FIREBASE_APP_ID`: Firebase app ID
- `FIREBASE_MEASUREMENT_ID`: Firebase measurement ID
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (production)
- `SESSION_SECRET`: Secure session secret

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
SecondChanceMatrimony/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── utils/         # Helper functions
├── server/                # Express backend server
├── shared/                # Shared schemas and types
├── migrations/            # Database migrations
└── public/               # Static assets
```

## 🔐 Security Features

- **256-bit SSL Encryption**
- **Two-Factor Authentication**
- **GDPR & CCPA Compliant Data Protection**
- **End-to-End Message Encryption**
- **Identity Verification System**
- **Real-time Fraud Detection**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@envaranmatrimony.com or create an issue in this repository.

## 🔗 Links

- **Live Demo**: [https://secondchancematrimony.com](https://secondchancematrimony.com)
- **Documentation**: [https://docs.secondchancematrimony.com](https://docs.secondchancematrimony.com)
- **API Reference**: [https://api.secondchancematrimony.com](https://api.secondchancematrimony.com)

---

**Note**: This is a matrimony platform specifically designed for individuals seeking second chances in relationships. Please ensure all user data is handled with the utmost care and in compliance with local privacy laws.
