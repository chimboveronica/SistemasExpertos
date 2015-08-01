var formWinCmdPred;
var winCmdPred;

Ext.onReady(function() {
    var responseExiste, contResponse;
     var storeCmdPredPred = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/combobox/comboCmdPred.php',
            reader : {
                type : 'json',
                root: 'comandos'
            }
        },
        fields : ['id', 'nombre']
    });

    var cbxDevicePred = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '<b>Equipo</b>',
        name: 'idDevice',
        store: storeDevicePredeterminado,
        valueField: 'id',
        forceSelection: true,
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Equipo...',
        allowBlank: false
    });

    var radioCmdPred = Ext.create('Ext.form.RadioGroup',{
        fieldLabel: '<b>Tipo Cmd</b>',
        items: [{
            boxLabel: 'Manual', 
            name: 'rb-auto', 
            inputValue: 1
        },{ 
            boxLabel: 'Predefinido', 
            name: 'rb-auto', 
            inputValue: 2,
            checked: true
        }],
        listeners : {
            change : function( thisObj, newValue, oldValue, eOpts ) {
                Object.getOwnPropertyNames(newValue).forEach(function(val, idx, array) {                    
                    if (newValue[val] === 1) {
                        formWinCmdPred.down('[name=cmdManual]').enable();
                        formWinCmdPred.down('[name=cbxCmdPred]').disable();
                    } else {
                        formWinCmdPred.down('[name=cmdManual]').disable();
                        formWinCmdPred.down('[name=cbxCmdPred]').enable();
                    }
                });
            }
        }
    });

    var cbxCmdPredBDPred = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '<b>Predefinido</b>', 
        name: 'cbxCmdPred',
        store: storeCmdPredPred,
        valueField: 'id',
        displayField: 'nombre',
        forceSelection: true,
        queryMode: 'local',
        emptyText: 'Seleccionar Comando...',
//        editable: false,
        allowBlank: false        
    });

    var cmdManualPred = Ext.create('Ext.form.field.TextArea', {        
        fieldLabel: '<b>Manual</b>',
        name: 'cmdManual',
        allowBlank: false,
        disabled : true
    });

    var responsePred = Ext.create('Ext.form.Label', {
        text : 'Respuesta: ',
        name : 'response',
        style: {
            color: 'red'
        }
    });

    formWinCmdPred = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 10 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor : '100%'
        },
        items: [
            cbxDevicePred,
            cbxCmdPredBDPred,
            responsePred
        ],
        buttons: [{
            text: 'Enviar',
            iconCls: 'icon-send-cmd',
            handler: function() {
                if (formWinCmdPred.getForm().isValid()) {
                    responsePred.setText('Respuesta:');
                    formWinCmdPred.submit({                            
                        url: 'php/administracion/device/cmd/setCmd.php',                            
                        waitMsg: 'Comprobando Datos...',
                        failure: function(form, action) {                                
                            Ext.MessageBox.show({
                                title: 'Mensaje',
                                msg: 'No se pudo Enviar el Comando...',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        },
                        success: function(form, action) {
                            Ext.example.msg('Mensaje', 'Comando Encolado para el Envio.');                                
                            responseExiste = false;
                            contResponse = 0;
                            searchResponsePred();
                        }                        
                    });
                }
            }
        }, {
            text: 'Cancelar',
            iconCls: 'icon-cancelar',
            handler: function(){
                winCmdPred.hide();
            }
        }]
    });

    var searchResponsePred = function reloadClock() {        
        if (!responseExiste) {
            if (contResponse < 20) {
                formWinCmdPred.submit({                            
                    url: 'php/administracion/device/cmd/getResponseCmd.php',
                    failure: function(form, action) { 
                        responsePred.update('<span style="color:green;">Respuesta: </span><span style="color:blue;">'+ action.result.message+'</span>');
                        responseExiste = false;
                        contResponse++;
                    },
                    success: function(form, action) {
                        responsePred.update('<span style="color:green;">Respuesta: </span><span style="color:black;">'+ action.result.message+'</span>');
                        responseExiste = true;
                    }                        
                });

                Ext.Function.defer(searchResponsePred, 2000, this);
            } else {
                responsePred.setText('Sin Respuesta, (tardo mas de 40 seg.)');
                responseExiste = true;
            } 
        }         
    };
});

function ventComandsPred() {
    if (!winCmdPred) {
        winCmdPred = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Envio de Comandos Predefinidos',
            iconCls: 'icon-cmd',
            resizable: false,
            width: 350,
            height: 185,
            closeAction: 'hide',
            plain: false,
            items: formWinCmdPred,
            tools: [{
                    type: 'help',
                    tooltip: '<b>Atención...!!!</b><br>Los comandos enviados, interactuan directamente en el Vehículo</b> Realice esta operación con toda responsabilidad'
                }]
        });
    }
    formWinCmdPred.getForm().reset();
    formWinCmdPred.down('[name=response]').update('Respuesta:');
    winCmdPred.show();
}