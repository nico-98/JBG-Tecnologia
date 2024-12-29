// Selección de contenedores y elementos
const productosContainer = document.querySelector('.productos-container');
const carritoContainer = document.querySelector('.carrito-container');
const carritoItems = document.getElementById('carrito-items');

// Variables del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar y renderizar el total en el carrito
function renderizarTotalCarrito() {
  const carritoText = document.querySelector('.carrito-text');
  if (!carritoText) {
    console.warn('No se encontró el elemento carrito-text.');
    return;
  }

  const total = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
  carritoText.textContent = `Ver carrito (Total: $${total.toLocaleString('es-AR')})`;
}

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
  if (event.target.classList.contains('agregar-carrito')) {
    const boton = event.target;
    const id = boton.dataset.id;
    const precio = parseFloat(boton.dataset.precio);

    const productoEnCarrito = carrito.find(prod => prod.id === id);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      const nuevoProducto = {
        id: id,
        nombre: boton.closest('.card-body').querySelector('.card-title').textContent,
        precio: precio,
        cantidad: 1,
      };
      carrito.push(nuevoProducto);
    }

    guardarCarrito();
    renderizarTotalCarrito();

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto agregado al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(event) {
  if (event.target.classList.contains('eliminar-producto')) {
    const id = event.target.dataset.id;

    // Filtrar el carrito para eliminar el producto con el id
    carrito = carrito.filter(producto => producto.id !== id);

    guardarCarrito();
    renderizarDetalleCarrito();
    renderizarTotalCarrito();

    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Producto eliminado del carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

// Mostrar detalle del carrito
function renderizarDetalleCarrito() {
  if (carrito.length === 0) {
    carritoItems.innerHTML = '<p>El carrito está vacío</p>';
  } else {
    carritoItems.innerHTML = carrito.map(producto => `
      <div class="carrito-item">
        <strong>${producto.nombre}</strong>
        <span>Cantidad: ${producto.cantidad}</span>
        <span>Subtotal: $${(producto.precio * producto.cantidad).toLocaleString('es-AR')}</span>
        <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
      </div>
    `).join('');
  }
}

// Alternar visibilidad del carrito
function toggleDetalleCarrito() {
  carritoItems.style.display = carritoItems.style.display === 'block' ? 'none' : 'block';
  renderizarDetalleCarrito();
}

// Eventos iniciales
document.addEventListener('DOMContentLoaded', () => {
  renderizarTotalCarrito();
  renderizarDetalleCarrito();
});

productosContainer.addEventListener('click', agregarAlCarrito);
carritoContainer.addEventListener('click', toggleDetalleCarrito);
carritoItems.addEventListener('click', eliminarDelCarrito);
