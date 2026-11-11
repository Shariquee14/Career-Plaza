# CAREER PLAZA – Official Education & Career Advisory Portal

Official online admission advisory, career counselling, and student intake platform for **CAREER PLAZA**.

## 🌟 Features

- **Full Student Application Intake:** Multi-section application form supporting undergraduate, postgraduate, engineering, medical (MBBS), study abroad, and management streams.
- **Admission Enquiry System:** Dedicated enquiry form with real-time automated email notifications dispatched directly to `careerplaza.work@gmail.com`.
- **Admin Desk Console (`/admin`):**
  - Applications Intake Management with Excel (.xlsx) export
  - Admission Enquiries Management with status workflow (`New`, `Contacted`, `In Progress`, `Completed`) and Excel export
  - Student Reviews Moderation desk
  - Cryptographic backend session authentication
- **Community Reviews Carousel:** 68 verified student testimonials rotating seamlessly with auto-scroll and hover-to-pause.
- **Responsive Modern UI:** Built with Tailwind CSS, Lucide icons, and modern interactive elements.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
PORT=5000
NOTIFICATION_EMAIL=careerplaza.work@gmail.com
```

### 3. Run Development Server
```bash
npm run dev
```
- Frontend: `http://localhost:5173/`
- Admin Desk: `http://localhost:5173/admin`
- Backend Server: `http://localhost:5000/`

### 4. Build for Production
```bash
npm run build
```

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend:** Node.js, Express, Nodemailer, SheetJS (xlsx), Cookie Parser, BcryptJS
- **Storage:** Persistent JSON data storage with automated backup exports

© CAREER PLAZA – All Rights Reserved.
