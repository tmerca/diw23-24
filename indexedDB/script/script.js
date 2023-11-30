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
const REGISTER_USER = "Register";
let checkAdmin = "true";

/*openCreateDb 
  - Abre/Crea una base de datos IndexedDB
*/

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
    store.createIndex("useradmin", "useradmin", { unique : false });
    console.log("openCreateDb: Index created on useradmin");
    
  };

  req.onerror = function (e) {
    console.error(
      "openCreateDb: error opening or creating DB:",
      e.target.errorCode
    );
  };
}

function sendData(checkAdmin) {
  openCreateDb(function (db) {
    addUser(db);
  });
}

// FUNCION PARA AÑADIR UN USUARIO
function addUser(db) {
  var username = document.getElementById("username");
  var useremail = document.getElementById("useremail");
  var userpwd = document.getElementById("userpwd");
  checkAdmin = "false";
  if(document.getElementById('useradmin').checked){
    checkAdmin = "true";
  }

  var obj = {
    username: username.value,
    useremail: useremail.value,
    userpwd: userpwd.value,
    useradmin: checkAdmin,
  };

  // Start a new transaction in readwrite mode. We can use readonly also
  var tx = db.transaction(DB_STORE_NAME, "readwrite");
  var store = tx.objectStore(DB_STORE_NAME);

  try {
    //Inserts data in our ObjectStore
    req = store.add(obj);
  } catch (e) {
    console.log("Catch");
  }

  req.onsuccess = function (e) {
    console.log(
      "addUser: Data insertion succesfully done. Id: " + e.target.result
    );

    if(checkAdmin == "true"){
      window.location.replace("../adminPage/index.html");
    }else{
      window.location.replace("../UD1_EX4/mainPage.html");
    }
      
    clearFormInputs();
    readData();
  };

  req.onerror = function (e) {
    console.error("addUser: error creating data", this.error);
  };

  //After transaction is completed we close the database
  tx.oncomplete = function () {
    console.log("addUser: transaction completed");
    db.close();
    opened = false;
  };
}

function readData() {
  openCreateDb(function (db) {
    readUsers(db);
  });
}

// Reads all the records from our ObjectStore
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
      cursor.continue();
    } else {
      console.log("EOF");
      console.log(result);
      //Operations to do after reading all the records
      // addUsersToHTML(result)
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

function readUser(e) {
  console.log("readUser");

  var user_id = e.target.getAttribute("user_id");

  openCreateDb(function (db) {
    console.log(db);
    console.log("Id user: " + user_id);

    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);

    //Reads one record from our objectStore
    var req = store.get(parseInt(user_id));

    req.onsuccess = function (e) {
      var record = e.target.result;
      console.log(record);

    };

    req.onerror = function (e) {
      console.error("readUser: error reading data:", e.target.errorCode);
    };

    tx.oncomplete = function () {
      console.log("readUser: tx completed");
      db.close();
      opened = false;
    };
  });
}
function clearFormInputs() {
  document.getElementById("username").value = "";
  document.getElementById("useremail").value = "";
  document.getElementById("userpwd").value = "";
}

// ELEMENTS CAUGHT WITH DOM
const register = document.getElementById('register');
const username = document.getElementById('username');
const useremail = document.getElementById('useremail');
const userpwd = document.getElementById('userpwd');

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let isValid = true;


register.addEventListener("click", (e) => {
  console.log(username.value);
  if(username.value === ''){
    document.getElementById('smallUsername').innerText = "Username can't be empty";
    isValid = false;
  }
  
  if(useremail.value === ''){
    document.getElementById('smallUseremail').innerText = "User email can't be empty";
    isValid = false;
  }
  
  if(userpwd.value === '') {
    document.getElementById('smallUserpwd').innerText = "Password can't be empty";
    isValid = false;
  }

  if(isValid == true){
    sendData(checkAdmin);
    
  }

});

/*
  CHECKING THAT THE INFORMATION OF THE FORM IS VALID
*/

// window.addEventListener("load", (e) => {
//   readData();
// });
