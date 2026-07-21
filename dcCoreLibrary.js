/*

    
                   dcCore.js
    

    Núcleo del ecosistema VY²

    Objetivo
    --------

    Contener funciones genéricas reutilizables por todos los
    proyectos del ecosistema (YL, YLAT, Vniversitas y futuros).

    Principios
    ----------

    - No contiene código específico de ningún proyecto.
    - No accede a tablas propias de un proyecto.
    - No depende de la interfaz gráfica.
    - No depende del modelo de datos.
    - Puede ser incluido sin modificaciones en cualquier proyecto.

*/


/*   BOOLEAN    */

/*

    Primer Mandamiento de VY²

    TRUE  = Y = 1
    FALSE = N = 0

*/

function IsTrue(value){

    value = String(value)
        .trim()
        .toUpperCase();

    return (
        value === "Y"    ||
        value === "TRUE" ||
        value === "1"
    );

}

function IsFalse(value){

    value = String(value)
        .trim()
        .toUpperCase();

    return (
        value === "N"     ||
        value === "FALSE" ||
        value === "0"
    );

}


/*        STRINGS       */




/*       NÚMEROS        */




/*    FECHAS Y HORAS    */




/*     VALIDACIONES     */




/*  VALORES POR DEFECTO */




/*     CONVERSIONES     */




/*     COMPARACIONES     */




/*  UTILIDADES GENERALES  */




/*    COMPATIBILIDAD     */


/*

Funciones auxiliares para mantener compatibilidad entre
versiones del ecosistema VY².

*/
