// Selección de elementos del DOM
const carritoContainer = document.querySelector('.carrito-container');

// Productos en el carrito (simulación inicial)
let carrito = [];
let historialCarrito = [];

// Función para actualizar el contenido del carrito
function actualizarCarrito() {
  const modalCarrito = document.querySelector('.modal-carrito');
  const contenido = carrito.length
    ? carrito.map((producto, index) =>
        `<li>${producto.nombre} - $${producto.precio} 
        <button class="btn-eliminar" data-index="${index}">❌</button></li>`
      ).join('') 
    : '<p>El carrito está vacío.</p>';

  modalCarrito.innerHTML = `
    <h3>Carrito de Compras</h3>
    <ul>${contenido}</ul>
    ${carrito.length ? '<button id="vaciar-carrito">Vaciar Carrito</button>' : ''}
  `;

  // Conectar eventos de eliminar y vaciar carrito
  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', (e) => eliminarProducto(e.target.dataset.index));
  });

  const btnVaciar = document.getElementById('vaciar-carrito');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
  }
}

// Función para agregar productos al carrito
function agregarAlCarrito(idProducto, nombreProducto, precioProducto) {
  carrito.push({ id: idProducto, nombre: nombreProducto, precio: precioProducto });
  historialCarrito.push({ id: idProducto, nombre: nombreProducto, precio: precioProducto });
  Swal.fire({
    title: "¡Producto añadido!",
    text: `${nombreProducto} fue agregado al carrito.`,
    icon: "success",
  });
  actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
  const productoEliminado = carrito[index];
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: "¿Estás seguro?",
    text: `¿Quieres eliminar ${productoEliminado.nombre} del carrito?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminarlo",
    cancelButtonText: "No, cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.splice(index, 1);
      Swal.fire({
        title: "¡Eliminado!",
        text: `${productoEliminado.nombre} fue eliminado del carrito.`,
        icon: "success"
      });
      actualizarCarrito();
    }
  });
}

// Función para vaciar el carrito
function vaciarCarrito() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esto eliminará todos los productos del carrito.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "No, cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      Swal.fire({
        title: "¡Carrito vacío!",
        text: "Se han eliminado todos los productos del carrito.",
        icon: "success"
      });
      actualizarCarrito();
    }
  });
}

// Evento para mostrar/ocultar el carrito
carritoContainer.addEventListener('click', () => {
  const modalCarrito = document.querySelector('.modal-carrito');
  
  if (!modalCarrito) {
    console.error("Modal del carrito no encontrado.");
    return;
  }

  // Alternar visibilidad del modal
  modalCarrito.style.display = modalCarrito.style.display === 'none' || !modalCarrito.style.display
    ? 'block'
    : 'none';
});

// Crear modal para el carrito
const modalHTML = document.createElement('div');
modalHTML.className = 'modal-carrito';
modalHTML.style.cssText = `
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #141035;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  display: none;
  z-index: 1000;
`;
document.body.appendChild(modalHTML);

// Conectar botones de productos
const botonesAgregar = document.querySelectorAll('.agregar-carrito');
botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const idProducto = boton.dataset.id;
    const nombreProducto = boton.parentElement.querySelector('.card-title').textContent;
    const precioProducto = boton.dataset.precio;
    agregarAlCarrito(idProducto, nombreProducto, precioProducto);
  });
});

// Conectar botón del carrito
carritoContainer.addEventListener('click', () => {
  const modalCarrito = document.querySelector('.modal-carrito');
  modalCarrito.classList.toggle('visible');
});

actualizarCarrito();

// Función para mostrar el historial de productos
function mostrarHistorial() {
  if (historialCarrito.length) {
    Swal.fire({
      title: "Historial de Productos",
      html: historialCarrito.map(producto => `<p>${producto.nombre} - $${producto.precio}</p>`).join(''),
      icon: "info"
    });
  } else {
    Swal.fire({
      title: "Historial vacío",
      text: "Aún no has añadido productos.",
      icon: "warning"
    });
  }
}

// Conectar el historial al DOM
document.querySelector('.historial-btn').addEventListener('click', mostrarHistorial);
