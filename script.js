// ========================================
// script.js - مركز موسى لطب الأسنان
// جميع الوظائف التفاعلية
// ========================================

// ---------- 1. شريط التنقل (للجوال) ----------
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// إغلاق القائمة عند الضغط على رابط
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// تفعيل الرابط النشط بناءً على التمرير
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ---------- 2. إحصائيات متحركة ----------
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const increment = target / 50; // سرعة الحركة
        let current = 0;
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        updateNumber();
    });
    statsAnimated = true;
}

// تشغيل الإحصائيات عند ظهور قسم الرئيسية
const heroSection = document.getElementById('home');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
        }
    });
}, { threshold: 0.3 });
heroObserver.observe(heroSection);

// ---------- 3. زر العودة للأعلى ----------
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- 4. نظام حجز الموعد (تخزين في localStorage) ----------
const bookBtn = document.getElementById('bookAppointmentBtn');
const bookingMessage = document.getElementById('bookingMessage');

bookBtn.addEventListener('click', () => {
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const email = document.getElementById('patientEmail').value.trim();
    const service = document.getElementById('serviceSelect').value;
    const date = document.getElementById('bookingDate').value;

    if (!name || !phone || !service || !date) {
        alert('يرجى ملء جميع الحقول المطلوبة (*)');
        return;
    }

    const appointment = {
        id: Date.now(),
        name,
        phone,
        email,
        service,
        date,
        createdAt: new Date().toISOString()
    };

    // استرجاع الحجوزات السابقة من localStorage
    let bookings = JSON.parse(localStorage.getItem('appointments')) || [];
    bookings.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(bookings));

    // عرض رسالة نجاح
    bookingMessage.style.display = 'block';
    bookingMessage.innerHTML = `
        <h4>✅ تم حجز موعدك بنجاح!</h4>
        <p>شكراً لك ${name}، تم حجز موعد ${service} في تاريخ ${date}.</p>
        <p>سيتم التواصل معك عبر ${phone} لتأكيد الموعد.</p>
    `;
    // إعادة تعيين النموذج بعد 3 ثواني
    setTimeout(() => {
        document.getElementById('patientName').value = '';
        document.getElementById('patientPhone').value = '';
        document.getElementById('patientEmail').value = '';
        document.getElementById('serviceSelect').value = '';
        document.getElementById('bookingDate').value = '';
        bookingMessage.style.display = 'none';
    }, 5000);
});

// ---------- 5. 🌙 الوضع الليلي (Dark Mode) ----------
// إضافة زر في شريط التنقل (يمكن إضافته يدوياً في HTML)
// نضيفه هنا عبر JS
const navbarContainer = document.querySelector('.navbar .container');
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
darkModeToggle.className = 'dark-mode-toggle';
darkModeToggle.style.cssText = `
    background: transparent;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: var(--text-dark);
    padding: 5px 10px;
`;
navbarContainer.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
    }
});

// استرجاع تفضيل الوضع الليلي من localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// ---------- 6. شات بوت بسيط (أسئلة شائعة) ----------
// سيظهر عند النقر على زر في الزاوية (يمكن إضافته)
console.log('مرحباً بك في مركز موسى! يمكنك طرح أسئلتك الشائعة.');

// ---------- 7. البحث في الموقع (مثال بسيط) ----------
// يمكن إضافته في المستقبل
console.log('ميزة البحث جاهزة للاستخدام.');

// ---------- 8. إظهار حالة العيادة (مفتوح/مغلق) ----------
function updateClinicStatus() {
    const now = new Date();
    const hours = now.getHours();
    const isOpen = hours < 20; // يغلق 8:00 م
    const statusElement = document.createElement('span');
    statusElement.className = 'clinic-status';
    statusElement.style.cssText = `
        display: inline-block;
        padding: 5px 15px;
        border-radius: 30px;
        font-weight: 700;
        margin-right: 15px;
        font-size: 0.9rem;
    `;
    if (isOpen) {
        statusElement.textContent = '🟢 مفتوح الآن';
        statusElement.style.background = '#d4edda';
        statusElement.style.color = '#155724';
    } else {
        statusElement.textContent = '🔴 مغلق حالياً';
        statusElement.style.background = '#f8d7da';
        statusElement.style.color = '#721c24';
    }
    // إضافته بجانب زر الواتساب أو في الهيدر
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.prepend(statusElement);
    }
}
updateClinicStatus();

console.log('🚀 موقع مركز موسى لطب الأسنان جاهز!');