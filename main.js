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
        `<li>${producto} <button class="btn-eliminar" data-index="${index}">❌</button></li>`
      ).join('')
    : '<p>El carrito está vacío.</p>';

  modalCarrito.innerHTML = `
    <h3>Carrito de Compras</h3>
    <ul>${contenido}</ul>
    ${carrito.length ? '<button id="vaciar-carrito">Vaciar Carrito</button>' : ''}
  `;

  // Agregar eventos a los botones para eliminar productos
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      eliminarProducto(index);
    });
  });

  const btnVaciar = document.getElementById('vaciar-carrito');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
  }
}

// Evento para mostrar el carrito
carritoContainer.addEventListener('click', () => {
  const modalCarrito = document.querySelector('.modal-carrito');
  modalCarrito.classList.toggle('visible');
});

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
  carrito.push(producto);
  historialCarrito.push(producto); // Guardar en el historial
  Swal.fire({
    title: "¡Producto añadido!",
    text: `${producto} se añadió al carrito.`,
    icon: "success"
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
    text: `¿Quieres eliminar ${productoEliminado} del carrito?`,
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
        text: `${productoEliminado} fue eliminado del carrito.`,
        icon: "success"
      });
      actualizarCarrito();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelado",
        text: `${productoEliminado} permanece en el carrito.`,
        icon: "error"
      });
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

// Conectar los botones de productos con el carrito
document.addEventListener('DOMContentLoaded', () => {
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

  actualizarCarrito();

  // Conectar botones de productos
  const botonesAgregar = document.querySelectorAll('.boton-agregar'); // Clase que asignaremos a botones
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const producto = boton.dataset.producto; // Usamos data-producto en HTML
      agregarAlCarrito(producto);
    });
  });
});

// Función para mostrar el historial de productos
function mostrarHistorial() {
  if (historialCarrito.length) {
    Swal.fire({
      title: "Historial de Productos",
      html: historialCarrito.map(producto => `<p>${producto}</p>`).join(''),
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
