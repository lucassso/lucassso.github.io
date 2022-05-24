<?php
  /*
  VALIDATION TODO
  - header() if $_POST is null
  - check htmlspecialchars() on inputs
  - check lengths on inputs (15)
  - check if they even used login.php
  - check if they logged in already in another tab
  */
  session_start();
  require_once "config.php";
  require_once "function_shortcut.php";
  $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
  // this will be used in game.php to see if a new acc was made
  $_SESSION["newAcc"] = false;
  // first we check if they already logged in
  if (!isset($_SESSION["user_id"])){
    // THIS IS ALL FOR LOGIN
    // look for any accounts with the same username
    if (isset($_POST["Lusername"]) && isset($_POST["Lpassword"])){


      $_SESSION["username"] = htmlspecialchars($_POST["Lusername"]);
      $_SESSION["password"] = htmlspecialchars($_POST["Lpassword"]);
      // if any accounts exist with same user, we know they were attempting login
      /*
      RUN THIS TO CHECK IF ANY ACCOUNTS MATCH USERNAMES
      if they log in, check for matching password hash
      */
      $getInput = $dbh->prepare("SELECT * FROM user WHERE `username` = :user;");
      $getInput->bindValue(":user", $_SESSION["username"]);
      $getInput->execute();
      $selectUser = $getInput->fetch();
      if(isset($selectUser)){
        // there IS an account with that username in the database
        $existingAccount = true;
        // now check if the password matches the hash in the database
        if(password_verify($_SESSION["password"], $selectUser["password"])){
          // user has successfully logged in!
          // now we have a way to know if they logged in successfully!
          $_SESSION["user_id"] = $selectUser["user_id"];
        } else {
          // see login.php for error code
          header("Location: login.php?error=1");
          exit;
        }
      }
      // THIS IS ALL FOR SIGN UP
      // now we check if they signed up with a NON-NULL username and password
    } else if (isset($_POST["Susername"]) && isset($_POST["Spassword"])){

      $_SESSION["username"] = htmlspecialchars($_POST["Susername"]);
      $_SESSION["password"] = htmlspecialchars($_POST["Spassword"]);
      /*
      RUN THIS TO CHECK IF ANY ACCOUNTS MATCH USERNAMES
      if they sign up, check if its taken already
      (we cant have multiple accounts with the same user or pwd)
      */
      $getInput = $dbh->prepare("SELECT * FROM user WHERE `username` = :user;");
      $getInput->bindValue(":user", $_SESSION["username"]);
      $getInput->execute();
      $selectUser = $getInput->fetch();
      if (!$selectUser){
        // an account with that username doesnt exist, proceed
        if ($_SESSION["password"] === $_POST["Spassword2"]){
          // TODO make it workkk
          // now make a fresh, new progress record
          $createSave = $dbh->prepare(
            "INSERT INTO `progress`
              (`health`, `money`, `obstacle_id`)
            VALUES
              (200, 100, 1);"
          );
          $createSave->execute();
          // now we get the last progress record's (the new one) progress_id for the account
          $getSave = $dbh->prepare(
            "SELECT `progress_id` FROM progress
            ORDER BY `progress_id` DESC
            LIMIT 1;"
          );
          $getSave->execute();
          $saveID = $getSave->fetch()["progress_id"];
          // use the ID for the new account
          $createAcc = $dbh->prepare(
            "INSERT INTO user
              (`username`, `password`, `role`, `progress_id`)
            VALUES
              (:username, :password, 'non', :newsave);"
          );
          $createAcc->bindValue(":username", $_SESSION["username"]);
          $createAcc->bindValue(":password", password_hash($_SESSION["password"], PASSWORD_DEFAULT));
          $createAcc->bindValue(":newsave", $saveID);
          $createAcc->execute();
          // now create a new inventory with your starting items
          // first item: a crusty sword
          $inv1 = $dbh->prepare(
            "INSERT INTO inventory
              (`progress_id`, `item_id`)
            VALUES
              (:newsave, 2)
            ;"
          );
          $inv1->bindValue(":newsave", $saveID);
          $inv1->execute();
          // second item: bandages
          $inv2 = $dbh->prepare(
            "INSERT INTO inventory
              (`progress_id`, `item_id`)
            VALUES
              (:newsave, 1)
            ;"
          );
          $inv2->bindValue(":newsave", $saveID);
          $inv2->execute();
          // now get the new record for session array
          $getNewUser = $dbh->prepare("SELECT * FROM user WHERE `username` = :user;");
          $getNewUser->bindValue(":user", $_SESSION["username"]);
          $getNewUser->execute();
          $newUser = $getNewUser->fetch();
          $_SESSION["user_id"] = $newUser["user_id"];
          // and now an account has been created and signed into!
          $_SESSION["newAcc"] = true;
        } else {
          // password doesnt match confirm password
          header("Location: login.php?error=5");
          exit;
        }
      } else {
        // username taken by someone else L
        header("Location: login.php?error=3");
        exit;
      }
    } else {
      // ok soooo they messed with the DOM >:(
      header("Location: login.php?error=2");
      exit;
    }
  } else {
    // they reloaded the page? ig we just dont do anything
  }
  $sth = $dbh->prepare(
    "SELECT * FROM user WHERE `user_id` = :id;"
  );
  $sth->bindValue(":id", $_SESSION["user_id"]);
  $sth->execute();
  $user = $sth->fetch();
  unset($_SESSION["password"]);
  if ($user["role"] == "admin"){
    header("Location: admin.php");
    exit;
  } else {
    header("Location: game.php");
    $_SESSION["reset"] = true;
    $_SESSION["first"] = true;
    exit;
  }

  header("Location: login.php?error=404");
  exit;

 ?>
