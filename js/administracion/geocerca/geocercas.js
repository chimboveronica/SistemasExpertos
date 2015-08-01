var winAddGeocerca;
var gridGeocercas;
var formGeocercas;
var vertPolygonos = "";
var trazar = 0;
var gridStoreGeocercas;
var listVehiculos = "";
var drawRoute;
var geometria;
var id_empresageos = 0;
var vistaVehiculosGeocercas;
var areaEdit;
var coordenadasEdit = '';
var storeListaVehiculosGeocerca;
var vehiculosList;

Ext.onReady(function () {


    vehiculosList = Ext.create('Ext.data.ArrayStore', {
        data: [],
        fields: ['value', 'text'],
        sortInfo: {
            field: 'value',
            direction: 'ASC'
        }
    });


    Ext.tip.QuickTipManager.init();
    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_geo', mapping: 'id'},
            {name: 'id_empresa'},
            {name: 'geocerca'},
            {name: 'desc_geo'},
            {name: 'empresa'},
            {name: 'listVeh'},
            {name: 'areaGeocerca'},
            {name: 'idPrueba', type: 'string'}
        ]
    });
    // crea los datos del store
    gridStoreGeocercas = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataObject',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/geocerca/read.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'adminGeo',
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
                }
            }
        }
    });
    // declare the source Grid
    gridGeocercas = Ext.create('Ext.grid.Panel', {
        store: gridStoreGeocercas,
        columns: [
            {header: "Geocerca", width: 160, sortable: true, dataIndex: 'geocerca'},
            {header: "Organización", width: 110, sortable: true, dataIndex: 'empresa', renderer: formatCompany},
            {header: "Descripción", width: 210, sortable: true, dataIndex: 'desc_geo', filter: {type: 'string'}},
            {header: "Área", width: 150, sortable: true, dataIndex: 'areaGeocerca', filter: {type: 'string'}}
        ],
        stripeRows: true,
        margins: '0 2 0 0',
        border: true,
        region: 'center',
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: false
        },
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected[0] !== null) {
                    setActiveRecord(selected[0] || null);
                    var record = selected[0];
                    idGeo = record.data.id;
                    lines.destroyFeatures();
                    Ext.getCmp('id_org').setValue(record.data.empresa);
                    formGeocercas.down('#createGeo').disable();
                    formGeocercas.down('#deleteGeo').enable();
                    recargar(record.data.id_empresa, record.data.id);
                    drawPoligonoGeocerca(record.data.geocercaPuntos);
                    //carga lista de vehiculos
                    var formVeh = Ext.create('Ext.form.Panel', {});
                    var form = formVeh.getForm();
                    form.submit({
                        url: 'php/interface/adminGeo/getVeh.php',
                        params: {
                            cbxEmpresas: record.data.id_empresa

                        },
                        method: 'POST',
                        success: function (form, action) {
                            //obtener datos para cargar en el itemselector
                            var resultado = action.result;
                            for (i = 0; i < resultado.datos.length; i++) {
                                var data1 = [resultado.datos[i].id, resultado.datos[i].text];
                                data[i] = data1;
                            }
//                        console.log(data);
                            vehiculosList = Ext.create('Ext.data.ArrayStore', {
                                data: data,
                                fields: ['value', 'text'],
                                sortInfo: {
                                    field: 'value',
                                    direction: 'ASC'
                                }
                            });
                            //para cargar datos de los vehiculos de la geocerca
                            formGeocercas.getForm().findField('listVehiGeos').setStore(vehiculosList);
                            form.submit({
                                url: 'php/interface/adminGeo/geoVeh.php',
                                params: {
                                    empresa: record.data.id_empresa,
                                    idGeo: record.data.id

                                },
                                method: 'POST',
                                success: function (form, action) {
                                    //obtener datos
                                    var resultado = action.result;
//                                console.log(resultado.datos.length);
                                    var ga = resultado.datos.length;
                                    var datos = [];
                                    for (i = 0; i < ga; i++) {
                                        datos[i] = resultado.datos[i].id;
                                    }
//                                console.log(datos);
                                    formGeocercas.getForm().findField('listVehiGeos').setValue(datos);

                                }
                            });
                        }
                    });
                }

            }
        }
    });
    function recargar(idEmpresa, idGeo) {
        storeVehGeocerca.load({
            params: {
                empresa: idEmpresa,
                idGeo: idGeo
            }
        });
    }


    formGeocercas = Ext.create('Ext.form.Panel', {
        id: 'panel',
        region: 'east',
        width: '70%',
        activeRecord: null,
//        bodyStyle: 'padding: 10px;',
//        margins: '2 2 2 2',
        scrollable: true,
        split: true,
        bodyPadding: 5,
        collapsible: true,
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Información</b>',
                layout: 'hbox',
                padding: '4 4 4 4',
                defaults: {
                    padding: '0 0 5 10',
                    baseCls: 'x-plain',
                    layout: 'hbox',
                    defaults: {
                        labelWidth: 100
                    }
                }
                ,
                items: [
                    {
                        defaults: {
                            padding: '0 5 0 0',
                            baseCls: 'x-plain',
                            layout: 'vbox',
                            defaults: {
                                labelWidth: 100
                            }
                        },
                        items: [
                            {
                                items: [
                                    {
                                        xtype: 'form',
                                        bodyPadding: '0 0 0 0',
                                        layout: 'vbox',
                                        fieldDefaults: {
                                            labelAlign: 'left'
                                        },
                                        defaults: {
                                            layout: 'hbox',
                                            defaults: {
                                                padding: '0 0 5 0'
                                            }
                                        },
                                        items: [
                                            {
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        fieldLabel: '<b>Geocerca</b>',
                                                        afterLabelTextTpl: required,
                                                        id: 'geocerca',
                                                        name: 'geocerca',
                                                        vtype: 'campos1',
                                                        allowBlank: false,
                                                        blankText: INFOMESSAGEBLANKTEXT,
                                                        emptyText: 'Nombre de Geocerca...'
                                                    }
                                                ]
                                            },
                                            /////////////////
                                            {
                                                items: [
                                                    {
                                                        xtype: 'panel',
                                                        layout: 'hbox',
                                                        baseCls: 'x-plain',
                                                        defaults: {
                                                            margin: '0 4 0 0'
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'textfield',
                                                                fieldLabel: '<b>Área</b>',
                                                                afterLabelTextTpl: required,
                                                                id: 'numberfield-point-route',
                                                                name: 'areaGeocerca',
                                                                editable: false,
                                                                allowBlank: false,
                                                                blankText: INFOMESSAGEBLANKTEXT,
                                                                emptyText: 'Area de la Geocerca...'
                                                            },
                                                            {
                                                                id: 'btn-draw-edit-route',
                                                                iconCls: 'icon-add',
                                                                xtype: 'button',
                                                                value: 0,
                                                                handler: function () {
                                                                    if (drawRoute === true) {
                                                                        drawLine.activate();
                                                                        geosArea = true;
                                                                        geosVertice = true;
                                                                        Ext.getCmp('btn-draw-edit-route').disable();
                                                                        Ext.getCmp('btn-delete-route').enable();
//                                                                        drawRoute=false;
                                                                    } else {
                                                                        modifyLine.activate();
                                                                        modifyLine.activate();
                                                                        modifyLine.activate();
                                                                        modifyLine.activate();
                                                                        geosArea = true;
                                                                        geosVertice = true;
                                                                        Ext.create('Ext.menu.Menu', {
                                                                            width: 100,
                                                                            floating: true, // usually you want this set to True (default)
                                                                            renderTo: 'map', // usually rendered by it's containing componen
                                                                            items: [{
                                                                                    iconCls: 'icon-valid',
                                                                                    text: 'Terminar',
                                                                                    handler: function () {
                                                                                        geometria = lines.features[0].geometry; //figura
                                                                                        var linearRing = new OpenLayers.Geometry.LinearRing(geometria.getVertices());
                                                                                        var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
                                                                                        areaEdit = polygonFeature.geometry.getArea() / 1000;
                                                                                        areaEdit = Math.round(areaEdit * 100) / 100;
                                                                                        Ext.getCmp('numberfield-point-route').setValue(areaEdit + ' km2');
                                                                                        modifyLine.deactivate();
                                                                                        var nuevosVertces = geometria.getVertices();
                                                                                        for (var i = 0; i < nuevosVertces.length; i++) {
                                                                                            nuevosVertces[i] = nuevosVertces[i].transform(new OpenLayers.Projection('EPSG:900913'),
                                                                                                    new OpenLayers.Projection('EPSG:4326'));
                                                                                            coordenadasEdit += nuevosVertces[i].x + ',' + nuevosVertces[i].y;
                                                                                            if (i != nuevosVertces.length - 1) {
                                                                                                coordenadasEdit += ';';
                                                                                            }
                                                                                        }
//                                                                                        console.log("Nuevas Cordenadas editadas  " + coordenadasEdit);
                                                                                        winAddGeocerca.show();
                                                                                    }
                                                                                }]
                                                                        }).show();
                                                                        geosVertice = true;
                                                                    }
                                                                    winAddGeocerca.hide();
                                                                }
                                                            },
                                                            {
                                                                id: 'btn-delete-route',
                                                                iconCls: 'icon-delete',
                                                                xtype: 'button',
                                                                disabled: true,
                                                                handler: function () {
                                                                    lines.destroyFeatures();
                                                                    Ext.getCmp('btn-draw-edit-route').enable();
                                                                    Ext.getCmp('numberfield-point-route').reset();
                                                                    Ext.getCmp('btn-delete-route').disable();
                                                                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                                                                    drawRoute = true;
                                                                }
                                                            }

                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                items: [
                                                    {
                                                        xtype: 'combobox',
                                                        fieldLabel: '<b>Organización</b>',
                                                        name: 'cbxEmpresasV',
                                                        store: storeEmpresas,
                                                        afterLabelTextTpl: required,
                                                        id: 'id_org',
                                                        valueField: 'id',
                                                        displayField: 'text',
                                                        queryMode: 'local',
                                                        emptyText: 'Seleccionar Organización...',
                                                        editable: false,
                                                        allowBlank: false,
                                                        blankText: INFOMESSAGEBLANKTEXT,
                                                        listeners: {
                                                            select: function (combo, record, eOpts) {
                                                                // crear un arreglo de tamaño de store vehiculos con valores vacio
                                                                for (i = 0; i < formGeocercas.getForm().findField('listVehiGeos').getStore().data.length; i++) {
                                                                    var data1 = ['', ''];
                                                                    data[i] = data1;
                                                                }
                                                                LimpiarvehiculosList = Ext.create('Ext.data.ArrayStore', {
                                                                    data: data,
                                                                    fields: ['value', 'text']
                                                                });
                                                                //fijar los valores vacio para limpiar el campo vehiculos
                                                                formGeocercas.getForm().findField('listVehiGeos').setStore(LimpiarvehiculosList);

                                                                var formVeh = Ext.create('Ext.form.Panel', {});
                                                                var form = formVeh.getForm();
                                                                form.submit({
                                                                    url: 'php/interface/adminGeo/getVeh.php',
                                                                    params: {
                                                                        cbxEmpresas: record.getId()
                                                                    },
                                                                    method: 'POST',
                                                                    success: function (form, action) {
                                                                        //obtener datos
                                                                        var resultado = action.result;
                                                                        //habilitar campos
                                                                        for (i = 0; i < resultado.datos.length; i++) {
                                                                            var data1 = [resultado.datos[i].id, resultado.datos[i].text];
                                                                            data[i] = data1;
                                                                        }
                                                                        vehiculosList = Ext.create('Ext.data.ArrayStore', {
                                                                            data: data,
                                                                            fields: ['value', 'text'],
                                                                            sortInfo: {
                                                                                field: 'value',
                                                                                direction: 'ASC'
                                                                            }
                                                                        });
                                                                        formGeocercas.getForm().findField('listVehiGeos').setStore(vehiculosList);


                                                                    }
                                                                });
                                                            }
                                                        }}]
                                            }
                                        ]
                                    }
                                ]}

                        ]},
                    {
                        xtype: 'textareafield',
                        grow: true,
                        name: 'desc_geo',
                        fieldLabel: '<b>Descripción</b>',
                        tooltip: 'Descripcion de la Geocerca',
                        emptyText: 'Descripción de la Geocerca...'
                    }
                ]
            },
            {
                xtype: 'form',
                baseCls: 'x-plain',
                items: [{
                        xtype: 'itemselector',
                        name: 'listVehiGeos',
                        anchor: '100%',
                        id: 'id_list_vehiculo',
                        store: vehiculosList,
                        valueField: 'value',
                        displayField: 'text',
                        allowBlank: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                        value: [],
                        msgTarget: 'side',
                        fromTitle: 'Vehiculos',
                        toTitle: 'Seleccionados'
                    }]
            }
        ]
        ,
        listeners: {
            create: function (form, data) {
                gridStoreGeocercas.insert(0, data);
                gridStoreGeocercas.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-update', itemId: 'updateGeo', text: 'Actualizar', scope: this, tooltip: 'Actualizar Geocerca', handler: onUpdateGeocerca},
                    {iconCls: 'icon-user-add', itemId: 'createGeo', text: 'Crear', scope: this, tooltip: 'Crear Geocerca', handler: onCreateGeocerca},
                    {iconCls: 'icon-delete', itemId: 'deleteGeo', text: 'Eliminar', scope: this, tooltip: 'Eliminar Geocerca', handler: onDeleteClick},
                    {iconCls: 'icon-limpiar', itemId: 'limpiarGeocerca', text: 'Limpiar', tooltip: 'Limpiar Campos', scope: this, handler: onResetGeocerca},
                    {iconCls: 'icon-cancelar', text: 'Cancelar', tooltip: 'Cancelar', scope: this, handler: clearWinGeocerca}
                ]
            }]
    });
});
var storeVehGeocerca = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/adminGeo/geoVeh.php',
        reader: {
            type: 'json',
            root: 'veh_geo'
        }
    },
    fields: ['id', 'nombre']
});

