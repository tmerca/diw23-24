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

function sendData() {
  openCreateDb(function (db) {
    addUser(db);
  });
}

// FUNCION PARA AÑADIR UN USUARIO
function addUser(db) {
  var username = document.getElementById("username");
  var useremail = document.getElementById("useremail");
  var userpwd = document.getElementById("userpwd");
  var useradmin = document.getElementById("useradmin");
  var obj = {
    username: username.value,
    useremail: useremail.value,
    userpwd: userpwd.value,
    useradmin: useradmin.value,
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

    /* Operations we want to do after inserting data
     */
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

      //Operations to do after reading a user
      // updateFormInputsToEdit(record);
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

const register = document.getElementById('register');

/*
COMPROBACIÓN FORMULARIO
*/

// let pass = true;
// const form = document.getElementById('form');
// const username = document.getElementById('username');
// const useremail = document.getElementById('useremail');
// const userpwd = document.getElementById('userpwd');

// function esObligatori(inputArray) {

//   inputArray.forEach((input) => {
//     if(input.value.trim() === '') {
//       pass = false;
//       mostraError(input, `${prenNomInput(input)} és obligatori`);
//     }
//   });

// }

// function comprovaLongitud(input, min, max) {
//   if (input.value.length < min) {
//     pass = false;
//     mostraError(input, `${prenNomInput(input)} ha de tenir mínim ${min} caràcters`);
//   } else if (input.value.length > max) {
//     pass = false;
//     mostraError(input, `${prenNomInput(input)} ha de tenir com a màxim ${max} caràcters`);
//   }
// }

// function esEmailValid(input) {
//   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//   if(re.test(input.value.trim())){

//   }else {
//     let missatge = `${prenNomInput(input)} no té el format correcte`
//     mostraError(input, missatge);
//     pass = false;
//   }

// }

// function mostraError(input, missatge) {

//   const formControl = input.parentElement;
//   const small = formControl.querySelector('small');
//   small.innerText = missatge;
// }

// function prenNomInput(input) {
//   return input.id.charAt(0).toUpperCase() * input.id.slice(1);
// }

// form.addEventListener('submit', (e) => {
//   e.preventDefault();

//   esObligatori([username, useremail, userpwd]);

//   comprovaLongitud(username, 3,15);
//   comprovaLongitud(userpwd, 6, 25);

//   esEmailValid(useremail);
// });

register.addEventListener("click", (e) => {
  sendData();
});

