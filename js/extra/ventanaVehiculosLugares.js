var panelVehiculosLugares;
var winVehiculosLugares;
var gridVehiculos;
var isLugar = false;

Ext.onReady(function () {

    var btn_geocercasHoy = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            date.setValue(nowDate);
        }
    });
    var bt_GeocercasAyer = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            date.setValue(yestDate);
        }
    });
    var panel_BotonesMantenimiento = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 2 0',
        defaults: {
            margin: '0 2 0 0'
        },
        items: [btn_geocercasHoy, bt_GeocercasAyer]
    });

    var date = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Fecha',
        format: 'Y-m-d',
        name: 'fecha',
        value: new Date(),
        allowBlank: false,
        emptyText: 'Fecha de Busqueda...'
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var storeVehLugares = Ext.create('Ext.data.JsonStore', {
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['idEquipo','idEquipoV' ,'fecha_hora', 'velocidad', 'latitud', 'longitud', 'bateria', 'ign', 'gsm', 'gps2', 'G2']
    });

    gridVehiculos = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Vehículos Encontrados</center>',
        store: storeVehLugares,
        columnLines: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 60}),
            {text: '<b>Equipo</b>', width: 100, dataIndex: 'idEquipoV', align: 'center'},
            {text: '<b>Fecha</b>', xtype: 'datecolumn', format: 'd-m-Y', width: 100, dataIndex: 'fecha_hora', align: 'center'},
            {text: '<b>Hora</b>', xtype: 'datecolumn', format: 'H:i:s', width: 100, dataIndex: 'fecha_hora', align: 'center'},
            {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 100, renderer: formatSpeed},
            {text: '<b>Batería</b>', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
            {text: '<b>GSM</b>', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
            {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
            {text: '<b>Vehículo(IGN)</b>', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
        ],
        listeners: {
            itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                e.stopEvent();
                Ext.create('Ext.menu.Menu', {
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                            text: 'Ver Ubicación en el Mapa',
                            disabled: false,
                            handler: function (widget, event) {
                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                            }
                        })
                    ]
                }).showAt(e.getXY());
                return false;
            }
        }
    });

    panelVehiculosLugares = Ext.create('Ext.form.Panel', {
        padding: '2 2 2 2',
        layout: 'border',
        items: [{
                region: 'north',
                xtype: 'form',
                frame: true,
                items: [date, timeIni, timeFin],
                buttons: [panel_BotonesMantenimiento, , '->', {
                        text: 'Trazar Lugar',
                        iconCls: 'icon-trazar',
                        handler: function () {
                            if (this.up('form').getForm().isValid()) {
                                drawRouteMapa = true;
                                vehiLugares = true;
                                drawLine.activate();
                                winVehiculosLugares.hide();
                            }
                        }
                    }]
            }, gridVehiculos]
    });
});

function ventanaVehLugares() {
    if (!winVehiculosLugares) {
        winVehiculosLugares = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Vehículos en Lugares',
            iconCls: 'icon-vehiculos_lugar',
            resizable: false,
            width: 650,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [panelVehiculosLugares]
        });
    }
    panelVehiculosLugares.getForm().reset();
    gridVehiculos.getStore().removeAll();
    winVehiculosLugares.show();
}