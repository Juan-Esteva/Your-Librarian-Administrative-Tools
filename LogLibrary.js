/*==============================================================================
    LogLibrary.gs

    ----------------------------------------------------------------------------
    YLAT - Sistema de Registro de Eventos
    ----------------------------------------------------------------------------

    Objetivo
    --------
    Registrar los eventos relevantes producidos por YLAT.

    Decisiones de arquitectura
    --------------------------

    1. El archivo de registro se denomina SIEMPRE:

            events.log

       para mantener compatibilidad con el ecosistema VY² y con YL.

    2. El archivo se almacena en la carpeta indicada por:

            logFolderId

       definida en config.csv.

    3. Cada línea comienza con la firma:

            YLAT

       permitiendo distinguir posteriormente los eventos de YLAT,
       YL, Vniversitas u otros componentes.

    4. Formato del registro

       FechaHora | Sistema | Nivel | Usuario | Módulo | Función | Mensaje

       Ejemplo:

       2026-07-16 19:42:31 | YLAT | INFO |
       admin@vniversitas.org |
       FM |
       FMListResources |
       Archivos encontrados: 5

    5. El logger nunca debe generar excepciones.
       Ante cualquier error interno simplemente abandona el registro.

==============================================================================*/

const LOG_SYSTEM = "YLAT";
const LOG_FILE   = "events.log";


/*------------------------------------------------------------------------------
    YLLog()

    Registra un evento en events.log.

------------------------------------------------------------------------------*/

function YLLog(
    level,
    user,
    module,
    functionName,
    message
){

    try{

        const folderId = GetConfig("logFolderId");

        if(!folderId)
            return;

        const folder = DriveApp.getFolderById(folderId);

        let file = null;

        const files = folder.getFilesByName(LOG_FILE);

        if(files.hasNext()){

            file = files.next();

        }
        else{

            file = folder.createFile(

                LOG_FILE,

                "",

                MimeType.PLAIN_TEXT

            );

        }

        const timeStamp = Utilities.formatDate(

            new Date(),

            Session.getScriptTimeZone(),

            "yyyy-MM-dd HH:mm:ss"

        );

        const line =

            timeStamp        + " | " +
            LOG_SYSTEM       + " | " +
            level            + " | " +
            user             + " | " +
            module           + " | " +
            functionName     + " | " +
            message          + "\n";

        //
        // TODO
        //
        // Sustituir esta implementación por el mecanismo definitivo
        // de escritura de events.log.
        //
        // No utilizar Logger.log().
        //

        const oldContent = file.getBlob().getDataAsString("UTF-8");

        file.setContent(

            oldContent +

            line

        );

    }
    catch(e){

        // El logger nunca debe interrumpir la ejecución.

    }

}


/*------------------------------------------------------------------------------
    Funciones auxiliares
------------------------------------------------------------------------------*/

function YLInfo(
    user,
    module,
    functionName,
    message
){

    YLLog(
        "INFO",
        user,
        module,
        functionName,
        message
    );

}


function YLWarn(
    user,
    module,
    functionName,
    message
){

    YLLog(
        "WARN",
        user,
        module,
        functionName,
        message
    );

}


function YLError(
    user,
    module,
    functionName,
    message
){

    YLLog(
        "ERROR",
        user,
        module,
        functionName,
        message
    );

}