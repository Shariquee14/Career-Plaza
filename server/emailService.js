import nodemailer from 'nodemailer';

/**
 * CAREER PLAZA Email Notification Service
 * Sends automated email alerts to careerplaza.work@gmail.com when a student enquiry is submitted.
 */

export async function sendEnquiryNotificationEmail(enquiry) {
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'careerplaza.work@gmail.com';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  const smtpUser = process.env.SMTP_USER || 'careerplaza.work@gmail.com';
  const smtpPass = process.env.SMTP_PASS || 'rvisyltidmvhocwq';
  const fromName = process.env.SMTP_FROM_NAME || 'CAREER PLAZA Admissions Desk';

  const formattedDate = new Date(enquiry.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `New Admission Enquiry – ${enquiry.fullName}${enquiry.subject ? ` [${enquiry.subject}]` : ''}`;

  const textBody = `
======================================================
CAREER PLAZA – NEW ADMISSION ENQUIRY NOTIFICATION
======================================================

A new admission enquiry has been submitted through the CAREER PLAZA website.

ENQUIRY DETAILS:
------------------------------------------------------
Enquiry ID:           ${enquiry.id}
Submission Date/Time: ${formattedDate} (IST)

Student Full Name:    ${enquiry.fullName}
Contact Phone:        ${enquiry.phone}
Email Address:        ${enquiry.email}
Service Interest:     ${enquiry.serviceInterest || 'Not Specified'}
Subject / Target:     ${enquiry.subject || 'General Enquiry'}

STUDENT MESSAGE / QUESTION:
------------------------------------------------------
${enquiry.message}

------------------------------------------------------
Admin Desk: Access and manage this enquiry at:
http://localhost:5173/admin

© CAREER PLAZA Admissions & Career Counselling
Official Email: ${targetEmail}
======================================================
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0b1b3d 0%, #1e3a8a 100%); color: #ffffff; padding: 28px 32px; text-align: left; }
    .header-tag { display: inline-block; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #cbd5e1; }
    .content { padding: 32px; }
    .alert-banner { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #1e40af; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table th { text-align: left; padding: 10px 12px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; width: 35%; }
    .info-table td { padding: 12px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
    .highlight-id { font-family: monospace; font-weight: 700; color: #2563eb; background: #dbeafe; padding: 2px 6px; border-radius: 4px; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 28px; }
    .message-box-title { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .message-box-content { font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; }
    .actions { display: flex; gap: 12px; margin-bottom: 24px; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; text-align: center; }
    .btn-primary { background: #2563eb; color: #ffffff !important; }
    .btn-secondary { background: #f1f5f9; color: #334155 !important; border: 1px solid #cbd5e1; }
    .footer { background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-tag">CAREER PLAZA ADMISSIONS DESK</div>
      <h1>New Student Admission Enquiry</h1>
      <p>A new prospective student has submitted an inquiry via the online counselling desk.</p>
    </div>

    <div class="content">
      <div class="alert-banner">
        <strong>Action Required:</strong> Please review student details and follow up within standard response window.
      </div>

      <table class="info-table">
        <tr>
          <th>Unique Enquiry ID</th>
          <td><span class="highlight-id">${enquiry.id}</span></td>
        </tr>
        <tr>
          <th>Submission Date/Time</th>
          <td>${formattedDate} (IST)</td>
        </tr>
        <tr>
          <th>Student Name</th>
          <td><strong>${enquiry.fullName}</strong></td>
        </tr>
        <tr>
          <th>Contact Phone</th>
          <td><a href="tel:${enquiry.phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${enquiry.phone}</a></td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td><a href="mailto:${enquiry.email}" style="color: #2563eb; text-decoration: none;">${enquiry.email}</a></td>
        </tr>
        <tr>
          <th>Service Interest</th>
          <td><span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 700;">${enquiry.serviceInterest || 'General'}</span></td>
        </tr>
        <tr>
          <th>Subject / Target Course</th>
          <td><strong>${enquiry.subject || 'Not specified'}</strong></td>
        </tr>
      </table>

      <div class="message-box">
        <div class="message-box-title">Student Message / Question:</div>
        <div class="message-box-content">${enquiry.message}</div>
      </div>

      <div style="text-align: center; padding-top: 8px;">
        <a href="mailto:${enquiry.email}?subject=Re:%20CAREER%20PLAZA%20Admission%20Enquiry%20[${enquiry.id}]" class="btn btn-primary" style="margin-right: 8px;">Reply via Email</a>
        <a href="tel:${enquiry.phone}" class="btn btn-secondary">Call Student</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">This automated alert was generated by the <strong>CAREER PLAZA Admissions System</strong>.</p>
      <p style="margin: 0; color: #94a3b8;">Recipient: ${targetEmail} • Managed via Admin Desk</p>
    </div>
  </div>
</body>
</html>
`;

  // Fallback to FormSubmit (Zero-password, direct Gmail delivery)
  if (!smtpUser || !smtpPass) {
    console.log(`ℹ️ [EMAIL SERVICE] SMTP credentials not set in .env. Attempting direct delivery to ${targetEmail} via FormSubmit...`);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://careerplaza.in',
        },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          'Enquiry Reference ID': enquiry.id,
          'Submission Date & Time': `${formattedDate} (IST)`,
          'Student Full Name': enquiry.fullName,
          'Contact Phone': enquiry.phone,
          'Email Address': enquiry.email,
          'Service Interest': enquiry.serviceInterest || 'General',
          'Subject / Target Course': enquiry.subject || 'General Enquiry',
          'Student Question / Message': enquiry.message,
          'Admin Desk': 'http://localhost:5173/admin',
        }),
      });

      const resData = await response.json();

      if (resData.success === 'true' || resData.success === true) {
        console.log(`✅ [EMAIL SERVICE] Notification delivered directly to ${targetEmail} via FormSubmit.`);
        return {
          success: true,
          status: 'sent',
          provider: 'formsubmit',
          message: `Email notification delivered to ${targetEmail}.`,
          targetEmail,
        };
      } else {
        console.log(`ℹ️ [EMAIL SERVICE] FormSubmit status: ${resData.message}`);
        return {
          success: true,
          status: 'activation_pending',
          provider: 'formsubmit',
          message: resData.message || 'Please check your inbox to click the one-time Activate link from FormSubmit.',
          targetEmail,
        };
      }
    } catch (fsErr) {
      console.warn('FormSubmit dispatcher failed:', fsErr.message);
      return {
        success: true,
        status: 'smtp_not_configured',
        message: 'Enquiry saved in database. Configure SMTP or activate FormSubmit to receive live emails.',
        targetEmail,
      };
    }
  }

  // Attempt live SMTP transmission
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${smtpUser}>`,
      to: targetEmail,
      replyTo: enquiry.email,
      subject: subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`✅ [EMAIL SERVICE] Notification successfully sent to ${targetEmail} (Message ID: ${info.messageId})`);
    return {
      success: true,
      status: 'sent',
      messageId: info.messageId,
      targetEmail,
    };
  } catch (err) {
    console.error(`❌ [EMAIL SERVICE] SMTP Delivery error:`, err.message);
    return {
      success: false,
      status: 'failed',
      error: err.message,
      targetEmail,
    };
  }
}

/**
 * Sends automated email notification when a full Admission Application is submitted.
 */
export async function sendApplicationNotificationEmail(application) {
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'careerplaza.work@gmail.com';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  const smtpUser = process.env.SMTP_USER || 'careerplaza.work@gmail.com';
  const smtpPass = process.env.SMTP_PASS || 'rvisyltidmvhocwq';
  const fromName = process.env.SMTP_FROM_NAME || 'CAREER PLAZA Admissions Desk';

  const formattedDate = new Date(application.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `New Student Application – ${application.fullName} [${application.preferredAdmissionCategory || 'General'} – ${application.preferredCourseOrProgramme || ''}]`;

  const textBody = `
