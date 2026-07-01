
        // ==========================================================================
        // === JS FILE START (Idhai mattum copy panni 'script.js' la podavum) ===
        // ==========================================================================
        
        // Configuration for WhatsApp Checkout Method
        const WHATSAPP_NUMBER = "919876543210"; 
        
        // Dynamic Cart Array state
        let cart = [];

        // DOM elements cache
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

        // Premium Background Image Slideshow Logic
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        const heroBgContainer = document.getElementById('heroBgContainer');
        
        let currentSlide = 0;
        let slideInterval = setInterval(autoPlaySlides, 5000); // 5 Seconds auto-slide interval

        function showSlide(index) {
            // Remove active classes
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            // Handle boundaries
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            // Set active class
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

        // Dot click listeners for slideshow control
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetSlideTimer();
            });
        });

        // Swipe gestures for background slider on touch screens
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
                showSlide(currentSlide + 1); // Swipe left
                resetSlideTimer();
            } else if (touchEndX - touchStartX > minSwipeDistance) {
                showSlide(currentSlide - 1); // Swipe right
                resetSlideTimer();
            }
        }

        // Open & Close sidebar controls
        function openCart() {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('show');
        }

        // <!-- -->
        function closeCart() {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
        }

        openCartBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);

        // Classy toast notification (Compliant with alert prohibition)
        function showToast(message) {
            const toast = document.createElement("div");
            toast.className = "toast";
            toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
            toastContainer.appendChild(toast);

            // Refined sliding entry animation
            setTimeout(() => {
                toast.classList.add("show");
            }, 100);

            // Automatic dismissal
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }

        // Render Cart items cleanly
        function renderCart() {
            cartItemsList.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<div class="empty-cart-msg">Your cart is empty! 🍰</div>';
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

        // Action controllers for dynamic elements inside Sidebar
        function attachCartActionListeners() {
            // Qty Increment (+) click
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

            // Qty Decrement (-) click
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

            // Full removal click
            document.querySelectorAll('.remove-qty').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    cart = cart.filter(x => x.id !== id);
                    renderCart();
                });
            });
        }

        // Add to Cart handling from Main catalog grid
        const productAddButtons = document.querySelectorAll('.add-to-cart-btn');
        productAddButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const id = productCard.getAttribute('data-id');
                const name = productCard.querySelector('h3').textContent;
                const priceText = productCard.querySelector('.price').textContent;
                const price = parseInt(priceText.replace('Rs. ', ''));
                const img = productCard.querySelector('img').src;

                // Check duplicates
                const existingItem = cart.find(x => x.id === id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id, name, price, img, quantity: 1 });
                }

                renderCart();
                showToast(`${name} added to cart!`);
                openCart(); // Auto trigger sliding cart entry
            });
        });

        // Dynamic WhatsApp Receipt Text Formatter
        whatsappCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast("Your cart is empty! Add sweet delights first.");
                return;
            }

            let message = `Hi *Sweet Haven Bakery*! 🍰\nI would like to place a premium order:\n\n`;
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
            message += `Please confirm my order details. Thank you! ✨`;

            const encodedMsg = encodeURIComponent(message);
            const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`;
            
            window.open(whatsappURL, '_blank');
        });

        // Smooth viewport reveal on scroll
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
        // Trigger once initially
        revealOnScroll();

        // Smooth scroll floating button visibility control
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollToTopBtn.style.display = "flex";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        };

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        // ==========================================================================
        // === JS FILE END ===
        // ==========================================================================
