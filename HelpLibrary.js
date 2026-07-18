/*Ultimo guardado : 202607131950*/
/*   HelpLibrary.js   */

/*     Help     */

const DEFAULT_HELP_TEMPLATE = `
<!-- Pegar aquí exactamente el contenido original de template.ES.html -->
`;

function BuildHelpFileName(language){

    language = (language || "ES").toUpperCase();

    return "help." + language + ".json";

}

function ResolveHelpFile(language){

    const folderId = GetConfig("helpFolderId");

    if(!folderId)
        throw new Error("helpFolderId no configurado.");

    const folder = DriveApp.getFolderById(folderId);

    const fileName = BuildHelpFileName(language);

    const files = folder.getFilesByName(fileName);

    if(files.hasNext())
        return files.next();

    //
    // Si falta ES es un error.
    //

    if(language.toUpperCase()==="ES")

        throw new Error(
            "No existe " + fileName
        );

    //
    // Crear nuevo idioma copiando ES
    //

    const spanish = folder.getFilesByName("help.ES.json");

    if(!spanish.hasNext())

        throw new Error(
            "No existe help.ES.json"
        );

    return spanish
        .next()
        .makeCopy(fileName,folder);

}

function LoadHelp(language){

    const file = ResolveHelpFile(language);

    const text = file.getBlob().getDataAsString("UTF-8").trim();

    if(text === "")
        return {};

    return JSON.parse(text);

}

/*   API Pública   */

function YLGetHelp(command,language){

    language = language || GetConfig("language");

    const help = LoadHelp(language);

    if(help.hasOwnProperty(command))
        return help[command];

    return{

        html:
            "<h2>"+command+"</h2>"+
            "<p>Aún no existe ayuda para este comando.</p>"

    };

}

function YLSaveHelp(language,data){

    const file = ResolveHelpFile(language);

    file.setContent(

        JSON.stringify(
            data,
            null,
            2
        )

    );

}

function YLSaveCurrentHelp(command,html,language){

    language = language || GetConfig("language");

    const help = LoadHelp(language);

    help[command]={

        html:html

    };

    YLSaveHelp(language,help);

}

/*   Permisos   */

function YLGetCommandPermissions(command){

    const rows = LoadTable("commands");

    const headers = rows[0];

    const idxCommand = headers.indexOf("command");
    const idxSU      = headers.indexOf("canSuperUser");
    const idxAD      = headers.indexOf("canAdmin");
    const idxUL      = headers.indexOf("canUploader");
    const idxUS      = headers.indexOf("canUser");

    for(let i=1;i<rows.length;i++){

        if(rows[i][idxCommand]===command){

            return{

                SU : rows[i][idxSU]==="Y",
                AD : rows[i][idxAD]==="Y",
                UL : rows[i][idxUL]==="Y",
                US : rows[i][idxUS]==="Y"

            };

        }

    }

    throw new Error(
        "Comando no encontrado: " + command
    );

}

function YLGetCommandsPermissions(){

    const rows = LoadTable("commands");

    const headers = rows[0];

    const idxCommand = headers.indexOf("command");
    const idxType    = headers.indexOf("type");
    const idxBrief   = headers.indexOf("brief");
    const idxSU      = headers.indexOf("canSuperUser");
    const idxAD      = headers.indexOf("canAdmin");
    const idxUL      = headers.indexOf("canUploader");
    const idxUS      = headers.indexOf("canUser");

    const result = [];

    for(let i=1;i<rows.length;i++){

        if(rows[i][idxType]==="COMMENT"){

            result.push({

                type  : "COMMENT",

                title : rows[i][idxBrief]

            });

            continue;

        }

        result.push({

            type    : "COMMAND",

            command : rows[i][idxCommand],

            SU : rows[i][idxSU] === "Y",

            AD : rows[i][idxAD] === "Y",

            UL : rows[i][idxUL] === "Y",

            US : rows[i][idxUS] === "Y"

        });

    }

    return result;

}

/*   Plantillas   */

