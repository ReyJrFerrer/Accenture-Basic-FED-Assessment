const productsData = [
  {
    id: "redmi-note-9s",
    name: "Redmi Note 9S",
    price: 10490,
    colors: ["Aurora Blue", "Glacier White", "Interstellar Grey"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    description: "Power to win with Snapdragon 720G, 48MP Quad Camera, and a massive 5020mAh high-capacity battery.",
    category: "Smartphones"
  },
  {
    id: "redmi-9",
    name: "Redmi 9",
    price: 6990,
    colors: ["Carbon Grey", "Sunset Purple", "Ocean Green"],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    description: "Capture your moments with AI Quad Camera, FHD+ display, and powerful Helio G80 processor.",
    category: "Smartphones"
  },
  {
    id: "redmi-note-10-pro",
    name: "Redmi Note 10 Pro",
    price: 13500,
    colors: ["Onyx Gray", "Glacier Blue", "Gradient Bronze"],
    image: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80",
    description: "Challenge boundaries with 108MP camera, 120Hz AMOLED display, and 33W fast charging.",
    category: "Smartphones"
  },
  {
    id: "redmi-10-lite",
    name: "Redmi 10 Lite",
    price: 15999,
    colors: ["Midnight Black", "Aurora White", "Cosmic Blue"],
    image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=600&q=80",
    description: "Lightweight and powerful. Qualcomm Snapdragon performance with dual speaker surround sound.",
    category: "Smartphones"
  },
  {
    id: "xiaomi-watch-s1",
    name: "Xiaomi Watch S1",
    price: 8990,
    colors: ["Classic Black", "Silver Leather", "Brown Leather"],
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80",
    description: "Stay stylish, stay fit. Sapphire glass display, stainless steel frame, and 117 fitness modes.",
    category: "Wearables"
  },
  {
    id: "xiaomi-smart-band-7",
    name: "Xiaomi Smart Band 7",
    price: 2490,
    colors: ["Neon Green", "Ivory White", "Midnight Blue"],
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80",
    description: "1.62\" AMOLED high-resolution display, 110+ sports modes, all-day SpO₂ tracking.",
    category: "Wearables"
  }
];

const colorMap = {
  "Aurora Blue": "#3b82f6",
  "Glacier White": "#f1f5f9",
  "Interstellar Grey": "#64748b",
  "Carbon Grey": "#374151",
  "Sunset Purple": "#a855f7",
  "Ocean Green": "#10b981",
  "Onyx Gray": "#57534e",
  "Glacier Blue": "#38bdf8",
  "Gradient Bronze": "#b45309",
  "Midnight Black": "#171717",
  "Aurora White": "#f4f4f5",
  "Cosmic Blue": "#4f46e5",
  "Classic Black": "#000000",
  "Silver Leather": "#a1a1aa",
  "Brown Leather": "#92400e",
  "Neon Green": "#84cc16",
  "Ivory White": "#fffbeb",
  "Midnight Blue": "#083344",
};

function needsDarkDot(colorName) {
  return colorName.includes("White") || colorName.includes("Silver") || colorName === "Ivory White" || colorName === "Glacier White";
}

// State
let cart = [];
let selectedCategory = "All";
let currentSlideIndex = 0;
let slideshowInterval = null;
let selectedProductForDetail = null;
let detailSelectedColor = null;

// DOM Elements
const cartTriggerBtn = document.getElementById("cart-trigger-btn");
const cartBadgeContainer = document.getElementById("header-cart-badge-container");
const cartModalContainer = document.getElementById("cart-modal-container");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
const cartProductsRow = document.getElementById("cart-products-row");
const emptyCartView = document.getElementById("empty-cart-view");
const cartTotalQuantity = document.getElementById("cart-total-quantity");
const cartTotalPriceDisplay = document.getElementById("cart-total-price-display");

const heroSlideshowSection = document.getElementById("hero-slideshow-section");
const productsFlexGrid = document.getElementById("products-flex-grid");
const wearablesFlexGrid = document.getElementById("wearables-flex-grid");
const brandLogo = document.getElementById("brand-logo");

const alertOverlay = document.getElementById("alert-overlay");
const alertMessageText = document.getElementById("alert-message-text");
const alertHeaderCloseBtn = document.getElementById("alert-header-close-btn");
const alertOkBtn = document.getElementById("alert-ok-btn");

const productDetailModalOverlay = document.getElementById("product-detail-modal-overlay");
const detailCloseBtn = document.getElementById("close-detail-modal-btn");
const detailAddToCartBtn = document.getElementById("detail-add-to-cart-btn");
const detailColorOptions = document.getElementById("detail-color-options");

function init() {
  renderProducts();
  initSlideshow();
  setupEventListeners();
  
  // Initialize lucide icons
  if(window.lucide) {
    lucide.createIcons();
  }
}

function setupEventListeners() {
  cartTriggerBtn.addEventListener("click", () => {
    cartModalContainer.classList.toggle("hidden");
  });

  closeCartBtn.addEventListener("click", () => {
    cartModalContainer.classList.add("hidden");
  });

  cartCheckoutBtn.addEventListener("click", handleCheckout);

  brandLogo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Modals close on overlay click
  productDetailModalOverlay.addEventListener("click", (e) => {
    if (e.target === productDetailModalOverlay) closeProductDetail();
  });
  alertOverlay.addEventListener("click", (e) => {
    if (e.target === alertOverlay) closeAlert();
  });
  detailCloseBtn.addEventListener("click", closeProductDetail);
  alertHeaderCloseBtn.addEventListener("click", closeAlert);
  alertOkBtn.addEventListener("click", closeAlert);

  detailAddToCartBtn.addEventListener("click", () => {
    if (selectedProductForDetail && detailSelectedColor) {
      handleAddToCart(selectedProductForDetail, detailSelectedColor);
      closeProductDetail();
    }
  });
}

function showAlert(message) {
  alertMessageText.textContent = message;
  alertOverlay.classList.remove("hidden");
}

function closeAlert() {
  alertOverlay.classList.add("hidden");
}

function formatPrice(price) {
  return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// Products Grid
function renderProducts() {
  if (productsFlexGrid) {
    productsFlexGrid.innerHTML = "";
    const smartphones = productsData.filter(p => p.category === "Smartphones");
    renderProductCards(smartphones, productsFlexGrid);
  }
  
  if (wearablesFlexGrid) {
    wearablesFlexGrid.innerHTML = "";
    const wearables = productsData.filter(p => p.category === "Wearables");
    renderProductCards(wearables, wearablesFlexGrid);
  }

  if(window.lucide) {
    lucide.createIcons();
  }
}

function renderProductCards(products, container) {
  products.forEach(product => {
    let selectedColor = product.colors[0];

    const card = document.createElement("div");
    card.className = "product-card";

    // Image stage
    const imgStage = document.createElement("div");
    imgStage.className = "card-img-stage";
    imgStage.innerHTML = `
      <div class="category-badge">${product.category}</div>
      <img src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer">
    `;
    imgStage.addEventListener("click", () => openProductDetail(product));
    card.appendChild(imgStage);

    // Details
    const details = document.createElement("div");
    details.className = "card-details";

    const title = document.createElement("h3");
    title.textContent = product.name;
    title.addEventListener("click", () => openProductDetail(product));
    details.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = product.description;
    details.appendChild(desc);

    // Colors
    const colorSec = document.createElement("div");
    colorSec.className = "color-picker-sec";
    
    const colorLabel = document.createElement("span");
    colorLabel.className = "label";
    colorLabel.innerHTML = `Color: <span class="card-color-name">${selectedColor}</span>`;
    colorSec.appendChild(colorLabel);

    const colorOptions = document.createElement("div");
    colorOptions.className = "color-options";
    
    product.colors.forEach(color => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.title = color;
      btn.className = `color-btn ${selectedColor === color ? "active" : ""}`;
      btn.style.backgroundColor = colorMap[color] || "#9ca3af";
      if (color.includes("White") || color.includes("Silver") || color === "Ivory White" || color === "Glacier White") {
        btn.style.border = "1px solid #d1d5db";
      }

      if (selectedColor === color) {
        const dot = document.createElement("span");
        dot.className = "inner-dot";
        dot.style.backgroundColor = needsDarkDot(color) ? "black" : "white";
        btn.appendChild(dot);
      }

      btn.addEventListener("click", () => {
        selectedColor = color;
        colorLabel.innerHTML = `Color: <span class="card-color-name">${selectedColor}</span>`;
        // Re-render color buttons in this card only
        Array.from(colorOptions.children).forEach(cb => {
          cb.className = `color-btn ${cb.title === selectedColor ? "active" : ""}`;
          cb.innerHTML = "";
          if (cb.title === selectedColor) {
            const d = document.createElement("span");
            d.className = "inner-dot";
            d.style.backgroundColor = needsDarkDot(cb.title) ? "black" : "white";
            cb.appendChild(d);
          }
        });
      });
      colorOptions.appendChild(btn);
    });
    colorSec.appendChild(colorOptions);
    details.appendChild(colorSec);

    // Footer
    const footer = document.createElement("div");
    footer.className = "card-footer";
    
    const priceCol = document.createElement("div");
    priceCol.className = "card-price-col";
    priceCol.innerHTML = `<span>Price</span><span>Php ${formatPrice(product.price)}</span>`;
    footer.appendChild(priceCol);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "add-btn";
    addBtn.innerHTML = `<i data-lucide="shopping-cart"></i><span>Add</span>`;
    addBtn.addEventListener("click", () => handleAddToCart(product, selectedColor));
    footer.appendChild(addBtn);

    details.appendChild(footer);
    card.appendChild(details);

    container.appendChild(card);
  });
}

// Cart functionality
function handleAddToCart(product, color) {
  const existingIndex = cart.findIndex(
    item => item.product.id === product.id && item.selectedColor === color
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ product, quantity: 1, selectedColor: color });
  }

  showAlert(`${product.name} (${color}) added to cart`);
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function handleCheckout() {
  const totalCost = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  showAlert(`Order placed successfully! Checking out ${totalItems} item(s) for a total of Php ${formatPrice(totalCost)}. Thank you for shopping with Xiaomi Store!`);
  
  cart = [];
  cartModalContainer.classList.add("hidden");
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Update badge
  if (totalItems > 0) {
    cartBadgeContainer.innerHTML = `<span class="badge-count">${totalItems}</span>`;
  } else {
    cartBadgeContainer.innerHTML = `<span class="badge-empty">Empty</span>`;
  }

  // Update modal header
  cartTotalQuantity.textContent = totalItems;
  if (totalItems > 0) {
    cartTotalPriceDisplay.classList.remove("hidden");
    cartTotalPriceDisplay.innerHTML = `Total: <span>Php ${formatPrice(totalCost)}</span>`;
    cartCheckoutBtn.disabled = false;
  } else {
    cartTotalPriceDisplay.classList.add("hidden");
    cartCheckoutBtn.disabled = true;
  }

  // Update items list
  cartProductsRow.innerHTML = "";
  if (cart.length === 0) {
    emptyCartView.classList.remove("hidden");
    cartProductsRow.classList.add("hidden");
  } else {
    emptyCartView.classList.add("hidden");
    cartProductsRow.classList.remove("hidden");

    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item-card";
      
      const thumb = document.createElement("div");
      thumb.className = "cart-item-thumb";
      thumb.innerHTML = `<img src="${item.product.image}" alt="${item.product.name}" referrerpolicy="no-referrer">`;
      row.appendChild(thumb);

      const info = document.createElement("div");
      info.className = "cart-item-info";
      info.innerHTML = `
        <p class="cart-item-name">${item.product.name}</p>
        <p class="cart-item-color">Color: ${item.selectedColor}</p>
        <p class="cart-item-price">Php ${formatPrice(item.product.price)}</p>
      `;
      row.appendChild(info);

      const removeBtn = document.createElement("button");
      removeBtn.className = "cart-item-remove";
      removeBtn.title = "Remove from cart";
      removeBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
      removeBtn.addEventListener("click", () => removeCartItem(index));
      row.appendChild(removeBtn);

      cartProductsRow.appendChild(row);
    });
  }

  if(window.lucide) {
    lucide.createIcons();
  }
}

