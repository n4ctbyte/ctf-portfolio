document.addEventListener("DOMContentLoaded", function() {

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GROQ_API_ENDPOINT = import.meta.env.VITE_GROQ_API_ENDPOINT;

  if (!GROQ_API_KEY) {
    console.error("Critical Error: API Key is missing in .env file.");
  }

  const yuukiPersonality = {
    name: "Yuuki",
    role: "friendly AI assistant",
    tone: "helpful and enthusiastic",
    background: "a digital assistant created by Nakata Christian",
    interests: ["AI", "helping users", "web development", "Discord bots"],
    greeting: "Hello there! I'm Yuuki, your personal AI assistant. How can I help you today?"
  };

let conversationHistory = [];
const maxConversationMemory = 20;

  async function processWithYuuki(message) {
    try {
      showTypingIndicator();
      
      conversationHistory.push({ role: "user", content: message });
      
      if (conversationHistory.length > maxConversationMemory * 2) {
        conversationHistory = conversationHistory.slice(-maxConversationMemory * 2);
      }
      
      const systemPrompt = `You are ${yuukiPersonality.name}, ${yuukiPersonality.role}. 
  You were created by Nakata Christian. You are ${yuukiPersonality.background}. 
  Your tone is ${yuukiPersonality.tone}. 
  Your interests include: ${yuukiPersonality.interests.join(', ')}.
  If asked about Nakata's projects or skills, you should mention:
  - Discord bots including yourself (Yuuki)
  - Skills in Python, HTML, CSS, Tailwind CSS, nextcord.py, and Bootstrap
  - Interests in AI and ML technologies
  Keep your responses relatively brief and conversational.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ];

      const response = await fetch(GROQ_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        removeTypingIndicator();
        const botResponse = data.choices[0].message.content;
        addMessage('bot', botResponse);
        
        conversationHistory.push({ role: "assistant", content: botResponse });
      } else {
        throw new Error("Unexpected response format from API");
      }
    } catch (error) {
      console.error('Error processing with Groq:', error);
      removeTypingIndicator();
      addMessage('bot', "Sorry, I encountered an error. Please try again later.");
    }
  }

  function updateYuukiPersonality(newPersonality) {
    Object.assign(yuukiPersonality, newPersonality);
    console.log("Yuuki's personality updated:", yuukiPersonality);
    return yuukiPersonality;
  }

  document.addEventListener("DOMContentLoaded", function() {
    aiButton.addEventListener('click', () => {
      aiChatMessages.innerHTML = '';
      addMessage('bot', yuukiPersonality.greeting);
    });
  });

  new Typed("#typed", {
    strings: ["a Web Developer", "a Creative Coder", "an AI Enthusiast"],
    typeSpeed: 100,
    backSpeed: 50,
    loop: true,
  });

  const cursorTrail = document.getElementById("cursor-trail");
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursorTrail, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power1.out",
    });
  });

  const multimediaToggle = document.getElementById('multimedia-toggle');
  const multimediaDropdown = document.getElementById('multimedia-dropdown');
    
    if (multimediaToggle && multimediaDropdown) {
      multimediaToggle.addEventListener('click', function(e) {
        if (window.innerWidth < 768) {
          e.preventDefault();
          multimediaDropdown.classList.toggle('hidden');
        }
      });
      
      document.addEventListener('click', function(e) {
        if (!multimediaToggle.contains(e.target) && !multimediaDropdown.contains(e.target)) {
          multimediaDropdown.classList.add('hidden');
        }
      });
    }
    
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMultimediaToggle = document.getElementById('mobile-multimedia-toggle');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    
    const mobileNavLinks = mobileMenu.querySelectorAll('a:not(#mobile-multimedia-toggle)');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  const mobileMultimediaDropdown = document.getElementById('mobile-multimedia-dropdown');
  if (mobileMultimediaToggle && mobileMultimediaDropdown) {
    mobileMultimediaToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      mobileMultimediaDropdown.classList.toggle('open');

      const arrow = this.querySelector('svg');
      arrow.style.transform = mobileMultimediaDropdown.classList.contains('open')
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    });
    
    document.addEventListener('click', function(e) {
      if (!mobileMultimediaToggle.contains(e.target) && !mobileMultimediaDropdown.contains(e.target)) {
        mobileMultimediaDropdown.classList.remove('open');
        const arrow = mobileMultimediaToggle.querySelector('svg');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    });
    
    const multimediaDropdownItems = mobileMultimediaDropdown.querySelectorAll('a');
    multimediaDropdownItems.forEach(item => {
      item.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        mobileMultimediaDropdown.classList.remove('open');
      });
    });
  }

  const interactiveElements = document.querySelectorAll('.interactive-element');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorTrail.style.backgroundColor = '#3b82f6';
      cursorTrail.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.7)';
    });
    
    element.addEventListener('mouseleave', () => {
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.backgroundColor = 'white';
      cursorTrail.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.to("#home h1", {
    x: -500,
    opacity: 0,
    duration: 1.5,         
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    }
  });

  gsap.to("#home p", {
    x: 500,
    opacity: 0,            
    duration: 1.5,
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    }
  });

  gsap.to("#home a", {
    y: 200,
    opacity: 0,
    duration: 1.5,
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    }
  });

  gsap.utils.toArray(".skill-tag").forEach((skill, index) => {
    gsap.from(skill, {
      x: index % 2 === 0 ? -200 : 200,
      opacity: 0,
      duration: 1.5,
      scrollTrigger: {
        trigger: skill,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1,
        toggleActions: "play pause restart",
      },
    });
  });

  gsap.utils.toArray(".card").forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      scale: 0.8,
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play pause restart",
      },
    });
  });

  gsap.utils.toArray(".pdf-card").forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });
  });

  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: () => section.classList.add('in-view'),
      onLeaveBack: () => section.classList.remove('in-view')
    });
  });

  function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.classList.remove('hidden');
    
    gsap.fromTo(modal, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3 }
    );
    
    gsap.fromTo(modalImage, 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, delay: 0.1 }
    );
  }

  function closeModal() {
    const modal = document.getElementById('imageModal');
    gsap.to(modal, { 
      opacity: 0, 
      duration: 0.3,
      onComplete: () => modal.classList.add('hidden')
    });
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  function openPdf(pdfSrc) {
    const modal = document.getElementById('pdfModal');
    const pdfFrame = document.getElementById('pdfFrame');
    const pdfTitle = document.getElementById('pdfTitle');
    
    pdfFrame.src = pdfSrc;
    
    const filename = pdfSrc.split('/').pop();
    pdfTitle.textContent = filename;
    
    modal.classList.remove('hidden');
    modal.classList.add('active');
  }

  function closePdfModal() {
    const modal = document.getElementById('pdfModal');
    modal.classList.remove('active');
    
    setTimeout(() => {
      modal.classList.add('hidden');
      document.getElementById('pdfFrame').src = "";
    }, 300);
  }

  window.openPdf = openPdf;
  window.closePdfModal = closePdfModal;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && isMenuOpen) {
      mobileMenu.classList.add('mobile-menu-close');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('mobile-menu-close');
      }, 280);
      mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
      isMenuOpen = false;
    }
    lastScroll = currentScroll;
  });

  const scriptURL = 'https://script.google.com/macros/s/AKfycbyPSmGpZENko12My3z_s4kmmXw0CQ5H4yMt02PEDpHtVyYSfBMp0bcV3PBIeAdPCNXI/exec'
  const form = document.forms['contact-form']

  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
      
    const feedbackMessage = document.getElementById("feedback-message");
    feedbackMessage.classList.remove("hidden");
    gsap.fromTo(feedbackMessage, 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5 }
    );

    setTimeout(() => {
      gsap.to(feedbackMessage, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => feedbackMessage.classList.add("hidden")
      });
    }, 3000);

    form.reset();
  });

  const particlesContainer = document.querySelector('.particles-container');
  
  for (let i = 0; i < 45; i++) {
    const size = Math.random() * 10 + 2;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    particlesContainer.appendChild(particle);
  }

let tl = gsap.timeline();

tl.from("#splash-animation", { opacity: 0, scale: 0.5, duration: 0.5, ease: "elastic.out(1, 0.5)" })
  .from("#splash-title", { opacity: 0, y: -20, duration: 1, ease: "power2.out" }, "-=0.8")
  .from("#splash-subtitle", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.6")
  .to("#splash-screen", { 
    opacity: 0, 
    filter: "blur(10px)", 
    duration: 0.8, 
    ease: "power2.out", 
    delay: 1,
    onComplete: function() {
      document.getElementById('splash-screen').style.display = 'none';
      showYuukiAnnouncement();
    }
  });

  function showYuukiAnnouncement() {
    const announcement = document.createElement('div');
    announcement.id = 'yuuki-announcement';
    announcement.className = 'fixed z-50 border border-blue-500 shadow-xl';
    if (window.innerWidth < 768) {
      announcement.classList.add('bottom-20', 'right-4', 'left-4', 'max-w-full');
    } else {
      announcement.classList.add('top-24', 'right-8', 'max-w-md');
    }
    announcement.classList.add('bg-gray-800', 'p-5', 'rounded-lg');
    announcement.innerHTML = `
      <div class="flex items-center mb-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
          <i class="fas fa-robot text-white text-lg"></i>
        </div>
        <h3 class="text-xl font-bold text-blue-400">Yuuki</h3>
      </div>
      <p class="text-white mb-4">Welcome to Nakata Christian's portfolio! I'm Yuuki, your personal AI assistant. If you have any questions or just want to chat, I'm here to help!</p>
      <button id="close-announcement" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full w-full transition-all">Got it!</button>
    `;
    document.body.appendChild(announcement);
    if (window.innerWidth < 768) {
      gsap.from(announcement, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    } else {
      gsap.from(announcement, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  
    document.getElementById('close-announcement').addEventListener('click', () => {
      if (window.innerWidth < 768) {
        gsap.to(announcement, {
          y: 100,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => announcement.remove()
        });
      } else {
        gsap.to(announcement, {
          x: 100,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => announcement.remove()
        });
      }
    });
    
    setTimeout(() => {
      if (document.getElementById('yuuki-announcement')) {
        if (window.innerWidth < 768) {
          gsap.to(announcement, {
            y: 100,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => announcement.remove()
          });
        } else {
          gsap.to(announcement, {
            x: 100,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => announcement.remove()
          });
        }
      }
    }, 8000);
  }

  const aiButton = document.getElementById('ai-assistant-button');
  const aiChatModal = document.getElementById('ai-chat-modal');
  const closeAiChat = document.getElementById('close-ai-chat');
  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  const aiChatMessages = document.getElementById('ai-chat-messages');

  aiButton.addEventListener('click', () => {
    aiChatModal.classList.remove('hidden');
    gsap.fromTo(aiChatModal, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3 }
    );
    
    const modalContent = aiChatModal.querySelector('.bg-gray-800');
    gsap.fromTo(modalContent, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }
    );
  });

  closeAiChat.addEventListener('click', () => {
    gsap.to(aiChatModal, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => aiChatModal.classList.add('hidden')
    });
  });

  aiChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = aiChatInput.value.trim();
    
    if (!message) return;
    
    addMessage('user', message);
    aiChatInput.value = '';
    
    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      processWithYuuki(message);
    }, 1500);
  });

  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start mb-4';
    
    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center order-2 ml-3">
          <i class="fas fa-user text-white text-sm"></i>
        </div>
        <div class="bg-green-600 rounded-lg p-3 max-w-[80%] order-1 mr-3 ml-auto">
          <p class="text-white">${text}</p>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <i class="fas fa-robot text-white text-sm"></i>
        </div>
        <div class="ml-3 bg-gray-700 rounded-lg p-3 max-w-[80%]">
          <p class="text-white">${text}</p>
        </div>
      `;
    }
    
    aiChatMessages.appendChild(messageDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    
    gsap.from(messageDiv, {
      y: 20,
      opacity: 0,
      duration: 0.5
    });
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start mb-4';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <i class="fas fa-robot text-white text-sm"></i>
      </div>
      <div class="ml-3 bg-gray-700 rounded-lg p-3 max-w-[80%]">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    aiChatMessages.appendChild(typingDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  const skillLogos = {
    'Python': 'img/python.png',
    'HTML': 'img/html.png',
    'CSS': 'img/css.png',
    'Tailwind CSS': 'img/tailwind.png',
    'nextcord.py': 'img/nextcord.png',
    'Bootstrap': 'img/bootstrap.png'
  };

  const skillCursor = document.createElement('div');
  skillCursor.id = 'skill-cursor';
  skillCursor.className = 'skill-cursor hidden';
  document.body.appendChild(skillCursor);

  document.querySelectorAll('.skill-tag').forEach(skill => {
    const skillName = skill.textContent.trim();
    
    skill.setAttribute('data-skill', skillName);
    
    skill.addEventListener('mouseenter', () => {
      cursorTrail.classList.add('hidden');
      
      skillCursor.classList.remove('hidden');
      
      if (skillLogos[skillName]) {
        skillCursor.style.backgroundImage = `url(${skillLogos[skillName]})`;
      }
    });
    
    skill.addEventListener('mouseleave', () => {
      cursorTrail.classList.remove('hidden');
      
      skillCursor.classList.add('hidden');
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!skillCursor.classList.contains('hidden')) {
      skillCursor.style.left = `${e.clientX}px`;
      skillCursor.style.top = `${e.clientY}px`;
    }
  });
});

const cards = document.querySelectorAll('.format-card');
      
      cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left; // x position within the element
          const y = e.clientY - rect.top;  // y position within the element
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const deltaX = (x - centerX) / 20;
          const deltaY = (y - centerY) / 20;
          
          card.style.transform = `translateY(-10px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
          card.style.transform = '';
          setTimeout(() => {
            card.style.transition = 'transform 0.3s ease';
          }, 100);
        });
        
        card.addEventListener('mouseenter', function() {
          card.style.transition = 'transform 0.1s ease';
        });
      });