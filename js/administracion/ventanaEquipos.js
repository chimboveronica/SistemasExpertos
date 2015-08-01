var winAdminDevice;
var formAdminDevice;
var gridAdminDevice;


Ext.onReady(function () {
    Ext.define('DataDevice', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idDevice', type: 'int'},
            {name: 'idTypeDevice', type: 'int'},
            {name: 'deviceDevice', type: 'string'},
            {name: 'serieDevice', type: 'string'},
            {name: 'numberChipDevice', type: 'string'},
            {name: 'imeiChipDevice', type: 'string'},
            {name: 'typeDevice', type: 'string'},
            {name: 'idDistribuidor1', type: 'int'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataDevice',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/diviceAdministrador/read.php',
                create: 'php/administracion/diviceAdministrador/create.php',
                update: 'php/administracion/diviceAdministrador/update.php',
                destroy: 'php/administracion/diviceAdministrador/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function (store, operation, eOpts) {
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    gridStore.reload();
                    store_equipo.reload();
                    if (operation.state) {
                        formAdminDevice.getForm().reset();
                        store_equipo.reload();
                    }
                }
            }
        }
    });

    gridAdminDevice = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Equipo", width: 100, sortable: true, dataIndex: 'deviceDevice', filter: {type: 'string'}, align: 'center'},
            {header: "Tipo de equipo", width: 150, sortable: true, dataIndex: 'typeDevice', filter: {type: 'list', store: storetipo_equipo_vehiculo}, align: 'center'},
            {header: "Serie", width: 150, sortable: true, dataIndex: 'serieDevice', filter: {type: 'string'}},
            {header: "Número de Chip", width: 150, sortable: true, dataIndex: 'numberChipDevice', filter: {type: 'string'}},
            {header: "Imei de Chip", width: 150, sortable: true, dataIndex: 'imeiChipDevice', filter: {type: 'string'}},
            {header: "Estado", width: 100, sortable: true, dataIndex: 'id', renderer: formatEstadoEquipo, filter: {type: 'string'}}

        ],
        stripeRows: true,
        margins: '0 2 0 0',
        region: 'center',
        title: 'Registros',
        plugins: 'gridfilters',
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function () {
                    exportExcelEventos(gridAdminDevice, "Registros de Equipos", "Datos", "Registros de Equipos");
                }
            }],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordDevice(selected[0] || null);
            }
        }
    });

    formAdminDevice = Ext.create('Ext.form.Panel', {
        region: 'east',
        title: 'Ingresar datos del equipo',
        activeRecord: null,
        bodyPadding: 5,
        width: '45%',
        scrollable: true,
        split: true,
        collapsible: true,
        defaultType: 'textfield',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [{
                xtype: 'combobox',
                fieldLabel: 'Tipo de equipo',
                afterLabelTextTpl: required,
                blankText: 'Este campo es Obligatorio',
                name: 'idTypeDevice',
                store: storetipo_equipo_vehiculo,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                editable: false,
                allowBlank: false,
                emptyText: 'Seleccionar Opción...'
            }, {
                fieldLabel: 'Equipo',
                afterLabelTextTpl: required,
                blankText: 'Este campo es Obligatorio',
                vtype: 'alphauppernum',
                name: 'deviceDevice',
                maxLength: 20,
                minLength: 2,
                allowBlank: false,
                allowOnlyWhitespace: false,
                emptyText: 'Ingresar nombre de Equipo...',
            }, {
                fieldLabel: 'Serie',
                name: 'serieDevice',
                maxLength: 25,
                minLength: 3,
                emptyText: 'Ingresar Serie de Equipo...',
                vtype: 'alphauppernum',
            }, {
                fieldLabel: 'Número de Chip',
                name: 'numberChipDevice',
                maxLength: 20,
//                vtype: 'telefonocelular',
                emptyText: 'Ingresar Número de Chip...',
            }, {
                fieldLabel: 'Imei de Chip',
                name: 'imeiChipDevice',
                maxLength: 25,
//                vtype: 'num',
                emptyText: 'Ingresar Imei de Chip...',
            }, {
                collapsible: true,
                defaultType: 'textfield',
                anchor: '100%',
                items: [{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        padding: '0 0 10 50',
                        items: [
                            {boxLabel: 'No', name: 'ids', inputValue: 1, checked: true},
                            {boxLabel: 'Si', name: 'ids', inputValue: 2}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (newValue['ids']) {
                                    case 1:
                                        Ext.getCmp('txt-user1').disable();
                                        break;
                                    case 2:
                                        Ext.getCmp('txt-user1').enable();
                                        break;
                                }
                            }
                        }
                    }, {
                        allowBlank: false,
                        id: 'txt-user1',
                        blankText: INFOMESSAGEBLANKTEXT,
                        displayField: 'text',
                        emptyText: 'Seleccionar Persona...',
                        fieldLabel: 'Persona',
                        forceSelection: true,
                        anchor: '100%',
                        listConfig: {
                            minWidth: 300
                        },
                        margin: '0 5 5 0',
                        name: 'idDistribuidor1',
                        maxLength: 90,
                        queryMode: 'local',
                        store: storePersonaDistribuidor,
                        valueField: 'id',
                        width: 400,
                        xtype: 'combobox'
                    }
                ],
                title: '<b>Establecer Persona Distribuidor</b>',
                xtype: 'fieldset'
            }],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
                store_equipo.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        tooltip: 'Actualizar',
                        handler: onUpdateDevice
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateDevice
                    },
