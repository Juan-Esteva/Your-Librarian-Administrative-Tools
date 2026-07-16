function TestHelpFile(){

    const f = YLResolveHelpFile("ES");
    YLResolveHelpFile("EN");

    Logger.log(f.getName());

}

function TestHelp(){

    Logger.log(
        JSON.stringify(
            YLGetHelp("ADDUSER")
        )
    );

}

function TestSaveHelp(){

    YLSaveCurrentHelp(

        "FAKE5",

        "<h1>Prueba</h1><p>Guardado OK</p>"

    );

}

/*          Diagnóstico         */

function TestConfig(){

    LoadConfig();

    Logger.log("=== CONFIG ===");

    Object.keys(CONFIG)

        .sort()

        .forEach(function(key){

            Logger.log(

                key +

                " = " +

                CONFIG[key]

            );

        });

}