var contenedorwinEvt;
var winEvt;
var empresaEventos;
Ext.onReady(function () {
    var idEmpresa;

    if (idCompanyKarview == 1) {
        idEmpresa = 1;
    } else {
        empresaEventos = storeEmpresaPanicos.data.items[0].data.text;
        idEmpresa = storeEmpresaPanicos.data.items[0].data.id;
    }

    var storeVehiculos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboVeh.php',
            reader: {
                type: 'json',
                root: 'veh'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, 'text']
    });



    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresasEvent',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: idEmpresa,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVehiculos.removeAll();
                empresaEventos = cbxEmpresasBD.getRawValue();
                placaEventos = " ";
                var listSelected = contenedorwinEvt.down('[name=listVehEvent]');
                listSelected.clearValue();
                listSelected.fromField.store.removeAll();
                storeVehiculos.load({
                    params: {
                        cbxEmpresas: record.getId()
                    }
                });
            }
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEvent',
        name: 'fechaIniEvent',
        value: new Date(),
        maxValue: new Date(),
        //vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEvent',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEvent',
        name: 'fechaFinEvent',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEvent',
        emptyText: 'Fecha Final...'
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniEvent',
        format: 'H:i',
        value: '00:00',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinEvent',
        format: 'H:i',
        value: '23:59',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIni.setValue(formatoFecha(nowDate));
            dateFin.setValue(formatoFecha(nowDate));
            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });

    var yesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var nowDate = new Date();
            var año = nowDate.getFullYear();
            var mes = nowDate.getMonth() + 1;
            if (mes < 10) {
                mes = "0" + mes;
            }
            var dia = nowDate.getDate() - 1;
            if (dia < 10) {
                dia = "0" + dia;
            }
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            dateIni.setValue(año + "-" + mes + "-" + dia);
            dateFin.setValue(año + "-" + mes + "-" + dia);

            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });

    var panelBotones = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [today]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterday]
            }]
    });

    contenedorwinEvt = Ext.create('Ext.form.Panel', {
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        baseCls: 'x-plain',
        items: [{
                xtype: 'form',
                baseCls: 'x-plain',
                items: [
                    cbxEmpresasBD
                ]
            }, {
                xtype: 'form',
                bodyStyle: 'padding: 10px 0 10px 0',
                width: 570,
                baseCls: 'x-plain',
                items: [{
                        xtype: 'itemselector',
                        name: 'listVehEvent',
                        anchor: '97%',
                        height: 170,
                        store: storeVehiculos,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Vehículos',
                        toTitle: 'Seleccionados'
                    }, {
                        xtype: 'itemselector',
                        name: 'listEvt',
                        anchor: '97%',
                        height: 170,
                        store: storeEventosReporte,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Eventos',
                        toTitle: 'Seleccionados'
                    }]
            }, {
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                },
                items: [{
                        layout: 'column',
                        baseCls: 'x-plain',
                        items: [{
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    dateIni,
                                    timeIni
                                ]
                            }, {
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    dateFin,
                                    timeFin
                                ]
                            }]
                    }]
            }, panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    if (contenedorwinEvt.getForm().isValid()) {
                        loadGridEvents();
                    } else {
                        Ext.MessageBox.show({
                            title: 'Atencion',
                            msg: 'LLene los espacios vacios',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });

                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winEvt.hide();
                }
            }]
    });
    storeVehiculos.load({
        params: {
            cbxEmpresas: idEmpresa
        }
    });
    empresaEventos = 'KRADAC';
});

function limpiar_datosEvt() {
    contenedorwinEvt.getForm().reset();
    if (winEvt) {
        winEvt.hide();
    }
}

