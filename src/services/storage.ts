import { ApplicationSubmission, StudentReview, ContactEnquiry, EnquiryStatus } from '../types';
import { INITIAL_APPROVED_REVIEWS } from '../data/config';
import { getAdminAuthHeaders } from './adminAuth';

export const STORAGE_KEYS = {
  APPLICATIONS: 'amarked_applications_v1',
  REVIEWS: 'amarked_reviews_v2',
  ENQUIRIES: 'amarked_enquiries_v1',
};

export const BACKEND_CONFIG = {
  endpoint: '/api',
  hasBackend: true
};

/* =========================================================================
   APPLICATION STORAGE & BACKEND SYNC
   ========================================================================= */

export async function fetchServerApplications(): Promise<ApplicationSubmission[]> {
  try {
    const res = await fetch('/api/admin/applications', {
      headers: getAdminAuthHeaders(),
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend applications fetch fallback to cache', err);
  }
  return getStoredApplications();
}

export function getStoredApplications(): ApplicationSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored applications from localStorage', e);
    return [];
  }
}

export async function saveApplicationSubmission(
  data: Omit<ApplicationSubmission, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; id: string; message: string }> {
  // First attempt backend save
  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        // Also sync local cache
        const existing = getStoredApplications();
        const savedItem = { ...data, id: result.id, createdAt: new Date().toISOString(), status: 'New' as const };
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([savedItem, ...existing]));
        return result;
      }
    }
  } catch (apiErr) {
    console.warn('Backend save unavailable, persisting locally', apiErr);
  }

  // Fallback local save & direct Gmail notification for static/Vercel hosting
  const id = 'APP-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);
  const newSubmission: ApplicationSubmission = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: 'New',
  };

  try {
    const existing = getStoredApplications();
    const updated = [newSubmission, ...existing];
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Local storage write failed for application', err);
  }

  // Direct Gmail alert via FormSubmit when backend is offline/static
  try {
    fetch('https://formsubmit.co/ajax/careerplaza.work@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New Admission Application – ${data.fullName} [${data.preferredAdmissionCategory} – ${data.preferredCourseOrProgramme}]`,
        _template: 'table',
        'Application Reference ID': id,
        'Student Full Name': data.fullName,
        'Contact Phone': data.mobileNumber,
        'Email Address': data.emailAddress,
        'Location': `${data.currentCity}, ${data.currentState} (${data.country})`,
        'Highest Qualification': data.highestQualification,
        'Stream & Course': `${data.currentOrCompletedStream} (${data.currentOrLastCourse || 'N/A'})`,
        'Passing Year': `${data.passingYear} (${data.academicStatus})`,
        'Target Stream': data.preferredAdmissionCategory,
        'Target Course': data.preferredCourseOrProgramme,
        'Location Preference': `${data.preferredStudyLocation} (${data.preferredStateOrCountry})`,
        'Target Intake Year': data.preferredAdmissionYear,
        'Preferred Colleges': data.preferredCollegeOrUniversity || 'Open',
        'Guidance Needed': data.guidanceNeeded,
        'Career Aspirations': data.careerGoals || 'N/A',
      }),
    }).catch(() => {});
  } catch (_) {}

  return {
    success: true,
    id,
    message: 'Your application has been securely recorded. Our counselling desk will contact you within 24 business hours.',
  };
}

