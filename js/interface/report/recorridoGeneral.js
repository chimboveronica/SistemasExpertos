var formReporteGeneral;
var winBan;
var tabpanelContain;
var acronimoRecorrido = 'KRC1';
var placaRecorrido;
var cbxVehBD;
var eventos;
var banderaRecorrido;
Ext.onReady(function () {
var idTipoEquipo;
    var dateLimitMin = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 1);

    if (idCompanyKarview == 1) {
        banderaRecorrido = 1;
    } else {
        acronimoRecorrido = 'CLM';
        banderaRecorrido = storeEmpresas.data.items[0].data.id;
    }

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaRecorrido,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                acronimoRecorrido = record.data.acronimo;
                cbxVehBD.enable();
                cbxVehBD.clearValue();
                storeVeh.load({
                    params: {
                        cbxEmpresas: record.getId()
                    }
                });
            }
        }
    });

    cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo',
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
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placaRecorrido = record.data.placa;
                idTipoEquipo=record.data.idTipoEquipo;
            }
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniBan',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        minValue: dateLimitMin,
        allowBlank: false,
        endDateField: 'fechaFinBan',
        emptyText: 'Fecha Inicial...',
        listConfig: {
            minWidth: 300
        }
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinBan',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniBan',
        emptyText: 'Fecha Final...'
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
    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });
    var yesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });

    var panelBotones = Ext.create('Ext.form.Panel', {
        layout: 'hbox',
        defaults: {
            margin: '5 5 0 0'
        },
        items: [
            today,
            yesterday
        ]
    });


    formReporteGeneral = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        layout: 'vbox',
        fieldDefaults: {
            labelAlign: 'left'
        },
        defaults: {
            layout: 'hbox',
            defaults: {
                padding: '0 0 5 5'
            }
        },
        items: [
            {
                items: [cbxEmpresasBD, cbxVehBD]
            }, {
                items: [dateIni, dateFin]
            }, {
                items: [timeIni, timeFin]
            },
            panelBotones,
            {
                xtype: 'fieldset',
                title: 'Opciones de Reporte',
                width: '100%',
                layout: 'anchor',
                margin: '10 0 0 0',
                defaults: {
                    anchor: '100%',
                    padding: '0 0 0 50'
                },
                items: [
                    {xtype: 'textfield',
                        hidden: true,
                        id: 'lugar'
                    },
                    {
                        xtype: 'checkboxgroup',
                        items: [{
                                boxLabel: 'Trazar Ruta',
                                name: 'trazar_ruta',
                                inputValue: 'trazar'
                            }, {
                                boxLabel: 'Reporte Ruta',
                                checked: true,
                                name: 'reporte_ruta',
                                inputValue: 'reporte'
                            }]
                    }]
            }
        ],
        buttons: [
            {
                text: 'Simbología',
                iconCls: 'icon-edit',
                tooltip: 'Simbología',
                handler: ventanaSimbologia
            }, '->',
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var vehiculo=cbxVehBD.getRawValue();
                    if (formReporteGeneral.getForm().isValid()) {
                        var trazar_ruta = this.up('form').down('[name=trazar_ruta]').getValue();
                        var reporte_ruta = this.up('form').down('[name=reporte_ruta]').getValue();
                        var fechaInicial = this.up('form').down('[name=fechaIni]').getValue();
                        var fechaFinal = this.up('form').down('[name=fechaFin]').getValue();
                        if (trazar_ruta || reporte_ruta) {
                            if(idTipoEquipo==='3'){
                                 formReporteGeneral.getForm().submit({
                                url: 'php/interface/report/recorridoGeneral/getDataTrackers.php',
                                method: 'POST',
                                waitMsg: 'Comprobando Datos...',
                                params: {
                                    nameVeh: vehiculo
                                },
                                failure: function (form, action) {
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert('Error', 'Los campos no se pueden enviar con valores invalidos.');
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('Error', 'No hay datos a mostrar en su Petición');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                            Ext.Msg.alert('Información', action.result.message);
                                            break;
                                    }
                                },
                                success: function (form, action) {
                                    var resultado = action.result;
                                    console.log(resultado);
                                    if (trazar_ruta) {
                                        clearLienzoTravel();
                                        clearLienzoPointTravel();
                                        //para cantidad de eventos
//                                        var valor = resultado.puntos[0].eventos.split(";");
//                                        eventos = '<TABLE id="tablestados"><TR class="alt"><TD> <IMG SRC="img/inicio.png"> <b>EVENTO:</b></td><TD> <IMG SRC="img/inicio.png"> <b>CANTIDAD:</b></td></TR>';
//                                        for (var i = 0; i < valor.length - 1; i++) {
//                                            var dato = valor[i].split(",");
//                                            eventos = eventos +
//                                                    '<TR class="alt"><TD align="CENTER "> ' + dato[0] + ' ' + '</TD> ' +
//                                                    '   <TD align="CENTER "> ' + dato[1] + ' ' + '</TD></TR> ';
//                                        }
//                                        eventos = eventos + '</TABLE>';
                                        drawPointsRoute(resultado.puntos);
                                        drawRutaMapa(resultado.puntos);
                                        var galones = obtenerGalones(resultado.puntos);
                                        var litros = obtenerLitros(resultado.puntos);
                                        var kilometraje = kilometrajeRecorrido(resultado.puntos);

                                        var velMaxima = velocidadmaxima(resultado.puntos);
                                        var velMinima = velocidadMinimo(resultado.puntos);
                                        var velMedia = velociadadMedia(resultado.puntos);
                                        var mayor60 = velociadadMayor60(resultado.puntos);
                                        var mayor90 = velociadadMayor90(resultado.puntos);
                                        tabpanelContain = Ext.create('Ext.form.Panel', {
                                            closable: true,
                                            title: '<b>Informe Tecnico</b>',
                                            autoScroll: true,
                                            id: 'contenedor',
                                            iconCls: 'icon-car',
                                            name: 'contenedoresg',
                                            padding: '5 5 5 15',
                                            defaults: {
                                                anchor: '100%',
                                            },
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Datos del Recorrido</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>FECHA DE NICIO:</b></td>' +
                                                                            '   <TD align="CENTER ">' + formatoFecha(fechaInicial) + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>FECHA FIN:</b></td>' +
                                                                            '   <TD align="CENTER ">' + formatoFecha(fechaFinal) + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>DISTANCIA RECORRIDA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + kilometraje + 'KM' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>CONSUMO DE COMBUSTIBLE:</b></td>' +
                                                                            '   <TD align="CENTER ">' + litros + 'LT' + ' | ' + galones + 'GL' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            ' </TABLE>'
                                                                }]},
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Velocidades del Recorido:</b>',
                                                            padding: '5 5 5 15',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            },
                                                            items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAXIMA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMaxima + ' KM/H' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MINIMA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMinima + ' KM/hH' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>PROMEDIO:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMedia + ' KM/H' + '</TD> ' +
                                                                            ' </TABLE>'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Excesos de Velocidad del Recorrido</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAYOR A 60 KM/h:</b></td>' +
                                                                            '   <TD align="CENTER "> ' + mayor60 + ' ' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAYOR A 90 KM/H:</b></td>' +
                                                                            '   <TD align="CENTER "> ' + mayor90 + ' ' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            ' </TABLE>'
                                                                }]}
                                                    ]
                                                }
                                            ]
                                        });
                                    }
                                    if (reporte_ruta) {
                                        loadGridFlags(vehiculo,
                                                resultado.puntos,
                                                cbxEmpresasBD.getValue(),
                                                cbxVehBD.getValue(),
                                                formatoFecha(dateIni.getValue()),
                                                formatoFecha(dateFin.getValue()),
                                                timeIni.getRawValue(),
                                                timeFin.getRawValue(),
                                                cbxVehBD.getRawValue(),idTipoEquipo
                                                );
                                    }

                                    winBan.hide();
                                }
                            });
                            }else{
                             formReporteGeneral.getForm().submit({
                                url: 'php/interface/report/recorridoGeneral/getDataFlags.php',
                                method: 'POST',
                                waitMsg: 'Comprobando Datos...',
                                params: {
                                    nameVeh: vehiculo
                                },
                                failure: function (form, action) {
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert('Error', 'Los campos no se pueden enviar con valores invalidos.');
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('Error', 'No hay datos a mostrar en su Petición');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                            Ext.Msg.alert('Información', action.result.message);
                                            break;
                                    }
                                },
                                success: function (form, action) {
                                    var resultado = action.result;
                                    console.log(resultado);
                                    if (trazar_ruta) {
                                        clearLienzoTravel();
                                        clearLienzoPointTravel();
                                        //para cantidad de eventos
                                        var valor = resultado.puntos[0].eventos.split(";");
                                        eventos = '<TABLE id="tablestados"><TR class="alt"><TD> <IMG SRC="img/inicio.png"> <b>EVENTO:</b></td><TD> <IMG SRC="img/inicio.png"> <b>CANTIDAD:</b></td></TR>';
                                        for (var i = 0; i < valor.length - 1; i++) {
                                            var dato = valor[i].split(",");
                                            eventos = eventos +
                                                    '<TR class="alt"><TD align="CENTER "> ' + formatEvento(dato[2]) + ' ' + '</TD> ' +
                                                    '   <TD align="CENTER "> ' + dato[1] + ' ' + '</TD></TR> ';
                                        }
                                        eventos = eventos + '</TABLE>';
                                        drawPointsRoute(resultado.puntos);
                                        drawRutaMapa(resultado.puntos);
                                        var galones = obtenerGalones(resultado.puntos);
                                        var litros = obtenerLitros(resultado.puntos);
                                        var kilometraje = kilometrajeRecorrido(resultado.puntos);

                                        var velMaxima = velocidadmaxima(resultado.puntos);
                                        var velMinima = velocidadMinimo(resultado.puntos);
                                        var velMedia = velociadadMedia(resultado.puntos);
                                        var mayor60 = velociadadMayor60(resultado.puntos);
                                        var mayor90 = velociadadMayor90(resultado.puntos);
                                        tabpanelContain = Ext.create('Ext.form.Panel', {
                                            closable: true,
                                            title: '<b>Informe Tecnico</b>',
                                            autoScroll: true,
                                            id: 'contenedor',
                                            iconCls: 'icon-car',
                                            name: 'contenedoresg',
                                            padding: '5 5 5 15',
                                            defaults: {
                                                anchor: '100%',
                                            },
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Datos del Recorrido</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>FECHA DE NICIO:</b></td>' +
                                                                            '   <TD align="CENTER ">' + formatoFecha(fechaInicial) + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>FECHA FIN:</b></td>' +
                                                                            '   <TD align="CENTER ">' + formatoFecha(fechaFinal) + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>DISTANCIA RECORRIDA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + kilometraje + 'KM' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>CONSUMO DE COMBUSTIBLE:</b></td>' +
                                                                            '   <TD align="CENTER ">' + litros + 'LT' + ' | ' + galones + 'GL' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            ' </TABLE>'
                                                                }]},
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Velocidades del Recorido:</b>',
                                                            padding: '5 5 5 15',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            },
                                                            items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAXIMA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMaxima + ' KM/H' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MINIMA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMinima + ' KM/hH' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>PROMEDIO:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMedia + ' KM/H' + '</TD> ' +
                                                                            ' </TABLE>'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Excesos de Velocidad del Recorrido</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAYOR A 60 KM/h:</b></td>' +
                                                                            '   <TD align="CENTER "> ' + mayor60 + ' ' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAYOR A 90 KM/H:</b></td>' +
                                                                            '   <TD align="CENTER "> ' + mayor90 + ' ' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            ' </TABLE>'
                                                                }]}
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Cantidad de Eventos</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: eventos
                                                                }]}
                                                    ]
                                                }
                                            ]
                                        });
                                    }

                                    if (reporte_ruta) {

                                        loadGridFlags(vehiculo,
                                                resultado.puntos,
                                                cbxEmpresasBD.getValue(),
                                                cbxVehBD.getValue(),
                                                formatoFecha(dateIni.getValue()),
                                                formatoFecha(dateFin.getValue()),
                                                timeIni.getRawValue(),
                                                timeFin.getRawValue(),
                                                cbxVehBD.getRawValue(),idTipoEquipo
                                                );
                                    }

                                    winBan.hide();
                                }
                            });
                                
                            }
                        } else {
                            Ext.MessageBox.show({
                                title: 'Atención',
                                msg: 'Escoga una de las Opciones de Reporte...',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.infor
                            });
                        }
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winBan.hide();
                }
            }]
    });
});

