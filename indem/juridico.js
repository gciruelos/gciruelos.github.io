/***************************************
 * COSAS JURIDICAS                     *
 ***************************************/

function antiguedad(datos) {
  var fechaIngreso = datos.fechaIngreso;
  var fechaDespido = datos.fechaDespido;
  var fechaPostPreaviso = moment(fechaIngreso).add(3, 'months');
  if (fechaDespido.isBefore(fechaPostPreaviso)) { // lo despidieron antes de los 3 meses
    return 0;
  } else {
    var diff = fechaPostPreaviso.preciseDiff(fechaDespido, true);
    return diff.years + 1;
  }
}

function ratioTrabajados(datos) {
  var fecha = datos.fechaDespido;
  return fecha.date()/parseFloat(fecha.daysInMonth());
}

function art245Monto(datos) {
  return datos.mejorSalario * datos.antiguedad;
}

function preavisoMonto(datos) {
  var preaviso = (datos.ultimoSalario * 13.0) / 12.0;
  if (datos.antiguedad < 5) {
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

  