// Slideshow
function initSlideshow() {
  const slides = productsData.slice(0, 3);
  if (slides.length === 0) return;

  function renderSlide() {
    const product = slides[currentSlideIndex];
    heroSlideshowSection.innerHTML = `
      <div id="product-slideshow">
        <div class="slideshow-grid-line left"></div>
        <div class="slideshow-grid-line right"></div>

        <div class="slide-item" id="slide-item-${product.id}">
          <div class="slide-copy">
            <span class="tag">Issue No. 04 / Featured Gadget</span>
            <h1>${product.name}</h1>
            <p class="subtitle">Exclusive product collection</p>
            <p class="desc">${product.description}</p>
            <div class="price-wrap">
              <span>Starting Price</span>
              <span>Php ${formatPrice(product.price)}</span>
            </div>
            <button class="slide-btn" id="slide-view-btn">View Object Details</button>
          </div>

          <div class="slide-image-stage">
            <div class="slide-image-inner">
              <div class="slide-stage-box"></div>
              <img src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer">
            </div>
          </div>
        </div>

        <button class="nav-btn prev" id="slide-prev" aria-label="Previous slide">
          <i data-lucide="chevron-left"></i>
        </button>
        <button class="nav-btn next" id="slide-next" aria-label="Next slide">
          <i data-lucide="chevron-right"></i>
        </button>

        <div class="indicators">
          ${slides.map((_, i) => `<button class="indicator ${i === currentSlideIndex ? "active" : ""}" data-index="${i}" aria-label="Go to slide ${i+1}"></button>`).join('')}
        </div>
      </div>
    `;

    document.getElementById("slide-item-" + product.id).addEventListener("click", () => openProductDetail(product));
    document.getElementById("slide-view-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openProductDetail(product);
    });

    document.getElementById("slide-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      changeSlide(-1);
    });
    document.getElementById("slide-next").addEventListener("click", (e) => {
      e.stopPropagation();
      changeSlide(1);
    });

    document.querySelectorAll(".indicator").forEach(ind => {
      ind.addEventListener("click", (e) => {
        e.stopPropagation();
        currentSlideIndex = parseInt(e.target.dataset.index);
        renderSlide();
        resetSlideshowTimer();
      });
    });

    if(window.lucide) {
      lucide.createIcons();
    }
  }

  function changeSlide(dir) {
    currentSlideIndex = (currentSlideIndex + dir + slides.length) % slides.length;
    renderSlide();
    resetSlideshowTimer();
  }

  function resetSlideshowTimer() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      renderSlide();
    }, 6000);
  }

  renderSlide();
  resetSlideshowTimer();
}

