/*

         Estructura del Proyecto

• Core.js → núcleo del sistema.
• Config.js → configuración e inicialización.
• HelpLibrary.js → lógica del editor de ayuda.
• NewsLibrary.js → lógica del editor de novedades.
• TableEditor.html → editor de tablas.
• HelpEditor.html → editor de ayuda.
• NewsEditor.html → editor de novedades.
• HelpPermissions.html → componente de permisos.
• RTE.html → biblioteca del editor enriquecido.
• YLAT.html → interfaz principal.


Ultimo guardado : 202607201852


*/


/*   Inicio   */

function doGet(){

    LoadConfig();

    return HtmlService
        .createTemplateFromFile("YLAT")
        .evaluate()
        .setTitle("YLAT");

}

/*   Configuración   */

function LoadConfig(){

    if(CONFIG.loaded)
      return;

    const rows = LoadTable("config");

    const headers = rows[0];
  
    const idxKey   = headers.indexOf("key");
  
    const idxValue = headers.indexOf("value");
  
    const idxType  = headers.indexOf("type");

    for(let i=1;i<rows.length;i++){

        const key = rows[i][idxKey];

        if(!key)
            continue;

        let value = rows[i][idxValue];

        switch(rows[i][idxType]){

            case "BOOLEAN":

                value =
                    String(value).toUpperCase()==="TRUE";

                break;

            case "INTEGER":

                value = Number(value);

                break;

        }

        CONFIG[key] = value;

    }

    CONFIG.loaded = true;

}

function GetConfig(key){

    const rows = LoadTable("config");
    const headers = rows[0];
    const idxKey   = headers.indexOf("key");
    const idxValue = headers.indexOf("value");
    const idxType  = headers.indexOf("type");

    key = String(key || "").trim();

    for(let i=1;i<rows.length;i++){

        if(String(rows[i][idxKey]).trim() !== key)
            continue;

        let value = rows[i][idxValue];

        switch(String(rows[i][idxType]).toUpperCase()){

            case "BOOLEAN":

                value = IsTrue(value);

                break;

            case "INTEGER":

                value = Number(value);

                break;

        }

        return value;

    }

    return null;

}

/*   Tablas   */

function GetTableFileId(
tableName
){

switch(
String(
tableName || ""
).toLowerCase()
){

case "config":
  return CONFIG.configCsvId;

case "commands":
    return GetConfig("commandsCsvId");

case "users":
    return GetConfig("usersCsvId");

case "catalog":
    return GetConfig("catalogCsvId");

default:
  throw new Error(
    "Tabla desconocida: " +
    tableName
  );

}

}

function LoadTable(
tableName
){

const fileId =

GetTableFileId(
  tableName
);

const file =

DriveApp.getFileById(
  fileId
);

return Utilities.parseCsv(

file

.getBlob()

.getDataAsString()

);

}

function SaveTable(
tableName,
rows
){

const fileId =

GetTableFileId(
  tableName
);

const csv =

rows

.map(
  row =>
  row.join(",")
)

.join("\n");

DriveApp

.getFileById(
  fileId
)

.setContent(
  csv
);

return true;

}

/*   Commands   */

function GetCommandList(){

  const rows = LoadTable("commands");

  if(!rows || rows.length < 2)
    return [];

  const headers = rows[0];

  const idxCommand = headers.indexOf("command");
  const idxType    = headers.indexOf("type");

  return rows
    .slice(1)
    .filter(row => row[idxType] === "COMMAND")
    .map(row => row[idxCommand])
    .filter(cmd => cmd)
    .sort((a,b)=>a.localeCompare(b));

}

/*   Interfaz   */

function YLGetInterfaceConfig(){

    return{

        logoFileId :
            GetConfig("logoFileId"),

        backgroundFileId :
            GetConfig("backgroundFileId")

    };

}

/*   Utilidades   */

function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}
