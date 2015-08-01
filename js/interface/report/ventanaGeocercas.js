var formGeocercasReport;
var winGeocercasReport;
Ext.onReady(function () {
    var empresaGeocerc = 'KRADAC';
    var idEmpresaG = 1;
    var banderaGeocercas;
    var placaReporteGeocercas;
    if (idCompanyKarview == 1) {
        banderaGeocercas = 1;
    } else {
        empresaGeocerc = storeEmpresaPanicos.data.items[0].data.text;
        banderaGeocercas = storeEmpresaPanicos.data.items[0].data.id;
    }
    var cbxEmpresasBDGeocercaReport = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyParadas',
        store: storeEmpresaPanicos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaGeocercas,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaGeocerc=cbxEmpresasBDGeocercaReport.getRawValue();
                cbxVehBDGeocercaReport.clearValue();
                cbxVehBDGeocercaReport.enable();
                storeVeh.load({
                    params: {
                        cbxEmpresas: record.getId()
                    }
                });
            }
        }
    });


    var cbxGeocerca = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Geocerca:',
        name: 'cbxGeo',
        store: storeGeo,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Geocerca...',
        disabled: false,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 325
        }
    });

    var cbxVehBDGeocercaReport = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 270
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placaReporteGeocercas = record.data.placa;
            }
        }
    });
    var dateIniGeocerca = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniParada',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha valida Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinGeocerca = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinParada',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });
    var timeIniGeocerca = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniParada',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinGeocerca = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinParada',
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
            dateIniGeocerca.setValue(nowDate);
            dateFinGeocerca.setValue(nowDate);
            timeIniGeocerca.setValue('00:00');
            timeFinGeocerca.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniGeocerca.setValue(yestDate);
            dateFinGeocerca.setValue(yestDate);
            timeIniGeocerca.setValue('00:00');
            timeFinGeocerca.setValue('23:59');
        }
    });
    var panelButtonsGeocercs = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnToday, btnYesterday]
    });
    formGeocercasReport = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    cbxEmpresasBDGeocercaReport,
                    cbxGeocerca,
                    cbxVehBDGeocercaReport
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniGeocerca,
                    dateFinGeocerca,
                    timeIniGeocerca,
                    timeFinGeocerca,
                    panelButtonsGeocercs
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var empresa = empresaGeocerc;
                    var placa = placaReporteGeocercas;
                    var fechaIni = dateIniGeocerca.getRawValue();
                    var fechaFin = dateFinGeocerca.getRawValue();
                    var horaIni = timeIniGeocerca.getRawValue();
                    var horaFin = timeFinGeocerca.getRawValue();
                    var formulario = formGeocercasReport.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/geocerca/getReportGeo.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: idEmpresaG
                            },
                            success: function (form, action) {
                                var storeDataGeocercas = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_geocerca', 'geocerca', 'placa', 'estado', 'fecha_hora']
                                });
                                var gridDataGeocercas = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Reporte de Geocercas de' + empresa + "-" + placa + '<br>Desde: ' + fechaIni + ' | Hasta: ' + fechaFin + '</center>',
                                    store: storeDataGeocercas,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 50, align: 'center'}),
                                        {text: 'Geocerca', width: 355, dataIndex: 'geocerca', align: 'center'},
                                        {text: 'Placa', width: 305, dataIndex: 'placa', align: 'center', filter: {type: 'string'}},
                                        {text: 'Estado', width: 210, dataIndex: 'estado', align: 'center', renderer: formatEstadoGeocerca,
                                            filter: {
                                                type: 'list',
                                                options: [[0, 'FUERA'], [1, 'DENTRO']]
                                            }},
                                        {text: 'Fecha', width: 170, dataIndex: 'fecha_hora', align: 'center', format: 'd-m-Y H:i:s', filter: {type: 'date'}, filterable: true}
                                    ],
                                    tbar: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                exportExcelEventos(gridDataGeocercas, "Reporte de Geocercas ", "nameSheet", "Reporte de Geocercas " + empresa + "-" + placa + " Desde " + fechaIni + " " + horaIni + "|" + fechaFin + " " + horaFin);
                                            }
                                        }
                                    ]
                                });

                                var tabGeocercas = Ext.create('Ext.container.Container', {
                                    title: '<div id="titulosForm"> Reporte de Geocercas ' + empresa + ":" + placa + '</div>',
                                    closable: true,
                                    iconCls: 'icon-report-geo',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 4000,
                                    region: 'center',
                                    items: [gridDataGeocercas]
                                });
                                panelTabMapaAdmin.add(tabGeocercas);
                                panelTabMapaAdmin.setActiveTab(tabGeocercas);
                                winGeocercasReport.hide();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: action.result.message,
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
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winGeocercasReport.hide();
                }
            }]
    });
});
function ventanaReporteGeocerca() {
    if (!winGeocercasReport) {
        winGeocercasReport = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Geocercas',
            iconCls: 'icon-report-geo',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formGeocercasReport
        });
    }
    winGeocercasReport.show();
    formGeocercasReport.getForm().reset();
    storeVeh.load({
        params: {
            cbxEmpresas: formGeocercasReport.down('[name=idCompanyParadas]').getValue()
        }
    });
}