======================================================
CAREER PLAZA – NEW STUDENT ADMISSION APPLICATION
======================================================

A student has submitted a complete admission application on the website.

APPLICATION DETAILS:
------------------------------------------------------
Application Ref ID:     ${application.id}
Submission Date/Time:   ${formattedDate} (IST)

STUDENT PERSONAL INFORMATION:
------------------------------------------------------
Full Name:              ${application.fullName}
Mobile Phone:           ${application.mobileNumber}
Email Address:          ${application.emailAddress}
Location:               ${application.currentCity}, ${application.currentState} (${application.country})

ACADEMIC BACKGROUND:
------------------------------------------------------
Highest Qualification:  ${application.highestQualification}
Current/Completed Stream: ${application.currentOrCompletedStream}
Current/Last Course:    ${application.currentOrLastCourse || 'N/A'}
Passing Year:           ${application.passingYear}
Academic Status:        ${application.academicStatus}

ADMISSION PREFERENCES:
------------------------------------------------------
Target Stream:          ${application.preferredAdmissionCategory}
Target Course / Degree: ${application.preferredCourseOrProgramme}
Location Preference:    ${application.preferredStudyLocation} (${application.preferredStateOrCountry})
Target Admission Year:  ${application.preferredAdmissionYear}
Preferred Institutes:   ${application.preferredCollegeOrUniversity || 'Open to recommendations'}

