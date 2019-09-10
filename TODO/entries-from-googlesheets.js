// Client ID and API key from the Developer Console
var CLIENT_ID = '215602376829-pr8qukbn4anrvrlo6bueknkf8d0c3h89.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDRLzj5Fl0XCv-eMBrcWdRuUR1LjskYJP4';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(onSignInChange);

    // Handle the initial sign-in state.
    onSignInChange(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick; 
  }, function(error) {
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function onSignInChange(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    // This is where we do the heavy lifting.
    executeOnSheetData('LifeListDb')
    .then(retrieveEntries)
    .then(displayEvents)
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    clearData();
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  clearData();
}

/**
 * Get Entries from google sheets and set them to the globally accessible variable 'entries'
 */
function retrieveEntries(spreadsheetID) {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetID,
    range: 'entries',
  }).then(function(response) {
    var range = response.result;
    let entries = [];
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        entries.push({
        "Name": row[1],
        "Body": row[2],
        "Category": row[5].split(','),
        "CreatedDate": row[3],
        "ModifiedDate": row[4],
        "CompletionDate" : row[6]
        })

      }
    }
    return entries;
  }, function(response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function clearData() {

}
/**
* Uses the Google Drive api (different from sheets) to get the id of the spreadsheet with the given name.
* returns a promise of the spreadsheetID if found, null otherwise. 
* If Not found then log error. 
*/
function executeOnSheetData(fileName) {
  return gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': "nextPageToken, files(id, name)"
  }).then(function(response) {

    var files = response.result.files;
    if (files && files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.name === fileName){
          return file.id;
        }
      }
      console.log(`File with name ${fileName} not found.`);
    } else {
      console.log('No files found.');
    }
    
    return null;

  });
}
