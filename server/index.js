import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import { 
  verifyAdminCredentials, 
  createAdminSession, 
  destroyAdminSession, 
  requireAdminAuth, 
  getSessionUser 
} from './auth.js';
import { 
  sendEnquiryNotificationEmail, 
  sendApplicationNotificationEmail 
} from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Data persistence paths
const DATA_DIR = path.join(__dirname, 'data');
const APPS_FILE = path.join(DATA_DIR, 'applications.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Initial Sample Reviews Seed for fresh server start
const INITIAL_REVIEWS_SEED = [
  {
    id: 'rev-01',
    studentName: 'Aman S. (Student)',
    course: 'B.Tech Computer Science',
    destination: 'Bengaluru, Karnataka',
    category: 'Engineering',
    rating: 5,
    writtenExperience: 'The counselling session at CAREER PLAZA gave me absolute clarity on selecting the right engineering branch. The team explained eligibility criteria, entrance cutoffs, and campus placements transparently.',
    avatarSeed: 'Aman',
    avatarColor: '#2563eb',
    status: 'approved',
    createdAt: '2026-09-15',
    isSample: true
  },
  {
    id: 'rev-02',
    studentName: 'Priya M. (Student)',
    course: 'M.Sc Data Science & AI',
    destination: 'Munich, Germany',
    category: 'Study Abroad',
    rating: 5,
    writtenExperience: 'Studying in Germany was my dream, but documentation and APS requirements felt overwhelming. CAREER PLAZA systematically broke down every deadline and university checklist. Highly recommended guidance.',
    avatarSeed: 'Priya',
    avatarColor: '#0d9488',
    status: 'approved',
    createdAt: '2026-09-28',
    isSample: true
  },
  {
    id: 'rev-03',
    studentName: 'Rahul K. (Student)',
    course: 'MBBS Programme Guidance',
    destination: 'Maharashtra, India',
    category: 'Medical',
    rating: 5,
    writtenExperience: 'Navigating medical seat allocations and counselling rounds is complex. The counsellors were patient, verified my eligibility meticulously, and helped my parents make an informed, stress-free decision.',
    avatarSeed: 'Rahul',
    avatarColor: '#ea580c',
    status: 'approved',
    createdAt: '2026-10-04',
    isSample: true
  },
  {
    id: 'rev-04',
    studentName: 'Ananya D. (Student)',
    course: 'MBA in Financial Management',
    destination: 'Mumbai, India',
    category: 'MBA / Management',
    rating: 5,
    writtenExperience: 'Clear comparison of PGDM versus MBA curricula, accreditation, and industry exposure. I appreciated that they never made false promises and focused on my long-term career growth.',
    avatarSeed: 'Ananya',
    avatarColor: '#9333ea',
    status: 'approved',
    createdAt: '2026-10-12',
    isSample: true
  }
];

if (!fs.existsSync(REVIEWS_FILE)) {
  writeJsonFile(REVIEWS_FILE, INITIAL_REVIEWS_SEED);
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Security: Rate limiter for Admin Login to prevent brute-force attacks
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
  },
});

/* =========================================================================
   AUTHENTICATION ROUTES
   ========================================================================= */

/**
 * POST /api/admin/login
 * Strictly verifies the 4 authorized credentials using bcrypt
 */
app.post('/api/admin/login', loginRateLimiter, (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Admin ID or Password. Please try again.',
    });
  }

  const authenticatedUser = verifyAdminCredentials(username, password);

  if (!authenticatedUser) {
    return res.status(401).json({
      success: false,
      error: 'Invalid Admin ID or Password. Please try again.',
    });
  }

  // Issue cryptographically secure session
  const sessionToken = createAdminSession(authenticatedUser);

  // Set HttpOnly Secure Cookie (2 Hours Expiration)
  res.cookie('amarked_admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    token: sessionToken,
    user: authenticatedUser,
    message: `Authentication successful. Welcome, ${authenticatedUser.name}.`,
  });
});

/**
 * POST /api/admin/logout
 * Destroys session and clears cookie
 */
