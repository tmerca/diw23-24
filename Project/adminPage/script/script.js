var indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
var database = "usersDB_Andreu";
const DB_STORE_NAME = "users";
const DB_VERSION = 1;
var db;
var opened = false;
let users = document.getElementById('users');

function openCreateDb(onDbCompleted) {
  if (opened) {
    db.close();
    opened = false;
  }

  // We could open changing version ..open(database,3)
  var req = indexedDB.open(database, DB_VERSION);

  // This is how we pass the DB instance to our var
  req.onsuccess = function (e) {
    db = this.result;
    console.log("openCreateDb: Databased opened " + db);
    opened = true;

    //The function passed by parameter is called after creating/opening database
    onDbCompleted(db);
  };

  /*
      Very important fired when 
      1. ObjectStore first time creation
      2. Version change
    */

  req.onupgradeneeded = function () {
    db = req.result;

    console.log("openCreateDb: upgrade needed " + db);
    var store = db.createObjectStore(DB_STORE_NAME, {
      keyPath: "id",
      autoIncrement: true,
    });
    console.log("openCreateDb: Object store created");

    store.createIndex("username", "username", { unique: false });
    console.log("openCreateDb: Index created on username");
    store.createIndex("useremail", "useremail", { unique: false });
    console.log("openCreateDb: Index created on useremail");
    store.createIndex("userpwd", "userpwd", { unique: false });
    console.log("openCreateDb: Index created on userpwd");
    store.createIndex("useradmin", "useradmin", { unique: false });
    console.log("openCreateDb: Index created on useradmin");
    store.createIndex("userimg", "userimg", { unique : false});
    console.log("openCreateDb: Index created on userimg");

  };

  req.onerror = function (e) {
    console.error(
      "openCreateDb: error opening or creating DB:",
      e.target.errorCode
    );
  };
}

function readData() {
  openCreateDb(function (db) {
    readUsers(db);
  });
}

function readUsers(db) {
  var tx = db.transaction(DB_STORE_NAME, "readonly");
  var store = tx.objectStore(DB_STORE_NAME);

  var result = [];
  var req = store.openCursor();

  req.onsuccess = function (e) {
    var cursor = e.target.result;

    if (cursor) {
      result.push(cursor.value);
      console.log(cursor.value);
      showUsers();
      cursor.continue();
    } else {
      console.log("EOF");
      //Operations to do after reading all the records
      // addUsersToHTML(result)
    }

    function showUsers(){
        users.innerHTML = "<li class='infoUser'><div> Username: <strong><span id='username'>" + cursor.value.username + "</span></strong></div>" 
        + "<div>Useremail:<strong><span id='useremail'>" + cursor.value.useremail + "</span></strong></div>" 
        + "<div>Image path: <strong><span id='userpath'>" + cursor.value.userimg + "</span></strong></div>" 
        + "<div>Id: <strong><span id='userid'>" + cursor.value.id +"</span></strong></div>"
        + "<button id='delete'>Delete User</button></li>" + users.innerHTML;
    }


  };

  req.onerror = function (e) {
    console.error("readUsers: error reading data:", e.target.errorCode);
  };

  tx.oncomplete = function () {
    console.log("readUsers: tx completed");
    db.close();
    opened = false;
  };
}

window.addEventListener("load", (e) => {
  readData();
});
