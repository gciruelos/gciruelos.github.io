
var datos = {
  'valorUMA' : 0.0,
  'montoSentencia' : 0.0,
  'montoReclamo' : 0.0,
  'montoConciliado' : 0.0,

  'totalUMA' : 0.0,
  'rangoPorcentajes' : {desde : 0, hasta : 0, maxAnterior : 0}
};

var ERRORES = {
  'errorFecha' : {
    check : function(d) {return d.fechaDespido.isBefore(d.fechaIngreso);},
    error : 'La fecha de despido es anterior o igual a la fecha de ingreso.'
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
    case 'valorUMA':
    case 'montoSentencia':
    case 'montoReclamo':
    case 'montoConciliado':
      datos[input.id] = parseFloat(input.value);
      break;
  }
  actualizarSalida();
  actualizarErrores();
}

function inicializarSalida() {
}

function actualizarSalida() {
  datos['totalUMA'] = (datos['montoSentencia']+datos['montoReclamo']*0.7+datos['montoConciliado']) / datos['valorUMA'];
  totalUMA = datos['totalUMA'];
  document.getElementById('totalUMA').value = totalUMA;
  if (totalUMA <= 15.0) {
    datos['rangoPorcentaje'] = {from : 22, to : 33, maxAnterior : 0};
  } else if (totalUMA <= 45) {
    datos['rangoPorcentaje'] = {from : 20, to : 26, maxAnterior : 33};
  } else if (totalUMA <= 90) {
    datos['rangoPorcentaje'] = {from : 18, to : 24, maxAnterior : 26};
  } else if (totalUMA <= 150) {
    datos['rangoPorcentaje'] = {from : 17, to : 22, maxAnterior : 24};
  } else if (totalUMA <= 450) {
    datos['rangoPorcentaje'] = {from : 15, to : 20, maxAnterior : 22};
  } else if (totalUMA <= 750) {
    datos['rangoPorcentaje'] = {from : 13, to : 17, maxAnterior : 20};
  } else {
    datos['rangoPorcentaje'] = {from : 12, to : 15, maxAnterior : 17};
  }

  document.getElementById('rangoPctDesde').value = datos['rangoPorcentaje'].from;
  document.getElementById('rangoPctHasta').value = datos['rangoPorcentaje'].to;


  document.getElementById('datosDebug').innerHTML = pre(JSON.stringify(datos, undefined, 2));
}

function inicializarErrores() {
}

function actualizarErrores() {
}

window.onload = function() {
  inicializarSalida();
  inicializarErrores();

  datos['valorUMA'] = parseFloat(document.getElementById('valorUMA').value);
  datos['montoSentencia'] = parseFloat(document.getElementById('montoSentencia').value);
  datos['montoReclamo'] = parseFloat(document.getElementById('montoReclamo').value);
  datos['montoConciliado'] = parseFloat(document.getElementById('montoConciliado').value);

  document.getElementById('datosDebug').innerHTML = pre(JSON.stringify(datos, undefined, 2));
}