app.post('/api/admin/logout', (req, res) => {
  const token = 
    req.cookies?.amarked_admin_session ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (token) {
    destroyAdminSession(token);
  }

  res.clearCookie('amarked_admin_session');
  return res.json({
    success: true,
    message: 'Logged out successfully. Session invalidated.',
  });
});

/**
 * GET /api/admin/me
 * Returns current authenticated admin or 401
 */
app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  return res.json({
    success: true,
    user: req.adminUser,
  });
});

/* =========================================================================
   PROTECTED ADMIN DATA ROUTES (REQUIRE AUTHENTICATION)
   ========================================================================= */

/**
 * GET /api/admin/applications
 * Returns all student applications (Protected)
 */
app.get('/api/admin/applications', requireAdminAuth, (req, res) => {
  const apps = readJsonFile(APPS_FILE);
  return res.json({ success: true, data: apps });
});

/**
 * GET /api/admin/applications/export-excel
 * Downloads all student applications in Excel (.xlsx) format (Protected)
 */
app.get('/api/admin/applications/export-excel', requireAdminAuth, (req, res) => {
  try {
    const apps = readJsonFile(APPS_FILE);
    const rows = apps.map((app) => ({
      'Reference ID': app.id || '',
      'Application Date': app.createdAt ? new Date(app.createdAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) : '',
      'Application Status': app.status || 'New',
      'Student Full Name': app.fullName || '',
      'Phone Number': String(app.mobileNumber || ''),
      'Email Address': app.emailAddress || '',
      'Location / City': app.currentCity || '',
      'State': app.currentState || '',
      'Country': app.country || 'India',
      'Education Level': app.highestQualification || '',
      'Stream / Discipline': app.currentOrCompletedStream || '',
      'Last Course / School / College': app.currentOrLastCourse || '',
      'Passing Year': app.passingYear || '',
      'Academic Status': app.academicStatus || '',
      'Target Stream': app.preferredAdmissionCategory || '',
      'Course / Programme': app.preferredCourseOrProgramme || '',
      'Location Preference': app.preferredStudyLocation || '',
      'Preferred State or Country': app.preferredStateOrCountry || '',
      'Target Intake': app.preferredAdmissionYear || '',
      'Preferred College / University': app.preferredCollegeOrUniversity || 'Not specified',
      'Career Aspirations': app.careerGoals || '',
      'Preferred Colleges List': app.preferredCollegesList || 'None',
      'Guidance Needed': app.guidanceNeeded || '',
      'Additional Notes': app.additionalNotes || 'None',
      'Privacy Consent': app.privacyConsent ? 'Granted' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Format phone numbers explicitly as text strings so Excel preserves leading zeros and format
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: 4 });
      if (worksheet[cellRef]) {
        worksheet[cellRef].t = 's';
        worksheet[cellRef].z = '@';
      }
    }

    worksheet['!cols'] = [
      { wch: 22 }, // Reference ID
      { wch: 22 }, // Application Date
      { wch: 18 }, // Application Status
      { wch: 24 }, // Student Full Name
      { wch: 20 }, // Phone Number
      { wch: 28 }, // Email Address
      { wch: 18 }, // Location / City
      { wch: 18 }, // State
      { wch: 14 }, // Country
      { wch: 20 }, // Education Level
      { wch: 22 }, // Stream / Discipline
      { wch: 26 }, // Last Course / School / College
      { wch: 14 }, // Passing Year
      { wch: 16 }, // Academic Status
      { wch: 20 }, // Target Stream
      { wch: 26 }, // Course / Programme
      { wch: 22 }, // Location Preference
      { wch: 24 }, // Preferred State or Country
      { wch: 16 }, // Target Intake
      { wch: 28 }, // Preferred College / University
      { wch: 32 }, // Career Aspirations
      { wch: 26 }, // Preferred Colleges List
      { wch: 32 }, // Guidance Needed
      { wch: 26 }, // Additional Notes
      { wch: 16 }  // Privacy Consent
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Applications');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="CAREER_PLAZA_Applications_${dateStr}.xlsx"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Excel export error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate Excel export' });
  }
});

