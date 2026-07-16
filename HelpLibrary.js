/*Ultimo guardado : 202607131950*/
/*   HelpLibrary.js   */

/*     Help     */

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

    const cfg = LoadConfig();

    let folderId;

    switch(type){

        case "Imagen":
            folderId = cfg.publicImagesFolderId;
            break;

        case "Documento":
            folderId = cfg.publicDocumentsFolderId;
            break;

        case "Audio":
            folderId = cfg.publicAudioFolderId;
            break;

        case "Video":
            folderId = cfg.publicVideoFolderId;
            break;

        default:
            return [];

    }

    const folder = DriveApp.getFolderById(folderId);

    const files = folder.getFiles();

    const result = [];

    while(files.hasNext()){

        const f = files.next();

        result.push({

            id   : f.getId(),

            name : f.getName(),

            mime : f.getMimeType(),

            size : f.getSize(),

            date : f.getLastUpdated(),

            url  : f.getUrl()

        });

    }

    return result;

}


