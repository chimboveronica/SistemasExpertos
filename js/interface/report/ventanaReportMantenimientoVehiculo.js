
var formularioMantenimientoDetallado;
var VentanaMantenimiento;
var vistaVistaRegistrosMantenimiento;

Ext.onReady(function () {
    var porEquipoManten;
    var banderaMantenimiento;
    if (idCompanyKarview == 1) {
        banderaMantenimiento = 1;
    } else {
        banderaMantenimiento = storeEmpresas.data.items[0].data.id;
    }

    var cbxEmpresasMantenimiento = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyMantenimiento',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaMantenimiento,
        listeners: {
            select: function (combo, records, eOpts) {
                storeVeh.removeAll();
                if (porEquipoManten) {
                    cbxVehBDManten.clearValue();
                    cbxVehBDManten.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records.getId()
                        }
                    });
                }
            }
        }
    });

    var cbxVehBDManten = Ext.create('Ext.form.ComboBox', {
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
        }
    });
    var fechaIniMantenimiento = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaInimanten',
        name: 'fechaInimanten',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinExcesos',
        emptyText: 'Fecha Inicial...'
    });
    var fechaFinMantenimiento = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinManten',
        value: new Date(),
        maxValue: new Date(),
        name: 'fechaFinManten',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaInimanten',
        emptyText: 'Fecha Final...'
    });
    var timeIniMantenimiento = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaInManten',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinMantenimiento = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinManten',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btn_HoyMnatenimiento = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            fechaIniMantenimiento.setValue(nowDate);
            fechaFinMantenimiento.setValue(nowDate);
        }
    });
    var bt_HayerMantenimiento = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaIniMantenimiento.setValue(yestDate);
            fechaFinMantenimiento.setValue(yestDate);
        }
    });
    var panel_BotonesMantenimiento = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btn_HoyMnatenimiento, bt_HayerMantenimiento]
    });
    formularioMantenimientoDetallado = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
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
                            {boxLabel: 'Por Organización', name: 'rb3', id: 'mr1', inputValue: '1'},
                            {boxLabel: 'Por Vehículo', name: 'rb3', id: 'mr2', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb3'])) {
                                    case 1:
                                        cbxEmpresasMantenimiento.enable();
                                        cbxVehBDManten.clearValue();
                                        cbxVehBDManten.disable();
                                        porEquipoManten = false;
                                        break;
                                    case 2:
                                        porEquipoManten = true;
                                        if (porEquipoManten) {
                                            cbxVehBDManten.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioMantenimientoDetallado.down('[name=idCompanyMantenimiento]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasMantenimiento,
                    cbxVehBDManten
                ]
            },
            {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaIniMantenimiento,
                    fechaFinMantenimiento,
                    timeIniMantenimiento,
                    timeFinMantenimiento,
                    panel_BotonesMantenimiento
                ]
            }

        ],
        buttons: [
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var fechaInicio = fechaIniMantenimiento.getRawValue();
                    var fechaFinal = fechaFinMantenimiento.getRawValue();
                    var horaInicio = timeIniMantenimiento.getRawValue();
                    var horaFinal = timeFinMantenimiento.getRawValue();
                    var form = formularioMantenimientoDetallado.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/mantenimiento/porvehiculo/getReportmantenimientoCantidad.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            success: function (form, action) {
                                var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.countByMantenimiento,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_vehiculo', 'empresa', 'vehiculo', 'total', 'descripSoat', 'fechaSoatVenc', 'descripMatricula', 'fechaMatriculaVenc', 'descripSeguro', 'fechaSeguroVenc']
                                });
                                var storeViewMantenimiento = Ext.create('Ext.data.JsonStore', {
                                    autoDestroy: true,
                                    proxy: {
                                        type: 'ajax',
                                        url: 'php/interface/report/mantenimiento/porvehiculo/getReportmantenimientoDetallado.php',
                                        reader: {
                                            type: 'json',
                                            root: 'data'
                                        }
                                    },
                                    fields: ['vehiculo', 'placa','marca','estandar','idTipoServicio', 'responsable']
                                });

                                var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '40%',
                                    title: '<center>Mantenimientos Totales: ' + '<br>Desde: ' + fechaInicio + ' | Hasta: ' + fechaFinal + '</center>',
                                    store: storeDataReporteDetallado,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Organización', width: 150, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
                                        {text: 'Vehículo', width: 160, dataIndex: 'vehiculo', align: 'center', filter: {type: 'string'}},
                                        {text: 'Total Mantenimientos', width: 165, dataIndex: 'total', align: 'center', filter: {type: 'numeric'}},
                                        {text: 'Soat ', width: 150, dataIndex: 'fechaSoatVenc', align: 'center', renderer: formatTipoRegistro},
                                        {text: 'Matricula ', width: 170, dataIndex: 'fechaMatriculaVenc', align: 'center', renderer: formatTipoRegistro},
                                        {text: 'Seguro', width: 160, dataIndex: 'fechaSeguroVenc', align: 'center', renderer: formatTipoRegistro}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                    exportExcelEventos(gridDataMantenimiento, "Reporte de Encendido Apagado ", "nameSheet", "Reporte de Mantenimiento");
                                            }
                                        }],
                                    listeners: {
                                        itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                                            e.stopEvent();
                                            Ext.create('Ext.menu.Menu', {
                                                items: [
                                                    Ext.create('Ext.Action', {
                                                        iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                        text: 'Ver Detalles',
                                                        disabled: false,
                                                        handler: function (widget, event) {
                                                            if (vistaVistaRegistrosMantenimiento) {
                                                                vistaVistaRegistrosMantenimiento.hide();
                                                            }
                                                            metodoRegistros(record.data.empresa, record.data.vehiculo, record.data.total, record.data.fechaSoatReg, record.data.fechaSoatVenc, record.data.descripSoat, record.data.fechaMatriculaReg, record.data.fechaMatriculaVenc, record.data.descripMatricula, record.data.fechaSeguroReg, record.data.fechaSeguroVenc, record.data.descripSeguro);
                                                            vistaVistaRegistrosMantenimiento.show();
                                                        }
                                                    })
                                                ]
                                            }).showAt(e.getXY());
                                            return false;
                                        },
                                        itemclick: function (thisObj, record, item, index, e, eOpts) {
                                            var empresa = record.get('empresa');
                                            var id_vehiculo = record.get('id_vehiculo');
                                            banderaMantenimiento = 1;
                                            gridViewDataMantenimiento.setTitle('<center>Lista de Mantenimientos por Vehiculo <br>Organización: ' + empresa + ' Desde: ' + fechaInicio + ' Hasta:' + fechaFinal + '</center>');
                                            storeViewMantenimiento.load({
                                                params: {
                                                    idVehiculo: id_vehiculo,
                                                    fechaInicio: fechaInicio,
                                                    fechaFin: fechaFinal,
                                                    horaInicio: horaInicio,
                                                    horaFinal: horaFinal
                                                }
                                            });
                                        }
                                    }
                                });
                                var gridViewDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '60%',
                                    title: '<center>Servicios Mantenimientos Detallado: ',
                                    store: storeViewMantenimiento,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Placa', width: 130, dataIndex: 'placa', align: 'center', filter: {type: 'string'}},
                                        {text: 'Marca', width: 200, dataIndex: 'marca', align: 'center', filter: {type: 'string'}},
                                        {text: 'Estandar', width: 250, dataIndex: 'estandar', align: 'center', filter: {type: 'string'}},
                                        {text: 'Tipo Servicio', width: 200, dataIndex: 'idTipoServicio', align: 'center', renderer: formatTipoServicio,
                                            filter: {
                                                type: 'list',
                                                options: [[1, 'Mantenimiento'], [2, 'Reparación'], [3, 'Repuesto']]
                                            }},
                                        {text: 'Responsable', width: 200, dataIndex: 'responsable', align: 'center', filter: {type: 'string'}}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                         exportExcelEventos(gridViewDataMantenimiento, "Reporte de Encendido Apagado ", "nameSheet", "Reporte de Mantenimiento");                                            }
                                        }]
                                });
                                var tabExces = Ext.create('Ext.container.Container', {
                                    title: 'Mantenimientos Detallados',
                                    closable: true,
                                    iconCls: 'icon-servicios',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 490,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridDataMantenimiento, gridViewDataMantenimiento]
                                });
                                panelTabMapaAdmin.add(tabExces);
                                panelTabMapaAdmin.setActiveTab(tabExces);
                                VentanaMantenimiento.hide();
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Información', action.result.msg);
                            }
                        });
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    VentanaMantenimiento.hide();
                }
            }]
    });
});
function limpiarPanelG() {
    if (vistaVistaRegistrosMantenimiento) {
        vistaVistaRegistrosMantenimiento.hide();
    }

}


