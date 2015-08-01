Ext.Loader.setPath('Ext.ux', 'extjs/examples/ux');
var panelCentral;
var formGraficGeneral;
var panelCountByDevice;
var panelChartCountAccessByUser;
var panelChartCountByAsig;
var refresh = false;
var timeRefresh = 15;
var donut = false;
var chartCountTypeByDevice;
var chartCountByDevice;
var storeCountAccessByUser;
var storeCountExcesosVelocidad;
var storeCount;
var storeCountByDevice;
var chartCountExcesos;
var panelChartCountExcesos;
var chartCount;
var panelChartCount;
Ext.onReady(function () {
    var longAcces;
    storeCountAccessByUser = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/estadistica/estadisticaAdmin/getCountAccessByUser.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['persona', 'rol_usuario', 'empresa', 'usuario', 'total', 'ip', 'host', 'ultima_acces'],
           listeners: {
            load: function (thisObject, records, successful, eOpts) {
                if (records.length > 0) {
                    var pos_ini = records[0].data;
                    var mayor = pos_ini;
                    for (var i = 0; i < records.length; i++) {
                        var dat = records[i].data;
                        if (dat > pos_ini) {
                            mayor = dat;
                        }
                    }
                    longAcces = mayor + 5;
                }
            }
        }
    });
    var longExces;
    storeCountExcesosVelocidad = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/estadistica/estadisticaAdmin/getCountExcesosVelocidad.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['persona', 'reg_municipal', 'empresa', 'total', 'mayor60', 'mayor90'],
        listeners: {
            load: function (thisObject, records, successful, eOpts) {
                if (records.length > 0) {
                    var pos_ini = records[0].data;
                    var mayor = pos_ini;
                    for (var i = 0; i < records.length; i++) {
                        var dat = records[i].data;
                        if (dat > pos_ini) {
                            mayor = dat;
                        }
                    }
                    longExces = mayor + 5;
                }
            }
        }
    });
    var longTramas;
    storeCountByDevice = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/estadistica/estadisticaAdmin/getCountByDevice.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['idEquipo', 'reg_municipal','ultimaTrama','total', 'equipo'],
        listeners: {
            load: function (thisObject, records, successful, eOpts) {
                if (records.length > 0) {
                    var pos_ini = records[0].data;
                    var mayor = pos_ini;
                    for (var i = 0; i < records.length; i++) {
                        var dat = records[i].data;
                        if (dat > pos_ini) {
                            mayor = dat;
                        }
                    }
                    longTramas = mayor + 5;
                }
            }
        }

    });
    storeCountTypeByDevice = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'php/interface/estadistica/estadisticaAdmin/getCountTypeByDevice.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['evento', 'abv', 'total']
    });
    storeCount = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            //url: 'php/interface/estadistica/getCountDespachos.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['persona', 'reg_municipal', 'empresa', 'ruta', 'total']
    });
    //CHART
    chartCountAccessByUser = Ext.create('Ext.chart.Chart', {
        width: '100%',
        height: '100%',
        animate: true,
        shadow: true,
        store: storeCountAccessByUser,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                minimum: 0,
                maximum: longAcces,
                title: 'Cantidad de accesos',
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['usuario'],
                title: 'Usuarios',
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'usuario',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function (storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update("<b>Persona:</b> " + storeItem.get('persona') +
                                "<br><b>Empresa:</b> " + storeItem.get('empresa') +
                                "<br><b>Rol:</b> " + storeItem.get('rol_usuario') +
                                "<br><b>Accesos:</b> " + storeItem.get('total') +
                                "<br><b>Ultimo Acceso:</b> " + storeItem.get('ultima_acces'));
                    }
                },
                style: {
                    fill: '#0040FF'
                }
            }]
    });
    chartCountExcesos = Ext.create('Ext.chart.Chart', {
        width: '100%',
        height: '100%',
        animate: true,
        shadow: true,
        store: storeCountExcesosVelocidad,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                minimum: 0,
                maximum: longExces,
                title: 'Cantidad de Excesos de Velocidad',
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['reg_municipal'],
                title: 'Equipo',
                label: {
                    rotate: {
                        degrees: -30
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'reg_municipal',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function (storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update(
                                "<b>Persona:</b> " + storeItem.get('persona') +
                                "<br><b>Empresa</b>: " + storeItem.get('empresa') +
                                "<br><b>Veloc 60</b>: " + storeItem.get('mayor60') +
                                "<br><b>Veloc 90</b>: " + storeItem.get('mayor90') +
                                "<br><b>Total</b>: " + storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#0040FF'
                }
            }]
    });
    chartCountByDevice = Ext.create('Ext.chart.Chart', {
        width: '100%',
        height: '100%',
        animate: true,
        shadow: true,
        store: storeCountByDevice,
        autoscroll: true,
        axes: [{
                type: 'Numeric',
                position: 'left',
                minimum: 0,
                maximum: longTramas,
                fields: ['total'],
                title: 'Cantidad',
                grid: true,
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['reg_municipal'],
                title: 'Equipos',
                label: {
                    rotate: {
                        degrees: 270
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'reg_municipal',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function (storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update(
                                "<b>Vehículo:</b> " + storeItem.get('reg_municipal')+ 
                                "<br><b>Equipo:</b> " + storeItem.get('equipo')+ 
                                "<br><b>Ultima Trama:</b> " + storeItem.get('ultimaTrama')+ 
                                "<br><b>Cantidad</b>: "+ storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#0040FF'
                },
                listeners: {
                    itemclick: function (item, eOpts) {
                        Ext.getCmp('form-info').setTitle('Información de tramas por vehículo: ' + item.value[0]);
                        storeCountTypeByDevice.load({
                            params: {
                                idEquipo: item.value[0]
                            }
                        });
                    }
                }
            }]
    });
    var botonGrafica = Ext.create('Ext.Button', {
        text: 'Descargar como imagen',
        iconCls: 'icon-descargar',
//        renderTo: Ext.getBody(),
        handler: function () {
            Ext.MessageBox.confirm('Confirmar descarga', 'Descargar imagen ?', function (choice) {
                if (choice === 'yes') {
                    chartCountTypeByDevice.save({
                        type: 'image/png'
                    });
                }
            });
        }
    });
    chartCountTypeByDevice = Ext.create('Ext.chart.Chart', {
        width: '100%',
        height: '100%',
        animate: true,
        store: storeCountTypeByDevice,
        shadow: true,
        legend: {
            position: 'right'
        },
        insetPadding: 10,
        theme: 'Base:gradients',
        series: [{
                type: 'pie',
                field: 'total',
                showInLegend: true,
                donut: donut,
                tips: {
                    trackMouse: true,
                    renderer: function (storeItem, item) {
                        //calculate percentage.
                        var total = 0;
                        storeCountTypeByDevice.each(function (rec) {
                            total += rec.get('total');
                        });
                        this.setTitle(storeItem.get('evento'));
                        this.update('Porcentaje: ' + Math.round(storeItem.get('total') / total * 100) + '%<br>Total: ' + storeItem.get('total'));
                        botonGrafica.setVisible(true);
                    }
                },
                highlight: {
                    segment: {
                        margin: 20
                    }
                },
                label: {
                    field: 'abv',
                    display: 'rotate',
                    contrast: true,
                    font: '10px Arial'
                }
            }]
    });

    chartCount = Ext.create('Ext.chart.Chart', {
        width: 5000,
        height: 450,
        animate: true,
        shadow: true,
        store: storeCount,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                minimum: 0,
                maximum: 50,
                title: 'Cantidad de Despachos',
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['reg_municipal'],
                title: 'Equipo',
                label: {
                    rotate: {
                        degrees: 270
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'reg_municipal',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function (storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update("<b>Persona:</b> " + storeItem.get('persona') + "<br><b>Empresa</b>: " + storeItem.get('empresa') + "<br><b>Ruta</b>: " + storeItem.get('ruta') + "<br><b>Cantidad</b>: " + storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#0040FF'
                }
            }]
    });


    //PANEL
    panelChartCountAccessByUser = Ext.create('Ext.form.Panel', {
        title: 'Accesos diarios',
        iconCls: 'icon-user',
        region: 'center',
        width: '100%',
        scrollable: true,
        layout: 'hbox',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function () {
                    var task = Ext.create('Ext.util.DelayedTask', function () {
                        Ext.example.msg('Información', 'Datos recargados correctamente.');
                        storeCountAccessByUser.reload();
                    }, this);
                    task.delay(500);
                }
            }, {
                text: 'Descargar como imagen',
                iconCls: 'icon-descargar',
                handler: function () {
                    Ext.MessageBox.confirm('Confirmar descarga', 'Descargar imagen ?', function (choice) {
                        if (choice === 'yes') {
                            chartCountAccessByUser.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
        items: chartCountAccessByUser
    });
    panelChartCountExcesos = Ext.create('Ext.form.Panel', {
        title: 'Excesos de Velocidad',
        iconCls: 'icon-exceso-vel',
        region: 'center',
        width: '100%',
        scrollable: true,
        layout: 'hbox',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function () {
                    var task = Ext.create('Ext.util.DelayedTask', function () {
                        Ext.example.msg('Información', 'Datos recargados correctamente.');
                        storeCountExcesosVelocidad.reload();
                    }, this);
                    task.delay(500);
                }
            }, {
                text: 'Descargar como imagen',
                iconCls: 'icon-descargar',
                handler: function () {
                    Ext.MessageBox.confirm('Confirmar descarga', 'Descargar imagen ?', function (choice) {
                        if (choice === 'yes') {
                            storeCountExcesosVelocidad.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
        items: chartCountExcesos
    });
    panelCountByDevice = Ext.create('Ext.form.Panel', {
        title: 'Tramas diarias',
        iconCls: 'icon-go',
        layout: 'border',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function () {
                    var task = Ext.create('Ext.util.DelayedTask', function () {
                        Ext.example.msg('Información', 'Datos recargados correctamente.');
                        storeCountByDevice.reload();
                    }, this);
                    task.delay(500);
                }
            }, {
                text: 'Descargar como imagen',
                iconCls: 'icon-descargar',
                handler: function () {
                    Ext.MessageBox.confirm('Confirmar descarga', 'Descargar imagen ?', function (choice) {
                        if (choice === 'yes') {
                            chartCountByDevice.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
        items: [{
                region: 'west',
                width: '60%',
                scrollable: true,
                layout: 'hbox',
                items: chartCountByDevice
            }, {
                region: 'center',
                id: 'form-info',
                title: 'Información de tramas por vehículo: ',
                layout: 'hbox', tbar: [botonGrafica],
                items: chartCountTypeByDevice
            }]
    });

    panelChartCount = Ext.create('Ext.form.Panel', {
        title: 'Despachos po Vehículo',
        iconCls: 'icon-reset',
        region: 'center',
        width: '100%',
        scrollable: true,
        layout: 'hbox',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function () {
                    var task = Ext.create('Ext.util.DelayedTask', function () {
                        Ext.example.msg('Información', 'Datos recargados correctamente.');
                        storeCount.reload();
                    }, this);
                    task.delay(500);
                }
            }, {
                text: 'Descargar como imagen',
                iconCls: 'icon-descargar',
                handler: function () {
                    Ext.MessageBox.confirm('Confirmar descarga', 'Descargar imagen ?', function (choice) {
                        if (choice === 'yes') {
                            chartCount.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
        items: chartCount
    });
    //

    panelCentral = Ext.create('Ext.tab.Panel', {
        region: 'center',
        deferreRender: false,
        activeTab: 0,
        //items: [panelChartCountAccessByUser, panelChartCountExcesos, panelCountByDevice, panelChartCountDespachos]
        items: [panelChartCountAccessByUser, panelChartCountExcesos, panelCountByDevice]
    });
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [
            {
                region: 'north',
                xtype: 'label',
                html: '<a target="_blank"><img src="img/uploads/orgs/logoKradac.jpg" width="1365" height="60"></a>'

            }
            , panelCentral]
    });
    reloadStore(storeCountAccessByUser, 60);
    reloadStore(storeCountExcesosVelocidad, 60);
    reloadStore(storeCountByDevice, 60);
    reloadStore(storeCount, 60);

    reloadStore(storeCountTypeByDevice, 60);
    checkRolSesion(idRolKarview);
});
