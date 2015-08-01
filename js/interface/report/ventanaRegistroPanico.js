var formPanico;
var ventanaRegistroPanico;
Ext.onReady(function () {
    var porEquipo = false;
    var placaReportPanico = "";
    var empresaPanico = 'KRADAC';
    var idVehiculoPanico = 0;
    var banderapanico;
    var idEmpresa = 1;
    if (idCompanyKarview == 1) {
        banderapanico = 1;
    } else {
        empresaPanico = storeEmpresaPanicos.data.items[0].data.text;
        banderapanico = storeEmpresaPanicos.data.items[0].data.id;
    }

    var cbxVehBDPanico = Ext.create('Ext.form.ComboBox', {
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
            minWidth: 270
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placaReportPanico = record.data.placa;
                idVehiculoPanico = record.data.id;
            }
        }
    });

    var cbxEmpresasBDPanico = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyPanico',
        store: storeEmpresaPanicos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderapanico,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaPanico = cbxEmpresasBDPanico.getRawValue();
                placaReportPanico = " ";
                if (porEquipo) {
                    cbxVehBDPanico.clearValue();
                    cbxVehBDPanico.enable();
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
        id: 'fechaIniPanico',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinPanico',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });

    var timeInipanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniPanico',
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
        name: 'horaFinPanico',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var id_tipo_consultaPanicos = 1;
    var btnToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
            timeInipanico.setValue('00:00');
            timeFinpanico.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
            timeInipanico.setValue('00:00');
            timeFinpanico.setValue('23:59');
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

    formPanico = Ext.create('Ext.form.Panel', {
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
                        vertical: false,
                        items: [
                            {boxLabel: 'Por Organización', name: 'rb', id: 'rb1', inputValue: '1'},
                            {boxLabel: 'Por Vehículo', name: 'rb', id: 'rb2', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        id_tipo_consultaPanicos = 1;
                                        idEmpresa = 1;
                                        cbxEmpresasBDPanico.enable();
                                        cbxVehBDPanico.clearValue();
                                        cbxVehBDPanico.disable();
                                        porEquipo = false;
                                        break;
                                    case 2:
                                        id_tipo_consultaPanicos = 2;
                                        porEquipo = true;
                                        idEmpresa = cbxEmpresasBDPanico.getValue();
                                        if (porEquipo) {
                                            cbxVehBDPanico.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formPanico.down('[name=idCompanyPanico]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDPanico,
                    cbxVehBDPanico
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    timeInipanico,
                    timeFinpanico,
                    panelButtons
                ]
            }],
        buttons: [
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var formulario = formPanico.getForm();
                    if (id_tipo_consultaPanicos === 1) {
                        var empresa1 = empresaPanico;
                        var placa1 = placaReportPanico;
                        var dateStart1 = dateIni.getRawValue();
                        var dateFinish1 = dateFin.getRawValue();
                        var timeInicio1 = timeInipanico.getRawValue();
                        var timeFin1 = timeFinpanico.getRawValue();
                        var vehiculo1;
                        if (formulario.isValid()) {
                            formulario.submit({
                                url: 'php/interface/report/panicos/getReportPanicosCantidad.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idCompany: idEmpresa
                                },
                                success: function (form, action) {
                                    var storeViewPanico = Ext.create('Ext.data.Store', {
                                        autoLoad: true,
                                        proxy: {
                                            type: 'ajax',
                                            url: 'php/interface/report/panicos/getReportPanicoDetallados.php',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        fields: ['idData', 'empresa', 'vehiculo', 'placa', 'latitud', 'longitud', 'fecha', 'hora', 'velocidad', 'bateria', 'gsm', 'gps', 'ign', 'sky_evento']
                                    });

                                    var storePanicosDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.countByParadas,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa', 'totalEventos']
                                    });
                                    var id_vehiculo = storePanicosDetallado.getAt(0).data.id_vehiculo;
                                    vehiculo1 = storePanicosDetallado.getAt(0).data.vehiculo;
                                    placa1 = storePanicosDetallado.getAt(0).data.placa;
                                    storeViewPanico.load(
                                            {
                                                params: {
                                                    idVehiculo: id_vehiculo,
                                                    fechaIni: dateIni.getRawValue(),
                                                    fechaFin: dateFin.getRawValue(),
                                                    horaIniP: timeInipanico.getRawValue(),
                                                    horaFinP: timeFinpanico.getRawValue()
                                                }
                                            });

                                    var gridDataPanicos = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Reporte de Panicos ' + '<br>Desde: ' + dateStart1 + ' | Hasta: ' + dateFinish1 + '</center>',
                                        store: storePanicosDetallado,
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
                                                    exportExcelEventos(gridDataPanicos, "Reporte de Pánicos ", "nameSheet", "Reporte de la empresa " + empresa1 + " " + " Desde: " + dateStart1 + " " + timeInicio1 + " | " + dateFinish1 + " " + timeFin1);
                                                }
                                            }],
                                        listeners: {
                                            itemclick: function (thisObj, record, item, index, e, eOpts) {
                                                var id_vehiculo_panicos = record.get('id_vehiculo');
                                                vehiculo1 = record.get('vehiculo');
                                                placa1 = record.get('placa');
                                                storeViewPanico.load(
                                                        {
                                                            params: {
                                                                idVehiculo: id_vehiculo_panicos,
                                                                fechaIni: dateStart1,
                                                                fechaFin: dateFinish1,
                                                                horaIniP: timeInicio1,
                                                                horaFinP: timeFin1
                                                            }
                                                        });
                                                gridViewDataPanico.setTitle('<center>Vista de vehículos que reportan evento de Pánicos: ' + ' <br>Empresa: ' + empresa1 + 'Desde:' + dateStart1 + ' Hasta:' + dateFinish1 + '</center>');
                                            }
                                        }
                                    });

                                    var gridViewDataPanico = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center> Reporte de Registros de Pánicos',
                                        store: storeViewPanico,
                                        plugins: 'gridfilters',
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 70, align: 'center'}),
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
                                            {text: 'Dirección', width: 200, dataIndex: 'direccion', align: 'center'}
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
                                                                drawPointsPanicos(record.data);
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
                                                    exportExcelEventos(gridViewDataPanico, "Reporte de Pánicos ", "nameSheet", "Reporte de Pánicos de " + empresa1 + "-" + placa1 + " Desde " + dateStart1 + " " + timeInicio1 + "|" + dateStart1 + " " + timeFin1);
                                                }
                                            }]
                                    });
                                    var tabExcesos = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Registros de Pánico ' + empresa1 + '</div>',
                                        closable: true,
                                        iconCls: 'icon-reset',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataPanicos, gridViewDataPanico]
                                    });
                                    panelTabMapaAdmin.add(tabExcesos);
                                    panelTabMapaAdmin.setActiveTab(tabExcesos);
                                    ventanaRegistroPanico.hide();
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('Información', action.result.message);
                                }
                            });
                        }
                    } else if (id_tipo_consultaPanicos === 2) {
                        var empresa2 = empresaPanico;
                        var placa2 = placaReportPanico;
                        var dateStart2 = dateIni.getRawValue();
                        var dateFinish2 = dateFin.getRawValue();
                        var timeInicio2 = timeInipanico.getRawValue();
                        var timeFin2 = timeFinpanico.getRawValue();
                        if (formulario.isValid()) {
                            formulario.submit({
                                url: 'php/interface/report/panicos/getReportPanicoDetallados.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idVehiculo: idVehiculoPanico,
                                    fechaIni: dateStart2,
                                    fechaFin: dateFinish2,
                                    horaIniP: timeInicio2,
                                    horaFinP: timeFin2
                                },
                                success: function (form, action) {
                                    var storeViewPanico = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa', 'totalEventos']
                                    });

                                    var gridViewDataPanico = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Reporte de Pánicos  ' + empresa2 + "-" + placa2 + '<br>Desde: ' + dateStart2 + ' | Hasta: ' + dateFinish2 + '</center>',
                                        store: storeViewPanico,
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
                                                                clearLienzoPointTravel();
                                                                clearLienzoTravel();
                                                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                                drawPointsPanicos(record.data);
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
                                                    exportExcelEventos(gridViewDataPanico, "Reporte de Pánicos ", "nameSheet", "Reporte de Pánicos de " + empresa2 + "-" + placa2 + " Desde " + dateStart2 + " " + timeInicio2 + "|" + dateFinish2 + " " + timeFin2);
                                                }
                                            }]
                                    });
                                    var tabExcesos = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Registros de Pánico ' + empresa2 + " : " + placa2 + '</div>',
                                        closable: true,
                                        iconCls: 'icon-reset',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridViewDataPanico]
                                    });
                                    panelTabMapaAdmin.add(tabExcesos);
                                    panelTabMapaAdmin.setActiveTab(tabExcesos);
                                    ventanaRegistroPanico.hide();
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('Información', action.result.message);
                                }
                            });
                        } else {
                            Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                        }
                    }
                }}
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    ventanaRegistroPanico.hide();
                }
            }]
    });
});
function showWinPanicosDaily() {
    if (!ventanaRegistroPanico) {
        ventanaRegistroPanico = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Registros de Pánico',
            iconCls: 'icon-reset',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false, items: formPanico
        });
    }
    ventanaRegistroPanico.show();
    formPanico.getForm().reset();
    if (idRolKarview == 3) {
        Ext.getCmp('rb1').disable();
        Ext.getCmp('rb2').setValue(true);
    } else {
        Ext.getCmp('rb1').setValue(true);
    }
}