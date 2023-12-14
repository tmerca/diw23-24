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
let users = document.getElementById("users");

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
    store.createIndex("userimg", "userimg", { unique: false });
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
      // console.log(cursor.value);
      cursor.continue();
    } else {
      console.log("EOF");
      //Operations to do after reading all the records
      showUsers(result);
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

function showUsers(users) {
  var ul = document.getElementById("users-ul");

  ul.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    ul.innerHTML +=
      "<li><span><div>Id: " +
      users[i].id +
      "</span></div><span><div>Username: " +
      users[i].username +
      "</span></div><span><div>Useremail: " +
      users[i].useremail +
      "</span></div><span><div id='messageDelete_"+users[i].id+"'></div></span><button user_id=" +
      users[i].id +
      " id=user_" +
      users[i].id +
      ">Delete user</button></li>";
  }

  for (let i = 0; i < users.length; i++) {
    document.getElementById("user_" + users[i].id).addEventListener('click', () =>{
        document.getElementById("messageDelete_" + users[i].id).innerHTML= 
        "<div>Are you sure you want to delete this user?</div>"+
        "<div id='answer'><button id='delete_"+users[i].id+"'>Yes</button><button id='no'>No</button></div>";
        
        document.getElementById('answer').addEventListener('click', (e) =>{
           if(e.target.id == 'delete_'+users[i].id){
            console.log("Deleted");
           }
        });

    });
  }
}


function deleteUser(e) {
  
  console.log("deleteUser");
  var button_id = e.target.id;
  var user_id = document.getElementById(button_id).getAttribute("user_id");
  
  openCreateDb(function (db) {
    console.log(user_id);
    var tx = db.transaction(DB_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_STORE_NAME);
  
    //Delete data in our ObjectStore
    var req = store.delete(parseInt(user_id));
  
    req.onsuccess = function (e) {
      console.log("deleteUser: Data successfully removed: " + user_id);
  
      //Operation to do after deleting a record
      readData();
    };
  
    req.onerror = function (e) {
      console.error("deleteUser: error removing data:", e.target.errorCode);
    };
  
    tx.oncomplete = function () {
      console.log("deleteUser: tx completed");
      db.close();
      opened = false;
    };
  });
}

window.addEventListener("load", (e) => {
  readData();
});