export async function updateApplicationStatus(id: string, status: 'New' | 'Under Review' | 'Contacted'): Promise<boolean> {
  try {
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.warn('Backend update failed, falling back to local', e);
  }

  try {
    const existing = getStoredApplications();
    const updated = existing.map(app => app.id === id ? { ...app, status } : app);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteApplication(id: string): Promise<boolean> {
  try {
    await fetch(`/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
    });
  } catch (e) {
    console.warn('Backend delete failed, falling back to local', e);
  }

  try {
    const existing = getStoredApplications();
    const updated = existing.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

/* =========================================================================
   STUDENT REVIEWS & MODERATION SYSTEM
   ========================================================================= */

export async function fetchServerApprovedReviews(): Promise<StudentReview[]> {
  try {
    const res = await fetch('/api/reviews/approved');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Approved reviews fetch failed, using cache', err);
  }
  return getApprovedReviews();
}

export async function fetchServerAdminReviews(): Promise<StudentReview[]> {
  try {
    const res = await fetch('/api/admin/reviews', {
      headers: getAdminAuthHeaders(),
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Admin reviews fetch fallback to cache', err);
  }
  return getAllReviews();
}

export function getAllReviews(): StudentReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_APPROVED_REVIEWS));
      return INITIAL_APPROVED_REVIEWS;
    }
    const parsed: StudentReview[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 68 || parsed.some(r => r.id === 'rev-01' && r.studentName.includes('Aman S.'))) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_APPROVED_REVIEWS));
      return INITIAL_APPROVED_REVIEWS;
    }
    return parsed;
  } catch (e) {
    return INITIAL_APPROVED_REVIEWS;
  }
}

export function getApprovedReviews(): StudentReview[] {
  const all = getAllReviews();
  return all.filter(r => r.status === 'approved');
}

export function getPendingReviews(): StudentReview[] {
  const all = getAllReviews();
  return all.filter(r => r.status === 'pending');
}

export async function submitStudentReview(
  data: Omit<StudentReview, 'id' | 'createdAt' | 'status' | 'avatarSeed' | 'avatarColor'>
): Promise<{ success: boolean; id: string; message: string }> {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) return result;
    }
  } catch (e) {
    console.warn('Backend review submit unavailable, fallback to local', e);
  }

  // Fallback
  const id = 'REV-' + Date.now().toString(36).toUpperCase();
  const colors = ['#2563eb', '#0d9488', '#ea580c', '#9333ea', '#059669', '#0284c7'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newReview: StudentReview = {
    ...data,
    id,
    createdAt: new Date().toISOString().split('T')[0],
    avatarSeed: data.studentName.replace(/[^a-zA-Z]/g, '') || 'Student',
    avatarColor,
    status: 'pending',
    isSample: false,
  };

  try {
    const existing = getAllReviews();
    const updated = [newReview, ...existing];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return {
    success: true,
    id,
    message: 'Thank you for sharing your experience! Your review has been submitted and is currently pending verification by our moderation team before appearing on the public website.',
  };
}

export async function moderateReview(id: string, action: 'approved' | 'rejected'): Promise<boolean> {
  try {
    await fetch(`/api/admin/reviews/${id}/moderate`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status: action }),
    });
  } catch (e) {
    console.warn('Backend review moderation failed, fallback to local', e);
  }

  try {
    const existing = getAllReviews();
    const updated = existing.map(r => r.id === id ? { ...r, status: action } : r);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
      credentials: 'include',
    });
  } catch (e) {
    console.warn('Backend review delete failed, fallback to local', e);
  }

  try {
    const existing = getAllReviews();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

/* =========================================================================
   CONTACT ENQUIRIES
   ========================================================================= */

export async function saveContactEnquiry(
  data: Omit<ContactEnquiry, 'id' | 'createdAt'>
): Promise<{ success: boolean; id: string; message: string }> {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      // Also cache in local storage for resilience
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
        const existing = raw ? JSON.parse(raw) : [];
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([result.enquiry || { ...data, id: result.id, createdAt: new Date().toISOString() }, ...existing]));
      } catch (cacheErr) {
        console.warn('LocalStorage cache failed:', cacheErr);
      }
      return result;
    } else {
      return {
        success: false,
        id: '',
        message: result.error || 'Failed to record enquiry. Please check your details and try again.',
      };
    }
  } catch (e) {
    console.warn('Backend enquiry endpoint unreachable, saving to local offline queue', e);
  }

  // Offline fallback
  const id = 'ENQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
  const newEnquiry: ContactEnquiry = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: 'New',
    emailDeliveryStatus: 'pending',
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    const existing = raw ? JSON.parse(raw) : [];
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([newEnquiry, ...existing]));
  } catch (e) {
    console.error(e);
  }

  // Direct Gmail alert via FormSubmit when backend is offline/static on Vercel
  try {
    fetch('https://formsubmit.co/ajax/careerplaza.work@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New Admission Enquiry – ${data.fullName} [${data.subject || data.serviceInterest}]`,
        _template: 'table',
        'Enquiry Reference ID': id,
        'Student Full Name': data.fullName,
        'Contact Phone': data.phone,
        'Email Address': data.email,
        'Service Interest': data.serviceInterest,
        'Subject / Target Course': data.subject,
        'Student Question / Message': data.message,
      }),
    }).catch(() => {});
  } catch (_) {}

  return {
    success: true,
    id,
    message: 'Thank you for reaching out! Your enquiry has been saved and our team has been notified.',
  };
}

export function getStoredEnquiries(): ContactEnquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading enquiries from localStorage', e);
    return [];
  }
}

export async function fetchServerEnquiries(): Promise<ContactEnquiry[]> {
  try {
    const res = await fetch('/api/admin/enquiries', {
      credentials: 'include',
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(result.data));
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch enquiries from server API, using local storage cache', err);
  }
  return getStoredEnquiries();
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) {
      const result = await res.json();
      return result.success;
    }
  } catch (err) {
    console.error('Failed to update enquiry status on server', err);
  }

  // Local fallback
  try {
    const enquiries = getStoredEnquiries();
    const updated = enquiries.map((enq) =>
      enq.id === id ? { ...enq, status, notes: notes !== undefined ? notes : enq.notes } : enq
    );
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to update enquiry in localStorage', err);
    return false;
  }
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      const result = await res.json();
      return result.success;
    }
  } catch (err) {
    console.error('Failed to delete enquiry from server', err);
  }

  // Local fallback
  try {
    const enquiries = getStoredEnquiries();
    const filtered = enquiries.filter((enq) => enq.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete enquiry in localStorage', err);
    return false;
  }
}

export async function resendEnquiryEmail(
  id: string
): Promise<{ success: boolean; message: string; status?: string }> {
  try {
    const res = await fetch(`/api/admin/enquiries/${id}/resend-email`, {
      method: 'POST',
      credentials: 'include',
    });
    const result = await res.json();
    return result;
  } catch (err) {
    return { success: false, message: 'Network error communicating with server.' };
  }
}
