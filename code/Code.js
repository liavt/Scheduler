function start(){
  var html = HtmlService.createTemplateFromFile('entry').evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(html,'What do you want to do?');
}
