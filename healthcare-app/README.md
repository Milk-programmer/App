# HealthCare Pro - Complete Hospital Appointment System

A comprehensive 24/7 hospital appointment scheduling application with Google Sheets integration.

## Features

### 🏥 Complete Hospital Services
- **Emergency & Critical Care**: ER, Trauma Center, ICU, Ambulance
- **Surgical Services**: Cardiac, Orthopedic, Neurological, General, Plastic, Urological, Gynecological, ENT, Ophthalmic, Vascular, Oncological, Bariatric, Transplant
- **Medical Consultations**: Cardiology, Neurology, Endocrinology, Gastroenterology, Pulmonology, Nephrology, Rheumatology, Dermatology, Psychiatry, Oncology, and more
- **Diagnostics & Imaging**: X-Ray, CT Scan, MRI, Ultrasound, Mammography, Blood Tests, Pathology, ECG/EKG
- **Treatment & Therapy**: Chemotherapy, Radiation, Dialysis, Physical/Occupational/Speech Therapy
- **Women & Children**: Obstetrics, Gynecology, Prenatal, Pediatrics, NICU, Fertility
- **Preventive & Wellness**: Checkups, Vaccinations, Screenings, Nutrition Counseling
- **Specialized Services**: Dental, Vision, Hearing, Pain Management, Sleep Medicine, Rehabilitation

### ⏰ 24/7 Operation with Two Shifts
- **Morning Shift**: 9:00 AM to 10:00 PM (13 hours)
- **Night Shift**: 10:00 PM to 9:00 AM (11 hours)

### 👥 Patient Types Supported
- Adult (18-64 years)
- Pediatric (0-17 years)
- Senior (65+ years)
- Pregnant / Maternity
- Critical Care
- Outpatient
- Inpatient Transfer
- Emergency

### 📊 Google Sheets Integration
Automatically sync all appointments to Google Sheets with:
- Timestamp tracking
- Patient information (name, phone, email)
- Patient type and service/department
- Appointment date, time, and shift assignment
- Additional notes
- Status tracking (Confirmed/Cancelled)
- Color-coded rows by shift

## Quick Start

### Option 1: Open Directly in Browser
Simply open `index.html` in any modern web browser.

### Option 2: Run Local Server
```bash
cd /workspace/healthcare-app
python3 -m http.server 8080
```
Then visit: http://localhost:8080

## Google Sheets Setup Instructions

### Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the entire content from `google-apps-script.js`
5. Save the project (give it a name like "HealthCare Pro API")

### Step 2: Deploy as Web App
1. Click the "Deploy" button (top right)
2. Select "New deployment"
3. Click the gear icon next to "Select type"
4. Choose "Web app"
5. Set:
   - Description: "HealthCare Pro API"
   - Execute as: "Me"
   - Who has access: "Anyone" (or "Anyone with Google account")
6. Click "Deploy"
7. Authorize the script when prompted
8. Copy the Web App URL (looks like: `https://script.google.com/macros/s/.../exec`)

### Step 3: Configure the App
1. Open the HealthCare Pro app in your browser
2. Click the "⚙️ Google Sheets Setup" button
3. Paste your Web App URL
4. Click "Save Configuration"
5. Click "Test Connection" to verify

### Step 4: Verify
1. Book a test appointment in the app
2. Check your Google Drive for a new spreadsheet called "Hospital Appointments"
3. Verify the appointment appears in the sheet

## How to Use the App

### Booking an Appointment
1. Click "📅 Book Appointment" or type "book appointment" in chat
2. Fill in all required fields:
   - Patient Full Name *
   - Contact Phone *
   - Service/Department *
   - Preferred Date *
   - Preferred Time *
3. Optional: Add email and notes
4. Click "Confirm & Save to Google Sheets"

### Viewing Appointments
1. Click "📋 View Appointments"
2. See all upcoming appointments with details
3. Cancel individual appointments if needed

### Exploring Services
1. Click "🏥 Our Services" to see all available departments
2. Organized by category for easy browsing

### Chat Assistant
Type natural language queries like:
- "I need to book an appointment"
- "What services do you offer?"
- "What are your operating hours?"
- "I have an emergency"

## File Structure
```
healthcare-app/
├── index.html              # Main application (single-file app)
├── google-apps-script.js   # Google Apps Script for Sheets integration
└── README.md              # This file
```

## Technical Details

### Data Storage
- **Local**: Appointments are saved in browser's localStorage (persists across sessions)
- **Cloud**: With Google Sheets configured, appointments sync to the cloud

### Shift Detection
The app automatically detects which shift an appointment falls into:
- **Morning Shift**: Times from 09:00 to 21:59
- **Night Shift**: Times from 22:00 to 08:59

### Browser Compatibility
Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

Mobile-responsive design works on phones and tablets.

## Security Notes

### For Production Use
1. Restrict Google Apps Script access to specific users/domains
2. Add authentication to the web app
3. Implement HIPAA compliance measures for patient data
4. Use HTTPS for the web app
5. Add data encryption for sensitive information

### Current Limitations
- No user authentication (for demo purposes)
- CORS restrictions require `no-cors` mode for fetch requests
- Google Sheets is publicly accessible with the link (configure appropriately for production)

## Support

For issues or questions:
1. Check that Google Apps Script is deployed correctly
2. Verify the Web App URL is correct
3. Check browser console for errors (F12 > Console)
4. Ensure localStorage is enabled in your browser

---

**HealthCare Pro** - Your Complete 24/7 Hospital Appointment Solution 🏥
