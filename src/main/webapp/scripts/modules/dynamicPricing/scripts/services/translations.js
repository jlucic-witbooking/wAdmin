'use strict';

/**
 * @ngdoc service
 * @name bprApp.translations
 * @description
 * # translations
 * Constant in the bprApp.
 */
angular.module('bprApp')
  .constant('TRANSLATIONS',
  {
    'es': {
      'trans.modal.deleteRule.title' : 'Eliminar Regla',
      'trans.modal.deleteRule.message' : '¿Desea eliminar esta regla?',
      'trans.ok' : 'Aceptar',
      'trans.cancel' : 'Cancelar',
      'trans.header.name.label' : 'Nombre',
      'trans.header.priceVariation.label' : 'Variación',
      'trans.header.actions.label' : 'Acciones',
      'trans.field.name.label' : 'Nombre',
      'trans.field.name.placeholder' : 'Nombre de la regla',
      'trans.field.priority.label' : 'Prioridad',
      'trans.field.priority.placeholder' : 'Seleccionar',
      'trans.field.variation.label' : 'Variación',
      'trans.contract' : 'Filtro por fecha de contratación (fecha reserva)',
      'trans.dates' : 'Rango de fechas (opcional)',
      'trans.field.contractEntryDate.label' : 'Fecha inicio contratación',
      'trans.field.contractExitDate.label' : 'Fecha fin contratación',
      'trans.hours' : 'Rango de horas (opcional)',
      'trans.days' : 'Dias de la semana (opcional)',
      'trans.MONDAY' : 'Lunes',
      'trans.TUESDAY' : 'Martes',
      'trans.WEDNESDAY' : 'Miércoles',
      'trans.THURSDAY' : 'Jueves',
      'trans.FRIDAY' : 'Viernes',
      'trans.SATURDAY' : 'Sábado',
      'trans.SUNDAY' : 'Domingo',
      'trans.country.description':'Filtrar por procedencia de la visita (opcional)',
      'trans.inventories.description':'Opciones de alojamiento incluidas:',
      'trans.stay' : 'Filtro por fecha de estancia (validez)',
      'trans.field.stayEntryDate.label' : 'Fecha inicio reserva',
      'trans.field.stayExitDate.label' : 'Fecha fin reserva',
      'trans.protection' : 'Protección',
      'trans.code' : 'Proteger con código (opcional)',
      'trans.field.code.description':'Esta regla sólo se aplicará si se valida previamente el código',
      'trans.field.code.placeholder' : 'Código',
      'trans.ctry' : 'País',
      'trans.save' : 'Guardar',
      'trans.back' : 'Volver',
      'trans.createNew' : 'Crear nuevo',
      'trans.header.edit.label': 'Editar',
      'trans.header.delete.label': 'Eliminar',
      'trans.selectAll': 'Todos',
      'trans.unselectAll': 'Ninguno',
      'trans.included': 'Incluidos',
      'trans.excluded': 'Excluidos'

    },
    'en': {
      'trans.modal.deleteRule.title' : 'Eliminar Regla',
      'trans.modal.deleteRule.message' : '¿Desea eliminar esta regla?',
      'trans.ok' : 'Aceptar',
      'trans.cancel' : 'Cancelar',
      'trans.header.name.label' : 'Nombre',
      'trans.header.priceVariation.label' : 'Variación',
      'trans.header.actions.label' : 'Acciones',
      'trans.field.name.label' : 'Nombre',
      'trans.field.name.placeholder' : 'Nombre de la regla',
      'trans.field.priority.label' : 'Prioridad',
      'trans.field.priority.placeholder' : 'Seleccionar',
      'trans.field.variation.label' : 'Variación',
      'trans.contract' : 'Según Contratación',
      'trans.dates' : 'Fechas',
      'trans.field.contractEntryDate.label' : 'Fecha inicio contratación',
      'trans.field.contractExitDate.label' : 'Fecha fin contratación',
      'trans.hours' : 'Horas',
      'trans.days' : 'Días',
      'trans.MONDAY' : 'Lunes',
      'trans.TUESDAY' : 'Martes',
      'trans.WEDNESDAY' : 'Miércoles',
      'trans.THURSDAY' : 'Jueves',
      'trans.FRIDAY' : 'Viernes',
      'trans.SATURDAY' : 'Sábado',
      'trans.SUNDAY' : 'Domingo',
      'trans.stay' : 'Según Validez',
      'trans.field.stayEntryDate.label' : 'Fecha inicio reserva',
      'trans.field.stayExitDate.label' : 'Fecha fin reserva',
      'trans.code' : 'Código',
      'trans.field.code.placeholder' : 'Código',
      'trans.field.code.description':'Esta regla sólo se aplicará si se valida previamente el código',
      'trans.ctry' : 'País',
      'trans.save' : 'Guardar',
      'trans.back' : 'Volver',
      'trans.createNew' : 'Crear nuevo',
      'trans.header.edit.label': 'Editar',
      'trans.header.delete.label': 'Eliminar'
    }
  }

);
