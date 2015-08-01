var formCelular;
var winusuario_celular;
var storeCelularUser;
var gridAdminCelular;
var listaCelularUser = [];
function ventanaActualizarCelular() {
    if (!winusuario_celular) {
        winusuario_celular = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Actualizar Celular',
            iconCls: 'icon-telef',
            resizable: false,
            width: 280,
            height: 300,
            closeAction: 'hide',
            items: [metodoCelular(celular)]
        });
    }
    formCelular.getForm().reset();
    winusuario_celular.show();
}

function metodoCelular(celular) {
    Ext.define('Employee', {
        extend: 'Ext.data.Model',
        fields: [
            'celular'
        ]
    });
    storeCelularUser = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        model: 'Employee',
        proxy: {
            type: 'memory'
        },
        data: listaCelularUser,
        sorters: [{
                property: 'start',
                direction: 'ASC'
            }]
    });
    if (celular !== "") {
        listaCelularUser = celular.split(',');
        for (var i = 0; i < listaCelularUser.length; i++) {
            var r = Ext.create('Employee', {
                celular: listaCelularUser[i]
            });
            storeCelularUser.insert(0, r);
        }
    }
    var rowEditingCelular = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1,
        autoCancel: false,
        saveBtnText: 'Guardar',
        cancelBtnText: 'Cancelar'

    });
    var columns = [
        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
        {header: '<center><b>Celular</b><center>', dataIndex: 'celular', width: 220,
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                blankText: INFOMESSAGEBLANKTEXT,
                name: 'celular',
                maxLength: 10,
                vtype: 'numeroTelefono'

            }}
    ];
    gridAdminCelular = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: storeCelularUser,
        width: 250,
        enableDragDrop: true,
        stripeRows: true,
        height: 300,
        tbar: ["  ", "   ", {text: '<b>Agregar</b>', iconCls: 'icon-add',
                handler: function () {
                    rowEditingCelular.cancelEdit();
                    var celularUser = Ext.create('Employee', {
                        celular: '0900000000'
                    });
                    storeCelularUser.insert(0, celularUser);
                    rowEditingCelular.startEdit(storeCelularUser.data.items.length - 1, 0);

                }
            }, {itemId: 'removeEmployee', text: '<b>Remover</b>', iconCls: 'icon-delete',
                handler: function () {
                    var sm = gridAdminCelular.getSelectionModel();
                    rowEditingCelular.cancelEdit();
                    storeCelularUser.remove(sm.getSelection());
                    if (storeCelularUser.getCount() > 0) {
                        sm.select(0);
                    }
                },
                disabled: true
            }],
        columns: columns,
        plugins: [rowEditingCelular],
        listeners: {
            selectionchange: function (view, records) {
                gridAdminCelular.down('#removeEmployee').setDisabled(!records.length);
            }
        }
    });

    formCelular = Ext.create('Ext.form.Panel', {
        height: 300,
        margins: '0 2 0 0',
        width: 150,
        autoScroll: true,
        items: [
            gridAdminCelular
        ],
        dockedItems: [{
                ui: 'footer',
                xtype: 'toolbar',
                dock: 'bottom',
                items: ["   ", "   ", "   ", {
                        text: 'Guardar',
                        tooltip: 'Guardar ',
                        iconCls: 'icon-save',
                        handler: onCreateCelular
                    }, {
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function () {
                            winusuario_celular.hide();
                        }
                    }]
            }]
    });
    return  formCelular;
}
function onCreateCelular() {
    var formVeh = Ext.create('Ext.form.Panel', {});
    var form = formVeh.getForm();
    if (form.isValid()) {
        form.submit({
            url: './php/usuario/modificar_celular.php',
            params: {
                celular: obtenerCelular()
            },
            success: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Mensaje',
                    msg: action.result.msg,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                winusuario_celular.hide();
            },
            failure: function (form, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        Ext.MessageBox.show({
                            title: 'Mensaje',
                            msg: 'Verifique su conexión a la internet,<br>no hay conexión con el servidor.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        formCelular.getForm().reset();
                        break;
                    case Ext.form.action.Action.SERVER_INVALID:
                        Ext.MessageBox.show({
                            title: 'Mensaje',
                            msg: action.result.msg,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        break;
                }
            }
        });
    }
}

function obtenerCelular() {
    var aux;
    if (storeCelularUser.data.length > 0) {
        if (storeCelularUser.data.length > 1) {
            for (var i = 0; i < storeCelularUser.data.length - 1; i++) {
                if (i === 0) {
                    aux = storeCelularUser.getAt(i).data.celular + ',';
                } else {
                    aux = aux + storeCelularUser.getAt(i).data.celular+ ',';
                }
            }
            aux = aux + storeCelularUser.getAt(storeCelularUser.data.length - 1).data.celular;
        } else {
            aux = storeCelularUser.getAt(0).data.celular;
        }
    }
    return aux;
}