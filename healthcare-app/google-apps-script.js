// Google Apps Script for HealthCare Pro Appointment System
// Deploy this script as a Web App to receive appointments from the hospital app

var SHEET_NAME = "Hospital Appointments";

function doGet(e) {
  return ContentService.createTextOutput("HealthCare Pro API is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    // Get or create the spreadsheet
    var ss = getOrCreateSpreadsheet();
    var sheet = getOrCreateSheet(ss);
    
    if (action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        result: "success",
        message: "Test connection successful!",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'addAppointment') {
      // Add new appointment row
      var newRow = [
        data.timestamp || new Date().toISOString(),
        data.id || '',
        data.patient || '',
        data.phone || '',
        data.email || '',
        data.type || '',
        data.service || '',
        data.date || '',
        data.time || '',
        data.shift || '',
        data.notes || '',
        data.status || 'Confirmed'
      ];
      
      sheet.appendRow(newRow);
      
      // Format the new row
      var lastRow = sheet.getLastRow();
      var range = sheet.getRange(lastRow, 1, 1, newRow.length);
      
      // Set background color based on shift
      if (data.shift === 'Morning') {
        range.setBackground('#fff3cd'); // Light yellow for morning
      } else if (data.shift === 'Night') {
        range.setBackground('#d1ecf1'); // Light blue for night
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        result: "success",
        message: "Appointment added successfully!",
        appointmentId: data.id,
        row: lastRow
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'cancelAppointment') {
      // Find and update the appointment status
      var id = data.id;
      var lastRow = sheet.getLastRow();
      var dataRange = sheet.getRange(2, 2, lastRow - 1, 1); // Column B is ID
      var ids = dataRange.getValues();
      
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] == id) {
          // Update status in column L (12th column)
          sheet.getRange(i + 2, 12).setValue('Cancelled');
          sheet.getRange(i + 2, 1, 1, 12).setBackground('#f8d7da'); // Light red for cancelled
          
          return ContentService.createTextOutput(JSON.stringify({
            result: "success",
            message: "Appointment cancelled successfully!",
            appointmentId: id
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        result: "error",
        message: "Appointment not found"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: "Unknown action: " + action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSpreadsheet() {
  var spreadsheets = DriveApp.getFilesByName(SHEET_NAME);
  
  if (spreadsheets.hasNext()) {
    var file = spreadsheets.next();
    return SpreadsheetApp.open(file);
  } else {
    // Create new spreadsheet
    var ss = SpreadsheetApp.create(SHEET_NAME);
    
    // Share it publicly (for web app access)
    // Note: In production, you might want more restrictive sharing
    var file = DriveApp.getFileById(ss.getId());
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    return ss;
  }
}

function getOrCreateSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
    
    // Create headers
    var headers = [
      "Timestamp",
      "ID",
      "Patient Name",
      "Phone",
      "Email",
      "Patient Type",
      "Service/Department",
      "Date",
      "Time",
      "Shift",
      "Notes",
      "Status"
    ];
    
    sheet.appendRow(headers);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#007bff');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

// Utility function to test from the script editor
function testFunction() {
  var testData = {
    action: 'test',
    timestamp: new Date().toISOString()
  };
  
  Logger.log("Test data: " + JSON.stringify(testData));
}
