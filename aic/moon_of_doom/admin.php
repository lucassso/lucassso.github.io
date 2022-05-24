 <?php
session_start();
require_once "function_shortcut.php";
require_once "config.php";
$dbh = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
echo "Welcome, super cool guy (swag admin) <a href='logout.php'>[log out]</a> <br>";
//this page will display all admin tools
$queryEntered = false;

if (isset($_POST["query"])){
  $queryEntered = true;
  // probably the only time the prepare() will contain a varaible
  // we can trust the user though cause its us :/
  $queryHandler = $dbh->prepare($_POST["query"]);
  $queryHandler->execute();
  $output = $queryHandler->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="main.css">

    <style>
      table{
        display: block;
        height: 250px;
        width: fit-content;
        border: 1px solid black;
        border-radius: 2px;
        overflow-y: scroll;
        margin: 2px;
      }
      td{
        border: 1px solid black;
        border-radius: 2px;
        margin: 2px;
        padding: 2px;
        height: 20px;
        text-align: center;
      }
      th{
        border: 1px solid black;
        border-radius: 2px;
        margin: 2px;
        padding: 2px;
        height: 20px;
        text-align: center;
      }
      textarea{
        resize: none;
      }
      form{
        border: 1px solid black;
        border-radius: 2px;
        margin: 2px;
        padding: 2px;
        position:sticky;
        position:-webkit-sticky;
        bottom:0;
        float: right;
      }
      form input{
        display: block;
      }
    </style>
    <title>Moon of Doom - Admin</title>
  </head>
  <body>
    <?php
      // user table
      echo "<h3>user</h3>";
      echo "<table>";
      echo "<tr>
      <th>user_id</th>
      <td>username</td>
      <td>password</td>
      <td>role</td>
      <td>progress_id</td>
      </tr>";
      $getTableUser = $dbh->prepare("SELECT * FROM user;");
      $getTableUser->execute();
      $tableUser = $getTableUser->fetchAll();
      for($i = 0; $i < count($tableUser); $i++){
        echo "<tr>
        <th>{$tableUser[$i]["user_id"]}</th>
        <td>{$tableUser[$i]["username"]}</td>
        <td>{$tableUser[$i]["password"]}</td>
        <td>{$tableUser[$i]["role"]}</td>
        <td>{$tableUser[$i]["progress_id"]}</td>
        </tr>";
      }
      echo "<tr>
      <th></th>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      </tr>";
      echo "</table>";

      // progress table
      echo "<h3>progress</h3>";
      echo "<table>";
      echo "<tr>
      <th>progress_id</th>
      <td>health</td>
      <td>money</td>
      <td>obstacle_id</td>
      </tr>";
      $getTableProgress = $dbh->prepare("SELECT * FROM progress;");
      $getTableProgress->execute();
      $tableProgress = $getTableProgress->fetchAll();
      for($i = 0; $i < count($tableProgress); $i++){
        echo "<tr>
        <th>{$tableProgress[$i]["progress_id"]}</th>
        <td>{$tableProgress[$i]["health"]}</td>
        <td>{$tableProgress[$i]["money"]}</td>
        <td>{$tableProgress[$i]["obstacle_id"]}</td>
        </tr>";
      }
      echo "<tr>
      <th></th>
      <td></td>
      <td></td>
      <td></td>
      </tr>";
      echo "</table>";

      // obstacle table
      echo "<h3>obstacle</h3>";
      echo "<table>";
      echo "<tr>
      <th>obstacle_id</th>
      <td>name</td>
      <td>health</td>
      <td>atk_stat</td>
      </tr>";
      $getTableObstacle = $dbh->prepare("SELECT * FROM obstacle;");
      $getTableObstacle->execute();
      $tableObstacle = $getTableObstacle->fetchAll();
      for($i = 0; $i < count($tableObstacle); $i++){
        echo "<tr>
        <th>{$tableObstacle[$i]["obstacle_id"]}</th>
        <td>{$tableObstacle[$i]["name"]}</td>
        <td>{$tableObstacle[$i]["health"]}</td>
        <td>{$tableObstacle[$i]["atk_stat"]}</td>
        </tr>";
      }
      echo "<tr>
      <th></th>
      <td></td>
      <td></td>
      <td></td>
      </tr>";
      echo "</table>";

      // inventory table
      echo "<h3>inventory</h3>";
      echo "<table>";
      echo "<tr>
      <th>inventory_id</th>
      <td>progress_id</td>
      <td>item_id</td>
      </tr>";
      $getTableInventory = $dbh->prepare("SELECT * FROM inventory;");
      $getTableInventory->execute();
      $tableInventory = $getTableInventory->fetchAll();
      for($i = 0; $i < count($tableInventory); $i++){
        echo "<tr>
        <th>{$tableInventory[$i]["inventory_id"]}</th>
        <td>{$tableInventory[$i]["progress_id"]}</td>
        <td>{$tableInventory[$i]["item_id"]}</td>
        </tr>";
      }
      echo "<tr>
      <th></th>
      <td></td>
      <td></td>
      </tr>";
      echo "</table>";

      // item table
      echo "<h3>item</h3>";
      echo "<table>";
      echo "<tr>
      <th>item_id</th>
      <td>name</td>
      <td>use</td>
      <td>stat</td>
      </tr>";
      $getTableItem = $dbh->prepare("SELECT * FROM item;");
      $getTableItem->execute();
      $tableItem = $getTableItem->fetchAll();
      for($i = 0; $i < count($tableItem); $i++){
        echo "<tr>
        <th>{$tableItem[$i]["item_id"]}</th>
        <td>{$tableItem[$i]["name"]}</td>
        <td>{$tableItem[$i]["use"]}</td>
        <td>{$tableItem[$i]["stat"]}</td>
        </tr>";
      }
      echo "<tr>
      <th></th>
      <td></td>
      <td></td>
      <td></td>
      </tr>";
      echo "</table>";

      //now put the query info if they put one
      if ($queryEntered){
        echo $_POST["query"];
        better_var_dump($output);
      }

     ?>
     <form method="post" action="admin.php">
       <textarea cols="55" rows="15" name="query" required placeholder="Enter SQL query..." ></textarea>
       <input type="submit" value="Run SQL Query">
     </form>
  </body>
</html>
