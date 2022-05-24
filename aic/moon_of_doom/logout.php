<!DOCTYPE html>
<?php
  require_once "config.php";
  $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
  $user;
  session_start();
  //if the auth.php code was run, we know a session was started AND login was success
  if (!isset($_SESSION["user_id"])){
    header('Location: login.php?error=4');
    exit;
  } else if ($_SESSION["username"] != "admin123"){
    $sth = $dbh->prepare("SELECT * FROM user WHERE `user_id` = :user_id;");
    $sth->bindValue(":user_id", $_SESSION["user_id"]);
    $sth->execute();
    $user = $sth->fetch()["username"];

    $updateProgresss = $dbh->prepare(
      "UPDATE progress
      SET
      `health` = :hp,
      `money` = :mon,
      `obstacle_id` = :newID
      WHERE `progress_id` = :progg;
    ");
    $updateProgresss->bindValue(":hp", $_SESSION["temp"]["health"]);
    $updateProgresss->bindValue(":mon", $_SESSION["temp"]["money"]);
    $updateProgresss->bindValue(":newID", $_SESSION["obstacle_id"]);
    $updateProgresss->bindValue(":progg", $_SESSION["progress_id"]);
    $updateProgresss->execute();
  }
  session_destroy();
?>
<html lang="en-us">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <link href="main.css" type="text/css" rel="stylesheet">
    <title>Moon of Doom - Log Out</title>
  </head>
  <body>
    <h4>Sign Out</h4>
    <p>You were signed out of <?php echo $user ?> successfully!</p>
    <p><a href="login.php">[log in]</a></p>
  </body>
</html>