//                    {
//                        iconCls: 'icon-delete',
//                        text: 'Eliminar',
//                        disabled: true,
//                        itemId: 'delete',
//                        scope: this,
//                        tooltip: 'Eliminar Usuario',
//                        handler: onDeleteDevice
//                    }, 
                    {
                        iconCls: 'icon-cleans',
                        //text: 'Limpiar',
                        tooltip: 'Limpiar Campos',
                        handler: onResetDevice
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminDevice.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminDevice() {
    if (!winAdminDevice) {
        winAdminDevice = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Equipos',
            iconCls: 'icon-credits',
            resizable: false,
            width: 790,
            height: 380,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminDevice,
                        formAdminDevice
                    ]
                }]
        });
    }
    onResetDevice();
    winAdminDevice.show();
    storetipo_equipo_vehiculo.reload();
    store_equipo.reload();
    Ext.getCmp('txt-user1').disable();
}

function setActiveRecordDevice(record) {
    formAdminDevice.activeRecord = record;
    if (record) {
        formAdminDevice.down('#update').enable();
//        formAdminDevice.down('#delete').enable();
        formAdminDevice.down('#create').disable();
        formAdminDevice.getForm().loadRecord(record);
    } else {
        formAdminDevice.down('#update').disable();
        formAdminDevice.getForm().reset();
    }
}

function onUpdateDevice() {
    var form = formAdminDevice.getForm();
    if (form.isValid()) {
        store_equipos.reload();
        form.updateRecord(formAdminDevice.activeRecord);
        onResetDevice();
        Ext.getCmp('txt-user1').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onCreateDevice() {
    var form = formAdminDevice.getForm();
    if (form.isValid()) {
        formAdminDevice.fireEvent('create', formAdminDevice, form.getValues());
        formAdminDevice.down('#update').disable();
        form.reset();
        store_equipo.reload();
        store_equipos.reload();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetDevice() {
    setActiveRecordDevice(null);
//    formAdminDevice.down('#delete').disable();
    formAdminDevice.down('#create').enable();
    formAdminDevice.getForm().reset();
    Ext.getCmp('txt-user1').disable();
}

function onDeleteDevice() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el Equipo', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminDevice.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                Ext.example.msg("Atención", 'Para hacer esta Operacion Consulte con el Administrador ');
            }
        }
    });
}
