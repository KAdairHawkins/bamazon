var inquirer = require("inquirer");
var table = require("console.table");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

connection.connect();

connection.query('SELECT * from products', function (error, results) {
  if (error) throw error;
  console.table(results);
  buyStuff();
});



function buyStuff(){

  inquirer.prompt([{
    type: "list",
    name: "userChoice",
    message: "Choose your category",
    choices: ["books", "clothing", "video game", "medical", "home"]
  }]).then(function (answers) {
      connection.query('select * from products where department_name=?', [answers.userChoice], function(error, results){
        if (error) throw error;
        console.table(results);
      })
      inquirer.prompt([{
        type: "input",
        name: "userChoice",
        message: "What is the product name?",
      }]).then(function (answers) {
        var total = 0;
        connection.query('update products set stock_quantity = if(stock_quantity > 0, stock_quantity-1, stock_quantity) where product_name = ?',
         [answers.userChoice], function(error, results){
            if (error) {
              console.log("Out of stock");
          }
            else{
              connection.query('select price from products where product_name=?', [answers.userChoice], function(err, results){
              console.log("You have purchased " + answers.userChoice + "! " + results);
            })
          }
          })
          connection.end();
      });
  });
}
