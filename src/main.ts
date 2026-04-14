// Converted and typed version of the inline script from index.html

type ConversationState =
  | 'initial'
  | 'service_category'
  | 'service_selection'
  | 'patient_type'
  | 'date_input'
  | 'time_input'
  | 'name'
  | 'contact'
  | 'email'
  | 'confirm'
  | 'emergency'
  | 'emergency_details'
  | 'services_info';

interface AppointmentData {
  service?: string;
  serviceCategory?: string;
  patientType?: string;
  name?: string;
  phone?: string;
  email?: string;
  emergency_details?: string;
  emergency?: string;
}

const chatMessages = document.getElementById('chatMessages') as HTMLDivElement | null;
const userInput = document.getElementById('userInput') as HTMLInputElement | null;
const sendButton = document.getElementById('sendButton') as HTMLButtonElement | null;
const typingIndicator = document.getElementById('typingIndicator') as HTMLDivElement | null;
const statusMessage = document.getElementById('statusMessage') as HTMLDivElement | null;
const quickActions = document.getElementById('quickActions') as HTMLDivElement | null;
const calendarLink = document.getElementById('calendarLink') as HTMLDivElement | null;

if (!chatMessages || !userInput || !sendButton || !typingIndicator || !statusMessage || !quickActions || !calendarLink) {
  throw new Error('Required DOM elements not found. Make sure index.html contains the expected ids.');
}

let conversationState: ConversationState = 'initial';
let appointmentData: AppointmentData = {};
let selectedDate: string | null = null;
let selectedTime: string | null = null;

// Surgery categories and types
const surgeryCategories = {
  'Cardiac': ['Heart Bypass Surgery', 'Valve Replacement', 'Angioplasty', 'Pacemaker Implantation', 'Heart Transplant'],
  'Orthopedic': ['Knee Replacement', 'Hip Replacement', 'Spine Surgery', 'Arthroscopy', 'Fracture Repair'],
  'Neurological': ['Brain Tumor Removal', 'Spinal Fusion', 'Craniotomy', 'Epilepsy Surgery', 'Nerve Repair'],
  'General': ['Appendectomy', 'Hernia Repair', 'Gallbladder Removal', 'Bowel Resection', 'Mastectomy'],
  'Plastic': ['Breast Augmentation', 'Liposuction', 'Rhinoplasty', 'Facelift', 'Reconstructive Surgery'],
  'Urological': ['Kidney Stone Removal', 'Prostate Surgery', 'Cystoscopy', 'Vasectomy', 'Kidney Transplant'],
  'Gynecological': ['Hysterectomy', 'C-Section', 'Ovarian Cyst Removal', 'Endometrial Ablation', 'Fibroid Removal'],
  'ENT': ['Tonsillectomy', 'Sinus Surgery', 'Ear Tube Insertion', 'Thyroid Surgery', 'Septoplasty'],
  'Ophthalmic': ['Cataract Surgery', 'LASIK', 'Glaucoma Surgery', 'Retinal Detachment Repair', 'Corneal Transplant'],
  'Vascular': ['Varicose Vein Treatment', 'Aneurysm Repair', 'Bypass Surgery', 'Stent Placement', 'Embolectomy'],
  'Oncological': ['Tumor Removal', 'Lumpectomy', 'Whipple Procedure', 'Colectomy', 'Lymph Node Dissection'],
  'Emergency': ['Trauma Surgery', 'Emergency Appendectomy', 'Bleeding Control', 'Organ Rupture Repair', 'Amputation']
};

// Patient types
const patientTypes = [
  'Adult (18-65)',
  'Pediatric (0-17)',
  'Senior (65+)',
  'Pregnant',
  'Critical Care',
  'Outpatient',
  'Inpatient'
];

addBotMessage("Hello! I'm HealthCare Bot, your 24/7 healthcare appointment assistant. We operate around the clock with Morning Shift (9 AM - 10 PM) and Night Shift (10 PM - 9 AM). How can I help you today?");

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', function (e: KeyboardEvent) {
  if (e.key === 'Enter') handleUserInput();
});

function handleUserInput(): void {
  const message = (userInput!.value || '').trim();
  if (!message) return;

  addUserMessage(message);
  userInput!.value = '';
  showTyping();

  setTimeout(() => {
    hideTyping();
    processMessage(message);
  }, 1000);
}

