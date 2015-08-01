var formularioParadas;
var Ventanaparadas;
Ext.onReady(function () {
    var porEquipoParadas;
    var idVehiculoParadas = 0;
    var empresaParadas='KRADAC';
    var idEmpresa = 1;
    var placaReporteParadas = "";
    var banderaReporParadas;
    if (idCompanyKarview == 1) {
        banderaReporParadas = 1;
    } else {
        empresaParadas = storeEmpresas.data.items[0].data.text;
        banderaReporParadas = storeEmpresas.data.items[0].data.id;
    }

    var cbxEmpresasParada = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización:',
        name: 'idempresaparada',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaReporParadas,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaParadas = cbxEmpresasParada.getRawValue();
                placaReporteParadas = " ";
                if (porEquipoParadas) {
                    cbxVehBDParadas.clearValue();
                    cbxVehBDParadas.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                }
            }
        }
    });
    var cbxVehBDParadas = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 450
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placaReporteParadas = record.data.placa;
                idVehiculoParadas = record.data.id;
            }
        }
    });
    var dateIniparadas = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        value: new Date(),
        maxValue: new Date(),
        id: 'fechaIniPradas',
        name: 'fechaIniParadas',
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinParadas',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinParadas = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinParadas',
        name: 'fechaFinParadas',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniParadas',
        emptyText: 'Fecha Final...'
    });
    var btnTodayparadas = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniparadas.setValue(nowDate);
            dateFinParadas.setValue(nowDate);
        }
    });
    var timeInipanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniParadas',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinpanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinParadas',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 270
        }
    });
    var btnYesterdayparadas = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniparadas.setValue(yestDate);
            dateFinParadas.setValue(yestDate);
        }
    });
    var panelButtonsparadas = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnTodayparadas, btnYesterdayparadas]
    });
    var id_tipo_consulta = 1;
    formularioParadas = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Por Organización', name: 'rb5', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehículo', name: 'rb5', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb5'])) {
                                    case 1:
                                        id_tipo_consulta = 1;
                                        idEmpresa = 1;
                                        cbxEmpresasParada.enable();
                                        cbxVehBDParadas.clearValue();
                                        cbxVehBDParadas.disable();
                                        porEquipoParadas = false;
                                        break;
                                    case 2:
                                        id_tipo_consulta = 2;
                                        porEquipoParadas = true;
                                        idEmpresa = cbxEmpresasParada.getValue();
                                        if (porEquipoParadas) {
                                            cbxVehBDParadas.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioParadas.down('[name=idempresaparada]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasParada,
                    cbxVehBDParadas
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniparadas,
                    dateFinParadas,
                    timeInipanico,
                    timeFinpanico,
                    panelButtonsparadas
                ]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var form = formularioParadas.getForm();
                    if (id_tipo_consulta === 1) {
                        var empresa1 = empresaParadas;
                        var placa1 = placaReporteParadas;
                        var dateStart1 = dateIniparadas.getRawValue();
                        var dateFinish1 = dateFinParadas.getRawValue();
                        var timeInicio1 = timeInipanico.getRawValue();
                        var timeFin1 = timeFinpanico.getRawValue();
                        var vehiculo1;
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/paradas/getReportParadasCantidad.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idEmpresas: idEmpresa
                                },
                                success: function (form, action) {

                                    var storeViewParadas = Ext.create('Ext.data.JsonStore', {
                                        autoLoad: true,
                                        proxy: {
                                            type: 'ajax',
                                            url: 'php/interface/report/paradas/getReportParadasDetallados.php',
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
//       
                                    var id_vehiculo = storeDataReporteDetallado.getAt(0).data.id_vehiculo;
                                    vehiculo1 = storeDataReporteDetallado.getAt(0).data.vehiculo;
                                    placa1 = storeDataReporteDetallado.getAt(0).data.placa;
                                    storeViewParadas.load({
                                        params: {
                                            idVehiculo: id_vehiculo,
                                            fechainiParadas: dateStart1,
                                            fechafinParadas: dateFinish1,
                                            horainiParadas: timeInicio1,
                                            horafinParadas: timeFin1
                                        }
                                    });
                                    var gridDataParadas = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '48%',
                                        title: '<center>Reporte de Paradas de los Equipos: ' + '<br>Desde: ' + dateStart1 + ' | Hasta: ' + dateFinish1 + '</center>',
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
                                                    exportExcelEventos(gridDataParadas, "Reporte de Paradas ", "nameSheet", "Reporte de la empresa " + empresa1 + " " + " Desde: " + dateStart1 + " " + timeInicio1 + " | " + dateFinish1 + " " + timeFin1);
                                                }
                                            }]
                                        , listeners: {
                                            itemclick: function (thisObj, record, item, index, e, eOpts) {
                                                var id_vehiculo_paradas = record.get('id_vehiculo');
                                                vehiculo1 = record.get('vehiculo');
                                                placa1 = record.get('placa');
                                                storeViewParadas.load({
                                                    params: {
                                                        idVehiculo: id_vehiculo_paradas,
                                                        fechainiParadas: dateStart1,
                                                        fechafinParadas: dateFinish1,
                                                        horainiParadas: timeInicio1,
                                                        horafinParadas: timeFin1

                                                    }
                                                });
                                                gridViewDataParadas.setTitle('<center>Lista de Equipos que Reportan Evento de Parada : <br>Empresa: ' + empresa1 + ' Desde: ' + dateStart1 + ' Hasta:' + dateFinish1 + '</center>');
                                            }
                                        }
                                    });
                                    var gridViewDataParadas = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '52%',
                                        title: '<center>Reporte de Paradas: ',
                                        store: storeViewParadas,
                                        plugins: 'gridfilters',
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Fecha', width: 200, dataIndex: 'fecha', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                            {text: 'Hora', width: 200, dataIndex: 'hora', align: 'center', filter: {type: 'string'}},
                                            {text: 'Velocidad', width: 200, dataIndex: 'velocidad', align: 'center', cls: 'listview-filesize', filterable: true, filter: {type: 'numeric'}},
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
                                            {text: 'Evento', width: 200, dataIndex: 'sky_evento', align: 'center'},
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
                                                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                                clearLienzoPointTravel();
                                                                clearLienzoTravel();
                                                                drawPointsParadas(record.data);
                                                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            }
                                        },
                                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function () {
                                                    exportExcelEventos(gridViewDataParadas, "Reporte de Paradas ", "nameSheet", "Reporte de Paradas de " + empresa1 + "-" + placa1 + " Desde: " + dateFinish1 + " " + timeInicio1 + "|" + dateFinish1 + " " + timeFin1);
                                                }
                                            }]
                                    });
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Reporte de Paradas'+ empresa1 + '</div>',
                                        closable: true,
                                        iconCls: 'icon-unlock',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataParadas, gridViewDataParadas]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    Ventanaparadas.hide();
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
                        } else {
                            Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                        }
                    } else if (id_tipo_consulta === 2) {
                        var empresa2 = empresaParadas;
                        var placa2 = placaReporteParadas;
                        var dateStart2 = dateIniparadas.getRawValue();
                        var dateFinish2 = dateFinParadas.getRawValue();
                        var timeInicio2 = timeInipanico.getRawValue();
                        var timeFin2 = timeFinpanico.getRawValue();
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/getReportParadasDetallados.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idVehiculo: idVehiculoParadas,
                                    fechainiParadas: dateStart2,
                                    fechafinParadas: dateFinish2,
                                    horainiParadas: timeInicio2,
                                    horafinParadas: timeFin2
                                },
                                success: function (form, action) {
                                    var storeViewParadas = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa']
                                    });
                                    var gridViewDataParadas = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '52%',
                                        title: '<center>Reporte de Paradas:' + empresa2 + "-" + placa2 + '<br>Desde: ' + dateStart2 + ' ' + timeInicio2 + ' | Hasta: ' + dateFinish2 + ' ' + timeFin2 + '</center>',
                                        store: storeViewParadas,
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
                                            {text: 'Evento', width: 200, dataIndex: 'sky_evento', align: 'center'},
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
                                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function () {
                                                    exportExcelEventos(gridViewDataParadas, "Reporte de Paradas ", "nameSheet", "Reporte de Paradas de" + empresa2 + "-" + placa2 + "-" + " Desde: " + dateStart2 + " " + timeInicio2 + " | " + dateFinish2 + " " + timeInicio2);
                                                }
                                            }]
                                    });
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Reporte de Paradas ' + empresa2 + ":" + placa2 + '</div>',
                                        closable: true,
                                        iconCls: 'icon-unlock',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridViewDataParadas]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    Ventanaparadas.hide();
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
                        } else {
                            Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                        }
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    Ventanaparadas.hide();
                }
            }]
    });
});
function showWinPradas() {
    if (!Ventanaparadas) {
        Ventanaparadas = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Paradas',
            iconCls: 'icon-unlock',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formularioParadas
        });
    }
    formularioParadas.getForm().reset();
    Ventanaparadas.show();
    empresaParadas = 'KRADAC';
}

