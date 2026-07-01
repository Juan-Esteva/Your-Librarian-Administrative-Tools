function doGet() {

  return HtmlService
    .createTemplateFromFile("YLAT")
    .evaluate()
    .setTitle("YLAT");

}

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
  return CONFIG.commandsCsvId;

case "users":
  return CONFIG.usersCsvId;

 case "catalog":
  return CONFIG.catalogCsvId; 

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

function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}