function metodoRegistros(empresa, vehiculo, total, fechaSoatReg, fechaSoatVenc, descripSoat, fechaMatriculaReg,
        fechaMatriculaVenc, descripMatricula, fechaSeguroReg, fechaSeguroVenc, descripSeguro) {
    vistaVistaRegistrosMantenimiento = Ext.create('Ext.window.Window', {
        layout: 'fit',
        title: 'Estado de Equipos',
        iconCls: 'icon-company',
        resizable: true,
        width: 400,
        height: 300,
        closeAction: 'hide',
        plain: true,
        items: [{
                xtype: 'form',
                autoScroll: true,
                width: 300,
                height: 390,
                items: [
                    {html: '<TABLE id="tablestados">' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon_empresa.png"> <b>EMPRESA:</b></td>' +
                                '   <TD align="CENTER ">' + empresa + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon_car.png"> <b>VEHICULO:</b></td>' +
                                '   <TD align="CENTER ">' + vehiculo + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de SOAT:</b></td>' +
                                '   <TD align="CENTER ">' + formatVistaRegistro(fechaSoatReg) + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de SOAT:</b></td>' +
                                '   <TD align="CENTER ">' + formatVistaRegistro(fechaSoatReg) + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de Matricula:</b></td>' +
                                '   <TD align="CENTER ">' + formatVistaRegistro(fechaMatriculaReg) + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de Matricula:</b></td>' +
                                '   <TD align="CENTER ">' + formatVistaRegistro(fechaMatriculaVenc) + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de Seguro:</b></td>' +
                                '   <TD align="CENTER ">' + formatVistaRegistro(fechaSeguroReg) + '</TD> ' +
                                '</TR> ' +
                                '<TR class="alt"> ' +
                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de Seguro:</b></td>' +
                                '   <TD align="CENTER ">' + formatVistaRegistro(fechaSeguroVenc) + '</TD> ' +
                                '</TR> ' +
                                ' </TABLE>'
                    }
                ]
                ,
                buttons: [
                    {
                        text: 'Cerrar',
                        tooltip: 'Cerrar',
                        iconCls: 'icon-cancelar',
                        handler: limpiarPanelG
                    }
                ]}
        ]
    });
}

function showWinMantenimientoVehiculo() {
    if (!VentanaMantenimiento) {
        VentanaMantenimiento = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Mantenimiento Vehicular',
            iconCls: 'icon-servicios',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: true,
            items: formularioMantenimientoDetallado
        });
    }
    formularioMantenimientoDetallado.getForm().reset();
    VentanaMantenimiento.show();
    if (idRolKarview == 3) {
        Ext.getCmp('mr1').disable();
        Ext.getCmp('mr2').setValue(true);
    } else {
        Ext.getCmp('mr2').setValue(true);
    }
}