var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}






var rubros = {
               "art245" : {nombre: "Art. 245", montoFunc : art245Monto},
               "preaviso" : {nombre: "Preaviso", montoFunc : preavisoMonto},
               "integracion" : {nombre: "Integración", montoFunc : integracionMonto},
               "diasdelmes" : {nombre: "Dias Del Mes", montoFunc : diasdelmesMonto},
               "art2ley25323" : {nombre: "Art. 2 Ley 25323", montoFunc : art2ley25323Monto},
             };

var datosInput = [
                   {id:"fechaIngreso", nombre:"Fecha de ingreso",
                     input:"type='date'"
                   },
                   {id:"fechaDespido", nombre:"Fecha de despido",
                     input:"type='date'"
                   },
                   {id:"mejorSalario", nombre:"Mejor Salario",
                     input:"type='number' min='0.01' step='0.01'"
                   },
                   {id:"ultimoSalario", nombre:"Ultimo Salario",
                     input:"type='number' min='0.01' step='0.01'"
                   },
                  ];

var datos = { "fechaIngreso" : moment(),
              "fechaDespido" : moment(),
              "mejorSalario" : 0.0,
              "ultimoSalario" : 0.0,
            };

function td(s, id="") {
  var td = "<td ";
  if (id) { td += "id='" + id + "' "; }
  td += " >" + s + "</td>";
  return td
}

function parseInputById(value, id) {
}


function generarInput(dato) {
  var onInputFunction = "onInputFunction";
  return "<tr>" +
           td(dato.nombre) + 
           td("<input " + dato.input + " " + 
              "id='" + dato.id + "' " +
              "oninput='" + onInputFunction + "(this);' " + 
              "/> ") + 
         "</tr>";
}

function inicializarEntrada() {
  entradaInnerHTML = ""
  entradaInnerHTML += "<table>";
  for (i = 0; i < datosInput.length; i++) {
    entradaInnerHTML += generarInput(datosInput[i]);
  }
  entradaInnerHTML += "</table>";
  document.getElementById("inputs").innerHTML = entradaInnerHTML; 

  document.getElementById("fechaIngreso").valueAsDate = datos["fechaIngreso"].toDate();
  document.getElementById("fechaDespido").valueAsDate = datos["fechaDespido"].toDate();
  document.getElementById("mejorSalario").value = datos["mejorSalario"];
  document.getElementById("ultimoSalario").value = datos["ultimoSalario"];
}


function generarDatos(ds) {
  var d = new Object();
  d.fechaIngreso = datos["fechaIngreso"];
  d.fechaDespido = datos["fechaDespido"];
  d.mejorSalario = datos["mejorSalario"];
  d.ultimoSalario = datos["ultimoSalario"];
  return d;
}

function onInputFunction(input) {
  // console.log(datos);
  switch (input.id) {
    case "fechaIngreso":
    case "fechaDespido":
      datos[input.id] = moment(input.value + " GMT-0300");
      break;
    case "mejorSalario":
    case "ultimoSalario":
      datos[input.id] = parseFloat(input.value);
      break;
  }
  // console.log(datos);
  actualizarSalida();
}

function round2Dec(num) {return Math.round(num * 100) / 100;}

function inicializarSalida() {
  d = generarDatos(datos);
  tabla = "<table>";
  tabla +=  "<tr>" + td("Rubro") + td("Monto") + "</tr>";
  for (var key in rubros ) {
    tabla +=  "<tr id='" + key + "'>" +
                td(rubros[key].nombre) + 
                td(rubros[key].montoFunc(d), key + "monto") + 
              "</tr>";
  }
  tabla += "</table>";
  document.getElementById("tablaFinal").innerHTML = tabla;
}

function actualizarSalida() {
  d = generarDatos(datos);
  for (var key in rubros ) {
    document.getElementById(key + "monto").innerHTML = round2Dec(rubros[key].montoFunc(d));
    console.log({nombre: key, monto: rubros[key].montoFunc(d)});
  }
}
