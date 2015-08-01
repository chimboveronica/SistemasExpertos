var contenedorReporteMant;
var winReportMante;
var banderaReportMantenimiento;
var empresaReporteMantenimiento = 'KRADAC';
var placaReporteMante = "";

Ext.onReady(function () {
    if (idCompanyKarview == 1) {
        banderaReportMantenimiento = 1;
    } else {
        empresaReporteMantenimiento = storeEmpresaPanicos.data.items[0].data.text;
        banderaReportMantenimiento = storeEmpresaPanicos.data.items[0].data.id;
    }

    var cbxEmpresasBDMant = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresasMant',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaReportMantenimiento,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVehiculosREportMante.removeAll();
                empresaReporteMantenimiento = cbxEmpresasBDPanico.getRawValue();
                placaReporteMante = " ";
                var listSelected = contenedorReporteMant.down('[name=listVehiculos]');
                listSelected.clearValue();
                listSelected.fromField.store.removeAll();
                storeVehiculosREportMante.load({
                    params: {
                        cbxEmpresas: record.getId()
                    }
                });
            }
        }
    });


    var dateIniMant = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniMant',
        name: 'fechaIniMant',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinMat',
        emptyText: 'Fecha Inicial...'
    });

    var dateFinMant = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinMat',
        name: 'fechaFinMat',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniMant',
        emptyText: 'Fecha Final...'
    });

    var timeIniMant = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniMant',
        format: 'H:i',
        value: '00:00',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFinMant = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinMant',
        format: 'H:i',
        value: '23:59',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });
    var botonesToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniMant.setValue(nowDate);
            dateFinMant.setValue(nowDate);
        }
    });

    var yesterdayMant = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniMant.setValue(yestDate);
            dateFinMant.setValue(yestDate);
        }
    });
    var panelBotonesMant = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [botonesToday]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterdayMant]
            }]
    });

    contenedorReporteMant = Ext.create('Ext.form.Panel', {
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        baseCls: 'x-plain',
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Por Vehículo', name: 'opcion', inputValue: '1', checked: true},
                            {boxLabel: 'Por Organización', name: 'opcion', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['opcion'])) {
                                    case 1:
                                        Ext.getCmp('vehiculos').enable();
                                        break;
                                    case 2:
                                        Ext.getCmp('vehiculos').disable();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDMant,
                    {
                        xtype: 'form',
                        bodyStyle: 'padding: 10px 0 10px 0',
                        width: 570,
                        baseCls: 'x-plain',
                        items: [{
                                xtype: 'itemselector',
                                name: 'listVehiculos',
                                anchor: '97%',
                                id: 'vehiculos',
                                height: 150,
                                store: storeVehiculosREportMante,
                                displayField: 'text',
                                valueField: 'value',
                                allowBlank: false,
                                msgTarget: 'side',
                                fromTitle: 'Vehículos',
                                toTitle: 'Seleccionados'
                            }, {
                                xtype: 'itemselector',
                                name: 'listServicios',
                                anchor: '97%',
                                height: 150,
                                store: storeVehiculosservicios,
                                displayField: 'text',
                                valueField: 'id',
                                allowBlank: false,
                                msgTarget: 'side',
                                fromTitle: 'Servicios',
                                toTitle: 'Seleccionados'
                            }]
                    }
                ]
            },
            {
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
                                    dateIniMant,
                                    timeIniMant
                                ]
                            }, {
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    dateFinMant,
                                    timeFinMant
                                ]
                            }]
                    }]
            }, panelBotonesMant],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    if (contenedorReporteMant.getForm().isValid()) {
                        contenedorReporteMant.submit({
                            url: 'php/interface/report/mantenimiento/general/getReporteMantenimiento.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            success: function (form, action) {
                                var storeDataMantenimiento = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.mantenimiento,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_vehiculo', 'empresa', 'vehiculo', 'fechaSoatVenc',
                                         'fechaMatriculaVenc', 'fechaSeguroVenc', 'estandar', 'responsable', 'idTipoServicio']
                                });
                                
                                var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center> Reporte de Mantenimiento de los Vehiculos  </center>',
                                    store: storeDataMantenimiento,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Organización', width: 150, dataIndex: 'empresa', align: 'center', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList},},
                                        {text: 'Vehículo', width: 170, dataIndex: 'vehiculo', align: 'center',filter: {type: 'string'}},
                                        {text: 'Servicio', width: 300, dataIndex: 'estandar', align: 'center',filter: {type: 'string'}},
                                        {text: 'Tipo Servicio', width: 300, dataIndex: 'idTipoServicio', align: 'center', renderer: formatTipoServicio, filter: {
                                                type: 'list',
                                                options: [[1, 'Mantenimiento'], [2, 'Reparación'], [3, 'Repuesto']]
                                            }},
                                        {text: 'Soat ', width: 150, dataIndex: 'fechaSoatVenc', align: 'center', renderer: formatTipoRegistro,filter: {type: 'string'}},
                                        {text: 'Matricula ', width: 170, dataIndex: 'fechaMatriculaVenc', align: 'center', renderer: formatTipoRegistro,filter: {type: 'string'}},
                                        {text: 'Seguro', width: 160, dataIndex: 'fechaSeguroVenc', align: 'center', renderer: formatTipoRegistro,filter: {type: 'string'}},
                                        {text: 'Responsable', width: 160, dataIndex: 'responsable', align: 'center',filter: {type: 'string'}}

                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                            exportExcelEventos(gridDataMantenimiento, "Reporte de Encendido Apagado ", "nameSheet", "Reporte de Mantenimiento");
                                            }
                                        }]
                                });

                                var tab = Ext.create('Ext.form.Panel', {
                                    title: '<div id="titulosForm"> Mantenimiento  ' + empresaReporteMantenimiento + '</div>',
                                    closable: true,
                                    iconCls: 'icon-servicios',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 490,
                                    width: 2000,
                                    items: gridDataMantenimiento
                                });
                                panelTabMapaAdmin.add(tab);
                                panelTabMapaAdmin.setActiveTab(tab);
                                winReportMante.hide();
                                limpiar_datosEvt();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: "No hay datos en estas Fechas",
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }

                        });
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
                    winReportMante.hide();
                }
            }]
    });
});

function limpiar_datosEvt() {
    contenedorReporteMant.getForm().reset();
    if (winReportMante) {
        winReportMante.hide();
    }
}

function ventanaReporteMantenimiento() {
    if (!winReportMante) {
        winReportMante = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Mantenimiento General',
            iconCls: 'icon-mantenimiento',
            resizable: false,
            width: 580,
            height: 587,
            closeAction: 'hide',
            plain: false,
            items: [contenedorReporteMant],
            listeners: {
                close: function (panel, eOpts) {
                    limpiar_datosEvt();
                }
            }
        });
    }
    contenedorReporteMant.getForm().reset();
    winReportMante.show();
    storeVehiculosREportMante.load({
        params: {
            cbxEmpresas: banderaReportMantenimiento
        }

    });
}
