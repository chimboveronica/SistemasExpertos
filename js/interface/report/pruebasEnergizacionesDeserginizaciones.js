var formularioEnerg;
var VentanaEnerg;
Ext.onReady(function () {
    var porEquipo=false;
    var empresaEnergDesernerg='KRADAC';
    var banderaEnergiDesenerg;
    var placaEnerDesenerg="";
    var idVehiculoEnerg=0;
    var idEmpresa = 1;
    if (idCompanyKarview == 1) {
        banderaEnergiDesenerg = 1;
    } else {
        empresaEnergDesernerg = storeEmpresas.data.items[0].data.text;
        banderaEnergiDesenerg = storeEmpresas.data.items[0].data.id;
    }

    var cbxEmpresasBDEnergD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyEnergD',
        store: storeEmpresaPanicos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaEnergiDesenerg,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaEnergDesernerg = cbxEmpresasBDEnergD.getRawValue();
                if (porEquipo) {
                    cbxVehBDEnergD.clearValue();
                    cbxVehBDEnergD.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                }
            }
        }
    });



    var cbxVehBDEnergD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVehED',
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
                placaEnerDesenerg = record.data.placa;
                idVehiculoEnerg = record.data.id;
            }
        }
    });


    var dateIniEnergD = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEnergD',
        name: 'fechaIniED',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinEnergD',
        emptyText: 'Fecha Inicial...'
    });

    var dateFinEnergD = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEnergD',
        name: 'fechaFinED',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniEnergD',
        emptyText: 'Fecha Final...'
    });

    var timeIniEnergD = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniED',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinEnergD = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinED',
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
            dateIniEnergD.setValue(nowDate);
            dateFinEnergD.setValue(nowDate);
            timeIniEnergD.setValue('00:00');
            timeFinEnergD.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniEnergD.setValue(yestDate);
            dateFinEnergD.setValue(yestDate);
            timeIniEnergD.setValue('00:00');
            timeFinEnergD.setValue('23:59');
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
    var id_tipo_consultEnergDes = 1;
    var reg_empresaEnerG;
    formularioEnerg = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'Por Organización', name: 'rbEnergD', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehículo', name: 'rbEnergD', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rbEnergD'])) {
                                    case 1:
                                        id_tipo_consultEnergDes = 1;
                                        idEmpresa = 1;
                                        cbxEmpresasBDEnergD.enable();
                                        cbxVehBDEnergD.clearValue();
                                        cbxVehBDEnergD.disable();
                                        porEquipo = false;
                                        break;
                                    case 2:
                                        id_tipo_consultEnergDes = 2;
                                        porEquipo = true;
                                        idEmpresa = cbxEmpresasBDEnergD.getValue();
                                        if (porEquipo) {
                                            cbxVehBDEnergD.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioEnerg.down('[name=idCompanyEnergD]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDEnergD,
                    cbxVehBDEnergD
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniEnergD,
                    dateFinEnergD,
                    timeIniEnergD,
                    timeFinEnergD,
                    panelButtons
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var formulario = formularioEnerg.getForm();
                    if (id_tipo_consultEnergDes === 1) {
                        var empresa1 = empresaEnergDesernerg;
                        var placa1 = placaEnerDesenerg;
                        var dateStart1 = dateIniEnergD.getRawValue();
                        var dateFinish1 = dateFinEnergD.getRawValue();
                        var timeInicio1 = timeIniEnergD.getRawValue();
                        var timeFin1 = timeFinEnergD.getRawValue();
                        var vehiculo1;
                        if (formulario.isValid()) {
                            formulario.submit({
                                url: 'php/interface/report/energizaDesenegizar/getReportEnergizarCantidad.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idCompany: idEmpresa
                                },
                                success: function (form, action) {
                                    var storeViewEnerg = Ext.create('Ext.data.JsonStore', {
                                        autoDestroy: true,
                                        proxy: {
                                            type: 'ajax',
                                            url: 'php/interface/report/energizaDesenegizar/getReportEnergizarDetallados.php',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        fields: ['idData', 'empresa', 'vehiculo', 'placa', 'latitud', 'longitud', 'fecha', 'hora', 'velocidad', 'bateria', 'gsm', 'gps', 'ign', 'sky_evento']
                                    });
                                    var storeDataEnergDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.countByParadas,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa', 'totalEventos']
                                    });
                                    var id_vehiculo = storeDataEnergDetallado.getAt(0).data.id_vehiculo;
                                    vehiculo1 = storeDataEnergDetallado.getAt(0).data.vehiculo;
                                    placa1 = storeDataEnergDetallado.getAt(0).data.placa;
                                    storeViewEnerg.load(
                                            {
                                                params: {
                                                    idvehiculoED: id_vehiculo,
                                                    fechaIniED: dateStart1,
                                                    fechaFinED: dateFinish1,
                                                    horaIniED: timeInicio1,
                                                    horaFinED: timeFin1
                                                }
                                            });

                                    var gridDataEnergizacionD = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '48%',
                                        title: '<center>Energización y desenergizacións Totales ' + '<br>Desde: ' + dateStart1 + ' | Hasta: ' + dateFinish1 + '</center>',
                                        store: storeDataEnergDetallado,
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
                                                    exportExcelEventos(gridDataEnergizacionD, "Reporte de Pánicos ", "nameSheet", "Reporte de la empresa " + empresa1 + " " + " Desde: " + dateStart1 + " " + timeInicio1 + " | " + dateFinish1 + " " + timeFin1);
                                                }
                                            }],
                                        listeners: {
                                            itemclick: function (thisObj, record, item, index, e, eOpts) {
                                                reg_empresaEnerG = record.get('empresa');
                                                var id_vehiculo_energ = record.get('id_vehiculo');
                                                vehiculo1 = record.get('vehiculo');
                                                placa1 = record.get('placa');
                                                storeViewEnerg.load(
                                                        {
                                                            params: {
                                                                idvehiculoED: id_vehiculo_energ,
                                                                fechaIniED: dateStart1,
                                                                fechaFinED: dateFinish1,
                                                                horaIniED: timeInicio1,
                                                                horaFinED: timeFin1,
                                                            }
                                                        });
                                                gridViewDataEnergD.setTitle('<center>Vista de energización y desenergización <br> Empresa: ' + reg_empresaEnerG + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                            }
                                        }
                                    });

                                    var gridViewDataEnergD = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Reporte de Encendido y Apagado: ',
                                        store: storeViewEnerg,
                                        plugins: 'gridfilters',
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 60, align: 'center'}),
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
                                                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                                clearLienzoPointTravel();
                                                                clearLienzoTravel();
                                                                drawPointsEnergDeserg(record.data);
                                                                localizarDireccion(record.data.longitudED, record.data.latitudED, 17);
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
                                                    exportExcelEventos(gridViewDataEnergD, "Reporte de Pánicos ", "nameSheet", "Reporte de la empresa " + empresa1 + "- " + placa1 + " Desde: " + dateStart1 + " " + timeInicio1 + " | " + dateFinish1 + " " + timeFin1);
                                                }
                                            }]
                                    });
                                    var tabExcesos = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Reporte de Energización Desenergización ' + empresaEnergDesernerg + '</div>',
                                        closable: true,
                                        iconCls: 'icon-conexcion',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridViewDataEnergD, gridDataEnergizacionD]
                                    });
                                    panelTabMapaAdmin.add(tabExcesos);
                                    panelTabMapaAdmin.setActiveTab(tabExcesos);
                                    VentanaEnerg.hide();
                                },
                                failure: function (form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Información',
                                        msg: 'No se existen datos disponibles',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                            });
                        } else {
                            Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                        }
                    } else if (id_tipo_consultEnergDes === 2) {
                        var empresa2 = empresaEnergDesernerg;
                        var placa2 = placaEnerDesenerg;
                        var dateStart2 = dateIniEnergD.getRawValue();
                        var dateFinish2 = dateFinEnergD.getRawValue();
                        var timeInicio2 = timeIniEnergD.getRawValue();
                        var timeFin2 = timeFinEnergD.getRawValue();
                        if (formulario.isValid()) {
                            formulario.submit({
                                url: 'php/interface/report/energizaDesenegizar/getReportEnergizarDetallados.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idCompany: idEmpresa,
                                    idvehiculoED: idVehiculoEnerg

                                },
                                success: function (form, action) {
                                    var storeDataEnergDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa', 'totalEventos']
                                    });
                                    var gridViewDataEnergD = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Reporte de Paradas: ' + placa2+ '<br>Desde: ' + dateStart2 + ' ' + timeInicio2 + ' | Hasta: ' + dateFinish2 + ' ' + timeFin2 + '</center>',
                                        store: storeDataEnergDetallado,
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
                                                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                                clearLienzoPointTravel();
                                                                clearLienzoTravel();
                                                                drawPointsEnergDeserg(record.data);
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
                                                exportExcelEventos(gridViewDataEnergD, "Reporte de Energizacón y Desenergización ", "nameSheet", "Reporte de Pánicos de " + empresa2 + "-" + placa2 + " Desde " + dateStart2 + " " + timeInicio2 + "|" + dateFinish2 + " " + timeFin2);
                                                }
                                            }]
                                    });
                                    var tabExcesos = Ext.create('Ext.container.Container', {
                                        title: '<div id="titulosForm"> Reporte de Energización Desenergización '+empresa2+'</div>',
                                        closable: true,
                                        iconCls: 'icon-conexcion',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridViewDataEnergD]
                                    });
                                    panelTabMapaAdmin.add(tabExcesos);
                                    panelTabMapaAdmin.setActiveTab(tabExcesos);
                                    VentanaEnerg.hide();
                                },
                                failure: function (form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Información',
                                        msg: 'No se existen datos disponibles',
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
                    VentanaEnerg.hide();
                }
            }]
    });
});
function showWinEnergizar() {
    if (!VentanaEnerg) {
        VentanaEnerg = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: ' Conexión Desconexión del Equipo',
            iconCls: 'icon-conexcion',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formularioEnerg
        });
    }
    VentanaEnerg.show();
    formularioEnerg.getForm().reset();
}