/**
 * PATCH /api/admin/applications/:id
 * Update application status (Protected)
 */
app.patch('/api/admin/applications/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const apps = readJsonFile(APPS_FILE);

  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  apps[idx].status = status;
  writeJsonFile(APPS_FILE, apps);
  return res.json({ success: true, data: apps[idx] });
});

/**
 * DELETE /api/admin/applications/:id
 * Delete application record (Protected)
 */
app.delete('/api/admin/applications/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const apps = readJsonFile(APPS_FILE);
  const filtered = apps.filter(a => a.id !== id);
  writeJsonFile(APPS_FILE, filtered);
  return res.json({ success: true, message: 'Application deleted successfully' });
});

/**
 * GET /api/admin/reviews
 * Returns all reviews for moderation (Protected)
 */
app.get('/api/admin/reviews', requireAdminAuth, (req, res) => {
  const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS_SEED);
  return res.json({ success: true, data: reviews });
});

/**
 * PATCH /api/admin/reviews/:id/moderate
 * Approve or reject review (Protected)
 */
app.patch('/api/admin/reviews/:id/moderate', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected'
  const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS_SEED);

  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  reviews[idx].status = status;
  writeJsonFile(REVIEWS_FILE, reviews);
  return res.json({ success: true, data: reviews[idx] });
});

/**
 * DELETE /api/admin/reviews/:id
 * Delete review permanently (Protected)
 */
app.delete('/api/admin/reviews/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS_SEED);
  const filtered = reviews.filter(r => r.id !== id);
  writeJsonFile(REVIEWS_FILE, filtered);
  return res.json({ success: true, message: 'Review deleted successfully' });
});

/* =========================================================================
   PUBLIC CLIENT ROUTES
   ========================================================================= */

/**
 * POST /api/applications
 * Public student application intake
 * Saves application to database & dispatches automated email notification to careerplaza.work@gmail.com
 */
app.post('/api/applications', async (req, res) => {
  const body = req.body;
  if (!body.fullName || !body.mobileNumber || !body.emailAddress) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }

  const id = 'APP-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);
  const newApp = {
    ...body,
    id,
    createdAt: new Date().toISOString(),
    status: 'New',
    emailDeliveryStatus: 'pending',
  };

  // 1. Save to Database FIRST (guaranteed persistent storage)
  const apps = readJsonFile(APPS_FILE);
  apps.unshift(newApp);
  writeJsonFile(APPS_FILE, apps);

  // 2. Dispatch automated email notification to careerplaza.work@gmail.com
  let emailResult = { success: false, status: 'pending' };
  try {
    emailResult = await sendApplicationNotificationEmail(newApp);
    newApp.emailDeliveryStatus = emailResult.status || (emailResult.success ? 'sent' : 'failed');
    if (emailResult.error) {
      newApp.emailDeliveryError = emailResult.error;
    }
  } catch (emailErr) {
    console.error('Application email dispatcher error (non-fatal):', emailErr);
    newApp.emailDeliveryStatus = 'failed';
    newApp.emailDeliveryError = emailErr.message;
  }

  // Update application record in database with delivery status
  const updatedApps = readJsonFile(APPS_FILE);
  const idx = updatedApps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    updatedApps[idx] = newApp;
    writeJsonFile(APPS_FILE, updatedApps);
  }

  return res.json({
    success: true,
    id,
    message: 'Your application has been securely recorded. Our counselling desk has received your details and will contact you within 24 business hours.',
    application: newApp,
  });
});

/**
 * GET /api/reviews/approved
 * Public endpoint returning only approved reviews
 */
app.get('/api/reviews/approved', (req, res) => {
  const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS_SEED);
  const approved = reviews.filter(r => r.status === 'approved');
  return res.json({ success: true, data: approved });
});

/**
 * POST /api/reviews
 * Public review submission — Enters pending moderation
 */
