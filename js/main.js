const productosContainer = document.querySelector('.productos-container');
const carritoContainer = document.querySelector('.carrito-container');
const carritoIcon = document.querySelector('.carrito-icon');
const carritoText = document.querySelector('.carrito-text');
const carritoItems = document.getElementById('carrito-items');

let carrito = [];
let productos = [];

// Cargar carrito desde localStorage
function cargarCarrito() {
  carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  renderizarTotalCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

async function cargarProductos(marca) {
  productosContainer.innerHTML = '<p>Cargando productos...</p>';
  try {
    const response = await fetch(`../data/${marca}.json`);
    if (!response.ok) throw new Error('Error al cargar productos');
    productos = await response.json();

    productosContainer.innerHTML = productos.map(producto => `
      <div class="card">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <p class="card-text"><strong>Precio:</strong> ${formatPrice(producto.precio)}</p>
          <button class="btn agregar-carrito" data-id="${producto.id}" data-precio="${producto.precio}">Agregar al carrito</button>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error:', error);
    productosContainer.innerHTML = '<p class="error">No se pudieron cargar los productos.</p>';
  }
}

// Delegación de eventos para botones de productos
productosContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('agregar-carrito')) {
    agregarAlCarrito(event.target.dataset);
  }
});

function agregarAlCarrito({ id, precio }) {
  if (!id || isNaN(precio)) return console.error('Datos inválidos:', { id, precio });
  
  const productoExistente = carrito.find(item => item.id === id);
  if (productoExistente) {
    // Si el producto ya está en el carrito, aumenta la cantidad
    productoExistente.cantidad++;
  } else {
    // Si no está en el carrito, agrégalo con cantidad 1
    const producto = productos.find(prod => prod.id == id);
    if (producto) {
      carrito.push({ id, nombre: producto.nombre, precio: Number(precio), cantidad: 1 });
    }
  }

  // Guardar el carrito actualizado en localStorage
  guardarCarrito();

  // Mostrar alerta de producto agregado
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Producto agregado al carrito",
    showConfirmButton: false,
    timer: 1500
  });

  // Actualizar el total mostrado en el carrito
  renderizarTotalCarrito();
}

function renderizarTotalCarrito() {
  const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
  carritoText.textContent = `Ver carrito (${formatPrice(total)})`;
}

// Mostrar u ocultar detalle del carrito
carritoIcon.addEventListener('click', toggleDetalleCarrito);
carritoText.addEventListener('click', toggleDetalleCarrito);

function toggleDetalleCarrito() {
  if (carritoItems.style.display === 'block') {
    carritoItems.style.display = 'none';
  } else {
    carritoItems.style.display = 'block';
    renderizarDetalleCarrito();
  }
}

function renderizarDetalleCarrito() {
  carritoItems.innerHTML = carrito.length ? carrito.map(producto => `
    <div class="carrito-item">
      <span><strong>${producto.nombre}</strong></span>
      <span>Cantidad: ${producto.cantidad}</span>
      <span>Precio: ${formatPrice(producto.precio * producto.cantidad)}</span>
    </div>
  `).join('') : '<p>El carrito está vacío</p>';
}

function formatPrice(price) {
  return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

// Inicialización
document.getElementById('btn-samsung').addEventListener('click', () => cargarProductos('samsung'));
document.getElementById('btn-xiaomi').addEventListener('click', () => cargarProductos('xiaomi'));

// Cargar carrito al inicio y productos por defecto
cargarCarrito();
cargarProductos('samsung');