function BuildTemplateFileName(language){

    language = (language || "ES").toUpperCase();

    return "template." + language + ".html";

}

function ResolveTemplateFile(language){

    const folderId = GetConfig("helpFolderId");

    const folder = DriveApp.getFolderById(folderId);

    const fileName = BuildTemplateFileName(language);

    const files = folder.getFilesByName(fileName);

    if(files.hasNext())
        return files.next();

    if(language.toUpperCase()=="ES")

        throw new Error(
            "No existe " + fileName
        );

    const spanish = folder.getFilesByName("template.ES.html");

    if(!spanish.hasNext())

        throw new Error(
            "No existe template.ES.html"
        );

    return spanish
        .next()
        .makeCopy(fileName,folder);

}

function LoadTemplate(language){

    const file = ResolveTemplateFile(language);

    return file
        .getBlob()
        .getDataAsString("UTF-8");

}

function YLGetTemplate(language){

    language = language || GetConfig("language");

    return LoadTemplate(language);

}

function YLSaveTemplate(language,html){

    const file = ResolveTemplateFile(language);

    file.setContent(html);

}

/*   Utilidades   */

function YLGetCurrentLanguage(){

    return GetConfig("language");

}

function YLGetCommandList(){

    return GetCommandList();

}

function FMListResources(type){

    let folderId;

    switch(type){

        case "IMAGE":
            folderId = GetConfig("publicImagesFolderId");
            break;

        case "DOCUMENT":
            folderId = GetConfig("publicDocumentsFolderId");
            break;

        case "AUDIO":
            folderId = GetConfig("publicAudioFolderId");
            break;

        case "VIDEO":
            folderId = GetConfig("publicVideoFolderId");
            break;

        default:
            throw new Error(
                "Tipo de recurso no soportado: " + type
            );

    }

    if(!folderId){

        throw new Error(
            "No está configurada la carpeta para el tipo de recurso: " + type
        );

    }

    const folder = DriveApp.getFolderById(folderId);
    const files  = folder.getFiles();
    const result = [];

    while(files.hasNext()){

        const f = files.next();

        YLInfo(
            "SYSTEM",
            "FM",
            "FMListResources",
            "Archivo  : " + f.getName()
        );

        /*
            IMPORTANTE

            No devolver objetos Date mediante google.script.run.

            Apps Script no serializa correctamente Date dentro de
            arrays de objetos y el cliente recibe NULL.

            Siempre convertir las fechas a String mediante
            Utilities.formatDate().
        */

        result.push({

            id   : f.getId(),
            name : f.getName(),
            mime : f.getMimeType(),
            size : f.getSize(),
            // URL para abrir el recurso
            url  : f.getUrl(),
            // URL para visualizar imágenes
            imageUrl :

                "https://drive.google.com/thumbnail?id=" +
                f.getId() +
                "&sz=w1600",
            thumbnail :
                "https://drive.google.com/thumbnail?id="+
                f.getId()+
                "&sz=w256",
            date : Utilities.formatDate(
                f.getLastUpdated(),
                Session.getScriptTimeZone(),
                "yyyy-MM-dd HH:mm:ss"
            )

        });


    }

    result.sort((a, b) =>
        a.name.localeCompare(
            b.name,
            undefined,
            {
                sensitivity: "base",
                numeric: true
            }
        )
    );

    YLInfo(
      "SYSTEM",
      "FM",
      "FMListResources",
      "Total recursos: " + result.length
    );

    return result;

}

function YLRestoreTemplate(language){

    language = language || GetConfig("language");

    const folder = DriveApp.getFolderById(

        GetConfig("helpFolderId")

    );

    const defaults = folder.getFilesByName("template.DEFAULT.html");

    if(!defaults.hasNext())

        throw new Error(

            "No existe template.DEFAULT.html"

        );

    const html = defaults

        .next()

        .getBlob()

        .getDataAsString("UTF-8");

    const file = ResolveTemplateFile(language);

    file.setContent(html);

    return html;

}