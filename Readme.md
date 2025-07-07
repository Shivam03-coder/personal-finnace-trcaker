# FIN Tracker 💰

A modern, full-stack personal finance tracker built with Next.js 15, TypeScript, and Prisma. Track your income, expenses, and financial goals with an intuitive and responsive interface.

## 🚀 Features

- **📊 Dashboard Analytics** - Visual insights into your spending patterns with interactive charts
- **💳 Expense Tracking** - Add, edit, and categorize your transactions
- **📈 Income Management** - Track multiple income sources
- **🎯 Budget Planning** - Set and monitor budget goals
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🔐 Type-Safe** - Built with TypeScript for reliability
- **⚡ Performance** - Optimized with Next.js 15 and Turbo

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Primitive UI components
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization library

### Backend
- **tRPC** - End-to-end type-safe APIs
- **Prisma** - Type-safe database ORM
- **Zod** - Schema validation
- **TanStack Query** - Server state management

### Database & Storage
- **Prisma** - Database toolkit and ORM
- **Cloudinary** - Image and file storage

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **pnpm** - Fast, disk space efficient package manager

## 🏗️ Project Structure

```
fin-tracker/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   ├── server/
│   │   └── api/
│   └── types/
├── public/
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Database (MONGODB)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shivam03-coder/personal-finnace-trcaker.git"
cd fin-tracker
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
DATABASE_URL="your-database-url"
```

4. **Set up the database**
```bash
pnpm db:generate
pnpm db:migrate
pnpm seed
```

5. **Start the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbo
pnpm dev:db           # Start database studio

# Building
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Build and start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Prisma Studio
pnpm seed             # Seed the database

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm typecheck        # Run TypeScript compiler check
pnpm format:check     # Check code formatting
pnpm format:write     # Format code with Prettier
pnpm check            # Run linting and type checking
```

## 🎨 UI Components

This project uses a combination of:

- **Radix UI** - Unstyled, accessible components
- **shadcn/ui** - Pre-built components with Tailwind CSS
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **next-themes** - Dark mode support

## 📊 Data Visualization

- **Recharts** - Interactive charts and graphs
- **TanStack Table** - Powerful data tables
- **React DnD Kit** - Drag and drop functionality

## 🔒 Type Safety

- **TypeScript** - Static type checking
- **Zod** - Runtime schema validation
- **tRPC** - End-to-end type safety
- **Prisma** - Type-safe database queries

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js:

- **Railway**
- **Render**
- **DigitalOcean**
- **AWS**
- **Google Cloud**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Multi-currency support
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Export/Import functionality
- [ ] Receipt scanning with OCR
- [ ] Recurring transactions


Made with ❤️ by [Your Name](https://github.com/Shivam03-coder)

**⭐ Star this repository if you find it helpful!**
