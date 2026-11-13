/**
 * SANTA JUANA ACTIVEWEAR — MAIN SCRIPT
 * Operado por GRUPO SANTA JUANA S.A.S.
 */

// Cart state
let cart = [];

// DOM Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartEmptyState = document.getElementById('cartEmptyState');
const cartFooter = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartCount = document.getElementById('cartCount');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

// Policy Modal Elements
const policyModal = document.getElementById('policyModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Currency Formatter COP
function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// Open / Close Cart Drawer
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Add to Cart Function
function addToCart(title, price, image) {
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price, image, quantity: 1 });
  }
  updateCartUI();
  openCart();
}

// Remove from Cart
function removeFromCart(title) {
  cart = cart.filter(item => item.title !== title);
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartEmptyState.style.display = 'block';
    cartFooter.style.display = 'none';
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(cartEmptyState);
  } else {
    cartEmptyState.style.display = 'none';
    cartFooter.style.display = 'block';
    
    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">${item.quantity} x ${formatCOP(item.price)}</div>
            <span class="cart-item-remove" onclick="removeFromCart('${item.title}')">Eliminar</span>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    cartSubtotal.textContent = formatCOP(subtotal);
  }
}

// WhatsApp Checkout
function checkoutViaWhatsApp() {
  if (cart.length === 0) return;

  let message = "👋 ¡Hola Santa Juana Activewear! Deseo ordenar los siguientes productos:\n\n";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    message += `${index + 1}. ${item.title} (Cant: ${item.quantity}) — ${formatCOP(itemTotal)}\n`;
  });

  message += `\n💰 *Total Estimado:* ${formatCOP(subtotal)}`;
  message += `\n📍 *Ciudad de entrega:* `;
  message += `\n📦 *Método de pago preferido:* (Contra entrega / Transferencia)`;

  const encodedUrl = `https://wa.me/573108247971?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Category Filter Pills
const filterPills = document.querySelectorAll('.filter-pill');
const productCards = document.querySelectorAll('.product-card');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.getAttribute('data-filter');

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Policy Modals Content
const policiesData = {
  enviosModal: {
    title: "Políticas de Envíos Nacionales",
    body: `
      <h4>Cobertura y Tiempos de Entrega</h4>
      <p>Realizamos despachos a todo el territorio nacional de Colombia desde nuestro centro de distribución en <strong>Cali, Valle del Cauca</strong> (Calle 33 # 75C - 31), operado legalmente por <strong>GRUPO SANTA JUANA S.A.S.</strong> (NIT: 900872354-8).</p>
      <p>Los tiempos estimados de entrega son:</p>
      <ul>
        <li><strong>Ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga):</strong> 1 a 3 días hábiles.</li>
        <li><strong>Resto del país y municipios intermedios:</strong> 3 a 5 días hábiles.</li>
      </ul>
      <h4>Modalidades de Pago</h4>
      <p>Ofrecemos servicio de <strong>pago contra entrega</strong> en ciudades seleccionadas y pagos electrónicos seguros mediante transferencias bancarias o pasarelas autorizadas.</p>
    `
  },
  garantiasModal: {
    title: "Garantías, Cambios y Devoluciones",
    body: `
      <h4>Garantía de Calidad</h4>
      <p>Todas nuestras prendas cuentan con <strong>30 días calendario de garantía</strong> por defectos de fabricación o confección en costuras y textiles.</p>
      <h4>Cambios por Talla</h4>
      <p>Si la prenda no te queda como esperabas, gestionamos tu cambio de talla dentro de los primeros 5 días hábiles posteriores a la entrega. La prenda debe estar en perfecto estado, con etiquetas originales y sin signos de uso ni lavado.</p>
      <p>Para iniciar una solicitud de cambio, comunícate a nuestra línea oficial de atención en WhatsApp: <strong>+57 3108247971</strong> o al correo <strong>recursoshumanos@santajuana.store</strong>.</p>
    `
  },
  privacidadModal: {
    title: "Política de Tratamiento de Datos Personales",
    body: `
      <h4>Responsable del Tratamiento</h4>
      <p><strong>GRUPO SANTA JUANA S.A.S.</strong>, sociedad comercial legalmente constituida bajo las leyes de la República de Colombia, identificada con NIT <strong>900872354-8</strong> y domicilio en la <strong>Calle 33 # 75C - 31, Cali - Valle</strong>, es la entidad responsable del tratamiento de los datos personales recolectados a través de esta plataforma digital (santajuana.store).</p>
      <h4>Finalidad del Tratamiento</h4>
      <p>En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013, los datos proporcionados por los usuarios serán utilizados exclusivamente para:</p>
      <ul>
        <li>Procesar, despachar y facturar pedidos comerciales.</li>
        <li>Coordinar entregas logísticas mediante transportadoras aliadas.</li>
        <li>Atención de PQRS, garantías y soporte al cliente.</li>
        <li>Envío de notificaciones de estado de pedidos.</li>
      </ul>
      <p>Para ejercer sus derechos de conocimiento, actualización o supresión de datos, comuníquese al correo oficial: <strong>recursoshumanos@santajuana.store</strong>.</p>
    `
  },
  terminosModal: {
    title: "Términos y Condiciones del Servicio",
    body: `
      <h4>Condiciones Generales</h4>
      <p>El acceso y uso de este sitio web (<strong>santajuana.store</strong>) se rige bajo la legislación mercantil de Colombia. La titularidad y operación comercial de la marca <strong>Santa Juana Activewear</strong> corresponde a <strong>GRUPO SANTA JUANA S.A.S.</strong>, con matrícula mercantil No. 384295-19 de la Cámara de Comercio de Cali.</p>
      <h4>Precios y Disponibilidad</h4>
      <p>Todos los precios se encuentran expresados en pesos colombianos (COP). Los precios y promociones están sujetos a disponibilidad de inventario y pueden variar sin previo aviso antes de la confirmación final del pedido.</p>
    `
  }
};

function openModal(modalKey) {
  const data = policiesData[modalKey];
  if (data) {
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    policyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  policyModal.classList.remove('active');
  document.body.style.overflow = '';
}

policyModal.addEventListener('click', (e) => {
  if (e.target === policyModal) {
    closeModal();
  }
});
