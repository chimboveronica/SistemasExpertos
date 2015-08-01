var formInvalidReport;
var DatoInvalidReport;
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

    var dateIniInvalid = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
//        id: 'fechaIniParada',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha valida Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinInvalid = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
//        id: 'fechaFinParada',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });
    var timeIniInvalid = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniInvalid',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinInvalid = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinInvalid',
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
            dateIniInvalid.setValue(nowDate);
            dateFinInvalid.setValue(nowDate);
            timeIniInvalid.setValue('00:00');
            timeFinInvalid.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniInvalid.setValue(yestDate);
            dateFinInvalid.setValue(yestDate);
            timeIniInvalid.setValue('00:00');
            timeFinInvalid.setValue('23:59');
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
    formInvalidReport = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniInvalid,
                    dateFinInvalid,
                    timeIniInvalid,
                    timeFinInvalid,
                    panelButtonsGeocercs
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var fechaIni = dateIniInvalid.getRawValue();
                    var fechaFin = dateFinInvalid.getRawValue();
                    var horaIni = timeIniInvalid.getRawValue();
                    var horaFin = timeFinInvalid.getRawValue();
                    var formulario = formInvalidReport.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/datos_invalidos/getDatoInvalido.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: idEmpresaG
                            },
                            success: function (form, action) {
                                var storeDataInvalid = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_tipo_dato_invalido', 'fecha_hora_registro', 'equipo', 'trama', 'excepcion']
                                });
                                var gridDataInvalid = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Reporte de Datos Invalidos </center>',
                                    store: storeDataInvalid,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: '<center>No hay datos que Mostrar</center>',
                                        loadMask: false,
                                        enableTextSelection: true,
                                        preserveScrollOnRefresh: true
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 50, align: 'center'}),
                                        {text: 'Equipo', width: 70, dataIndex: 'equipo', align: 'center', filter: {type: 'string'}},
                                        {text: 'Descripción', width: 100, dataIndex: 'id_tipo_dato_invalido', align: 'center', renderer: formatInvalid, filter: {type: 'list', store: storeInvalidList}},
                                        {text: 'Fecha Hora Registro', width: 150, dataIndex: 'fecha_hora_registro', align: 'center', format: 'd-m-Y H:i:s', filter: {type: 'date'}, filterable: true},
                                        {text: 'Trama', width: 700, dataIndex: 'trama', align: 'center', filter: {type: 'string'}},
                                        {text: 'Excepción', width: 400, dataIndex: 'excepcion', align: 'center', filter: {type: 'string'}}
                                    ],
                                    tbar: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                exportExcelEventos(gridDataInvalid, "Reporte de Datos Invalidos ", "nameSheet", "Reporte de Datos Invalidos  ");
                                            }
                                        }
                                    ]
                                });

                                var tabDatoInvalido = Ext.create('Ext.container.Container', {
                                    title: '<div id="titulosForm"> Reporte de Datos Invalidos ' + '</div>',
                                    closable: true,
                                    iconCls: 'icon-datainvalid',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 3000,
                                    region: 'center',
                                    items: [gridDataInvalid]
                                });
                                panelTabMapaAdmin.add(tabDatoInvalido);
                                panelTabMapaAdmin.setActiveTab(tabDatoInvalido);
                                DatoInvalidReport.hide();
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
                    DatoInvalidReport.hide();
                }
            }]
    });
});
function ventanaReporteDatoInvalido() {
    if (!DatoInvalidReport) {
        DatoInvalidReport = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte Datos Invalidos',
            iconCls: 'icon-datainvalid',
            resizable: false,
            width: 350,
            height: 280,
            closeAction: 'hide',
            plain: false,
            items: formInvalidReport
        });
    }
    DatoInvalidReport.show();
    formInvalidReport.getForm().reset();

}