// Product Detail Modal
function openProductDetail(product) {
  selectedProductForDetail = product;
  detailSelectedColor = product.colors[0];

  document.getElementById("modal-category-badge").textContent = product.category;
  document.getElementById("modal-product-image").src = product.image;
  document.getElementById("modal-product-image").alt = product.name;
  
  document.getElementById("detail-product-name").textContent = product.name;
  document.getElementById("detail-product-price").textContent = `Php ${formatPrice(product.price)}`;
  document.getElementById("detail-product-description").textContent = product.description;

  renderDetailColors();
  productDetailModalOverlay.classList.remove("hidden");
}

function closeProductDetail() {
  productDetailModalOverlay.classList.add("hidden");
  selectedProductForDetail = null;
}

function renderDetailColors() {
  document.getElementById("detail-selected-color-name").textContent = detailSelectedColor;
  detailColorOptions.innerHTML = "";

  selectedProductForDetail.colors.forEach(color => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `detail-color-btn ${detailSelectedColor === color ? "active" : ""}`;
    btn.innerHTML = detailSelectedColor === color 
      ? `<i data-lucide="check"></i>${color}`
      : color;
    
    btn.addEventListener("click", () => {
      detailSelectedColor = color;
      renderDetailColors();
    });

    detailColorOptions.appendChild(btn);
  });
  
  if(window.lucide) {
    lucide.createIcons();
  }
}

// Start
document.addEventListener("DOMContentLoaded", init);
