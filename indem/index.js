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
  'fechaDespido' : moment(),
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
           td('<input ' + dato.input + ' ' + 
              'id="' + dato.id + '" ' +
              'oninput="' + onInputFunction + '(this);" ' + 
              '/> ') + 
         '</tr>';
}

function inicializarEntrada() {
  entradaInnerHTML = ''
  entradaInnerHTML += '<table>';
  for (i = 0; i < datosInput.length; i++) {
    entradaInnerHTML += generarInput(datosInput[i]);
  }
  entradaInnerHTML += '</table>';
  document.getElementById('inputs').innerHTML = entradaInnerHTML; 
  if ( $('input[type="date"]').prop('type') != 'date' ) {
        $('input[type="date"]').datepicker();
  }

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
  return d;
}

function onInputFunction(input) {
  // console.log(datos);
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
  // console.log(datos);
  actualizarSalida();
}

function round2Dec(num) {return Math.round(num * 100) / 100;}

function inicializarSalida() {
  d = generarDatos(datos);
  tabla = '<table>';
  tabla +=  '<tr>' + td('Rubro') + td('Monto') + '</tr>';
  for (var key in rubros ) {
    tabla +=  '<tr id="' + key + '">' +
                td(rubros[key].nombre) + 
                td(rubros[key].montoFunc(d), key + 'monto') + 
              '</tr>';
  }
  tabla += '</table>';
  document.getElementById('tablaFinal').innerHTML = tabla;
}

function actualizarSalida() {
  d = generarDatos(datos);
  for (var key in rubros ) {
    document.getElementById(key + 'monto').innerHTML = round2Dec(rubros[key].montoFunc(d));
    console.log({nombre: key, monto: rubros[key].montoFunc(d)});
  }
}







/***************************************
 * COSAS JURIDICAS                     *
 ***************************************/

function antiguedad(datos) {
  var fechaIngreso = datos.fechaIngreso;
  var fechaDespido = datos.fechaDespido;
  var fechaPostPreaviso = moment(fechaIngreso);
  fechaPostPreaviso.add(3, 'months').add(1, 'day');
  if (fechaDespido.isBefore(fechaPostPreaviso)) { // lo despidieron antes de los 3 meses
    return 0;
  } else {
    var diff = moment().preciseDiff(fechaPostPreaviso, fechaDespido);
    return diff.years + 1;
  }
}

function ratioTrabajados(datos) {
  var fecha = datos.fechaDespido;
  return fecha.date()/parseFloat(fecha.daysInMonth());
}

function art245Monto(datos) {
  console.log(datos);
  return datos.mejorSalario * antiguedad(datos);
}

function preavisoMonto(datos) {
  var preaviso = (datos.ultimoSalario * 13.0) / 12.0;
  if (antiguedad(datos) < 5) {
    return preaviso;
  } else {
    return preaviso * 2.0;
  }
}

function integracionMonto(datos) {
  return datos.ultimoSalario * parseFloat(ratioTrabajados(datos));
}

function diasdelmesMonto(datos) {
  return datos.ultimoSalario * (1.0 - ratioTrabajados(datos));
}

function art2ley25323Monto(datos) {
  return (art245Monto(datos) + preavisoMonto(datos) + integracionMonto(datos)) * 0.5;
}

  
