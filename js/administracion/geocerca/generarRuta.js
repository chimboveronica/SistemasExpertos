var formWinRuta;
var winRuta;
var resultEditMapa;

Ext.onReady(function () {
    formWinRuta = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 10 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [
            {
                id: 'btnedit',
                iconCls: 'icon-add',
                xtype: 'button',
                value: 0,
                handler: function () {
                    if (drawRouteMapa === true) {
                        drawLineRuta.activate();
                        Ext.getCmp('btndelete').enable();
                    } else {
                        console.log('editar');
                        modifyLineRuta.activate();
                        modifyLineRuta.activate();
                        Ext.create('Ext.menu.Menu', {
                            width: 100,
                            floating: true, // usually you want this set to True (default)
                            renderTo: 'map', // usually rendered by it's containing componen
                            items: [{
                                    iconCls: 'icon-valid',
                                    text: 'Terminar',
                                    handler: function () {
                                        var listPoint = lines.features[0].geometry.getVertices();
                                        resultEditMapa = listPoint;
                                        modifyLineRuta.deactivate();
//                                        Ext.getCmp('btnedit').setIconCls("icon-add");
//                                        Ext.getCmp('btndelete').disable();
                                        winRuta.show();
                                    }
                                }]
                        }).show();
                        geosVertice = true;
                    }
                    winRuta.hide();
                }
            },
            {
                id: 'btndelete',
                iconCls: 'icon-delete',
                xtype: 'button',
                disabled: true,
                handler: function () {
                    lines.destroyFeatures();
//                    Ext.getCmp('btn-draw-edit-route').enable();
//                    Ext.getCmp('numberfield-point-route').reset();
//                    Ext.getCmp('btn-delete-route').disable();
//                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                    drawRouteMapa = true;
                }
            }

        ],
        buttons: [
            {
                text: 'Enviar',
                iconCls: 'icon-send-cmd',
                handler: function () {

                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winRuta.hide();
                }
            }]
    });


});

function ventRuta() {
    if (!winRuta) {
        winRuta = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Graficar Ruta',
            iconCls: 'icon-cmd',
            resizable: false,
            width: 350,
            height: 185,
            closeAction: 'hide',
            plain: false,
            items: formWinRuta,
            tools: [{
                    type: 'help',
                    tooltip: '<b>Atención...!!!</b><br>Los comandos enviados, interactuan directamente en el Vehículo</b> Realice esta operación con toda responsabilidad'
                }]
        });
    }
    formWinRuta.getForm().reset();
    winRuta.show();
    drawRouteMapa = true;
    Ext.getCmp('btnedit').setIconCls("icon-add");
}