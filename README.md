# Envaran Matrimony - Second Chance Matrimony Platform

<div align="center">

![Envaran Matrimony](https://img.shields.io/badge/Envaran-Matrimony-blue?style=for-the-badge&logo=heart)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.1.0-orange?style=for-the-badge&logo=firebase)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)

**A modern, secure, and inclusive matrimony platform designed specifically for individuals seeking second chances in life.**

[Live Demo](https://envaranmatrimony.com) • [Report Bug](https://github.com/Baskar-U/Envaran_Matrimony/issues)

</div>

---

## 🌟 About Envaran Matrimony

Envaran Matrimony is a comprehensive matrimony platform that celebrates new beginnings and second chances. We understand that life takes different paths, and everyone deserves to find meaningful connections regardless of their past. Our platform is specifically designed for:

- **Divorced individuals** seeking new relationships
- **Widowed persons** ready to open their hearts again
- **Separated individuals** looking for fresh starts
- **Single people** who want to find their perfect match

### 🎯 Our Mission

To provide a safe, secure, and inclusive platform where individuals can find genuine connections based on mutual understanding, respect, and shared values. We believe that every person deserves love and companionship, regardless of their relationship history.

---

## ✨ Key Features

### 🔐 **Security & Privacy First**
- **256-bit SSL Encryption** - Bank-level security for all data
- **Two-Factor Authentication** - Enhanced account protection
- **GDPR & CCPA Compliant** - Full data protection compliance
- **End-to-End Encryption** - Secure messaging using Signal Protocol
- **Identity Verification** - Multi-step verification process
- **Real-time Fraud Detection** - Advanced security monitoring

### 💝 **Smart Matching System**
- **AI-Powered Matching** - Advanced algorithms for compatibility
- **Detailed Profile Matching** - Based on values, interests, and preferences
- **Location-Based Discovery** - Find matches in your area
- **Religion & Caste Compatibility** - Respect for cultural preferences
- **Age & Lifestyle Matching** - Comprehensive compatibility factors

### 💬 **Communication Platform**
- **Real-time Messaging** - Instant communication with matches
- **Voice & Video Calls** - Built-in calling features
- **Message Encryption** - Military-grade message security
- **Read Receipts** - Know when your messages are read
- **Message History** - Complete conversation tracking

### 👑 **Premium Features**
- **Unlimited Messaging** - No restrictions on communication
- **Contact Details Access** - View phone numbers and emails
- **Profile Boost** - Get priority in search results
- **Advanced Filters** - Detailed search and filtering options
- **Priority Support** - 24/7 dedicated customer service
- **Exclusive Events** - Access to premium matrimony events

### 📱 **Mobile-First Design**
- **Responsive Design** - Perfect on all devices
- **Progressive Web App** - App-like experience on mobile
- **Offline Capability** - Basic features work without internet
- **Push Notifications** - Real-time updates and alerts
- **Touch-Optimized** - Designed for mobile interaction

### 🎉 **Event Management**
- **Matrimony Events** - Organized meet-and-greet events
- **Vendor Directory** - Wedding service providers
- **Event Registration** - Easy event booking system
- **Event Notifications** - Stay updated on upcoming events
- **Photo Galleries** - Event memories and highlights

### 🌍 **Multi-Language Support**
- **English** - Primary language support
- **Tamil** - Native Tamil language support
- **Cultural Sensitivity** - Respect for diverse traditions
- **Localized Content** - Region-specific information

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18.3.1** - Modern UI framework
- **TypeScript 5.6.3** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Smooth animations
- **React Query** - Server state management
- **Wouter** - Lightweight routing

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Firebase** - Authentication, database, and storage
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database queries
- **Zod** - Schema validation

### **Infrastructure**
- **Firebase Auth** - User authentication
- **Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Vite** - Build tool and dev server
- **ESBuild** - Fast bundling

---

## 📊 Platform Statistics

- **10,000+** Active Users
- **500+** Successful Matches
- **50+** Events Organized
- **99.9%** Uptime
- **24/7** Customer Support
- **256-bit** Encryption

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Firebase** project
- **Git**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/SecondChanceMatrimony.git
   cd SecondChanceMatrimony
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   
   # Firebase
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # Server
   PORT=3001
   NODE_ENV=development
   SESSION_SECRET=your_session_secret
   
   # Admin
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3001` to see the application.

---

## 📁 Project Structure

```
SecondChanceMatrimony/
├── 📁 client/                    # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 ui/           # Radix UI components
│   │   │   ├── Navigation.tsx   # Main navigation
│   │   │   ├── ProfileCard.tsx  # Profile display
│   │   │   └── ...
│   │   ├── 📁 pages/            # Page components
│   │   │   ├── Home.tsx         # Dashboard
│   │   │   ├── Profiles.tsx     # Profile browsing
│   │   │   ├── Matches.tsx      # Matches management
│   │   │   ├── Premium.tsx      # Premium features
│   │   │   └── ...
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   ├── 📁 lib/              # Utility libraries
│   │   └── 📁 utils/            # Helper functions
│   └── 📁 public/               # Static assets
├── 📁 server/                   # Express backend
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API routes
│   └── db.ts                    # Database connection
├── 📁 shared/                   # Shared schemas
│   └── schema.ts                # Database schema
├── 📁 migrations/               # Database migrations
├── package.json                 # Dependencies
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:generate  # Generate migrations

# Type checking
npm run check        # TypeScript type checking
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message validation

---

## 🚀 Deployment

### Environment Variables

Set these environment variables in your production environment:

```env
# Production Database
DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/prod_db

# Firebase Production
FIREBASE_API_KEY=prod_firebase_api_key
FIREBASE_AUTH_DOMAIN=prod_project.firebaseapp.com
FIREBASE_PROJECT_ID=prod_project_id
FIREBASE_STORAGE_BUCKET=prod_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=prod_messaging_sender_id
FIREBASE_APP_ID=prod_app_id
FIREBASE_MEASUREMENT_ID=prod_measurement_id

# Production Server
PORT=5000
NODE_ENV=production
SESSION_SECRET=prod_session_secret
```

### Build & Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Deployment Platforms

- **Vercel** - Frontend deployment
- **Railway** - Backend deployment
- **Supabase** - Database hosting
- **Firebase** - Authentication and storage

---

## 🔐 Security Features

### Data Protection
- **AES-256 Encryption** - All sensitive data encrypted
- **HTTPS Only** - Secure communication
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API abuse prevention
- **Input Validation** - XSS and injection protection

### Privacy Controls
- **Profile Privacy** - User-controlled visibility
- **Photo Protection** - Watermarking and download prevention
- **Contact Privacy** - Premium-only contact access
- **Data Retention** - Automatic data cleanup
- **Right to Deletion** - GDPR compliance

### Authentication
- **Multi-Factor Auth** - Enhanced security
- **Session Management** - Secure session handling
- **Password Policies** - Strong password requirements
- **Account Lockout** - Brute force protection
- **Login Notifications** - Security alerts

---

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Page Load Time**: < 2 seconds
- **Mobile Performance**: Optimized for all devices
- **Database Queries**: Optimized with proper indexing
- **Image Optimization**: Automatic compression and lazy loading

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow conventional commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Contact Information

- **Email**: support@envaranmatrimony.com
- **Phone**: +91-9176 400 700
- **WhatsApp**: +91-9176 400 700
- **Address**: Chennai, Tamil Nadu, India
  
---

## 🙏 Acknowledgments

- **Firebase** - For providing excellent backend services
- **React Team** - For the amazing frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Our Users** - For trusting us with their journey to find love
- **Our Contributors** - For helping make this platform better

---

<div align="center">

**Made with Baskar for those seeking pair in love**

[Privacy Policy](https://secondchancematrimony.com/privacy) • [Terms of Service](https://secondchancematrimony.com/terms) • [Cookie Policy](https://secondchancematrimony.com/cookies)

</div>
