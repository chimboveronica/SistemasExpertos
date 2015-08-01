var winAdminUser;
var formAdminUser;
var gridAdminUser;

Ext.onReady(function () {
    Ext.define('DataUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUser', type: 'int'},
            {name: 'idRolUser', type: 'int'},
            {name: 'idCompanyUser', type: 'int'},
            {name: 'idPersonUser', type: 'int'},
            {name: 'personUser', type: 'string'},
            {name: 'userUser', type: 'string'},
            {name: 'passwordUser', type: 'string'},
            {name: 'activeUser', type: 'int'},
            {name: 'documentPersonUser', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataUser',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/usuario/read.php',
                create: 'php/administracion/usuario/create.php',
                update: 'php/administracion/usuario/update.php',
//                destroy: 'php/administracion/usuario/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'usuarios',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    gridAdminUser.getStore().rejectChanges();
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
                onResetUser();
                if ((operation.getRequest().getInitialConfig(['action']) === 'create') ||
                        (operation.getRequest().getInitialConfig(['action']) === 'update')) {
                    gridStore.reload();
                }
                messageInformationEffect(operation.getResultSet().message);
            },
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    gridAdminUser.setTitle('Registros: ' + records.length);
                }
            }
        }
    });

    gridAdminUser = Ext.create('Ext.grid.Panel', {
        plugins: 'gridfilters',
        region: 'center',
        store: gridStore,
        title: 'Registros',
        tbar: [{
                text: 'Exportar a Excel',
                iconCls: 'icon-excel',
                handler: function () {
                    exportExcelEventos(gridAdminUser, 'Registros de Usuarios', 'Usuarios', 'Registros de Usuarios');
                }
            }, {
                text: 'Habilitar',
                tooltip: 'Habilitar el acceso al Sistema',
                disabled: true,
                iconCls: 'icon-unlock',
                itemId: 'habilitar',
                handler: function () {
                    gridAdminUser.getSelection()[0].set('activeUser', 1);
                }
            }, {
                text: 'Bloquear',
                tooltip: 'Bloquear el acceso al Sistema',
                disabled: true,
                iconCls: 'icon-lock',
                itemId: 'deshabilitar',
                handler: function () {
                    gridAdminUser.getSelection()[0].set('activeUser', 0);
                }
            }
        ],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: "Cédula", width: 100, dataIndex: 'documentPersonUser', filter: true},
            {text: "Persona", width: 200, dataIndex: 'personUser', filter: true},
            {text: "Usuario", width: 125, dataIndex: 'userUser', filter: true},
            {text: "Rol de Usuario", width: 150, align: 'center', dataIndex: 'idRolUser', renderer: formatRolUs},
            {text: "Organización", width: 150, align: 'center', dataIndex: 'idCompanyUser', renderer: formatComp},
            {text: "Estado", width: 100, align: 'center', dataIndex: 'activeUser', renderer: formatActiveUser, filter: {type: 'list', store: storeActiveUserList}}
        ],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordUser(selected);
            }
        },
        viewConfig: {
            loadingText: 'Cargando...'
        }
    });

    formAdminUser = Ext.create('Ext.form.Panel', {
        region: 'east',
        scrollable: true,
        split: true,
        title: 'Formulario',
        width: '45%',
        bodyPadding: 5,
        collapsible: true,
        defaultType: 'textfield',
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
                        handler: onUpdateUsuario
                    }, {
                        text: 'Crear',
                        tooltip: 'Crear',
                        iconCls: 'icon-add',
                        itemId: 'create',
                        handler: onCreateUsuario
                    }, /*{
                     tooltip: 'Eliminar',
                     disabled: true,
                     iconCls: 'icon-delete',
                     itemId: 'delete',
                     handler: onDeleteUser
                     }, */{
                        tooltip: 'Limpiar Campos',
                        iconCls: 'icon-cleans',
                        handler: onResetUser
                    }, {
                        tooltip: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function () {
                            winAdminUser.hide();
                        }
                    }]
            }],
        fieldDefaults: {
            anchor: '100%',
            enforceMaxLength: true
        },
        items: [
            {
                afterLabelTextTpl: INFOMESSAGEREQUERID,
                allowBlank: false,
                blankText: INFOMESSAGEBLANKTEXT,
                displayField: 'nombre',
                editable: false,
                emptyText: 'Seleccionar Rol de Usuario...',
                fieldLabel: 'Rol de Usuario',
                listeners: {
                    change: function (thisObj, newValue, oldValue, eOpts) {
                        if (newValue === '1') {
                            formAdminUser.down('[name=idCompanyUser]').setValue(1);
                            formAdminUser.down('[name=idCompanyUser]').setVisible(false);
                        } else {
                            formAdminUser.down('[name=idCompanyUser]').reset();
                            formAdminUser.down('[name=idCompanyUser]').setVisible(true);
                        }
                    }
                },
                name: 'idRolUser',
                queryMode: 'local',
                store: storRoles,
                valueField: 'id',
                xtype: 'combobox'
            },
            {
                afterLabelTextTpl: INFOMESSAGEREQUERID,
                allowBlank: false,
                blankText: INFOMESSAGEBLANKTEXT,
                displayField: 'text',
                editable: false,
                emptyText: 'Seleccionar Empresa...',
                fieldLabel: 'Empresa',
                name: 'idCompanyUser',
                queryMode: 'local',
                store: storeEmpresas,
                valueField: 'id',
                xtype: 'combobox'
            }, {
                items: [{
                        afterLabelTextTpl: INFOMESSAGEREQUERID,
                        allowBlank: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                        displayField: 'text',
                        emptyText: 'Seleccionar Persona...',
                        fieldLabel: 'Persona',
                        forceSelection: true,
                        listConfig: {
                            minWidth: 320
                        },
                        margin: '0 5 5 0',
                        name: 'idPersonUser',
                        maxLength: 90,
                        queryMode: 'local',
                        store: storePersonas,
                        valueField: 'id',
                        width: 307,
                        xtype: 'combobox'
                    }, {
                        xtype: 'button',
                        tooltip: 'Administración de Personal',
                        iconCls: 'icon-personal',
                        handler: showWinAdminPerson
                    }],
                layout: 'hbox',
                xtype: 'panel'
            }, {
                afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                allowBlank: false,
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Usuario...',
                fieldLabel: 'Usuario',
                name: 'userUser',
                maxLength: 20,
                minLength: 3,
                minLengthText: INFOMESSAGEMINLENGTH,
                vtype: 'alphanum'
            }, {
                collapsible: true,
                defaultType: 'textfield',
                items: [{
                        id: 'rg-set-password',
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        padding: '0 0 10 50',
                        items: [
                            {boxLabel: 'No', name: 'rbpass', inputValue: 1, checked: true},
                            {boxLabel: 'Si', name: 'rbpass', inputValue: 2}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (newValue['rbpass']) {
                                    case 1:
                                        Ext.getCmp('txt-pass-user').disable();
                                        Ext.getCmp('txt-confirm-pass-user').disable();
                                        break;
                                    case 2:
                                        Ext.getCmp('txt-pass-user').enable();
                                        Ext.getCmp('txt-confirm-pass-user').enable();
                                        break;
                                }
                            }
                        }
                    }, {
                        afterLabelTextTpl: INFOMESSAGEREQUERID,
                        allowBlank: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                        disabled: true,
                        emptyText: 'Ingresar Contraseña...',
                        fieldLabel: 'Contraseña',
                        id: 'txt-pass-user',
                        inputType: 'password',
                        itemId: 'pass',
                        name: 'passwordUser',
                        maxLength: 45,
                        minLength: 5,
                        minLengthText: INFOMESSAGEMINLENGTH,
                        vtype: 'alphanum'
                    }, {
                        afterLabelTextTpl: INFOMESSAGEREQUERID,
                        allowBlank: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                        disabled: true,
                        emptyText: 'Ingresar Contraseña Nuevamente...',
                        fieldLabel: 'Confirmar Contraseña',
                        id: 'txt-confirm-pass-user',
                        initialPassField: 'pass',
                        inputType: 'password',
                        name: 'passwordUser',
                        maxLength: 45,
                        minLength: 5,
                        minLengthText: INFOMESSAGEMINLENGTH,
                        vtype: 'password'
                    }],
                title: '<b>Establecer Contraseña</b>',
                xtype: 'fieldset'
            }],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
            }
        }
    });
});

