/*Ultimo guardado : 202607140432*/

/*       NewsLibrary.js       */

/*   Configuración   */

function YLGetNewsFolderId(){

    return GetConfig("newsFolderId");

}

/*   Resolución de archivos   */

function YLResolveNewsFolder(){

    const folderId = YLGetNewsFolderId();

    if(!folderId)

        throw new Error("newsFolderId no configurado.");

    return DriveApp.getFolderById(folderId);

}

function YLResolveNewsFile(){

    const folder = YLResolveNewsFolder();

    const files = folder.getFilesByName("news.tmp");

    if(files.hasNext())

        return files.next();

    return null;

}

/*    Carga   */

function YLLoadNews(){

    const file = YLResolveNewsFile();

    if(!file){

        return{

            title     : "",

            html      : "",

            daily      : true,

            weekly     : false,

            monthly    : false,

            catalog    : false,

            preserve   : true

        };

    }

    const news = JSON.parse(

        file

            .getBlob()

            .getDataAsString("UTF-8")

    );

    //
    // Compatibilidad con gacetillas antiguas
    //

    return{

        title     : news.title     || "",

        html      : news.html      || "",

        daily     : !!news.daily,

        weekly    : !!news.weekly,

        monthly   : !!news.monthly,

        catalog   : !!news.catalog,

        preserve  : ("preserve" in news)
                     ? !!news.preserve
                     : true

    };

}

function YLGetNews(){

    return YLLoadNews();

}

/*   Guardar   */

function YLSaveNews(news){

    const folder = YLResolveNewsFolder();

    let file = YLResolveNewsFile();

    const data = {

        title : String(news.title || "").trim(),

        html : String(news.html || ""),

        daily : !!news.daily,

        weekly : !!news.weekly,

        monthly : !!news.monthly,

        catalog : !!news.catalog,

        preserve : !!news.preserve

    };

    const json = JSON.stringify(

        data,

        null,

        2

    );

    if(file){

        file.setContent(json);

    }
    else{

        folder.createFile(

            "news.tmp",

            json,

            MimeType.PLAIN_TEXT

        );

    }

    return true;

}

/*   Eliminar   */

function deleteNews(){

    dcConfirm(

        "¿Eliminar la gacetilla activa?",

        function(){

            google.script.run

                .withSuccessHandler(function(){

                    document.getElementById("newsTitle").value = "";

                    document.getElementById("newsDaily").checked = true;

                    document.getElementById("newsWeekly").checked = false;

                    document.getElementById("newsMonthly").checked = false;

                    document.getElementById("newsCatalog").checked = false;

                    document.getElementById("newsPreserve").checked = true;

                    document.getElementById("newsDocument").innerHTML = "";

                    document.getElementById("newsTitle").focus();

                    dcAlert(

                        "La gacetilla fue eliminada.",

                        "EDN"

                    );

                })

                .withFailureHandler(function(err){

                    dcAlert(

                        err.message,

                        "EDN"

                    );

                })

                .YLDeleteNews();

        },

        "EDN"

    );

}


