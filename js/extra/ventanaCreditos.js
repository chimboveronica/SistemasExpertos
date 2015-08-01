var winCred;

function credits(){
    if(!winCred){
        var contenedorWinC = Ext.create('Ext.form.Panel', {
            id: 'panel-credit',
            labelAlign:"left",
            bodyStyle:"padding:5px 5px 0",
            labelWidth:60,
            width:600,
            items:[{
                html: '<div id="div-info-about"><center> ' +
                            '<img src="img/logo.png" width="200px" height="50px"></center>' +
                            'Versión 3.0 <br><br>' +
                            '<div align="center"><h1> Sistema de Rastreo Vehicular "KARVIEW" </h1></div>.' +
                            '<p align=right>KRADAC Cia. Ltda. Todos los derechos reservados.<br>' +
                            '<a href="http://www.kradac.com">www.kradac.com</a></p>' +
                            '</div>'
            }],
            buttonAlign:"center",
            buttons:[{
                text:"OK",
                handler: function(){
                    winCred.hide();
                    spot.hide();
                }
            }]
        });

        winCred = Ext.create('Ext.window.Window',{
            layout:"fit",
            iconCls: 'icon-credits',
            title:"Creditos",
            resizable:false,
            width:300,
            height:290,
            closeAction:"hide",
            plain:true,
            items:[contenedorWinC],
            listeners: {
                close: function( panel, eOpts ) {
                    spot.hide();
                }
            }
        });

        Ext.create('Ext.fx.Anim', {
            target: contenedorWinC,
            duration: 2000,
            from: {
                opacity: 0,       // Transparent
            },
            to: {
                opacity: 1,       // Opaque
            }
        });
    }
    winCred.show();
}