GUIDANCE & CAREER ASPIRATIONS:
------------------------------------------------------
Guidance Needed:        ${application.guidanceNeeded || 'General Advisory'}
Career Aspirations:     ${application.careerGoals || 'N/A'}
Additional Notes:       ${application.additionalNotes || 'N/A'}

------------------------------------------------------
Admin Desk: Access and manage this application at:
http://localhost:5173/admin

© CAREER PLAZA Admissions & Career Counselling
Official Email: ${targetEmail}
======================================================
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0b1b3d 0%, #1e3a8a 100%); color: #ffffff; padding: 28px 32px; }
    .header-tag { display: inline-block; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #cbd5e1; }
    .content { padding: 32px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #2563eb; letter-spacing: 0.05em; margin: 20px 0 10px 0; border-bottom: 2px solid #eff6ff; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .info-table th { text-align: left; padding: 8px 10px; background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; width: 38%; }
    .info-table td { padding: 8px 10px; font-size: 13px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9; }
    .highlight-id { font-family: monospace; font-weight: 700; color: #2563eb; background: #dbeafe; padding: 2px 6px; border-radius: 4px; }
    .highlight-badge { background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
    .quote-box { background: #f8fafc; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin-top: 6px; font-size: 13px; color: #334155; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; text-align: center; }
    .btn-primary { background: #2563eb; color: #ffffff !important; margin-right: 8px; }
    .btn-secondary { background: #f1f5f9; color: #334155 !important; border: 1px solid #cbd5e1; }
    .footer { background: #f8fafc; padding: 18px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-tag">NEW ADMISSION APPLICATION</div>
      <h1>${application.fullName}</h1>
      <p>Target Stream: ${application.preferredAdmissionCategory} • ${application.preferredCourseOrProgramme}</p>
    </div>

    <div class="content">
      <div class="section-title">Submission Identification</div>
      <table class="info-table">
        <tr><th>Application Ref ID</th><td><span class="highlight-id">${application.id}</span></td></tr>
        <tr><th>Submitted At</th><td>${formattedDate} (IST)</td></tr>
      </table>

      <div class="section-title">Personal Details</div>
      <table class="info-table">
        <tr><th>Full Name</th><td>${application.fullName}</td></tr>
        <tr><th>Contact Phone</th><td><a href="tel:${application.mobileNumber}" style="color: #2563eb; text-decoration: none;">${application.mobileNumber}</a></td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${application.emailAddress}" style="color: #2563eb; text-decoration: none;">${application.emailAddress}</a></td></tr>
        <tr><th>Location</th><td>${application.currentCity}, ${application.currentState} (${application.country})</td></tr>
      </table>

      <div class="section-title">Academic Background</div>
      <table class="info-table">
        <tr><th>Qualification</th><td>${application.highestQualification}</td></tr>
        <tr><th>Stream & Course</th><td>${application.currentOrCompletedStream} ${application.currentOrLastCourse ? `(${application.currentOrLastCourse})` : ''}</td></tr>
        <tr><th>Passing Year</th><td>${application.passingYear} (${application.academicStatus})</td></tr>
      </table>

      <div class="section-title">Admission Preferences</div>
      <table class="info-table">
        <tr><th>Target Stream</th><td><span class="highlight-badge">${application.preferredAdmissionCategory}</span></td></tr>
        <tr><th>Course / Degree</th><td><strong>${application.preferredCourseOrProgramme}</strong></td></tr>
        <tr><th>Location Preference</th><td>${application.preferredStudyLocation} (${application.preferredStateOrCountry})</td></tr>
        <tr><th>Target Intake</th><td>${application.preferredAdmissionYear}</td></tr>
        <tr><th>Preferred College(s)</th><td>${application.preferredCollegeOrUniversity || 'Open'}</td></tr>
      </table>

      <div class="section-title">Guidance & Aspirations</div>
      <table class="info-table">
        <tr><th>Guidance Scope</th><td>${application.guidanceNeeded || 'General Advisory'}</td></tr>
      </table>
      ${application.careerGoals ? `
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 8px;">Career Aspirations:</div>
      <div class="quote-box">"${application.careerGoals}"</div>
      ` : ''}

      <div style="text-align: center; padding-top: 24px;">
        <a href="tel:${application.mobileNumber}" class="btn btn-primary">Call Student (${application.mobileNumber})</a>
        <a href="mailto:${application.emailAddress}?subject=CAREER%20PLAZA%20Application%20Follow-up%20[${application.id}]" class="btn btn-secondary">Reply via Email</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">This automated alert was generated by the <strong>CAREER PLAZA Admissions System</strong>.</p>
      <p style="margin: 0; color: #94a3b8;">Recipient: ${targetEmail} • Managed via Admin Desk</p>
    </div>
  </div>
</body>
</html>
`;

  // Fallback to FormSubmit (Zero password direct Gmail delivery)
  if (!smtpUser || !smtpPass) {
    console.log(`ℹ️ [EMAIL SERVICE] SMTP credentials not set. Attempting direct delivery of Application to ${targetEmail} via FormSubmit...`);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://careerplaza.in',
        },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          'Application Reference ID': application.id,
          'Submission Date & Time': `${formattedDate} (IST)`,
          'Full Name': application.fullName,
          'Contact Phone': application.mobileNumber,
          'Email Address': application.emailAddress,
          'City & State': `${application.currentCity}, ${application.currentState} (${application.country})`,
          'Highest Qualification': application.highestQualification,
          'Stream': application.currentOrCompletedStream,
          'Target Stream': application.preferredAdmissionCategory,
          'Target Course': application.preferredCourseOrProgramme,
          'Location Preference': `${application.preferredStudyLocation} (${application.preferredStateOrCountry})`,
          'Target Intake Year': application.preferredAdmissionYear,
          'Preferred Institutes': application.preferredCollegeOrUniversity || 'Open',
          'Guidance Needed': application.guidanceNeeded || 'General',
          'Career Aspirations': application.careerGoals || 'N/A',
          'Admin Desk': 'http://localhost:5173/admin',
        }),
      });

      const resData = await response.json();
      if (resData.success === 'true' || resData.success === true) {
        console.log(`✅ [EMAIL SERVICE] Application notification delivered directly to ${targetEmail} via FormSubmit.`);
        return {
          success: true,
          status: 'sent',
          provider: 'formsubmit',
          message: `Application notification delivered to ${targetEmail}.`,
          targetEmail,
        };
      } else {
        console.log(`ℹ️ [EMAIL SERVICE] FormSubmit status: ${resData.message}`);
        return {
          success: true,
          status: 'activation_pending',
          provider: 'formsubmit',
          message: resData.message,
          targetEmail,
        };
      }
    } catch (fsErr) {
      console.warn('FormSubmit application dispatcher error:', fsErr.message);
      return {
        success: true,
        status: 'smtp_not_configured',
        targetEmail,
      };
    }
  }

  // Attempt live SMTP transmission
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${smtpUser}>`,
      to: targetEmail,
      replyTo: application.emailAddress,
      subject: subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`✅ [EMAIL SERVICE] Application notification sent to ${targetEmail} (Message ID: ${info.messageId})`);
    return {
      success: true,
      status: 'sent',
      messageId: info.messageId,
      targetEmail,
    };
  } catch (err) {
    console.error(`❌ [EMAIL SERVICE] Application SMTP Delivery error:`, err.message);
    return {
      success: false,
      status: 'failed',
      error: err.message,
      targetEmail,
    };
  }
}
