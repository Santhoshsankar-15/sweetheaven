// ==========================================================================
// Sweet Haven Bakery — script.js
// ==========================================================================

const WHATSAPP_NUMBER = "919876543210";

let cart = [];

// DOM cache
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCountBadge = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cartItemsList');
const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const toastContainer = document.getElementById("toastContainer");
const ticketNumberEl = document.getElementById("ticketNumber");

// Generate a friendly order ticket number for the session
ticketNumberEl.textContent = `#${Math.floor(1000 + Math.random() * 9000)}`;

// ---------- Hero photo slideshow ----------
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const heroBgContainer = document.getElementById('heroBgContainer');

let currentSlide = 0;
let slideInterval = setInterval(autoPlaySlides, 5000);

function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function autoPlaySlides() {
    showSlide(currentSlide + 1);
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoPlaySlides, 5000);
}

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        showSlide(idx);
        resetSlideTimer();
    });
});

// Swipe gestures
let touchStartX = 0;
let touchEndX = 0;

heroBgContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

heroBgContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
    const minSwipeDistance = 50;
    if (touchStartX - touchEndX > minSwipeDistance) {
        showSlide(currentSlide + 1);
        resetSlideTimer();
    } else if (touchEndX - touchStartX > minSwipeDistance) {
        showSlide(currentSlide - 1);
        resetSlideTimer();
    }
}

// ---------- Category filter tabs ----------
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');
const emptyFilterMsg = document.getElementById('emptyFilterMsg');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        let visibleCount = 0;

        productCards.forEach(card => {
            const matches = filter === 'all' || card.getAttribute('data-category') === filter;
            card.classList.toggle('hide', !matches);
            if (matches) visibleCount++;
        });

        emptyFilterMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    });
});

// ---------- Cart sidebar open/close ----------
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ---------- Toast notifications ----------
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ---------- Cart rendering ----------
function renderCart() {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart-msg">Your ticket is blank! 🍰<br><span>Add something sweet.</span></div>';
        cartTotalPrice.textContent = 'Rs. 0';
        cartCountBadge.textContent = '0';
        return;
    }

    let total = 0;
    let countItems = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        countItems += item.quantity;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">Rs. ${item.price}</div>
                <div class="quantity-control">
                    <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item-btn remove-qty" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsList.appendChild(itemElement);
    });

    cartTotalPrice.textContent = `Rs. ${total}`;
    cartCountBadge.textContent = countItems;

    attachCartActionListeners();
}

function attachCartActionListeners() {
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(x => x.id === id);
            if (item) {
                item.quantity += 1;
                renderCart();
            }
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(x => x.id === id);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart = cart.filter(x => x.id !== id);
                }
                renderCart();
            }
        });
    });

    document.querySelectorAll('.remove-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            cart = cart.filter(x => x.id !== id);
            renderCart();
        });
    });
}

// ---------- Add to cart ----------
const productAddButtons = document.querySelectorAll('.add-to-cart-btn');
productAddButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const id = productCard.getAttribute('data-id');
        const name = productCard.querySelector('h3').textContent;
        const priceText = productCard.querySelector('.price-tag').textContent;
        const price = parseInt(priceText.replace('Rs. ', ''));
        const img = productCard.querySelector('img').src;

        const existingItem = cart.find(x => x.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }

        renderCart();
        showToast(`${name} added to cart!`);
        openCart();
    });
});

// ---------- WhatsApp checkout ----------
whatsappCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast("Your ticket is empty! Add sweet delights first.");
        return;
    }

    let message = `Hi *Sweet Haven Bakery*! 🍰\nI'd like to place an order (Ticket ${ticketNumberEl.textContent}):\n\n`;
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        message += `*${index + 1}. ${item.name}*\n`;
        message += `   Quantity: ${item.quantity} x Rs. ${item.price}\n`;
        message += `   Total: Rs. ${itemTotal}\n\n`;
    });

    message += `--------------------------------\n`;
    message += `*Grand Total: Rs. ${grandTotal}*\n`;
    message += `--------------------------------\n`;
    message += `Please confirm my order. Thank you! ✨`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${9788631351}&text=${encodedMsg}`;

    window.open(whatsappURL, '_blank');
});

// ---------- Scroll reveal ----------
function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    const elementVisible = 120;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ---------- Back to top ----------
window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollToTopBtn.style.display = "flex";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});