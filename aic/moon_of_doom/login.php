<?php
require_once "config.php";
require_once "function_shortcut.php";
$dbh = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
/*
VALIDATION TODO
- check if session started already
*/
//check if auth.php already ran
session_start();
if (count($_SESSION) > 1){
  session_destroy();
}
$errorOccurred = false;
$errorMessage = "";
if(isset($_GET["error"])){
  $errorOccurred = true;
  if($_GET["error"] == "1"){
    $errorMessage = "incorrect password";
  } else if($_GET["error"] == "2"){
    $errorMessage = "invalid inputs";
  } else if($_GET["error"] == "3"){
    $errorMessage = "username taken";
  } else if($_GET["error"] == "4"){
    $errorMessage = "not logged in";
  } else if($_GET["error"] == "5"){
    $errorMessage = "password doesn't match";
  } else {
    $errorMessage = "unknown";
  }
}
/*
error values:
1: incorrect password
2: invalid inputs
3: user exists
4: no account recognized
5: confirm password doesnt match
other? they probably messed with the URL, just say unknown
*/
 ?>
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
    <title>Moon of Doom - Log In</title>
    <!-- see main.css for grid positioning -->
    <link href="main.css" type="text/css" rel="stylesheet">

  </head>
  <body>
    <div id="containsForm">
      <form action="auth.php" method="post">
        <div id="login">
          <h3>Log In</h3>
          <input type="text" maxlength="15" name="Lusername" required placeholder="Username" class="userinput">
          <input type="password" maxlength="15" name="Lpassword" required placeholder="Password" class="pwdinput">
          <input type="submit" value="Log Into Account" id="submitLogIn">
        </div>
      </form>
      <form action="auth.php" method="post">
        <div id="signup">
          <h3>Sign Up</h3>
          <input type="text" maxlength="15" name="Susername" required placeholder="Username" class="userinput">
          <input type="password" maxlength="15" name="Spassword" required placeholder="Password" class="pwdinput">
          <input type="password" maxlength="15" name="Spassword2" required placeholder="Confirm Password" class="pwd2input">
          <input type="submit" value="Create New Account" id="submitSignUp">
        </div>
      </form>
    </div>
    <br>
    <?php
    if ($errorOccurred){echo "error: ".$errorMessage." :(";}
    ?>
  </body>
</html>
