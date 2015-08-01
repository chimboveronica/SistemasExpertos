var winAdminEvento;
var formAdminEvento;
var gridAdminEvento;

Ext.onReady(function () {
    Ext.define('DataEvent', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id', type: 'int'},
            {name: 'evento', type: 'int'},
            {name: 'parametro', type: 'int'},
            {name: 'sky_evento', type: 'string'},
            {name: 'acronimo', type: 'string'},
            {name: 'color', type: 'string'},
            {name: 'observacion', type: 'string'},
            {name: 'mensaje', type: 'string'}
        ]
    });

    var gridStoreEvento = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataEvent',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/Eventos/read.php',
                create: 'php/administracion/Eventos/create.php',
                update: 'php/administracion/Eventos/update.php'
//                destroy: 'php/administracion/usuario/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'evento',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    gridAdminEvento.getStore().rejectChanges();
                    if (operation.getRequest().getInitialConfig(['action']) !== 'destroy') {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }
        },
        listeners: {
            write: function (store, operation, eOpts) {
//                onResetUser();
                if ((operation.getRequest().getInitialConfig(['action']) === 'create') ||
                        (operation.getRequest().getInitialConfig(['action']) === 'update'))
                {
                    gridStoreEvento.reload();
                }
                messageInformationEffect(operation.getResultSet().message);
            },
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    gridAdminEvento.setTitle('Registros: ' + records.length);
                }
            }
        }
    });
    gridAdminEvento = Ext.create('Ext.grid.Panel', {
        plugins: 'gridfilters',
        region: 'center',
        store: gridStoreEvento,
        title: 'Registros',
        tbar: [{
                text: 'Exportar a Excel',
                iconCls: 'icon-excel',
                handler: function () {
                    exportExcelEventos(gridAdminEvento, 'Evento', 'Registro Evento', 'Acronimo', 'Color', 'Mensaje');
                }
            }
        ],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 50, align: 'center'}),
            {text: "Evento", width: 60, align: 'center', dataIndex: 'evento', filter: true},
            {text: "Parámetro", width: 80, align: 'center', dataIndex: 'parametro', filter: true},
            {text: "Nombre Evento", width: 350, dataIndex: 'id', filter: true, renderer: formatEvento},
            {text: "Acrónimo", width: 125, dataIndex: 'acronimo', filter: true},
            {text: "Color", width: 150, align: 'center', dataIndex: 'color'},
            {text: "Observaciòn", width: 200, align: 'center', dataIndex: 'observacion', filter: {type: 'string'}},
            {text: "Mensaje", width: 150, align: 'center', dataIndex: 'mensaje', filter: {type: 'string'}}
        ],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordEvent(selected);
            }
        },
        viewConfig: {
            loadingText: 'Cargando...'
        }
    });
    formAdminEvento = Ext.create('Ext.form.Panel', {
        region: 'east',
        scrollable: true,
        split: true,
        title: 'Formulario Eventos',
        width: '45%',
        bodyPadding: 5,
        collapsible: true,
        dockedItems: [{
                ui: 'footer',
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', {
                        text: 'Actualizar',
                        tooltip: 'Actualizar',
                        disabled: true,
                        iconCls: 'icon-update',
                        itemId: 'update',
                        handler: onUpdateUser
                    }, {
                        text: 'Crear',
                        tooltip: 'Crear',
                        iconCls: 'icon-add',
                        itemId: 'create',
                        handler: onCreateEvento
                    }, /*{
                     tooltip: 'Eliminar',
                     disabled: true,
                     iconCls: 'icon-delete',
                     itemId: 'delete',
                     handler: onDeleteUser
                     }, */{
                        tooltip: 'Limpiar Campos',
                        iconCls: 'icon-cleans',
                        handler: onResetEvento
                    }, {
                        tooltip: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function () {
                            winAdminEvento.hide();
                        }
                    }]
            }],
        fieldDefaults: {
            anchor: '100%',
            enforceMaxLength: true
        },
        items: [
            {
                xtype: 'textfield',
                afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                allowBlank: false,
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Evento...',
                fieldLabel: 'Nombre Evento',
                name: 'sky_evento',
                maxLength: 50,
                minLength: 3,
                minLengthText: INFOMESSAGEMINLENGTH
            },
            {
                xtype: 'textfield',
                afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                allowBlank: false,
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Evento...',
                fieldLabel: 'Evento',
                name: 'evento',
                minLengthText: INFOMESSAGEMINLENGTH,
                vtype: 'num'
            },
            {
                xtype: 'textfield',
                afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                allowBlank: false,
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Parámetro...',
                fieldLabel: 'Parámetro',
                name: 'parametro',
                vtype: 'num'
            },
            {
                xtype: 'textfield',
                emptyText: 'Ingresar Acrónimo...',
                fieldLabel: 'Acrónimo',
                maxLength: 15,
                minLength: 3,
                name: 'acronimo',
                minLengthText: INFOMESSAGEMINLENGTH
            },
            {
                layout: 'column',
                baseCls: 'x-plain',
                itemId: 'placaCon',
                items: [{
                        columnWidth: .8,
                        baseCls: 'x-plain',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Color',
                                itemId: 'idcolor',
                                tooltip: 'Seleccione Color',
                                name: 'color',
                                allowBlank: false,
                                inputType: 'color',
                                minLengthText: INFOMESSAGEMINLENGTH,
                                width: 200,
                                onChange: function (color) {
                                     Ext.getCmp('bt').setStyle('background',color);
                                }
                            }
                        ]
                    },
                    {
                        baseCls: 'x-plain',
                        items: [
                            {xtype: 'button',
                                id:'bt',
                                style: {
                                    background: '#f70606',
                                    borderStyle: '#000000'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'textfield',
                emptyText: 'Ingresar Observación...',
                fieldLabel: 'Observación',
                name: 'observacion',
                maxLength: 50,
                minLength: 3,
                minLengthText: INFOMESSAGEMINLENGTH
            },
            {
                xtype: 'textfield',
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Mensaje...',
                fieldLabel: 'Mensaje',
                name: 'mensaje',
                maxLength: 50,
                minLength: 3,
                minLengthText: INFOMESSAGEMINLENGTH,
            }
        ],
        listeners: {
            create: function (form, data) {
                gridStoreEvento.insert(0, data);
            }
        }
    });
});