function recorridosGeneral() {
    if (!winBan) {
        winBan = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Recorridos General',
            iconCls: 'icon-all-flags',
            resizable: false,
            width: 592,
            height: 265,
            closeAction: 'hide',
            plain: false,
            items: [formReporteGeneral]
        });
    }
    formReporteGeneral.getForm().reset();
    var nowDate = new Date();
    formReporteGeneral.down('[name=fechaIni]').setValue(formatoFecha(nowDate));
    formReporteGeneral.down('[name=fechaFin]').setValue(formatoFecha(nowDate));
    formReporteGeneral.down('[name=horaIni]').setValue('00:00');
    formReporteGeneral.down('[name=horaFin]').setValue('23:59');
    winBan.show();
    cbxVehBD.enable();
    cbxVehBD.clearValue();
    storeVeh.load({
        params: {
            cbxEmpresas: banderaRecorrido
        }
    });
}

function ventanaBanderasClick(coop, eqp) {
    ventanaBanderas();
    storeEmpresas.load({
        params: {
            idEmpresa: coop,
            menuClick: 1
        }
    });
    formReporteGeneral.down('[name=cbxEmpresas]').setValue(coop);
    storeVeh.load({
        params: {
            cbxEmpresas: coop
        }
    });
    formReporteGeneral.down('[name=cbxVeh]').setValue(eqp);
}
;

