// Chat functionality for RETRO Chat
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// Mobile navigation elements
const menuButton = document.getElementById('menu-icon');
const mobileNav = document.getElementById('mobileNav');
const closeMobileNav = document.getElementById('closeMobileNav');

// Notes functionality elements
const addNoteBtn = document.getElementById('addNoteBtn');
const noteInputSection = document.getElementById('noteInputSection');
const noteTitleInput = document.getElementById('noteTitleInput');
const noteContentInput = document.getElementById('noteContentInput');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');
const notesContainer = document.getElementById('notesContainer');

// Predefined responses for the chatbot
const botResponses = [
  "That's an interesting question! Let me think about that...",
  "I understand your point. Here's what I think...",
  "Thanks for sharing that with me!",
  "That's a great observation. Have you considered...",
  "I'm here to help! What else would you like to know?",
  "Interesting! Tell me more about that.",
  "I see what you mean. Let me provide some insight...",
  "That's a fascinating topic! Here's my perspective..."
];

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  
  if (isUser) {
    // User message without avatar or header
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-text">${content}</div>
      </div>
    `;
  } else {
    // Bot message with avatar but no header
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="ri-robot-fill"></i>
      </div>
      <div class="message-content">
        <div class="message-text">${content}</div>
      </div>
    `;
  }
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

function getBotResponse() {
  return botResponses[Math.floor(Math.random() * botResponses.length)];
}

function sendMessage() {
  const message = chatInput.value.trim();
  if (message === '') return;

  // Add user message
  addMessage(message, true);
  chatInput.value = '';

  // Show typing indicator
  showTypingIndicator();

  // Simulate bot response delay
  setTimeout(() => {
    hideTypingIndicator();
    addMessage(getBotResponse());
  }, 1000 + Math.random() * 2000);
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Auto-focus on input
chatInput.focus();

// Mobile Navigation Functions
function openMobileNav() {
  mobileNav.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNavigation() {
  mobileNav.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Mobile navigation event listeners
if (menuButton && mobileNav && closeMobileNav) {
  menuButton.addEventListener('click', openMobileNav);
  closeMobileNav.addEventListener('click', closeMobileNavigation);
  
  // Close mobile nav when clicking on overlay
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      closeMobileNavigation();
    }
  });
  
  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNavigation();
    }
  });
}

// Notes functionality
function showNoteInput() {
  noteInputSection.style.display = 'block';
  noteTitleInput.focus();
}

function hideNoteInput() {
  noteInputSection.style.display = 'none';
  noteTitleInput.value = '';
  noteContentInput.value = '';
}

function saveNote() {
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  
  if (!title || !content) {
    alert('Please fill in both title and content');
    return;
  }
  
  const noteItem = document.createElement('div');
  noteItem.className = 'note-item';
  
  const currentTime = new Date().toLocaleString();
  
  noteItem.innerHTML = `
    <div class="note-header">
      <span class="note-title">${title}</span>
      <div class="note-actions">
        <button class="note-pin" onclick="togglePin(this)" title="Pin preference">
          <i class="ri-pushpin-line"></i>
        </button>
        <button class="note-delete" onclick="deleteNote(this)" title="Delete preference">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>
    <div class="note-content">${content}</div>
    <div class="note-timestamp">${currentTime}</div>
  `;
  
  notesContainer.appendChild(noteItem);
  hideNoteInput();
}

function togglePin(button) {
  const noteItem = button.closest('.note-item');
  const icon = button.querySelector('i');
  
  if (noteItem.classList.contains('pinned')) {
    // Unpin the note
    noteItem.classList.remove('pinned');
    button.classList.remove('pinned');
    icon.className = 'ri-pushpin-line';
    button.title = 'Pin preference';
  } else {
    // Pin the note
    noteItem.classList.add('pinned');
    button.classList.add('pinned');
    icon.className = 'ri-pushpin-fill';
    button.title = 'Unpin preference';
    
    // Move pinned note to top
    const notesContainer = document.getElementById('notesContainer');
    const pinnedNotes = notesContainer.querySelectorAll('.note-item.pinned');
    const unpinnedNotes = notesContainer.querySelectorAll('.note-item:not(.pinned)');
    
    // Clear container and re-add in order: pinned first, then unpinned
    notesContainer.innerHTML = '';
    pinnedNotes.forEach(note => notesContainer.appendChild(note));
    unpinnedNotes.forEach(note => notesContainer.appendChild(note));
  }
}

function deleteNote(button) {
  if (confirm('Are you sure you want to delete this note?')) {
    button.closest('.note-item').remove();
  }
}

// Notes event listeners
if (addNoteBtn && noteInputSection) {
  addNoteBtn.addEventListener('click', showNoteInput);
  saveNoteBtn.addEventListener('click', saveNote);
  cancelNoteBtn.addEventListener('click', hideNoteInput);
  
  // Save note on Ctrl+Enter
  noteContentInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      saveNote();
    }
  });
}