function showWinAdminEvento() {
    if (!winAdminEvento) {
        winAdminEvento = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Eventos',
            iconCls: 'icon-user',
            resizable: false,
            width: 790,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminEvento,
                        formAdminEvento
                    ]
                }]
        });
    }
    onResetEvento();
    winAdminEvento.show();
}

function setActiveRecordEvent(selected) {
    formAdminEvento.down('#update').setDisabled(!selected.length);
    formAdminEvento.down('#create').setDisabled(selected.length);
    if (selected.length > 0) {
        formAdminEvento.getForm().loadRecord(selected[0]);
    }
}


function onUpdateUser() {
    var form = formAdminEvento.getForm();
    if (form.isValid()) {
        form.updateRecord(formAdminEvento.activeRecord);
        onResetEvento();
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}


function onCreateEvento() {
    var form = formAdminEvento.getForm();
    if (form.isValid()) {
        formAdminEvento.fireEvent('create', formAdminEvento, form.getValues());
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onResetEvento() {
    gridAdminEvento.getStore().rejectChanges();
    formAdminEvento.getForm().reset();
    gridAdminEvento.getView().deselect(gridAdminEvento.getSelection());
}

//function onDeleteUser() {
//    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el Usuario', function (choice) {
//        if (choice === 'yes') {
//            var selection = gridAdminUser.getView().getSelectionModel().getSelection()[0];
//            if (selection) {
//                gridAdminUser.store.remove(selection);
//                formAdminUser.down('#update').disable();
//                formAdminUser.down('#create').enable();
//            }
//        }
//    });
//}