function addUserMessage(text: string): void {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function addBotMessage(text: string): void {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function showTyping(): void {
  typingIndicator.style.display = 'flex';
  scrollToBottom();
}

function hideTyping(): void {
  typingIndicator.style.display = 'none';
}

function scrollToBottom(): void {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function selectQuickAction(action: string): void {
  let message = '';
  switch (action) {
    case 'appointment':
      message = 'I would like to schedule an appointment';
      break;
    case 'services':
      message = 'Tell me about your services';
      break;
    case 'emergency':
      message = 'I have a dental emergency';
      break;
    case 'change':
      message = 'I need to change my appointment';
      break;
    default:
      message = action;
  }
  userInput.value = message;
  handleUserInput();
}

function processMessage(userMessage: string): void {
  const lowerMsg = userMessage.toLowerCase();

  switch (conversationState) {
    case 'initial':
      if (lowerMsg.includes('appointment') || lowerMsg.includes('schedule') || lowerMsg.includes('book')) {
        conversationState = 'service_category';
        const categories = Object.keys(surgeryCategories).join(', ');
        addBotMessage(`Great! I'll help you schedule an appointment. We offer surgeries in these categories:\n${categories}\n\nWhich category interests you?`);
        showQuickActions(['Cardiac', 'Orthopedic', 'General', 'Emergency']);
      } else if (lowerMsg.includes('service') || lowerMsg.includes('what do you offer') || lowerMsg.includes('surgery')) {
        conversationState = 'services_info';
        const allServices = Object.entries(surgeryCategories).map(([cat, services]) => `${cat}: ${services.slice(0, 3).join(', ')}...`).join('\n');
        addBotMessage(`We offer comprehensive surgical services 24/7:\n\n${allServices}\n\n...and many more procedures in each category.\n\nWould you like to schedule an appointment or learn more about a specific category?`);
        showQuickActions(['Schedule Appointment', 'More Info']);
      } else if (lowerMsg.includes('emergency')) {
        conversationState = 'emergency';
        addBotMessage("I understand this is urgent. Our emergency team is available 24/7. Can you describe the issue?");
        showQuickActions(['Severe Pain', 'Trauma', 'Bleeding', 'Other Emergency']);
      } else {
        addBotMessage("I can help you with:\n1. Scheduling surgical appointments (24/7)\n2. Information about our services\n3. Emergency care\n4. Patient information\n\nWhat would you like assistance with?");
        showQuickActions(['Appointment', 'Services', 'Emergency', 'Patient Info']);
      }
      break;

    case 'service_category':
      // Check if the message matches any category
      let matchedCategory = '';
      for (const category of Object.keys(surgeryCategories)) {
        if (lowerMsg.includes(category.toLowerCase())) {
          matchedCategory = category;
          break;
        }
      }
      
      if (matchedCategory) {
        appointmentData.serviceCategory = matchedCategory;
        conversationState = 'service_selection';
        const services = surgeryCategories[matchedCategory as keyof typeof surgeryCategories];
        addBotMessage(`Excellent choice! ${matchedCategory} surgeries include:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhich specific procedure do you need?`);
        showQuickActions(services.slice(0, 5));
      } else {
        addBotMessage("Could you specify which surgery category you need? Options include: Cardiac, Orthopedic, Neurological, General, Plastic, Urological, Gynecological, ENT, Ophthalmic, Vascular, Oncological, or Emergency.");
      }
      break;

    case 'service_selection':
      // Check if the message matches any service in the selected category
      const category = appointmentData.serviceCategory as keyof typeof surgeryCategories;
      const servicesInCategory = surgeryCategories[category];
      let matchedService = '';
      
      for (const service of servicesInCategory) {
        if (lowerMsg.includes(service.toLowerCase()) || lowerMsg.includes(service.split(' ')[0].toLowerCase())) {
          matchedService = service;
          break;
        }
      }
      
      if (matchedService) {
        appointmentData.service = matchedService;
        conversationState = 'patient_type';
        addBotMessage(`Perfect! "${matchedService}" has been selected.\n\nNow, what type of patient is this for?\n${patientTypes.join('\n')}`);
        showQuickActions(patientTypes);
      } else {
        addBotMessage(`Please select a specific procedure from the ${category} category: ${servicesInCategory.join(', ')}`);
      }
      break;

    case 'patient_type':
      let matchedPatientType = '';
      for (const pType of patientTypes) {
        if (lowerMsg.includes(pType.toLowerCase().split(' ')[0])) {
          matchedPatientType = pType;
          break;
        }
      }
      
      if (matchedPatientType) {
        appointmentData.patientType = matchedPatientType;
        conversationState = 'date_input';
        addBotMessage(`Thank you. Now please provide the date you'd like for your appointment (MM/DD/YYYY):\n\nOur facility operates 24/7:\n🌅 Morning Shift: 9:00 AM - 10:00 PM\n🌙 Night Shift: 10:00 PM - 9:00 AM`);
      } else {
        addBotMessage(`Please select a patient type: ${patientTypes.join(', ')}`);
      }
      break;

    case 'date_input':
      if (isValidDate(userMessage)) {
        selectedDate = userMessage;
        conversationState = 'time_input';
        addBotMessage("Perfect! Now please provide the time you'd like (e.g., 9:00 AM, 2:30 PM, 11:00 PM).\n\nRemember:\n- Morning Shift: 9:00 AM - 10:00 PM\n- Night Shift: 10:00 PM - 9:00 AM\n\nWe accept appointments at any time!");
      } else {
        addBotMessage("Please enter a valid date in MM/DD/YYYY format.");
      }
      break;

    case 'time_input':
      selectedTime = userMessage;
      conversationState = 'name';
      addBotMessage(`Great! I've reserved ${selectedDate} at ${selectedTime} for ${appointmentData.service} (${appointmentData.patientType}).\n\nNow, could you please share the patient's full name?`);
      break;

    case 'name':
      if (userMessage.split(' ').length >= 2) {
        appointmentData.name = userMessage;
        conversationState = 'contact';
        addBotMessage(`Thank you! Please provide a phone number for appointment confirmation.`);
      } else {
        addBotMessage("Please enter the patient's full name (first and last name).");
      }
      break;

    case 'contact':
      if (userMessage.trim().length > 0) {
        appointmentData.phone = userMessage;
        conversationState = 'email';
        addBotMessage("Almost done! Please provide an email address for confirmation.");
      } else {
        addBotMessage("Please enter a phone number.");
      }
      break;

    case 'email':
      if (isValidEmail(userMessage)) {
        appointmentData.email = userMessage;
        conversationState = 'confirm';

        const summary = `Here's your appointment summary:\nProcedure: ${appointmentData.service}\nCategory: ${appointmentData.serviceCategory}\nPatient Type: ${appointmentData.patientType}\nDate: ${selectedDate}\nTime: ${selectedTime}\nPatient Name: ${appointmentData.name}\nPhone: ${appointmentData.phone}\nEmail: ${appointmentData.email}\n\nIs this correct? Please reply with "Yes" to confirm or "No" to make changes.`;
        addBotMessage(summary);
        showQuickActions(['Yes', 'No']);
      } else {
        addBotMessage("Please enter a valid email address.");
      }
      break;

    case 'confirm':
      if (lowerMsg.includes('yes') || lowerMsg.includes('confirm')) {
        submitToGoogleAppsScript(appointmentData);
      } else {
        addBotMessage("Let's start over. Which surgery category do you need?");
        conversationState = 'service_category';
      }
      break;

    case 'emergency':
      appointmentData.emergency = userMessage;
      conversationState = 'emergency_details';
      addBotMessage(`Thank you for letting us know. Can you provide more details about the emergency? This helps us prepare for your arrival.`);
      break;

    case 'emergency_details':
      appointmentData.emergency_details = userMessage;
      conversationState = 'name';
      addBotMessage(`Thank you for sharing. Our emergency team is being notified. Could you please provide the patient's full name?`);
      break;

    case 'services_info':
      if (lowerMsg.includes('more info') || lowerMsg.includes('learn more')) {
        addBotMessage("Which category would you like to know more about?\n" + Object.keys(surgeryCategories).join('\n'));
        showQuickActions(['Cardiac', 'Orthopedic', 'Neurological', 'General']);
      } else if (lowerMsg.includes('schedule') || lowerMsg.includes('appointment')) {
        conversationState = 'service_category';
        const categories = Object.keys(surgeryCategories).join(', ');
        addBotMessage(`Great! Which surgery category are you interested in?\n${categories}`);
        showQuickActions(['Cardiac', 'Orthopedic', 'General', 'Emergency']);
      } else {
        // Show info about a specific category if mentioned
        for (const cat of Object.keys(surgeryCategories)) {
          if (lowerMsg.includes(cat.toLowerCase())) {
            const services = surgeryCategories[cat as keyof typeof surgeryCategories];
            addBotMessage(`${cat} Surgery Services:\n${services.join('\n')}\n\nWould you like to schedule an appointment for any of these procedures?`);
            showQuickActions(['Schedule Appointment', 'Back to Categories']);
            return;
          }
        }
        addBotMessage("Would you like more information about any specific service category, or shall we schedule an appointment?");
        showQuickActions(['Schedule Appointment', 'All Categories']);
      }
      break;

    default:
      addBotMessage("How else can I assist you today? You can ask about services, schedule an appointment, or get emergency care.");
      showQuickActions(['Appointment', 'Services', 'Emergency']);
  }
}

function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;

  const [month, day, year] = dateString.split('/').map(s => parseInt(s, 10));
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function showQuickActions(actions: string[]): void {
  quickActions.innerHTML = '';
  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'quick-action-btn';
    const icon = action.toLowerCase().includes('appointment') ? 'calendar-check'
      : action.toLowerCase().includes('service') ? 'list-alt'
      : action.toLowerCase().includes('emerg') ? 'heartbeat'
      : action.toLowerCase().includes('chang') ? 'sync-alt'
      : action.toLowerCase().includes('yes') ? 'check'
      : action.toLowerCase().includes('no') ? 'times'
      : 'star';
    btn.innerHTML = `<i class="fas fa-${icon}"></i> ${action}`;
    btn.onclick = () => {
      userInput.value = action;
      handleUserInput();
    };
    quickActions.appendChild(btn);
  });
}

function submitToGoogleAppsScript(data: AppointmentData): void {
  statusMessage.textContent = 'Processing your appointment...';

  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzxgokRRcQgP-2bxKxoYEwYmy3qzsvYYFGYn9KKfVILQaGsPs4EpUi0AXszFSfu_VRwoA/exec';

  const formData = new FormData();
  formData.append('timestamp', new Date().toISOString());
  formData.append('name', data.name ?? '');
  formData.append('phone', data.phone ?? '');
  formData.append('email', data.email ?? '');
  formData.append('service', data.service ?? '');
  formData.append('service_category', data.serviceCategory ?? '');
  formData.append('patient_type', data.patientType ?? '');
  formData.append('date', selectedDate ?? '');
  formData.append('time', selectedTime ?? '');
  formData.append('emergency_details', data.emergency_details ?? '');

  fetch(scriptUrl, {
    method: 'POST',
    body: formData
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.result === 'success') {
        statusMessage.textContent = 'Appointment confirmed and saved to our system!';
        createCalendarLink(data);
        addBotMessage('🎉 Your appointment has been scheduled successfully! A confirmation email has been sent to you. Thank you for choosing HealthCare Pro!');
        resetConversation();
      } else {
        statusMessage.textContent = 'Error submitting appointment. Please try again.';
        addBotMessage('There was an issue with your appointment. Would you like me to try again?');
        showQuickActions(['Try Again', 'Contact Office']);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      statusMessage.textContent = 'Error submitting appointment. Please try again.';
      addBotMessage('There was an issue with your appointment. Would you like me to try again?');
      showQuickActions(['Try Again', 'Contact Office']);
    });
}

function createCalendarLink(data: AppointmentData): void {
  if (!selectedDate || !selectedTime) return;

  const dateParts = selectedDate.split('/');
  const date = new Date(parseInt(dateParts[2], 10), parseInt(dateParts[0], 10) - 1, parseInt(dateParts[1], 10));

  const timeParts = selectedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!timeParts) return;
  let hour = parseInt(timeParts[1], 10);
  const minute = parseInt(timeParts[2], 10);
  const period = timeParts[3].toUpperCase();

  if (period === 'PM' && hour !== 12) hour += 12;
  else if (period === 'AM' && hour === 12) hour = 0;

  const startTime = new Date(date);
  startTime.setHours(hour, minute, 0, 0);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const startFormatted = formatDateForCalendar(startTime);
  const endFormatted = formatDateForCalendar(endTime);

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Surgery Appointment: ${encodeURIComponent(data.name ?? '')}&dates=${startFormatted}/${endFormatted}&details=Procedure: ${encodeURIComponent(data.service ?? '')}%0ACategory: ${encodeURIComponent(data.serviceCategory ?? '')}%0APatient Type: ${encodeURIComponent(data.patientType ?? '')}%0APatient: ${encodeURIComponent(data.name ?? '')}%0APhone: ${encodeURIComponent(data.phone ?? '')}%0AEmail: ${encodeURIComponent(data.email ?? '')}&location=HealthCare Pro Hospital`;

  const linkElement = calendarLink.querySelector('a') as HTMLAnchorElement | null;
  if (linkElement) {
    linkElement.href = calendarUrl;
    calendarLink.style.display = 'block';
  }
}

function formatDateForCalendar(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function resetConversation(): void {
  conversationState = 'initial';
  setTimeout(() => {
    calendarLink.style.display = 'none';
    addBotMessage("Is there anything else I can help you with today? You can ask about our surgical services, schedule another appointment, or get emergency care.");
    showQuickActions(['Services', 'Appointment', 'Emergency']);
  }, 1500);
}

scrollToBottom();
