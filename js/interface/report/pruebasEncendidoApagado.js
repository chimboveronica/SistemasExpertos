var formEncendidoApag;
var ventanaEncendidoApag;
Ext.onReady(function () {
var porEquipo = false;
var placaReportEncendidoApag = "";
var empresaReportEncApag = 'KRADAC';
var idVehiculoEncendidoApagado = 0;
var banderaRegistroEncApag;
var idEmpresa = 1;
    if (idCompanyKarview == 1) {
        banderaRegistroEncApag = 1;
    } else {
        empresaReportEncApag = storeEmpresaPanicos.data.items[0].data.text;
        banderaRegistroEncApag = storeEmpresaPanicos.data.items[0].data.id;
    }
 var cbxVehBDEncendidoApag = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVehEncApag',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 270
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placaReportEncendidoApag = record.data.placa;
                idVehiculoEncendidoApagado = record.data.id;
            }
        }
    });

  var  cbxEmpresasBDEncendidoApag = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyEncApag',
        store: storeEmpresaPanicos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaRegistroEncApag,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaReportEncApag = cbxEmpresasBDEncendidoApag.getRawValue();
                placaReportEncendidoApag = ""
                if (porEquipo) {
                    cbxVehBDEncendidoApag.clearValue();
                    cbxVehBDEncendidoApag.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                }
            }
        }
    });
   
    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEncApag',
        name: 'fechaIniEA',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinEncApag',
        emptyText: 'Fecha Inicial...'
    });
    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEncApag',
        name: 'fechaFinEA',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniEncApag',
        emptyText: 'Fecha Final...'
    });
    var timeIniEncendidoApag = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniEncApag',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinEncendidoApag = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinEncApag',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btnToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
            timeIniEncendidoApag.setValue('00:00');
            timeFinEncendidoApag.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
            timeIniEncendidoApag.setValue('00:00');
            timeFinEncendidoApag.setValue('23:59');
        }
    });
    var panelButtons = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnToday, btnYesterday]
    });
    var id_tipo_conEncApag = 1;
    formEncendidoApag = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Organización', name: 'rbEA', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehículo', name: 'rbEA', inputValue: '2'}

                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rbEA'])) {
                                    case 1:
                                        id_tipo_conEncApag = 1;
                                        idEmpresa = 1;
                                        cbxEmpresasBDEncendidoApag.enable();
                                        cbxVehBDEncendidoApag.clearValue();
                                        cbxVehBDEncendidoApag.disable();
                                        porEquipo = false;
                                        break;
                                    case 2:
                                        id_tipo_conEncApag = 2;
                                        porEquipo = true;
                                        idEmpresa = cbxEmpresasBDEncendidoApag.getValue();
                                        if (porEquipo) {
                                            cbxVehBDEncendidoApag.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formEncendidoApag.down('[name=idCompanyEncApag]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDEncendidoApag,
                    cbxVehBDEncendidoApag

                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    timeIniEncendidoApag,
                    timeFinEncendidoApag,
                    panelButtons
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var form = formEncendidoApag.getForm();
                    if (id_tipo_conEncApag === 1) {
                        var empresaVehiculo1 = empresaReportEncApag;
                        var placa1 = placaReportEncendidoApag;
                        var fechaInicio1 = dateIni.getRawValue();
                        var fechaFin1 = dateFin.getRawValue();
                        var horaInicio1 = timeIniEncendidoApag.getRawValue();
                        var horaFin1 = timeFinEncendidoApag.getRawValue();
                        var vehiculo1;
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/encendidoApagado/getReportEncendidosCantidad.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idEmpresas: idEmpresa
                                },
                                success: function (form, action) {
                                    var storeViewEncendidoApagad = Ext.create('Ext.data.JsonStore', {
                                        autoLoad: true,
                                        proxy: {
                                            type: 'ajax',
                                            url: 'php/interface/report/encendidoApagado/getReportEncendidosDetallados.php',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        fields: ['idData', 'empresa', 'vehiculo', 'placa', 'latitud', 'longitud', 'fecha', 'hora', 'velocidad', 'bateria', 'gsm', 'gps', 'ign', 'sky_evento']
                                    });
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.countByParadas,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa', 'totalEventos']
                                    });
                                    var id_vehiculo = storeDataReporteDetallado.getAt(0).data.id_vehiculo;
                                    vehiculo1 = storeDataReporteDetallado.getAt(0).data.vehiculo;
                                    placa1 = storeDataReporteDetallado.getAt(0).data.placa;
                                    storeViewEncendidoApagad.load({
                                        params: {
                                            idVehiculo: id_vehiculo,
                                            fechainiEncApaga: fechaInicio1,
                                            fechafinEncApaga: fechaFin1,
                                            horainiEncApaga: horaInicio1,
                                            horafinEncApaga: horaFin1
                                        }
                                    });
                                    var gridDataMantenimientoparadas = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '48%',
                                        title: '<center>Reporte de Encendido y Apagado : ' + '<br>Desde: ' + fechaInicio1 + ' | Hasta: ' + fechaFin1 + '</center>',
                                        store: storeDataReporteDetallado,
                                        plugins: 'gridfilters',
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Organización', width: 150, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
                                            {text: 'Vehículo', width: 100, dataIndex: 'vehiculo', align: 'center', filter: {type: 'string'}},
                                            {text: 'Equipo', width: 100, dataIndex: 'equipo', align: 'center', filter: {type: 'string'}},
                                            {text: 'Placa', width: 100, dataIndex: 'placa', align: 'center', filter: {type: 'string'}},
                                            {text: 'Cantidad Eventos', width: 150, dataIndex: 'totalEventos', align: 'center', filter: {type: 'numeric'}}
                                        ],
                                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function () {
                                                    exportExcelEventos(gridDataMantenimientoparadas, "Reporte de Encendido Apagado ", "nameSheet", "Reporte de Encendido Apagado de " + empresaVehiculo1 + " Desde " + fechaInicio1 + " " + horaInicio1 + "|" + fechaFin1 + " " + horaFin1);
                                                }
                                            }]
                                        , listeners: {
                                            itemclick: function (thisObj, record, item, index, e, eOpts) {
                                               var id_vehiculo_EncApag = record.get('id_vehiculo');
                                                vehiculo1 = record.get('vehiculo');
                                                placa1 = record.get('placa');
                                                storeViewEncendidoApagad.load({
                                                    params: {
                                                        idVehiculo: id_vehiculo_EncApag,
                                                        fechainiEncApaga: fechaInicio1,
                                                        fechafinEncApaga: fechaFin1,
                                                        horainiEncApaga: horaInicio1,
                                                        horafinEncApaga: horaFin1
                                                    }
                                                });
                                                gridViewDataEncendidoApag.setTitle('<center>Lista de Vehículos que Reportan Evento de Parada : <br>Empresa: ' + empresaVehiculo1 + ' Desde: ' + fechaInicio1 + ' Hasta:' + fechaFin1 + '</center>');
                                            }
                                        }
                                    });
                                    var gridViewDataEncendidoApag = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '52%',
                                        title: '<center>Reporte de Encendido Apagado: ',
                                        store: storeViewEncendidoApagad,
                                        plugins: 'gridfilters',
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Fecha', width: 200, dataIndex: 'fecha', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                            {text: 'Hora', width: 200, dataIndex: 'hora', align: 'center', filter: {type: 'string'}},
                                            {text: 'Velocidad', width: 200, dataIndex: 'velocidad', align: 'center', cls: 'listview-filesize', renderer: formatSpeed, filterable: true, filter: {type: 'numeric'}},
                                            {text: 'Batería', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Bat. del Equipo'], [0, 'Bat. del Vehiculo']]
                                                }},
                                            {text: 'GSM', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Con covertura'], [0, 'Sin covertura']]
                                                }},
                                            {text: 'GPS', width: 105, dataIndex: 'gps', align: 'center', renderer: estadoGps, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Con GPS'], [0, 'Sin GPS']]
                                                }},
                                            {text: 'Vehículo(IGN)', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Encendido'], [0, 'Apagado']]
                                                }},
                                            {text: 'Evento', width: 300, dataIndex: 'sky_evento', align: 'center'},
                                            {text: 'Latitud', width: 200, dataIndex: 'latitud', align: 'center'},
                                            {text: 'Longitud', width: 200, dataIndex: 'longitud', align: 'center'}
                                        ],
                                        listeners: {
                                            itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                                                e.stopEvent();
                                                Ext.create('Ext.menu.Menu', {
                                                    items: [
                                                        Ext.create('Ext.Action', {
                                                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                            text: 'Ver Ubicación en el Mapa',
                                                            disabled: false,
                                                            handler: function (widget, event) {
                                                                clearLienzoPointTravel();
                                                                clearLienzoTravel();
                                                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                                drawPointsParadas(record.data);
                                                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            }
                                        },
                                        tbar: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function () {
                                                    exportExcelEventos(gridViewDataEncendidoApag, "Reporte de Encendido Apagado ", "nameSheet", "Reporte de Encendido Apagado de " + empresaVehiculo1 + "-" + placa1 + " Desde " + fechaInicio1 + " " + horaInicio1 + "|" + fechaFin1 + " " + horaFin1);
                                                }
                                            }
                                        ]
                                    });
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Reporte de Encendido Apagado ' + empresaVehiculo1  + '</div>',
                                        closable: true,
                                        iconCls: 'icon-unlock',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimientoparadas, gridViewDataEncendidoApag]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    ventanaEncendidoApag.hide();
                                },
                                failure: function (form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Información',
                                        msg: 'No se encuentran datos!!!',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                            });
                        }

                    } else if (id_tipo_conEncApag === 2) {
                        var empresaVehiculo2 = empresaReportEncApag;
                        var placa2 = placaReportEncendidoApag;
                        var fechaInicio2 = dateIni.getRawValue();
                        var fechaFin2 = dateFin.getRawValue();
                        var horaInicio2 = timeIniEncendidoApag.getRawValue();
                        var horaFin2 = timeFinEncendidoApag.getRawValue();
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/encendidoApagado/getReportEncendidosDetallados.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idVehiculo: idVehiculoEncendidoApagado,
                                    fechainiEncApaga: fechaInicio2,
                                    fechafinEncApaga: fechaFin2,
                                    horainiEncApaga: horaInicio2,
                                    horafinEncApaga: horaFin2
                                },
                                success: function (form, action) {
                                    var storeViewEncApaga = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa']
                                    });
                                    var gridViewEncApaga = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '52%',
                                        title: '<center>Reporte de Encendido Apagado: ' + placa2 + '<br>Desde: ' + fechaInicio2 + ' ' + horaInicio2 + ' | Hasta: ' + fechaFin2 + ' ' + horaFin2 + '</center>',
                                        store: storeViewEncApaga,
                                        plugins: 'gridfilters',
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Fecha', width: 200, dataIndex: 'fecha', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                            {text: 'Hora', width: 200, dataIndex: 'hora', align: 'center', filter: {type: 'string'}},
                                            {text: 'Velocidad', width: 200, dataIndex: 'velocidad', align: 'center', cls: 'listview-filesize', renderer: formatSpeed, filterable: true, filter: {type: 'numeric'}},
                                            {text: 'Batería', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Bat. del Equipo'], [0, 'Bat. del Vehiculo']]
                                                }},
                                            {text: 'GSM', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Con covertura'], [0, 'Sin covertura']]
                                                }},
                                            {text: 'GPS', width: 105, dataIndex: 'gps', align: 'center', renderer: estadoGps, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Con GPS'], [0, 'Sin GPS']]
                                                }},
                                            {text: 'Vehículo(IGN)', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {
                                                    type: 'list',
                                                    options: [[1, 'Encendido'], [0, 'Apagado']]
                                                }},
                                            {text: 'Evento', width: 300, dataIndex: 'sky_evento', align: 'center'},
                                            {text: 'Latitud', width: 200, dataIndex: 'latitud', align: 'center'},
                                            {text: 'Longitud', width: 200, dataIndex: 'longitud', align: 'center'}
                                        ],
                                        listeners: {
                                            itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                                                e.stopEvent();
                                                Ext.create('Ext.menu.Menu', {
                                                    items: [
                                                        Ext.create('Ext.Action', {
                                                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                            text: 'Ver Ubicación en el Mapa',
                                                            disabled: false,
                                                            handler: function (widget, event) {
                                                                clearLienzoPointTravel();
                                                                clearLienzoTravel();
                                                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                                drawPointsParadas(record.data);
                                                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            }
                                        },
                                        tbar: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function () {
                                                    exportExcelEventos(gridViewEncApaga, "Reporte de Encendido Apagado ", "nameSheet", "Reporte de Encendido Apagado de " + empresaVehiculo2 + "-" + placa2 + " Desde " + fechaInicio2 + " " + horaInicio2 + "|" + fechaFin2 + " " + horaFin2);
                                                }
                                            }]
                                    });
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Reporte de Encendido Apagado ' + empresaVehiculo2 + ":" + placa2 + '</div>',
                                        closable: true,
                                        iconCls: 'icon-unlock',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridViewEncApaga]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    ventanaEncendidoApag.hide();
                                },
                                failure: function (form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Información',
                                        msg: 'No se encuentran datos!!!',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                            });
                        }
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    ventanaEncendidoApag.hide();
                }
            }]
    });
});
function showWinencendidoapagado() {
    if (!ventanaEncendidoApag) {
        ventanaEncendidoApag = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: ' Reporte de Encendido y Apagado',
            iconCls: 'icon-encendido',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formEncendidoApag
        });
    }
    ventanaEncendidoApag.show();
    formEncendidoApag.getForm().reset();
}