app.post('/api/reviews', (req, res) => {
  const body = req.body;
  if (!body.studentName || !body.writtenExperience) {
    return res.status(400).json({ success: false, error: 'Review content missing' });
  }

  const id = 'REV-' + Date.now().toString(36).toUpperCase();
  const colors = ['#2563eb', '#0d9488', '#ea580c', '#9333ea', '#059669', '#0284c7'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newReview = {
    ...body,
    id,
    createdAt: new Date().toISOString().split('T')[0],
    avatarSeed: body.studentName.replace(/[^a-zA-Z]/g, '') || 'Student',
    avatarColor,
    status: 'pending', // Strictly pending verification
    isSample: false,
  };

  const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS_SEED);
  reviews.unshift(newReview);
  writeJsonFile(REVIEWS_FILE, reviews);

  return res.json({
    success: true,
    id,
    message: 'Thank you for sharing your experience! Your review has been submitted and is currently pending verification by our moderation team before appearing on the public website.',
  });
});

/**
 * POST /api/enquiries
 * Public contact & admission enquiry submission
 * Saves enquiry to database & dispatches automated email to careerplaza.work@gmail.com
 */
app.post('/api/enquiries', async (req, res) => {
  const { fullName, email, phone, subject, serviceInterest, message, honeypot } = req.body || {};

  // Spam protection: honeypot check
  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Spam detected.' });
  }

  // Server-side validation
  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ success: false, error: 'Full name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ success: false, error: 'Contact phone number is required.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message / specific question is required.' });
  }

  const id = 'ENQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
  const createdAt = new Date().toISOString();

  const newEnquiry = {
    id,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: subject?.trim() || 'General Admission Enquiry',
    serviceInterest: serviceInterest || 'General Counselling',
    message: message.trim(),
    createdAt,
    status: 'New',
    emailDeliveryStatus: 'pending',
  };

  // 1. Save to Database FIRST (guaranteed persistent storage)
  const enquiries = readJsonFile(ENQUIRIES_FILE);
  enquiries.unshift(newEnquiry);
  writeJsonFile(ENQUIRIES_FILE, enquiries);

  // 2. Dispatch automated email alert to careerplaza.work@gmail.com
  let emailResult = { success: false, status: 'pending' };
  try {
    emailResult = await sendEnquiryNotificationEmail(newEnquiry);
    newEnquiry.emailDeliveryStatus = emailResult.status || (emailResult.success ? 'sent' : 'failed');
    if (emailResult.error) {
      newEnquiry.emailDeliveryError = emailResult.error;
    }
  } catch (emailErr) {
    console.error('Email dispatcher error (non-fatal):', emailErr);
    newEnquiry.emailDeliveryStatus = 'failed';
    newEnquiry.emailDeliveryError = emailErr.message;
  }

  // Update record in database with delivery status
  const updatedEnquiries = readJsonFile(ENQUIRIES_FILE);
  const idx = updatedEnquiries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    updatedEnquiries[idx] = newEnquiry;
    writeJsonFile(ENQUIRIES_FILE, updatedEnquiries);
  }

  return res.json({
    success: true,
    id,
    message: 'Thank you! Your enquiry has been safely received. A notification has been forwarded to our admissions desk at careerplaza.work@gmail.com.',
    enquiry: newEnquiry,
  });
});

/**
 * GET /api/admin/enquiries
 * Returns all submitted student enquiries (Protected)
 */
app.get('/api/admin/enquiries', requireAdminAuth, (req, res) => {
  const enquiries = readJsonFile(ENQUIRIES_FILE);
  return res.json({ success: true, data: enquiries });
});

/**
 * PATCH /api/admin/enquiries/:id
 * Updates enquiry status and admin notes (Protected)
 */
app.patch('/api/admin/enquiries/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['New', 'Contacted', 'In Progress', 'Completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid enquiry status.' });
  }

  const enquiries = readJsonFile(ENQUIRIES_FILE);
  const enquiryIndex = enquiries.findIndex((e) => e.id === id);

  if (enquiryIndex === -1) {
    return res.status(404).json({ success: false, error: 'Enquiry not found.' });
  }

  if (status) enquiries[enquiryIndex].status = status;
  if (notes !== undefined) enquiries[enquiryIndex].notes = notes;
  enquiries[enquiryIndex].updatedAt = new Date().toISOString();

  writeJsonFile(ENQUIRIES_FILE, enquiries);

  return res.json({
    success: true,
    message: 'Enquiry updated successfully.',
    data: enquiries[enquiryIndex],
  });
});

