var gotoLabels= {};
var whileLabels = {};


Selenium.prototype.reset = function() {
    this.initialiseLabels();
    this.defaultTimeout = Selenium.DEFAULT_TIMEOUT;
    this.browserbot.selectWindow("null");
    this.browserbot.resetPopups();
}



Selenium.prototype.initialiseLabels = function()
{
    gotoLabels = {};
    whileLabels = { ends: {}, whiles: {} };
    var command_rows = [];
    var numCommands = htmlTestRunner.currentTest.htmlTestCase.commandRows.length;
    for (var i = 0; i < numCommands; ++i) {
        var x = htmlTestRunner.currentTest.htmlTestCase.commandRows[i];
        command_rows.push(x);
    }
    var cycles = [];
    var forEachCmds = [];
    for( var i = 0; i < command_rows.length; i++ ) {
        if (command_rows[i].type == 'command')
        switch( command_rows[i].command.toLowerCase() ) {
            case "label":
                gotoLabels[ command_rows[i].target ] = i;
                break;
            case "while":
            case "endwhile":
                cycles.push( [command_rows[i].command.toLowerCase(), i] )
                break;
            case "foreach":
            case "endforeach":
                forEachCmds.push( [command_rows[i].command.toLowerCase(), i] )
                break;
        }
    }
    var i = 0;
    while( cycles.length ) {
        if( i >= cycles.length ) {
            throw new Error( "non-matching while/endWhile found" );
        }
        switch( cycles[i][0] ) {
            case "while":
                if( ( i+1 < cycles.length ) && ( "endwhile" == cycles[i+1][0] ) ) {
                    whileLabels.ends[ cycles[i+1][1] ] = cycles[i][1];
                    whileLabels.whiles[ cycles[i][1] ] = cycles[i+1][1];
                    cycles.splice( i, 2 );
                    i = 0;
                } else ++i;
                break;
            case "endwhile":
                ++i;
                break;
        }
    }

}

Selenium.prototype.continueFromRow = function( row_num )
{
    if(row_num == undefined || row_num == null || row_num < 0) {
        throw new Error( "Invalid row_num specified." );
    }
    testCase.debugContext.debugIndex = row_num;
}

Selenium.prototype.doLabel = function(){};

Selenium.prototype.doGotoLabel = function( label )
{
    if( undefined == gotoLabels[label] ) {
        throw new Error( "Specified label '" + label + "' is not found." );
    }
    this.continueFromRow( gotoLabels[ label ] );
};

Selenium.prototype.doGoto = Selenium.prototype.doGotoLabel;

Selenium.prototype.doGotoIf = function( condition, label )
{
    if( eval(condition) ) this.doGotoLabel( label );
}

Selenium.prototype.doWhile = function( condition )
{
    if( !eval(condition) ) {
        var last_row = testCase.debugContext.debugIndex;
        var end_while_row = whileLabels.whiles[ last_row ];
        if( undefined == end_while_row ) throw new Error( "Corresponding 'endWhile' is not found." );
        this.continueFromRow( end_while_row );
    }
}

Selenium.prototype.doEndWhile = function()
{
    var last_row = testCase.debugContext.debugIndex;
    var while_row = whileLabels.ends[ last_row ] - 1;
    if( undefined == while_row ) throw new Error( "Corresponding 'While' is not found." );
    this.continueFromRow( while_row );
}

Selenium.prototype.doPush= function(value, varName)
{
    if(!storedVars[varName]) {
        storedVars[varName] = new Array();
    }
    if(typeof storedVars[varName] !== 'object') {
        throw new Error("Cannot push value onto non-array " + varName);
    } else {
        storedVars[varName].push(value);
    }
}

Selenium.prototype.doStoreLogin= function(varName){
    storedVars[varName] = "uitest+aotest1011@aboutone.com";
}

Selenium.prototype.doStorePassword= function(varName){
    storedVars[varName] = "Testabout99$";
}

Selenium.prototype.doStoreCreditCardNo= function(varName){
    storedVars[varName] = "4868306050559917";
}

Selenium.prototype.doStoreDevPayPalLogin= function(varName){
    storedVars[varName] = "JLang-facilitator@aboutone.com";
}

Selenium.prototype.doStoreDevPayPalPassword= function(varName){
    storedVars[varName] = "9OneAbout3#";
}

Selenium.prototype.doStoreProdPayPalLogin= function(varName){
    storedVars[varName] = "support@aboutone.com";
}

Selenium.prototype.doStoreProdPayPalPassword= function(varName){
    storedVars[varName] = "3aboutone1";
}

Selenium.prototype.doStoreFacebookLogin= function(varName){
    storedVars[varName] = "uitest+aotest-facebook@aboutone.com";
}

Selenium.prototype.doStoreGoogleLogin= function(varName){
    storedVars[varName] = "uitest.aotes@gmail.com";
}

Selenium.prototype.doStoreAboutOneUrl= function(varName){
    storedVars[varName] = "https://go.aboutone.com/";
}

Selenium.prototype.doStoreGmailUrl= function(varName){
    storedVars[varName] = "https://mail.google.com/intl/en/mail/help/about.html";
}

Selenium.prototype.doStoreDay= function(varName){
    storedVars[varName] = "1";
}

Selenium.prototype.doStoreMonth= function(varName){
    storedVars[varName] = "November";
}

Selenium.prototype.doStoreYear= function(varName){
    storedVars[varName] = "2013";
}

Selenium.prototype.doStoreTenDay= function(varName){
    storedVars[varName] = "11";
}

//Dev: JLang-facilitator@aboutone.com // 9OneAbout3#
//Prod: support@aboutone.com // 3aboutone1
//Card information – 4868306050559917 with any future exp date
// storedVars["Login"] = "uitest+aotest1011@aboutone.com";
// storedVars["Password"] = "Testabout99$";
// storedVars["PayPalLogin"] = "JLang-facilitator@aboutone.com";
// storedVars["PayPalPassword"] = "9OneAbout3#";
// storedVars["CreditCardNo"] = "4868306050559917";