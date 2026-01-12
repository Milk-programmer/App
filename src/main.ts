// Converted and typed version of the inline script from index.html

type ConversationState =
  | 'initial'
  | 'service'
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

addBotMessage("Hello! I'm Dr. CareBot, your DentalCare AI assistant. How can I help you today? Would you like to schedule an appointment, inquire about services, or get directions?");

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
        conversationState = 'service';
        addBotMessage("Great! What type of dental service do you need? Our most common services:\n1. Routine Cleaning\n2. Filling\n3. Root Canal\n4. Whitening\n5. Crown\n6. Checkup\n7. Emergency");
        showQuickActions(['Routine Cleaning', 'Filling', 'Checkup', 'Emergency']);
      } else if (lowerMsg.includes('service') || lowerMsg.includes('what do you offer')) {
        conversationState = 'services_info';
        addBotMessage("We offer:\n- Comprehensive exams and cleanings\n- Fillings and restorations\n- Root canal therapy\n- Crowns and bridges\n- Teeth whitening\n- Orthodontics\n- Emergency care\nWhich service interests you?");
        showQuickActions(['Cleaning', 'Whitening', 'Orthodontics']);
      } else if (lowerMsg.includes('emergency')) {
        conversationState = 'emergency';
        addBotMessage("I understand this is urgent. Can you describe the issue? We have emergency slots available today and tomorrow.");
        showQuickActions(['Severe Pain', 'Broken Tooth', 'Swelling']);
      } else {
        addBotMessage("I can help you with:\n1. Scheduling appointments\n2. Information about our services\n3. Emergency care\n4. Directions to our office\nWhat would you like assistance with?");
        showQuickActions(['Appointment', 'Services', 'Directions']);
      }
      break;

    case 'service':
      if (lowerMsg.includes('cleaning') || lowerMsg.includes('checkup')) {
        appointmentData.service = 'Routine Cleaning';
        conversationState = 'date_input';
        addBotMessage(`Good choice! "${appointmentData.service}" typically takes 45 minutes. Please provide the date you'd like for your appointment (MM/DD/YYYY):`);
      } else if (lowerMsg.includes('filling') || lowerMsg.includes('root canal') || lowerMsg.includes('crown') || lowerMsg.includes('whitening')) {
        appointmentData.service = userMessage;
        conversationState = 'date_input';
        addBotMessage(`"${appointmentData.service}" usually takes 1-2 hours. Please provide the date you'd like for your appointment (MM/DD/YYYY):`);
      } else if (lowerMsg.includes('emergency')) {
        appointmentData.service = 'Emergency Care';
        conversationState = 'emergency_details';
        addBotMessage("I understand this is urgent. Can you describe the issue? We have emergency slots available today and tomorrow.");
      } else {
        addBotMessage("Could you specify which service you need? Options: cleaning, filling, root canal, whitening, crown, checkup, or emergency.");
      }
      break;

    case 'date_input':
      if (isValidDate(userMessage)) {
        selectedDate = userMessage;
        conversationState = 'time_input';
        addBotMessage("Perfect! Now please provide the time you'd like (e.g., 9:00 AM, 2:30 PM):");
      } else {
        addBotMessage("Please enter a valid date in MM/DD/YYYY format.");
      }
      break;

    case 'time_input':
      selectedTime = userMessage;
      conversationState = 'name';
      addBotMessage(`Great! I've reserved ${selectedDate} at ${selectedTime} for ${appointmentData.service}. Now, could you please share your full name?`);
      break;

    case 'name':
      if (userMessage.split(' ').length >= 2) {
        appointmentData.name = userMessage;
        conversationState = 'contact';
        addBotMessage(`Thank you, ${userMessage}! Please provide your phone number so we can confirm your appointment.`);
      } else {
        addBotMessage("Please enter your full name (first and last name).");
      }
      break;

    case 'contact':
      if (userMessage.trim().length > 0) {
        appointmentData.phone = userMessage;
        conversationState = 'email';
        addBotMessage("Almost done! Please provide your email address for confirmation.");
      } else {
        addBotMessage("Please enter your phone number.");
      }
      break;

    case 'email':
      if (isValidEmail(userMessage)) {
        appointmentData.email = userMessage;
        conversationState = 'confirm';

        const summary = `Here's your appointment summary:\nService: ${appointmentData.service}\nDate: ${selectedDate}\nTime: ${selectedTime}\nName: ${appointmentData.name}\nPhone: ${appointmentData.phone}\nEmail: ${appointmentData.email}\n\nIs this correct? Please reply with "Yes" to confirm or "No" to make changes.`;
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
        addBotMessage("Let's start over. What type of dental service do you need?");
        conversationState = 'service';
      }
      break;

    case 'emergency':
      appointmentData.emergency = userMessage;
      conversationState = 'name';
      addBotMessage(`Thank you for letting us know. We'll prioritize your case. Could you please share your full name for our emergency records?`);
      break;

    case 'emergency_details':
      appointmentData.emergency_details = userMessage;
      conversationState = 'name';
      addBotMessage(`Thank you for sharing. Could you please provide your full name so we can prepare for your visit?`);
      break;

    case 'services_info':
      if (lowerMsg.includes('cleaning') || lowerMsg.includes('whitening') || lowerMsg.includes('orthodontics')) {
        addBotMessage(`Our ${userMessage} service includes:\n- Professional assessment\n- Detailed procedure\n- Post-treatment care instructions\n- Follow-up recommendations\nWould you like to schedule this service?`);
        showQuickActions(['Schedule Now', 'More Info']);
      } else {
        addBotMessage("Would you like more information about any specific service, or shall we schedule an appointment?");
        showQuickActions(['Schedule Appointment', 'More Services']);
      }
      break;

    default:
      addBotMessage("How else can I assist you today? You can ask about services, schedule an appointment, or get directions to our office.");
      showQuickActions(['Appointment', 'Services', 'Directions']);
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
        addBotMessage('🎉 Your appointment has been scheduled successfully! A confirmation email has been sent to you. Thank you for choosing DentalCare Pro!');
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

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dental Appointment: ${encodeURIComponent(data.name ?? '')}&dates=${startFormatted}/${endFormatted}&details=Service: ${encodeURIComponent(data.service ?? '')}%0APatient: ${encodeURIComponent(data.name ?? '')}%0APhone: ${encodeURIComponent(data.phone ?? '')}%0AEmail: ${encodeURIComponent(data.email ?? '')}&location=DentalCare Pro`;

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
    addBotMessage("Is there anything else I can help you with today? You can ask about our services, schedule another appointment, or get directions to our office.");
    showQuickActions(['Services', 'Directions', 'Contact Info']);
  }, 1500);
}

scrollToBottom();
