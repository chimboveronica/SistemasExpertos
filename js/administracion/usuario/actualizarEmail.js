var formCorreo;
var winusuario_email;
var emailValido;
var emailConfir;
var email;
var storeCorreoUser;
var gridAdminCorreos;
var listaCorreosUser = [];
function ventanaActualizarEmail() {
    if (!winusuario_email) {
        winusuario_email = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Actualizar Correo',
            iconCls: 'icon-email ',
            resizable: false,
            width: 280,
            height: 300,
            closeAction: 'hide',
            items: [metodo(correo)]
        });
    }
    formCorreo.getForm().reset();
    winusuario_email.show();
}

function metodo(correo) {
    Ext.define('Employee', {
        extend: 'Ext.data.Model',
        fields: [
            'correo'
        ]
    });
    storeCorreoUser = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        model: 'Employee',
        proxy: {
            type: 'memory'
        },
        data: listaCorreosUser,
        sorters: [{
                property: 'start',
                direction: 'ASC'
            }]
    });
    if (correo !== "") {
        storeCorreoUser.removeAll();
        listaCorreosUser = correo.split(',');
        for (var i = 0; i < listaCorreosUser.length; i++) {
            var r = Ext.create('Employee', {
                correo: listaCorreosUser[i]
            });
            storeCorreoUser.insert(0, r);
        }
    }
    var rowEditingCorreoUser = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1,
        autoCancel: true,
        saveBtnText: 'Guardar',
        cancelBtnText: 'Cancelar'

    });
    var columns = [
        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
        {header: '<center><b>Correo</b><center>', dataIndex: 'correo', width: 220,
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                blankText: INFOMESSAGEBLANKTEXT,
                name: 'correo',
                maxLength: 45,
                vtype: 'email'

            }}
    ];
    gridAdminCorreos = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: storeCorreoUser,
        width: 250,
        enableDragDrop: true,
        stripeRows: true,
        height: 300,
        tbar: ["  ", "   ", {text: '<b>Agregar</b>', iconCls: 'icon-add',
                handler: function () {
                    rowEditingCorreoUser.cancelEdit();
                    var correoUser = Ext.create('Employee', {
                        correo: 'kradac@kradac.com'
                    });
                    storeCorreoUser.insert(0, correoUser);
                    rowEditingCorreoUser.startEdit(storeCorreoUser.data.items.length - 1, 0);

                }
            }, {itemId: 'removeEmployee', text: '<b>Remover</b>', iconCls: 'icon-delete',
                handler: function () {
                    var sm = gridAdminCorreos.getSelectionModel();
                    rowEditingCorreoUser.cancelEdit();
                    storeCorreoUser.remove(sm.getSelection());
                    if (storeCorreoUser.getCount() > 0) {
                        sm.select(0);
                    }
                },
                disabled: true
            }],
        columns: columns,
        plugins: [rowEditingCorreoUser],
        listeners: {
            selectionchange: function (view, records) {
                gridAdminCorreos.down('#removeEmployee').setDisabled(!records.length);
            }
        }
    });

    formCorreo = Ext.create('Ext.form.Panel', {
        height: 300,
        margins: '0 2 0 0',
        width: 150,
        autoScroll: true,
        items: [
            gridAdminCorreos
        ],
        dockedItems: [{
                ui: 'footer',
                xtype: 'toolbar',
                dock: 'bottom',
                items: ["   ", "   ", "   ", {
                        text: 'Guardar',
                        tooltip: 'Guardar Correos',
                        iconCls: 'icon-save',
                        handler: onCreateCorreoUser
                    }, {
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function () {
                            winusuario_email.hide();
                        }
                    }]
            }]
    });
    return  formCorreo;
}
function onCreateCorreoUser() {
    var formVeh = Ext.create('Ext.form.Panel', {});
    var form = formVeh.getForm();
    if (form.isValid()) {
        form.submit({
            url: './php/usuario/modificar_email.php',
            params: {
                correo: obtenerCorreoUser()
            },
            success: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Mensaje',
                    msg: action.result.msg,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                winusuario_email.hide();
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
                        formCorreo.getForm().reset();
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

function obtenerCorreoUser() {
    var aux;
    if (storeCorreoUser.data.length > 0) {
        if (storeCorreoUser.data.length> 1) {
            for (var i = 0; i < storeCorreoUser.data.length - 1; i++) {
                if (i === 0) {
                    aux = storeCorreoUser.getAt(i).data.correo + ',';
                } else {
                    aux = aux + storeCorreoUser.getAt(i).data.correo + ',';
                }
            }
            aux = aux + storeCorreoUser.getAt(storeCorreoUser.data.length - 1).data.correo;
        } else {
            aux = storeCorreoUser.getAt(0).data.correo;
        }
    }
    return aux;
}