/**
 * DELETE /api/admin/enquiries/:id
 * Deletes an enquiry record (Protected)
 */
app.delete('/api/admin/enquiries/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const enquiries = readJsonFile(ENQUIRIES_FILE);
  const filtered = enquiries.filter((e) => e.id !== id);

  if (filtered.length === enquiries.length) {
    return res.status(404).json({ success: false, error: 'Enquiry not found.' });
  }

  writeJsonFile(ENQUIRIES_FILE, filtered);
  return res.json({ success: true, message: 'Enquiry deleted successfully.' });
});

/**
 * POST /api/admin/enquiries/:id/resend-email
 * Re-attempts sending the notification email for an enquiry (Protected)
 */
app.post('/api/admin/enquiries/:id/resend-email', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const enquiries = readJsonFile(ENQUIRIES_FILE);
  const enquiry = enquiries.find((e) => e.id === id);

  if (!enquiry) {
    return res.status(404).json({ success: false, error: 'Enquiry not found.' });
  }

  const emailResult = await sendEnquiryNotificationEmail(enquiry);
  enquiry.emailDeliveryStatus = emailResult.status || (emailResult.success ? 'sent' : 'failed');
  if (emailResult.error) {
    enquiry.emailDeliveryError = emailResult.error;
  } else {
    delete enquiry.emailDeliveryError;
  }
  enquiry.lastEmailAttemptAt = new Date().toISOString();

  writeJsonFile(ENQUIRIES_FILE, enquiries);

  return res.json({
    success: emailResult.success,
    status: enquiry.emailDeliveryStatus,
    message: emailResult.message || (emailResult.success ? 'Email sent successfully.' : 'Email sending failed: ' + emailResult.error),
  });
});

/**
 * GET /api/admin/enquiries/export-excel
 * Downloads all student enquiries in Excel (.xlsx) format (Protected)
 */
app.get('/api/admin/enquiries/export-excel', requireAdminAuth, (req, res) => {
  try {
    const enquiries = readJsonFile(ENQUIRIES_FILE);

    if (!enquiries || enquiries.length === 0) {
      return res.status(400).json({ success: false, error: 'No enquiries to export.' });
    }

    const rows = enquiries.map((enq) => ({
      'Enquiry ID': enq.id || '',
      'Submission Date & Time': enq.createdAt ? new Date(enq.createdAt).toLocaleString('en-IN') : '',
      'Status': enq.status || 'New',
      'Full Name': enq.fullName || '',
      'Contact Phone': enq.phone ? String(enq.phone) : '',
      'Email Address': enq.email || '',
      'Service Interest': enq.serviceInterest || '',
      'Subject / Target Course': enq.subject || '',
      'Student Message / Question': enq.message || '',
      'Email Notification Status': enq.emailDeliveryStatus || 'pending',
      'Admin Notes': enq.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: 4 });
      if (worksheet[cellRef]) {
        worksheet[cellRef].t = 's';
      }
    }

    worksheet['!cols'] = [
      { wch: 18 }, // Enquiry ID
      { wch: 24 }, // Submission Date
      { wch: 14 }, // Status
      { wch: 22 }, // Full Name
      { wch: 18 }, // Contact Phone
      { wch: 30 }, // Email Address
      { wch: 24 }, // Service Interest
      { wch: 30 }, // Subject
      { wch: 50 }, // Message
      { wch: 22 }, // Email Notification Status
      { wch: 30 }, // Admin Notes
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admission Enquiries');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="CAREER_PLAZA_Enquiries_${dateStr}.xlsx"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Error generating enquiries excel:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate Excel export.' });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', service: 'CAREER PLAZA Secure Backend' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[CAREER PLAZA Security Engine] Backend server listening on port ${PORT}`);
  });
}

export default app;
