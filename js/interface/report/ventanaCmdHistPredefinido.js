var formComandos;
var winComandos;



var placacomandos = "";
var empresaComandos = 'KRADAC';
var banderaComandos;
Ext.onReady(function () {
    var porEquipoComan = false;
    var idEmpresa = 1;
    var idEquipoComandos;
    if (idCompanyKarview == 1) {
        banderaComandos = 1;
    } else {
        empresaComandos = storeEmpresas.data.items[0].data.text;
        banderaComandos = storeEmpresas.data.items[0].data.id;
    }
    var cbxEmpresasBDComandos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyComando',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaComandos,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaComandos = cbxEmpresasBDComandos.getRawValue();
                placacomandos = " ";
                if (porEquipoComan) {
                    cbxVehBDComanodos.clearValue();
                    cbxVehBDComanodos.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                }
            }
        }
    });
    var cbxVehBDComanodos = Ext.create('Ext.form.ComboBox', {
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
            minWidth: 300
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placacomandos = record.data.placa;
            }
        }
    });
    var dateIniComandos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniComando',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinComandos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinComando',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });
    var timeIniComandos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniComando',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinComandos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinComando',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btnTodayComandos = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniComandos.setValue(nowDate);
            dateFinComandos.setValue(nowDate);
            timeIniComandos.setValue('00:00');
            timeFinComandos.setValue('23:59');
        }
    });
    var btnYesterdayComandos = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniComandos.setValue(yestDate);
            dateFinComandos.setValue(yestDate);
            timeIniComandos.setValue('00:00');
            timeFinComandos.setValue('23:59');
        }
    });
    var panelButtonsComandos = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnTodayComandos, btnYesterdayComandos]
    });
    formComandos = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'Por Organización', name: 'rb6', id: 'cr1', inputValue: '1'},
                            {boxLabel: 'Por Vehículo', name: 'rb6', id: 'cr2', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb6'])) {
                                    case 1:
                                        idEmpresa = 1;
                                        cbxEmpresasBDComandos.enable();
                                        cbxVehBDComanodos.clearValue();
                                        cbxVehBDComanodos.disable();
                                        porEquipoComan = false;
                                        break;
                                    case 2:
                                        porEquipoComan = true;
                                        idEmpresa = cbxEmpresasBDComandos.getValue();
                                        if (porEquipoComan) {
                                            cbxVehBDComanodos.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formComandos.down('[name=idCompanyComando]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDComandos,
                    cbxVehBDComanodos,
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniComandos,
                    dateFinComandos,
                    timeIniComandos,
                    timeFinComandos,
                    panelButtonsComandos
                ]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    dateStartComan = dateIniComandos.getRawValue();
                    dateFinishComan = dateFinComandos.getRawValue();
                    var formulario = formComandos.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/comandos/getReportCmdPredefinido.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: idEmpresa
                            },
                            success: function (form, action) {
                                var storeDataComandos = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['usuario', 'comando', 'respuesta', 'fecha_creacion', 'fecha_envio', 'estado']
                                });
                                var gridDataComandos = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Lista de Comandos ' + '<br>Desde: ' + dateStartComan + ' | Hasta: ' + dateFinishComan + '</center>',
                                    store: storeDataComandos,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Usuario', width: 130, dataIndex: 'usuario', align: 'center', filter: {type: 'string'}},
                                        {text: 'Comando', width: 200, dataIndex: 'comando', align: 'center', renderer: formatComandoPredefinido, filter: {type: 'string'}},
                                        {text: 'Equipo', width: 200, dataIndex: 'equipo', align: 'center', filter: {type: 'string'}},
                                        {text: 'Respuesta', width: 200, dataIndex: 'respuesta', align: 'center', filter: {type: 'string'}},
                                        {text: 'Fecha Creación', width: 250, dataIndex: 'fecha_creacion', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                        {text: 'Fecha Envio', width: 250, dataIndex: 'fecha_envio', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                        {text: 'Estado', width: 250, dataIndex: 'estado', align: 'center', filter: {type: 'string'}}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                if (storeDataComandos.getCount() > 0) {
                                                    exportExcelEventos(gridDataComandos, "Reporte de Comandos ", "nameSheet", "Reporte de Comandos de la " + empresaComandos + "-" + placacomandos + " Desde " + dateStartComan + "|" + dateFinishComan + " ");
                                                }
                                            }
                                        }]
                                });
                                var tabComandos = Ext.create('Ext.container.Container', {
                                    title: '<div id="titulosForm">CMD Enviados ' + empresaComandos + " : " + placacomandos + '</div>',
                                    closable: true,
                                    iconCls: 'icon-cmd-hist',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 8000,
                                    region: 'center',
                                    items: [gridDataComandos]
                                });
                                panelTabMapaAdmin.add(tabComandos);
                                panelTabMapaAdmin.setActiveTab(tabComandos);
                                winComandos.hide();
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
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winComandos.hide();
                }
            }]
    });
});
function  ventanaCmdHistorialPredefinido() {
    if (!winComandos) {
        winComandos = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'CMD Enviados',
            iconCls: 'icon-cmd-hist',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formComandos
        });
    }
    winComandos.show();
    formComandos.getForm().reset();
    if (idRolKarview == 3) {
        Ext.getCmp('cr1').disable();
        Ext.getCmp('cr2').setValue(true);
    } else {
        Ext.getCmp('cr2').setValue(true);
    }
}