///// comboVeh a partir del id de la Organización
storeListaVehiculosGeocerca = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboVeh.php',
        reader: {
            type: 'json',
            root: 'veh'
        }
    },
    fields: [{name: 'value', mapping: 'id'}, 'text']
});

//para nuevo store que me sirve para llenar los nuevos datos
Ext.define('Employee', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'},
    ]
});

var mystore = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    model: 'Employee',
    proxy: {
        type: 'memory'
    },
    sorters: [{
            property: 'start',
            direction: 'ASC'
        }]
});

var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
    fieldLabel: '<b>Organización</b>',
    name: 'cbxEmpresasV',
    store: storeEmpresas,
    valueField: 'id',
    displayField: 'text',
    queryMode: 'local',
    emptyText: 'Seleccionar Organización...',
    editable: false,
    allowBlank: false,
    listeners: {
        select: function (combo, record, eOpts) {
            storeListaVehiculosGeocerca.removeAll();
            var listSelected = contenedorgeocerca.down('[name=listVehiGeos]');
            listSelected.clearValue();
            storeListaVehiculosGeocerca.load({
                params: {
                    cbxEmpresas: record.getId()
                }
            });
        }
    }
});
function loadGridStorVeh() {
    storeListaVehiculosGeocerca.removeAll();

}

