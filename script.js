document.addEventListener('DOMContentLoaded', function() {
  var listaRecetas = document.getElementById('lista-recetas');
  var listaComida = document.getElementById('lista-comida');
  var tablaCompra = document.getElementById('tabla-compra').getElementsByTagName('tbody')[0];
  var filtroRecetasInput = document.getElementById('filtroRecetas');
  var resetListaCompraBtn = document.getElementById('resetListaCompra');
  
  // Función para agregar ingredientes a la lista de la compra
  function agregarIngredienteAListaCompra(nombre, cantidad) {
    var filas = tablaCompra.getElementsByTagName('tr');
    for (var i = 0; i < filas.length; i++) {
      var celdas = filas[i].getElementsByTagName('td');
      if (celdas.length > 0 && celdas[0].textContent === nombre) {
        // El ingrediente ya existe en la lista, actualizar la cantidad
        var cantidadExistente = parseFloat(celdas[1].textContent);
        celdas[1].textContent = cantidadExistente + cantidad;
        // Si la cantidad es 0 o menos, eliminar el ingrediente de la lista
        if (cantidadExistente + cantidad <= 0) {
          tablaCompra.deleteRow(i);
        }
        return; // Salir de la función
      }
    }
    // Si el ingrediente no existe, agregarlo como una nueva fila
    if (cantidad > 0) {
      var fila = tablaCompra.insertRow();
      var celdaComida = fila.insertCell(0);
      var celdaCantidad = fila.insertCell(1);
      celdaComida.textContent = nombre;
      celdaCantidad.textContent = cantidad;
    }
  }
  
  // Función para cargar y mostrar las recetas y la comida
  function cargarRecetasYComida() {
    fetch('recetas.json')
      .then(response => response.json())
      .then(data => {
        listaRecetas.innerHTML = ''; // Limpiar la lista de recetas
        listaComida.innerHTML = ''; // Limpiar la lista de comida
        
        data.recetas.forEach(receta => {
          var listItem = document.createElement('li');
          var buttonAdd = document.createElement('button');
          var buttonSub = document.createElement('button');
          buttonAdd.textContent = '+';
          buttonSub.textContent = '-';
          buttonAdd.className = 'btn-anadir';
          buttonSub.className = 'btn-quitar';
          listItem.textContent = receta.nombre;
          listItem.appendChild(buttonAdd);
          listItem.appendChild(buttonSub);
          listaRecetas.appendChild(listItem);
          
          buttonAdd.addEventListener('click', function() {
            console.log('Añadiendo receta:', receta.nombre);
            console.log('Ingredientes:', receta.ingredientes);
            // Agregar ingredientes a la lista de la compra
            receta.ingredientes.forEach(ingrediente => {
              agregarIngredienteAListaCompra(ingrediente.nombre, ingrediente.cantidad);
            });
          });
          
          buttonSub.addEventListener('click', function() {
            console.log('Restando receta:', receta.nombre);
            console.log('Ingredientes:', receta.ingredientes);
            // Restar ingredientes a la lista de la compra
            receta.ingredientes.forEach(ingrediente => {
              agregarIngredienteAListaCompra(ingrediente.nombre, -ingrediente.cantidad);
            });
          });
        });
        
        data.comida.forEach(ingrediente => {
          var listItem = document.createElement('li');
          var buttonAdd = document.createElement('button');
          buttonAdd.textContent = '+';
          buttonAdd.className = 'btn-anadir';
          listItem.textContent = ingrediente;
          listItem.appendChild(buttonAdd);
          listaComida.appendChild(listItem);
          
          buttonAdd.addEventListener('click', function() {
            console.log('Añadiendo comida:', ingrediente);
            // Agregar comida a la lista de la compra
            agregarIngredienteAListaCompra(ingrediente, 1);
          });
        });
      })
      .catch(error => console.error('Error al cargar recetas y comida:', error));
  }
  
// Cargar y mostrar las recetas y la comida al cargar la página
cargarRecetasYComida();
  
// Evento para filtrar las recetas y la comida al escribir en el input de filtro
filtroRecetasInput.addEventListener('input', function() {
  var filtroTexto = filtroRecetasInput.value.toLowerCase();
  
  // Filtrar las recetas
  var recetas = listaRecetas.getElementsByTagName('li');
  Array.from(recetas).forEach(function(receta) {
    var nombreReceta = receta.textContent.toLowerCase();
    if (nombreReceta.includes(filtroTexto)) {
      receta.style.display = 'block';
    } else {
      receta.style.display = 'none';
    }
  });
  
  // Filtrar la comida
  var comida = listaComida.getElementsByTagName('li');
  Array.from(comida).forEach(function(ingrediente) {
    var nombreIngrediente = ingrediente.textContent.toLowerCase();
    if (nombreIngrediente.includes(filtroTexto)) {
      ingrediente.style.display = 'block';
    } else {
      ingrediente.style.display = 'none';
    }
  });
});
  
  // Evento para resetear la lista de la compra
  resetListaCompraBtn.addEventListener('click', function() {
    tablaCompra.innerHTML = ''; // Vaciar la tabla de la lista de compra
  });
});
