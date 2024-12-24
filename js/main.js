
const productosContainer = document.querySelector('.productos-container');
const carritoContainer = document.querySelector('.carrito-container');

let carrito = [];


async function cargarProductos(marca) {
  try {
    const response = await fetch(`../data/${marca}.json`); 
    if (!response.ok) throw new Error('Error al cargar productos');
    const productos = await response.json();

    productosContainer.innerHTML = productos.map(producto => `
      <div class="card">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
          <button class="btn agregar-carrito" data-id="${producto.id}" data-precio="${producto.precio}">Agregar al carrito</button>
        </div>
      </div>
    `).join('');


    document.querySelectorAll('.agregar-carrito').forEach(boton => {
      boton.addEventListener('click', () => agregarAlCarrito(boton.dataset));
    });

  } catch (error) {
    console.error('Error:', error);
    productosContainer.innerHTML = `<p class="error">No se pudieron cargar los productos.</p>`;
  }
}


function agregarAlCarrito({ id, precio }) {
  const productoExistente = carrito.find(item => item.id === id);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ id, precio: Number(precio), cantidad: 1 });
  }
  renderizarCarrito();
}


function renderizarCarrito() {
  carritoContainer.innerHTML = carrito.length ? carrito.map(producto => `
    <div class="carrito-item">
      <span>Producto ID: ${producto.id}</span>
      <span>Cantidad: ${producto.cantidad}</span>
      <span>Total: $${producto.precio * producto.cantidad}</span>
      <button class="btn eliminar-item" data-id="${producto.id}">Eliminar</button>
    </div>
  `).join('') : '<p>El carrito está vacío</p>';


  document.querySelectorAll('.eliminar-item').forEach(boton => {
    boton.addEventListener('click', () => eliminarDelCarrito(boton.dataset.id));
  });
}


function eliminarDelCarrito(id) {
  carrito = carrito.filter(producto => producto.id !== id);
  renderizarCarrito();
}

document.getElementById('btn-samsung').addEventListener('click', () => cargarProductos('samsung'));
document.getElementById('btn-xiaomi').addEventListener('click', () => cargarProductos('xiaomi'));


cargarProductos('samsung');
