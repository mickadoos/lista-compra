document.addEventListener("DOMContentLoaded", function () {
  var recetasTitle = document.getElementById("recetas-title");
  var listaRecetas = document.getElementById("lista-recetas");
  var comidaTitle = document.getElementById("comida-title");
  var listaComida = document.getElementById("lista-comida");
  var tablaCompra = document
    .getElementById("tabla-compra")
    .getElementsByTagName("tbody")[0];
  var filtroComidasInput = document.getElementById("filtroComidas");
  var resetListaCompraBtn = document.getElementById("resetListaCompra");

  // Agregar evento de clic para la columna de recetas
  recetasTitle.addEventListener("click", function () {
    listaRecetas.classList.toggle("active");
    recetasTitle.classList.toggle("active"); // Agregar o quitar la clase "active" al título
  });

  // Agregar evento de clic para la columna de comida
  comidaTitle.addEventListener("click", function () {
    listaComida.classList.toggle("active");
    comidaTitle.classList.toggle("active"); // Agregar o quitar la clase "active" al título
  });

  // Función para agregar ingredientes a la lista de la compra
  function agregarIngredienteAListaCompra(nombre, cantidad) {
    var filaExistente = obtenerFilaIngrediente(nombre);
    if (filaExistente) {
      // Si la fila ya existe, actualizar la cantidad
      var celdaCantidad = filaExistente.querySelector(".cantidad");
      var cantidadExistente = parseFloat(celdaCantidad.textContent);
      var nuevaCantidad = cantidadExistente + cantidad;

      // Si la cantidad es 0 o menos, eliminar el ingrediente de la lista
      if (nuevaCantidad <= 0) {
        tablaCompra.removeChild(filaExistente);
      } else {
        celdaCantidad.textContent = nuevaCantidad;
      }
    } else if (cantidad > 0) {
      // Si el ingrediente no existe, agregarlo como una nueva fila
      var fila = tablaCompra.insertRow();
      var celdaComida = fila.insertCell(0);
      var celdaCantidad = fila.insertCell(1);
      var celdaButtons = fila.insertCell(2);
      celdaComida.textContent = nombre;
      celdaCantidad.textContent = cantidad;
      celdaCantidad.className = "cantidad"; // Añadir una clase para identificar la celda de cantidad
      celdaButtons.className = "buttonsDiv";

      // Añadir botones "+" y "-" para incrementar y decrementar la cantidad
      var btnIncrementar = document.createElement("button");
      btnIncrementar.textContent = "+";
      btnIncrementar.className = "btn-incrementar";
      btnIncrementar.addEventListener("click", function () {
        var cantidadExistente = parseFloat(celdaCantidad.textContent);
        celdaCantidad.textContent = cantidadExistente + 1;
        console.log("+1");
      });

      var btnDecrementar = document.createElement("button");
      btnDecrementar.textContent = "-";
      btnDecrementar.className = "btn-decrementar";
      btnDecrementar.addEventListener("click", function () {
        var cantidadExistente = parseFloat(celdaCantidad.textContent);
        if (cantidadExistente > 1) {
          celdaCantidad.textContent = cantidadExistente - 1;
        } else {
          // Si la cantidad es 1 o menos, eliminar el ingrediente de la lista
          console.log("-1");
          tablaCompra.removeChild(fila);
        }
      });

      celdaButtons.appendChild(btnIncrementar);
      celdaButtons.appendChild(btnDecrementar);
    }
  }

  // Función para obtener la fila de un ingrediente en la lista de compra
  function obtenerFilaIngrediente(nombre) {
    var filas = tablaCompra.getElementsByTagName("tr");
    for (var i = 0; i < filas.length; i++) {
      var celdas = filas[i].getElementsByTagName("td");
      if (celdas.length > 0 && celdas[0].textContent === nombre) {
        return filas[i];
      }
    }
    return null; // El ingrediente no está en la lista de compra
  }

  // Función para cargar y mostrar las recetas y la comida
  function cargarRecetasYComida() {
    fetch("recetas.json")
      .then((response) => response.json())
      .then((data) => {
        listaRecetas.innerHTML = ""; // Limpiar la lista de recetas
        listaComida.innerHTML = ""; // Limpiar la lista de comida

        data.recetas.forEach((receta) => {
          var listItem = document.createElement("li");
          var buttonAdd = document.createElement("button");
          var buttonSub = document.createElement("button");
          var divButtons = document.createElement("div");
          buttonAdd.textContent = "+";
          buttonSub.textContent = "-";
          buttonAdd.className = "btn-anadir";
          buttonSub.className = "btn-quitar";
          divButtons.className = "buttons";
          listItem.textContent = receta.nombre;
          divButtons.appendChild(buttonAdd);
          divButtons.appendChild(buttonSub);
          listItem.appendChild(divButtons);
          listaRecetas.appendChild(listItem);

          buttonAdd.addEventListener("click", function () {
            console.log("Añadiendo receta:", receta.nombre);
            console.log("Ingredientes:", receta.ingredientes);
            // Agregar ingredientes a la lista de la compra
            receta.ingredientes.forEach((ingrediente) => {
              agregarIngredienteAListaCompra(
                ingrediente.nombre,
                ingrediente.cantidad
              );
            });
          });

          buttonSub.addEventListener("click", function () {
            console.log("Restando receta:", receta.nombre);
            console.log("Ingredientes:", receta.ingredientes);
            // Restar ingredientes a la lista de la compra
            receta.ingredientes.forEach((ingrediente) => {
              agregarIngredienteAListaCompra(
                ingrediente.nombre,
                -ingrediente.cantidad
              );
            });
          });
        });

        data.comida.forEach((categoria) => {
          var categoriaContainer = document.createElement("div"); // Crear un contenedor para la categoría
          categoriaContainer.classList.add("categoria-container"); // Agregar una clase al contenedor

          var categoriaHeading = document.createElement("h3");
          categoriaHeading.textContent = categoria.categoria;
          categoriaContainer.appendChild(categoriaHeading);

          var categoriaList = document.createElement("ul");
          categoria.ingredientes.forEach((ingrediente) => {
            var listItem = document.createElement("li");
            var buttonAdd = document.createElement("button");
            buttonAdd.textContent = "+";
            buttonAdd.className = "btn-anadir";
            listItem.textContent = ingrediente;
            listItem.appendChild(buttonAdd);
            categoriaList.appendChild(listItem);

            buttonAdd.addEventListener("click", function () {
              console.log("Añadiendo comida:", ingrediente);
              // Agregar comida a la lista de la compra
              agregarIngredienteAListaCompra(ingrediente, 1);
            });
          });

          categoriaContainer.appendChild(categoriaList); // Agregar la lista de ingredientes al contenedor
          listaComida.appendChild(categoriaContainer); // Agregar el contenedor a la lista de comida
        });
      })
      .catch((error) =>
        console.error("Error al cargar recetas y comida:", error)
      );
  }

  // Cargar y mostrar las recetas y la comida al cargar la página
  cargarRecetasYComida();

  // Evento para filtrar las recetas y la comida al escribir en el input de filtro
  filtroComidasInput.addEventListener("input", function () {
    var filtroTexto = filtroComidasInput.value.toLowerCase();

    // Filtrar las recetas
    var recetas = listaRecetas.getElementsByTagName("li");
    Array.from(recetas).forEach(function (receta) {
      var nombreReceta = receta.textContent.toLowerCase();
      if (nombreReceta.includes(filtroTexto)) {
        receta.style.display = "flex";
      } else {
        receta.style.display = "none";
      }
    });

    // Filtrar la comida
    var comida = listaComida.getElementsByTagName("li");
    Array.from(comida).forEach(function (ingrediente) {
      var nombreIngrediente = ingrediente.textContent.toLowerCase();
      if (nombreIngrediente.includes(filtroTexto)) {
        ingrediente.style.display = "flex";
      } else {
        ingrediente.style.display = "none";
      }
    });
  });

  // Evento para resetear la lista de la compra
  resetListaCompraBtn.addEventListener("click", function () {
    tablaCompra.innerHTML = ""; // Vaciar la tabla de la lista de compra
  });

  // Evento para resetear el valor del input al hacer clic fuera de él
  document.addEventListener("click", function (event) {
    // Verificar si se hizo clic fuera del input de filtro
    if (
      event.target !== filtroComidasInput &&
      !event.target.closest("#lista-recetas") &&
      !event.target.closest(".categoria-container") &&
      !event.target.closest("#tabla-compra")
    ) {
      // Resetear el valor del input
      filtroComidasInput.value = "";

      // Volver a cargar las listas de comida y recetas
      cargarRecetasYComida();
    }
  });

  function descargarListaCompra() {
    // Obtener la tabla de la compra
    var tablaCompra = document.getElementById("tabla-compra");

    // Crear el contenido del archivo de texto
    var contenido = "Lista de la compra:\n\n";

    // Obtener la cantidad máxima de caracteres en la columna de comida
    var maxCaracteresComida = 0;
    for (var i = 0; i < tablaCompra.rows.length; i++) {
      var fila = tablaCompra.rows[i];
      var comida = fila.cells[0].textContent;
      if (comida.length > maxCaracteresComida) {
        maxCaracteresComida = comida.length;
      }
    }

    // Recorrer las filas y agregar el contenido con las cantidades alineadas
    for (var i = 0; i < tablaCompra.rows.length; i++) {
      var fila = tablaCompra.rows[i];
      var comida = fila.cells[0].textContent;
      var cantidad = fila.cells[1].textContent;

      // Calcular la cantidad de espacios necesarios para alinear las cantidades
      var espacios = " ".repeat(maxCaracteresComida - comida.length + 2); // Se añade 2 espacios adicionales

      // Agregar la comida y la cantidad alineadas
      contenido += `${comida}${espacios}${cantidad}\n`;
    }

    // Crear un Blob con el contenido de texto
    var blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });

    // Crear un objeto URL a partir del Blob
    var url = URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo
    var enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "lista_de_compra.txt";
    enlace.style.display = "none";

    // Agregar el enlace al documento y hacer clic en él
    document.body.appendChild(enlace);
    enlace.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  }

  function enviarListaCompraPorWhatsApp(numeroWhatsApp) {
    console.log(numeroWhatsApp);
    var tablaCompra = document.getElementById("tabla-compra");
    var mensaje = "```Lista de la compra:\n\n";

    // Obtener la cantidad máxima de caracteres en la columna de comida
    var maxCaracteresComida = 0;
    for (var i = 0; i < tablaCompra.rows.length; i++) {
      var fila = tablaCompra.rows[i];
      var comida = fila.cells[0].textContent;
      if (comida.length > maxCaracteresComida) {
        maxCaracteresComida = comida.length;
      }
    }
    console.log("max characters: ", maxCaracteresComida);
    // Recorrer las filas y agregar el contenido con las cantidades alineadas
    for (var i = 1; i < tablaCompra.rows.length; i++) {
      var fila = tablaCompra.rows[i];
      var comida = fila.cells[0].textContent;
      var cantidad = fila.cells[1].textContent;

      // Calcular la cantidad de espacios necesarios para alinear las cantidades
      var espacios = " ".repeat(maxCaracteresComida - comida.length + 2); // Se añade 2 espacios adicionales

      // Agregar la comida y la cantidad alineadas
      mensaje += `${comida}${espacios}${cantidad}\n`;
    }

    mensaje += "```";

    console.log(mensaje);

    // Reemplaza 'NUMERO_DE_WHATSAPP' con el número al que deseas enviar el mensaje
    // var numeroWhatsApp = "685347771";

    // Generar el enlace de WhatsApp con el mensaje predefinido
    var linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Abrir el enlace en una nueva ventana o pestaña
    window.open(linkWhatsApp);
  }

  // Obtener los botones por su ID y asociar el evento a cada uno
  var btnAlana = document.getElementById("btnAlana");
  var btnYabel = document.getElementById("btnYabel");

  // Agregar evento para enviar la lista de compra por WhatsApp cuando se hace clic en el botón de Alana
  btnAlana.addEventListener("click", function () {
    enviarListaCompraPorWhatsApp(btnAlana.dataset.valor);
  });

  // Agregar evento para enviar la lista de compra por WhatsApp cuando se hace clic en el botón de Yabel
  btnYabel.addEventListener("click", function () {
    enviarListaCompraPorWhatsApp(btnYabel.dataset.valor);
  });

  // Asociar la función de descarga al botón de descarga
  var btnDescargar = document.getElementById("btnDescargar");
  btnDescargar.addEventListener("click", descargarListaCompra);

  // // Asociar la función de descarga al botón de descarga
  // var enviarPorWhatsAppBtn = document.getElementById("enviarPorWhatsAppBtn");
  // enviarPorWhatsAppBtn.addEventListener("click", enviarListaCompraPorWhatsApp);
});