function ventanaEventos() {
    if (!winEvt) {
        winEvt = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Eventos',
            iconCls: 'icon-eventos',
            resizable: false,
            width: 580,
            height: 570,
            closeAction: 'hide',
            autoScroll: true,
            plain: false,
            items: [contenedorwinEvt],
            listeners: {
                close: function (panel, eOpts) {
                    limpiar_datosEvt();
                }
            }
        });
    }
    contenedorwinEvt.getForm().reset();
    winEvt.show();
}
function loadGridEvents() {
    var empresa = contenedorwinEvt.down('[name=cbxEmpresasEvent]').getValue();
    var listVeh = contenedorwinEvt.down('[name=listVehEvent]').getValue();
    var listEvt = contenedorwinEvt.down('[name=listEvt]').getValue();
    var fi = formatoFecha(contenedorwinEvt.down('[name=fechaIniEvent]').getValue());
    var ff = formatoFecha(contenedorwinEvt.down('[name=fechaFinEvent]').getValue());
    var hi = formatoHora(contenedorwinEvt.down('[name=horaIniEvent]').getValue());
    var hf = formatoHora(contenedorwinEvt.down('[name=horaFinEvent]').getValue());
    Ext.MessageBox.show({
        title: "Cargando....",
        msg: "Procesando Datos",
        progressText: "Obteniendo...",
        wait: true,
        waitConfig: {
            interval: 150
        }
    });

    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/eventos/getReportEvent.php?cbxEmpresas=' + empresa +
                    '&listVeh=' + listVeh +
                    '&listEvt=' + listEvt +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['id_sky_evento', 'vehiculor', 'latitudr', 'longitudr', 'fecha_horar', 'velocidadr', 'bateriar', 'gsmr', 'gps2r', 'ignr', 'evtr', 'direccionr'],
        listeners: {
            load: function (thisObject, records, successful, eOpts) {
                Ext.MessageBox.hide();
                if (records !== null && records.length > 0) {
                    var columnEvets = [
                        Ext.create('Ext.grid.RowNumberer', {text: 'N°', width: 48}),
                        {text: '<b>Vehiculos</b>', width: 200, dataIndex: 'vehiculor', filter: {type: 'string'}},
                        {text: '<b>Fechas</b>', width: 150, dataIndex: 'fecha_horar', xtype: 'datecolumn', align: 'center', format: 'Y-m-d', filter: {type: 'date'}, filterable: true},
                        {text: '<b>Hora</b>', format: 'H:i:s', width: 100, dataIndex: 'fecha_horar', xtype: 'datecolumn', align: 'center'},
                        {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'velocidadr', align: 'center', width: 105, cls: 'listview-filesize', renderer: formatSpeed, filterable: true, filter: {type: 'numeric'}},
                        {text: '<b>Batería</b>', width: 140, dataIndex: 'bateriar', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
                        {text: '<b>GSM</b>', width: 105, dataIndex: 'gsmr', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
                        {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2r', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
                        {text: '<b>Vehículo(IGN)</b>', width: 130, dataIndex: 'ignr', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
                        {text: '<b>Activo</b>', width: 100, dataIndex: 'activo', renderer: formatLock, align: 'center', filter: {type: 'list', store: storActivo}},
                        {text: '<b>Evento</b>', width: 300, dataIndex: 'id_sky_evento', renderer: formatEvento, filter: {type: 'list', store: storeEventos}},
                        {text: '<b>Direccion</b>', width: 300, dataIndex: 'direccionr', tooltip: 'Direccion', filter: {type: 'string'}},
                        {text: '<b>Latitud</b>', width: 150, dataIndex: 'latitudr', tooltip: 'Latitud'},
                        {text: '<b>Longitud</b>', width: 200, dataIndex: 'longitudr', tooltip: 'Longitud'}
                    ];
                    var gridEvents = Ext.create('Ext.grid.Panel', {
                        region: 'center',
                        frame: true,
                        width: '52%',
                        store: store,
                        height: 415,
                        plugins: 'gridfilters',
                        multiSelect: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnEvets,
                        tbar: [
                            {
                                xtype: 'button',
                                iconCls: 'icon-excel',
                                text: 'Exportar a Excel',
                                handler: function () {
                                    exportExcelEventos(gridEvents, "Reporte de Eventos", "nameSheet", "Reporte de la empresa " + empresaEventos + " " + " Desde: " + fi + " " + hi + " | " + ff + " " + hf);
                                }
                            }
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
//                                                drawPointsEventos(record.data);
                                                localizarDireccion(record.data.longitudr, record.data.latitudr, 17);
                                            }
                                        })
                                    ]
                                }).showAt(e.getXY());
                                return false;
                            }
                        }
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: '<div id="titulosForm"> Reporte de Eventos ' + empresaEventos + '</div>',
                        closable: true,
                        iconCls: 'icon-eventos',
                        layout: 'border',
                        fullscreen: true,
                        height: 485,
                        width: 2000,
                        region: 'center',
                        items: gridEvents
                    });

                    panelTabMapaAdmin.add(tab);
                    panelTabMapaAdmin.setActiveTab(tab);
                    winEvt.hide();
                    limpiar_datosEvt();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No hay datos a mostrar en su Petición',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                }

            }
        }
    });
}