function showWinAdminUser() {
    if (!winAdminUser) {
        winAdminUser = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Usuarios',
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
                        gridAdminUser,
                        formAdminUser
                    ]
                }]
        });
    }
    onResetUser();
    winAdminUser.show();
}

function setActiveRecordUser(selected) {
    formAdminUser.down('#update').setDisabled(!selected.length);
    formAdminUser.down('#create').setDisabled(selected.length);
    if (selected.length > 0) {
        if (selected[0].get('activeUser') === 1) {
            gridAdminUser.down('#deshabilitar').enable();
            gridAdminUser.down('#habilitar').disable();
        } else {
            gridAdminUser.down('#habilitar').enable();
            gridAdminUser.down('#deshabilitar').disable();
        }
        formAdminUser.getForm().loadRecord(selected[0]);
    }
}


function onUpdateUsuario() {
    var form = formAdminUser.getForm();
    if (form.isValid()) {
        form.updateRecord(formAdminUser.activeRecord);
        onResetUser();
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onCreateUsuario() {
    var form = formAdminUser.getForm();
    if (form.isValid()) {
        if (parseInt(Ext.getCmp('rg-set-password').getChecked()[0].inputValue) === 1) {
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'Por favor, ingrese una contraseña para el usuario',
                icon: Ext.MessageBox.INFO,
                buttons: Ext.Msg.OK
            });
        } else {
            formAdminUser.fireEvent('create', formAdminUser, form.getValues());
        }
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onResetUser() {
    gridAdminUser.down('#deshabilitar').disable();
    gridAdminUser.down('#habilitar').disable();
    gridAdminUser.getStore().rejectChanges();
    formAdminUser.getForm().reset();
    gridAdminUser.getView().deselect(gridAdminUser.getSelection());
}

function onDeleteUser() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el Usuario', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminUser.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminUser.store.remove(selection);
                formAdminUser.down('#update').disable();
                formAdminUser.down('#create').enable();
            }
        }
    });
}
