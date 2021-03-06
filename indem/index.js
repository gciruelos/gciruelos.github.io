var rubros = {
  'art245' : {nombre: 'Art. 245', montoFunc : art245Monto},
  'preaviso' : {nombre: 'Preaviso', montoFunc : preavisoMonto},
  'integracion' : {nombre: 'Integración', montoFunc : integracionMonto},
  'diasdelmes' : {nombre: 'Días Del Mes', montoFunc : diasdelmesMonto},
  'art2ley25323' : {nombre: 'Art. 2 Ley 25323', montoFunc : art2ley25323Monto},
};

var datosInput = [
  {
    id:'fechaIngreso', nombre:'Fecha de ingreso',
    input:'type="text" placeholder="dd/mm/aaaa"'
  },
  {
    id:"fechaDespido", nombre:"Fecha de despido",
    input:'type="text"  placeholder="dd/mm/aaaa"'
  },
  {
    id:'mejorSalario', nombre:'Mejor Salario',
    input:'type="number" min="0.01" step="0.01"'
  },
  {
    id:'ultimoSalario', nombre:'Último Salario',
    input:'type="number" min="0.01" step="0.01"'
  },
];

var datos = {
  'fechaIngreso' : moment().hour(12),
  'fechaDespido' : moment().add(1, 'day').hour(12),
  'mejorSalario' : 0.0,
  'ultimoSalario' : 0.0,
};

var ERRORES = {
  'errorFecha' : {
    check : function(d) {return d.fechaDespido.isBefore(d.fechaIngreso);},
    error : 'La fecha de despido es anterior o igual a la fecha de ingreso.'
  }, 
  'errorFechaIngreso' : {
    check : function(d) {return !d.fechaIngreso.isValid();},
    error : 'La fecha de ingreso no es válida.'
  }, 
  'errorFechaDespido' : {
    check : function(d) {return !d.fechaDespido.isValid();},
    error : 'La fecha de despido no es válida.'
  }, 
  'errorSalario' : {
    check : function(d) {return d.mejorSalario < d.ultimoSalario;},
    error : 'El mejor salario es más bajo que el último salario.'
  }, 
  'errorMejorSalarioIncorrecto' : {
    check : function(d) {return isNaN(d.mejorSalario);},
    error : 'Ingrese el mejor salario.'
  }, 
  'errorUltimoSalarioIncorrecto' : {
    check : function(d) {return isNaN(d.ultimoSalario);},
    error : 'Ingrese el último salario.'
  }, 
}

function td(s, attrs) {
  var td = '<td ';
  for (var key in attrs) {
    td += key + '="' + attrs[key] + '" ';
  }
  td += ' >' + s + '</td>';
  return td
}
function tr(id, tds) {
  var tr = '<tr';
  if (id) {
    tr += ' id="' + id + '" >'
  } else {
    tr += '>'
  }
  for (var i = 0; i < tds.length; i++) {
    tr += tds[i];
  }
  tr += '</tr>';
  return tr;
}

function round2Dec(num) {return Math.round(num * 100) / 100;}
function strong(s) {return '<strong>' + s + '</strong>';}
function pre(s) {return '<pre>' + s + '</pre>';}
function th(s) {return '<th>' + s + '</th>';}

function generarInput(dato) {
  var onInputFunction = 'onInputFunction';
  return tr('', 
      [
        td(dato.nombre),
        td('<div class="form-group"><input ' + dato.input + ' ' + 
          'id="' + dato.id + '" ' +
          'oninput="' + onInputFunction + '(this);" ' + 
          'class="form-control" ' + 
          '/></div>')
      ]);
}

function inicializarEntrada() {
  entradaInnerHTML = ''
  entradaInnerHTML += '<table class="table table-striped table-bordered">';
  for (i = 0; i < datosInput.length; i++) {
    entradaInnerHTML += generarInput(datosInput[i]);
  }
  entradaInnerHTML += '</table>';
  document.getElementById('inputs').innerHTML = entradaInnerHTML; 
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
      datos[input.id] = moment(input.value, 'DD/MM/YYYY').hour(12);
      break;
    case 'mejorSalario':
    case 'ultimoSalario':
      datos[input.id] = parseFloat(input.value);
      break;
  }
  actualizarSalida();
  actualizarErrores();
}

function inicializarSalida() {
  d = generarDatos(datos);
  tabla = '<table class="table table-bordered">';
  tabla += '<tbody>';
  tabla +=  tr('', [th('Rubro'), th('Monto')]);
  var total = 0.0;
  for (var key in rubros ) {
    var montoRubro = rubros[key].montoFunc(d);
    total += montoRubro;
    tabla += tr(key,
        [
          td(rubros[key].nombre),
          td(round2Dec(montoRubro), {'id' : key + 'Monto'})
        ]);
  }
  tabla += tr('total',
      [
        td('Total'),
        td(round2Dec(total), {'id' : 'totalMonto'})
      ]);
  tabla += '</tbody>';
  tabla += '</table>';
}

function actualizarSalida() {
  d = generarDatos(datos);
  var total = 0.0;
  for (var key in rubros ) {
    var montoRubro = rubros[key].montoFunc(d);
    total += montoRubro;
    document.getElementById(key + 'Monto').innerHTML = round2Dec(montoRubro);
  }
  document.getElementById('totalMonto').innerHTML = round2Dec(total); 
  document.getElementById('datosDebug').innerHTML = pre(JSON.stringify(d, undefined, 2)); 
}

function inicializarErrores() {
  var erroresDiv = '';
  for (var key in ERRORES) {
    erroresDiv += '<div id="' +
                  key +
                  '" class="alert alert-danger"></div>';
  }
  document.getElementById('errorMsg').innerHTML = erroresDiv;
  for (var key in ERRORES) {
    document.getElementById(key).innerHTML = strong('Error! ') + ERRORES[key].error;
  }
}

function actualizarErrores() {
  d = generarDatos(datos);
  console.log(d);
  var error = false;
  for (var key in ERRORES) {
    var elem = document.getElementById(key);
    if (ERRORES[key].check(d)) {
      error = true;
      elem.style.display = 'block';
    } else {
      elem.style.display = 'none';
    }
  }
  if (error) {
    document.getElementById('tablaFinal').style.display = 'none';
    document.getElementById('errorMsg').style.display = 'block';
  } else {
    document.getElementById('tablaFinal').style.display = 'block';
    document.getElementById('errorMsg').style.display = 'none';
  }
}

window.onload = function() {
  inicializarEntrada();
  inicializarSalida();
  inicializarErrores();

  document.getElementById('fechaIngreso').value = datos['fechaIngreso'].format('DD/MM/YYYY');
  document.getElementById('fechaDespido').value = datos['fechaDespido'].format('DD/MM/YYYY');
  document.getElementById('mejorSalario').value = datos['mejorSalario'];
  document.getElementById('ultimoSalario').value = datos['ultimoSalario'];

  document.getElementById('tablaFinal').innerHTML = tabla;
  document.getElementById('tablaFinal').style.display = 'block';
  document.getElementById('errorMsg').style.display = 'none';
  document.getElementById('datosDebug').innerHTML = pre(JSON.stringify(d, undefined, 2)); 
}