function loadGridFlags(vehiculo,records, idEmp, idEqp, fi, ff, hi, hf, vehiculo, idTipoEquipo) {

    var storeFlags = Ext.create('Ext.data.JsonStore', {
        data: records,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['latitud', 'longitud', {name: 'fecha_hora', type: 'date', dateFormat: 'c'}, {name: 'fecha_hora_reg', type: 'date', dateFormat: 'c'}, 'velocidad', 'bateria',
            'gsm', 'gps2', 'ign', 'direccion', 'color', 'evento', 'idEvento', 'g1', 'g2', 'salida', 'evento']
    });
    if (idRolKarview === 3) {
        Ext.getCmp('cr1').disable();
        Ext.getCmp('cr2').setValue(true);
    } else {
        Ext.getCmp('cr1').setValue(true);
    }
if(idTipoEquipo==='3'){
var columnFlags = [];
    columnFlags = [
        {text: '<b>Trama</b>', width: 65, dataIndex: 'idData', align: 'center'},
        {text: '<b>Fecha y Hora <br> del Equipo</b>', xtype: 'datecolumn', width: 200, dataIndex: 'fecha_hora', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
        {text: '<b>Fecha y Hora <br> Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 200, dataIndex: 'fecha_hora_reg', align: 'center', filter: {type: 'date'}, filterable: true},
        {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 100, filter: {type: 'numeric'}},
        {text: '<b>Direccion</b>', width: 600, dataIndex: 'direccion', align: 'center', filter: {type: 'string'}}
    ];    
}else{
    var columnFlags = [];
    columnFlags = [
        {text: '<b>Trama</b>', width: 65, dataIndex: 'idData', align: 'center'},
        {text: '<b>Eventos</b>', width: 330, dataIndex: 'idEvento', filter: {type: 'list', store: storeEventos},renderer: formatEvento ,align: 'center'},
        {text: '<b>Fecha y Hora <br> del Equipo</b>', xtype: 'datecolumn', width: 200, dataIndex: 'fecha_hora', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
        {text: '<b>Fecha y Hora <br> Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center', filter: {type: 'date'}, filterable: true},
        {text: '<b>Batería</b>', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
        {text: '<b>GSM</b>', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
        {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
        {text: '<b>Vehículo(IGN)</b>', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
        {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 100, filter: {type: 'numeric'}},
        {text: '<b>Activo</b>', width: 100, dataIndex: 'activo', renderer: formatLock, align: 'center', filter: {type: 'list', store: storActivo}},
//        {text: '<b>G1</b>', width: 100, dataIndex: 'g1', align: 'center', renderer: formatStateTaxy,
//            filter: {
//                type: 'list',
//                options: [[1, 'Ocupado'], [0, 'Libre']]
//            }},
//        {text: '<b>G2</b>', width: 200, dataIndex: 'g2', align: 'center', renderer: formatPanic, align: 'center', filterable: true, filter: {
//                type: 'list',
//                options: [[1, 'Normal'], [0, 'Pánico receptado']]
//            }},
        {text: '<b>Direccion</b>', width: 350, dataIndex: 'direccion', align: 'center', filter: {type: 'string'}}
    ];
}
    
    var gridFlags = Ext.create('Ext.grid.Panel', {
        title: '<center>Informe Detallado</center>',
        region: 'center',
        iconCls: 'icon-general',
        store: storeFlags,
        columnLines: true,
        autoScroll: true,
        height: 425,
        width: 800,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function () {
                    exportExcelEventos(gridFlags, "Reporte de Recorridos", "nameSheet", "Reporte de Recorridos de : "+vehiculo);
                }
            }],
        columns: columnFlags,
        listeners: {
            itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                e.stopEvent();
                Ext.create('Ext.menu.Menu', {
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'icon-vehiculos_lugar',
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

    panelGrid = Ext.create('Ext.tab.Panel', {
        title: '<center>Recorridos Historico: ' + vehiculo + '<br>Desde: ' + fi + ' ' + hi + ' | Hasta: ' + ff + ' ' + hf + '</center>',
        region: 'center',
        frame: true,
        deferreRender: false,
        activeTab: 0,
        items: [gridFlags, tabpanelContain

        ]
    });

    var tab = Ext.create('Ext.container.Container', {
        title: '<div id="titulosForm"> Recorrido General  ' + acronimoRecorrido + ":" + placaRecorrido + '</div>',
        closable: true,
        iconCls: 'icon-all-flags',
        layout: 'border',
        items: panelGrid
    });

    panelTabMapaAdmin.add(tab);
    panelTabMapaAdmin.setActiveTab(tab);


}