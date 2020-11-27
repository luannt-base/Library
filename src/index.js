/**
 * Thiết kế database cho 1 hệ thống quản lý thư viện sách, cho biết thư viện này có hàng trăm giá sách khác nhau, sách được để ở bất kì giá nào không theo danh mục nào.
 * Mỗi cuốn sách có 1 mã khác nhau.
 * Hệ thống cho phép đăng ký người dùng mới, một người có thể mượn nhiều sách khác nhau trong một khoảng thời gian hữu hạn.
 * Hệ thống có thể lưu lịch sử ai đã mượn sách nào, bắt đầu mượn từ bao lâu, trả lúc nào.
 * Hệ thống có lưu lại số ngày quá hạn tổng cộng của 1 người dùng, ví dụ sách A quá 2 ngày, sách B quá 3 ngày -> tổng 5 ngày
 */

var readlineSync = require('readline-sync');
var fs = require('fs');

var dataUsers = [];
var dataBooks = [];
var rentBooks = [];
var getName = [];

//LOAD USER
function loadUser() {
  var fileUser = fs.readFileSync('./dataUser.json');
  dataUsers = JSON.parse(fileUser);
}

//SAVE USER
function saveUser() {
  var content = JSON.stringify(dataUsers)
  fs.writeFileSync('./dataUser.json',content, {encoding: 'utf8'})
}

//LOAD DATABOOK
function loadDataBook() {
  var fileDataBook = fs.readFileSync('./databaseBook.json');
  dataBooks = JSON.parse(fileDataBook)
}

//SAVE DATABOOK
function saveDataBook() {
  var content = JSON.stringify(dataBooks);
  fs.writeFileSync('./databaseBook.json', content, {encoding: 'uft8'});
}

//LOAD RENT BOOK
function loadRentBook() {
  var fileDataRentBook = fs.readFileSync('./dataRentBook.json')
  rentBooks = JSON.parse(fileDataRentBook)
}

//SAVE RENT BOOK
function saveRentBook() {
  var content = JSON.stringify(rentBooks);
  fs.writeFileSync('./dataRentBook.json', content, {encoding: 'utf8'});
}

//SHOW BOOK
function showBook() {
  
  for (let book of dataBooks) {
    console.log(book.idByBook + "---" + book.name + "---"+ "expiration after " + book.expiration + ' days')
  }
}

//ADD USER
function addUser() {
  var username = readlineSync.question("Enter new username: ");
  var password = readlineSync.question("Enter new password: ");

  var newUser = {
    username: username,
    password: password
  }

  dataUsers.push(newUser);
  console.log("-----Add new user success-----")
  saveUser();
}

//LOGIN USER
function loginUser() {      
  var username = readlineSync.question("Enter username: ");
  var password = readlineSync.question("Enter password: ", {
    hideEchoBack: true,
  });
  
  var findUsername = dataUsers.find(function(user) {
    return user.username === username;
  });

  if (findUsername) {
    var findPassword = dataUsers.find(function(user) {
      return user.password === password
    })
  }
  
  if (findPassword) {
    console.log("Login success");
    getName.push(username);
    console.clear();
    console.log(`-----WELCOME ${findUsername.username.toUpperCase()} TO LIBRARY-----`);
  } else {
    console.log("Incorrect username or password")
  }

  return findPassword;
}

//CHECK USER
function checkUser() {
  var checkAcc = readlineSync.keyInYN('Do u have an account ? ');
  
  if (checkAcc) {
    return checkAcc;
  } else {
    console.log("--------Add new user--------");
    addUser();
  } 
}

//RENT A BOOK
function rentABook(rentBook) {
  var findBookbyId = dataBooks.find(function(books){ return books.idByBook == rentBook; });

  var today = new Date();
  var daterent = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var dateRent = daterent.getFullYear() + '/' + daterent.getMonth() + '/' + daterent.getDate();

  var dateExp = new Date(today.getFullYear(), today.getMonth(), today.getDate() + findBookbyId.expiration);

  var dateExpiration = dateExp.getFullYear() + '/' + dateExp.getMonth() + '/' + dateExp.getDate();

  var book = {
    username: getName[0],
    id: parseInt(findBookbyId.idByBook, 10),
    name: findBookbyId.name,
    dateRent: dateRent,
    DATE_RENT: daterent,
    expiration: findBookbyId.expiration,
    dateExpiration : dateExpiration,
    status: 1
  };
    
  rentBooks.push(book);
  saveRentBook();

}

//HISTORY OF BORROW"S book
function historyRentBook() {
  var findName = rentBooks.filter(function(user) {
      return user.username === getName[0]
  })

  for (let users of findName) {
    console.log("----------------------------");
    console.log("User: ", users.username);
    console.log("Id: ", users.id);
    console.log("Name of book: ", users.name);
    console.log("Date of Rent: ", users.dateRent);
    console.log("Expiration: ", users.expiration);
    console.log("Date of Expiration: ", users.dateExpiration);
    console.log("Status: ", users.status);
  }
}

//RETURN A book
function returnBook() {
  historyRentBook();
  
  var today = new Date();
  var DATE_RETURN = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var findName = rentBooks.filter(function(user) {
    return user.username === getName[0];
  });
 
  var chooseById = readlineSync.question("What's bookID u want to return ? ");

  for (var user of findName) {
    var checkDate = new Date(user.DATE_RENT);
    
    if (user.id === chooseById && user.status === 1) {
      var days = (DATE_RETURN - checkDate) / (1000*60*60*24);
      if (days > user.expiration) {
        console.log("You're expirated ", days - user.expiration, " days! You have to pay more money") 
      } else {
        user.status = 0;
        console.log("Return success");
      }
    }
  }
  saveRentBook();
}

//REMOVE AFTER RETURN
function removeBook() {
  console.log(rentBooks)

}




//CHECK OUT OF DATE
function checkOutOfDate() {
  historyRentBook();
  
  var today = new Date();
  var DATE_CHECK = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  var findName = rentBooks.filter(function(user) {
    return user.username === getName[0];
  });

  var findByID = readlineSync.question("What's bookID u want to find ? ");
  
  
}


//SHOW MENU
function showMenu() {
  console.log("1.Rent a book");
  console.log("2.History of borrow's book");
  console.log("3.Return a book");
  console.log("4.Check out of date");
}


function main() {
  loadUser();
  loadDataBook();
  loadRentBook();

  if ( checkUser() ) {
    if( loginUser() ) {
      showMenu();
      var option = readlineSync.question("> ")

      switch(option) {

        case '1': 
          showBook();
          var rentbook = readlineSync.question("What is book u want to RENT? ")
          rentABook(rentbook)
          break;

        case '2':    
          historyRentBook();
          break;
        case '3': 
          returnBook();
          break;
        case '4':
          removeBook();
          break;
        default: break;
  }
    }
  }


}

main();

