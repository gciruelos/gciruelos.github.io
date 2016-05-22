var rubros = {
  'art245' : {nombre: 'Art. 245', montoFunc : art245Monto},
  'preaviso' : {nombre: 'Preaviso', montoFunc : preavisoMonto},
  'integracion' : {nombre: 'Integración', montoFunc : integracionMonto},
  'diasdelmes' : {nombre: 'Dias Del Mes', montoFunc : diasdelmesMonto},
  'art2ley25323' : {nombre: 'Art. 2 Ley 25323', montoFunc : art2ley25323Monto},
};

var datosInput = [
  {
    id:"fechaIngreso", nombre:"Fecha de ingreso",
    input:"type='date'"
  },
  {
    id:"fechaDespido", nombre:"Fecha de despido",
    input:"type='date'"
  },
  {
    id:"mejorSalario", nombre:"Mejor Salario",
    input:"type='number' min='0.01' step='0.01'"
  },
  {
    id:"ultimoSalario", nombre:"Ultimo Salario",
    input:"type='number' min='0.01' step='0.01'"
  },
];

var datos = {
  'fechaIngreso' : moment(),
  'fechaDespido' : moment().add(1, 'day'),
  'mejorSalario' : 0.0,
  'ultimoSalario' : 0.0,
};

function td(s, attrs) {
  var td = '<td ';
  for (var key in attrs) {
    td += key + '="' + attrs[key] + '" ';
  }
  td += ' >' + s + '</td>';
  return td
}

function parseInputById(value, id) {
}


function generarInput(dato) {
  var onInputFunction = 'onInputFunction';
  return '<tr>' +
           td(dato.nombre) + 
           td('<div class="form-group"><input ' + dato.input + ' ' + 
              'id="' + dato.id + '" ' +
              'oninput="' + onInputFunction + '(this);" ' + 
              'class="form-control" ' + 
              '/></div>') + 
         '</tr>';
}

function inicializarEntrada() {
  entradaInnerHTML = ''
  entradaInnerHTML += '<table class="table table-striped table-bordered">';
  for (i = 0; i < datosInput.length; i++) {
    entradaInnerHTML += generarInput(datosInput[i]);
  }
  entradaInnerHTML += '</table>';
  document.getElementById('inputs').innerHTML = entradaInnerHTML; 

  document.getElementById('fechaIngreso').valueAsDate = datos['fechaIngreso'].toDate();
  document.getElementById('fechaDespido').valueAsDate = datos['fechaDespido'].toDate();
  document.getElementById('mejorSalario').value = datos['mejorSalario'];
  document.getElementById('ultimoSalario').value = datos['ultimoSalario'];
}


function generarDatos(ds) {
  var d = new Object();
  d.fechaIngreso = datos['fechaIngreso'];
  d.fechaDespido = datos['fechaDespido'];
  d.mejorSalario = datos['mejorSalario'];
  d.ultimoSalario = datos['ultimoSalario'];
  d.antiguedad = parseInt(antiguedad(d));
  return d;
}

function onInputFunction(input) {
  switch (input.id) {
    case 'fechaIngreso':
    case 'fechaDespido':
      datos[input.id] = moment(input.value + ' GMT-0300');
      break;
    case 'mejorSalario':
    case 'ultimoSalario':
      datos[input.id] = parseFloat(input.value);
      break;
  }
  actualizarSalida();
  actualizarErrores();
}

function round2Dec(num) {return Math.round(num * 100) / 100;}
function strong(s) {return '<strong>' + s + '</strong>';}

function inicializarSalida() {
  d = generarDatos(datos);
  tabla = '<table class="table table-bordered">';
  tabla +=  '<tr>' + td(strong('Rubro')) + td(strong('Monto')) + '</tr>';
  var total = 0.0;
  for (var key in rubros ) {
    var montoRubro = rubros[key].montoFunc(d);
    total += montoRubro;
    tabla += '<tr id="' + key + '">' +
               td(rubros[key].nombre) + 
               td(round2Dec(montoRubro), {'id' : key + 'monto'}) + 
             '</tr>';
  }
  tabla +=  '<tr id="total">' + td('Total') + td(round2Dec(total), {'id' : 'totalmonto'}) + '</tr>';
  tabla += '</table>';
  document.getElementById('tablaFinal').innerHTML = tabla;
  document.getElementById('tablaFinal').style.display = 'block';
  document.getElementById('error').style.display = 'none';
}

function actualizarSalida() {
  d = generarDatos(datos);
  var total = 0.0;
  for (var key in rubros ) {
    var montoRubro = rubros[key].montoFunc(d);
    total += montoRubro;
    document.getElementById(key + 'monto').innerHTML = round2Dec(montoRubro);
  }
  document.getElementById('totalmonto').innerHTML = round2Dec(total); 
}


var ERRORES = {
  'errorFecha' : {
    check : (d) => {return d.fechaDespido.isBefore(d.fechaIngreso);},
    error : 'La fecha de despido es anterior o igual a la fecha de ingreso.'
  }, 
  'errorSalario' : {
    check : (d) => {return d.mejorSalario < d.ultimoSalario;},
    error : 'La mejor salario es más bajo que el último salario.'
  }, 
}
console.log(ERRORES);

function actualizarErrores() {
  d = generarDatos(datos);
  var error = false;
  for (var key in ERRORES) {
    var elem = document.getElementById(key);
    if (ERRORES[key].check(d)) {
      error = true;
      elem.innerHTML = ERRORES[key].error;
    } else {
      elem.innerHTML = '';
    }
  }
  if (error) {
    document.getElementById('tablaFinal').style.display = 'none';
    document.getElementById('error').style.display = 'block';
  } else {
    document.getElementById('tablaFinal').style.display = 'block';
    document.getElementById('error').style.display = 'none';
  }
}