function ventanaGeocerca() {
    if (!winAddGeocerca) {
        winAddGeocerca = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administrar Geocercas',
            iconCls: 'icon-personal',
            resizable: false,
            width: 990,
            height: 450,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridGeocercas,
                        formGeocercas
                    ]}]
        });
    }
    onResetGeocerca();
    winAddGeocerca.show();
    formGeocercas.down('#updateGeo').disable();
    formGeocercas.down('#createGeo').enable();
    formGeocercas.down('#deleteGeo').disable();
    if (gridGeocercas.getStore().getCount() === 0) {
        gridGeocercas.getStore().load();
    }
}


function setActiveRecord(record) {
    formGeocercas.activeRecord = record;
    if (record) {
        formGeocercas.down('#updateGeo').enable();
        formGeocercas.getForm().loadRecord(record);
    } else {
        formGeocercas.down('#updateGeo').disable();
        formGeocercas.getForm().reset();
    }
}

function onUpdateGeocerca() {
    var form = formGeocercas.getForm();
    if (form.isValid()) {
        var contador = 0;
        for (var i = 0; i < gridStoreGeocercas.data.length; i++) {
            if ((gridStoreGeocercas.getAt(i).data.geocerca.toUpperCase()) === (Ext.getCmp('geocerca').value.toUpperCase())) {
                contador++;
            }
        }
        if (contador > 1) {
            Ext.Msg.alert('Atención...', 'La Geocerca está Repetida');
        } else {
            form.submit({
                url: "php/interface/adminGeo/geoUpdate.php",
                waitMsg: "Guardando...",
                params: {
                    idGeo: idGeo,
                    coord: coordenadasEdit,
                    area: areaEdit,
                    vehiculolist: formGeocercas.down('[name=listVehiGeos]').getValue()
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: "Problemas",
                        msg: "No se puede Editar la Geocerca",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                success: function (form, action) {
                    Ext.MessageBox.show({
                        title: "Correcto",
                        msg: "Datos Modificados Correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    Ext.getCmp('btn-draw-edit-route').enable();
                    Ext.getCmp('btn-delete-route').disable();
                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                    drawRoute = true;
                    lines.destroyFeatures();
                    formGeocercas.down('#deleteGeo').disable();
                    formGeocercas.down('#createGeo').enable();
                    formGeocercas.getForm().reset();
                    gridStoreGeocercas.reload();
                    formGeocercas.down('#createGeo').enable();
                    formGeocercas.down('#deleteGeo').disable();
                    formGeocercas.down('#updateGeo').disable();
                }
            });
        }
    } else {
        Ext.Msg.alert('Atención...', 'Por favor llenar los campos correctamente');
    }
}

function onCreateGeocerca() {
    var form = formGeocercas.getForm();
    if (form.isValid()) {
        var bandera = false;
        for (var i = 0; i < gridStoreGeocercas.data.length; i++) {
            if ((gridStoreGeocercas.getAt(i).data.geocerca.toUpperCase()) === (Ext.getCmp('geocerca').value.toUpperCase())) {
                bandera = true;
            }
        }
        if (bandera) {
            Ext.Msg.alert('Atención...', 'La Geocerca esta Repetida');
        } else {
            var form = formGeocercas.getForm();
            if (form.isValid()) {
                if (coordenadasGeos != "") {
                    form.submit({
                        url: "php/interface/adminGeo/geoNew.php",
                        waitMsg: "Guardando...",
                        params: {
                            coord: coordenadasGeos,
                            area: formGeocercas.down('[name=areaGeocerca]').getValue(),
                            vehiculolist: formGeocercas.down('[name=listVehiGeos]').getValue(),
//                            idempresa: idempresaGeocerca
                        },
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: "Problemas",
                                msg: "No se puede guardar la Geocerca",
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            })
                        },
                        success: function (form, action) {
                            Ext.MessageBox.show({
                                title: "Correcto",
                                msg: "GeoCerca guardada",
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                            });
                            Ext.getCmp('btn-draw-edit-route').enable();
                            Ext.getCmp('btn-delete-route').disable();
                            Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                            drawRoute = true;
                            lines.destroyFeatures();
                            formGeocercas.down('#deleteGeo').disable();
                            formGeocercas.down('#createGeo').enable();
                            formGeocercas.down('#updateGeo').disable();
                            formGeocercas.getForm().reset();
                            gridStoreGeocercas.reload();
                            formGeocercas.getForm().findField('listVehiGeos').setStore(Ext.create('Ext.data.ArrayStore', {
                                fields: ['value', 'text']
                            }));
                        }
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "Sin Geocerca",
                        msg: "Aún no traza la GeoCerca",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        }
    } else {
        Ext.Msg.alert('Atención...', 'Por favor llenar los campos correctamente');
    }
}

function onResetGeocerca() {
    Ext.getCmp('id_list_vehiculo').reset();
    formGeocercas.getForm().findField('listVehiGeos').setStore(Ext.create('Ext.data.ArrayStore', {
        fields: ['value', 'text']
    }));
    Ext.getCmp('btn-draw-edit-route').enable();
    Ext.getCmp('btn-delete-route').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
    drawRoute = true;
    lines.destroyFeatures();
    formGeocercas.down('#deleteGeo').disable();
    formGeocercas.down('#createGeo').enable();
    formGeocercas.down('#updateGeo').disable();
    formGeocercas.getForm().reset();
    gridStoreGeocercas.reload();
}

function clearWinGeocerca() {
    formGeocercas.down('#deleteGeo').disable();
    formGeocercas.down('#createGeo').enable();
    winAddGeocerca.hide();
    lines.destroyFeatures();
    Ext.getCmp('numberfield-point-route').reset();
    Ext.getCmp('btn-delete-route').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
//    drawRoute = true;
}

function onDeleteClick() {
    var selection = gridGeocercas.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        var form = formGeocercas.getForm();
        if (form.isValid()) {
            form.submit({
                url: "php/interface/adminGeo/geoDelete.php",
                waitMsg: "Eliminando la Geocerca...",
                params: {
                    idGeo: selection.data.id_geo
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: "Problemas",
                        msg: "No se puede Eliminar la Geocerca",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                success: function (form, action) {
                    Ext.MessageBox.show({
                        title: "Correcto",
                        msg: "Geocerca Eliminada Correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                    drawRoute = true;
                    lines.destroyFeatures();
                    formGeocercas.down('#deleteGeo').disable();
                    formGeocercas.down('#createGeo').enable();
                    formGeocercas.getForm().reset();
                    gridStoreGeocercas.reload();
                    formGeocercas.getForm().findField('listVehiGeos').setStore(Ext.create('Ext.data.ArrayStore', {
                        fields: ['value', 'text']
                    }));
                }
            });

        } else {
            Ext.MessageBox.show({
                title: "Información",
                msg: "Problemas en la Seleccion de la Geocerca",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });

        }


    }
}
