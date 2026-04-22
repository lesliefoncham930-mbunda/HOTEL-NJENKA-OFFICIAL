// ===================================
// HOTEL NJENKA - JAVASCRIPT
// Interactive functionality
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION =====
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || mobileMenuToggle.contains(event.target);
        if (!isClickInside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== BOOKING FORM HANDLING =====
    const bookingForm = document.getElementById('bookingForm');
    
    // Set minimum date to today
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);
    
    // Update checkout minimum date when check-in changes
    checkInInput.addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        const minCheckOut = new Date(checkInDate);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        const minCheckOutStr = minCheckOut.toISOString().split('T')[0];
        checkOutInput.setAttribute('min', minCheckOutStr);
        
        // Reset checkout if it's before new minimum
        if (checkOutInput.value && checkOutInput.value <= this.value) {
            checkOutInput.value = '';
        }
    });
    
    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            roomType: document.getElementById('roomType').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            guests: document.getElementById('guests').value,
            specialRequests: document.getElementById('specialRequests').value,
            message: document.getElementById('message').value
        };
        
        // Validate dates
        if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
            alert('Check-out date must be after check-in date!');
            return;
        }
        
        // Calculate number of nights
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        // Get room price
        const roomPrices = {
            'standard': 25000,
            'deluxe': 35000,
            'suite': 55000
        };
        const totalPrice = roomPrices[formData.roomType] * nights;
        
        // Create confirmation message
        const confirmMessage = `
Booking Summary:
━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

Room Type: ${formData.roomType.toUpperCase()}
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Number of Nights: ${nights}
Guests: ${formData.guests}

Total Price: ${totalPrice.toLocaleString()} FCFA
━━━━━━━━━━━━━━━━━━━━━━

We will contact you within 24 hours to confirm your reservation.

Would you like to proceed with this booking request?
        `;
        
        if (confirm(confirmMessage)) {
            // In a real application, this would send data to a server
            // For now, we'll show a success message
            showBookingConfirmation(formData, nights, totalPrice);
            bookingForm.reset();
        }
    });
    
    // Show booking confirmation
    function showBookingConfirmation(data, nights, total) {
        const message = `
Thank you, ${data.fullName}!

Your booking request has been submitted successfully.

Booking Details:
- Room: ${data.roomType.toUpperCase()}
- Check-in: ${data.checkIn}
- Check-out: ${data.checkOut}
- Nights: ${nights}
- Total: ${total.toLocaleString()} FCFA

We will send a confirmation email to ${data.email} within 24 hours.

For immediate assistance, please call us at +237 6XX XXX XXX.

Thank you for choosing Hotel Njenka!
        `;
        
        alert(message);
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                alert(`Thank you for subscribing!\n\nYou will receive our newsletter at: ${email}\n\nStay tuned for exclusive offers and updates from Hotel Njenka!`);
                emailInput.value = '';
            }
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.room-card, .service-card, .gallery-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== ACTIVE NAVIGATION LINK =====
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
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
    
    // ===== ROOM CARD HOVER EFFECT =====
    const roomCards = document.querySelectorAll('.room-card');
    
    roomCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ===== GALLERY LIGHTBOX EFFECT =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageName = this.querySelector('.image-placeholder').textContent;
            alert(`Image: ${imageName}\n\nIn a full implementation, this would open a lightbox gallery viewer.`);
        });
    });
    
    // ===== PHONE NUMBER VALIDATION =====
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format phone number
            if (value.length > 0) {
                if (value.startsWith('237')) {
                    value = '+' + value;
                } else if (!value.startsWith('+')) {
                    value = '+237' + value;
                }
            }
            
            e.target.value = value;
        });
    }
    
    // ===== LOADING ANIMATION =====
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(function() {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // ===== PRINT BOOKING DETAILS =====
    function printBookingDetails(data) {
        console.log('Booking Request Details:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Name:', data.fullName);
        console.log('Email:', data.email);
        console.log('Phone:', data.phone);
        console.log('Room Type:', data.roomType);
        console.log('Check-in:', data.checkIn);
        console.log('Check-out:', data.checkOut);
        console.log('Guests:', data.guests);
        console.log('Special Requests:', data.specialRequests);
        console.log('Message:', data.message);
        console.log('━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    // Format currency
    function formatCurrency(amount) {
        return amount.toLocaleString('fr-FR') + ' FCFA';
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    // Calculate nights between dates
    function calculateNights(checkIn, checkOut) {
        const date1 = new Date(checkIn);
        const date2 = new Date(checkOut);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%c Welcome to Hotel Njenka! ', 'background: #1a5f7a; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('%c Located in Esono, Yaoundé, Cameroon ', 'background: #c9a857; color: white; font-size: 14px; padding: 5px; border-radius: 3px;');
    console.log('For technical support: info@hotelnjenka.com');
    
});

// ===== SERVICE WORKER (for future PWA implementation) =====
if ('serviceWorker' in navigator) {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js');
}