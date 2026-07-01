/*  YLLibrary   */

/******************************************************************************
 * Configuración
 ******************************************************************************/

function YLGetConfig(key){

    const rows = LoadTable("config");

    const headers = rows[0];

    const idxKey   = headers.indexOf("key");
    const idxValue = headers.indexOf("value");

    for(let i=1;i<rows.length;i++){

        if(rows[i][idxKey]===key)

            return rows[i][idxValue];

    }

    return null;

}

function YLGetLanguage(){

    return YLGetConfig("language");

}

function YLGetHelpFolderId(){

    return YLGetConfig("helpFolderId");

}

/******************************************************************************
 * Help
 ******************************************************************************/

function YLBuildHelpFileName(language){

    language = (language || "ES").toUpperCase();

    return "help." + language + ".json";

}

function YLResolveHelpFile(language){

    const folderId = YLGetHelpFolderId();

    if(!folderId)
        throw new Error("helpFolderId no configurado.");

    const folder = DriveApp.getFolderById(folderId);

    const fileName = YLBuildHelpFileName(language);

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


/******************************************************************************
 * Help
 ******************************************************************************/

function YLLoadHelp(language){

    const file = YLResolveHelpFile(language);

    const text = file.getBlob().getDataAsString("UTF-8").trim();

    if(text === "")
        return {};

    return JSON.parse(text);

}

function YLGetHelp(command,language){

    language = language || YLGetLanguage();

    const help = YLLoadHelp(language);

    if(help.hasOwnProperty(command))
        return help[command];

    return{

        html:
            "<h2>"+command+"</h2>"+
            "<p>Aún no existe ayuda para este comando.</p>"

    };

}

function YLGetCommandList(){

    return GetCommandList();

}

function YLSaveHelp(language,data){

    const file = YLResolveHelpFile(language);

    file.setContent(

        JSON.stringify(
            data,
            null,
            2
        )

    );

}

function YLSaveCurrentHelp(command,html,language){

    language = language || YLGetLanguage();

    const help = YLLoadHelp(language);

    help[command]={

        html:html

    };

    YLSaveHelp(language,help);

}

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

function YLGetCurrentLanguage(){

    return YLGetLanguage();

}

function YLBuildTemplateFileName(language){

    language = (language || "ES").toUpperCase();

    return "template." + language + ".html";

}

function YLResolveTemplateFile(language){

    const folderId = YLGetHelpFolderId();

    const folder = DriveApp.getFolderById(folderId);

    const fileName = YLBuildTemplateFileName(language);

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

function YLLoadTemplate(language){

    const file = YLResolveTemplateFile(language);

    return file
        .getBlob()
        .getDataAsString("UTF-8");

}

function YLSaveTemplate(language,html){

    const file = YLResolveTemplateFile(language);

    file.setContent(html);

}

function YLGetTemplate(language){

    language = language || YLGetLanguage();

    return YLLoadTemplate(language);

}
