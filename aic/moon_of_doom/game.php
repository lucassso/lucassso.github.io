<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="main.css">
    <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
    <script src="game.js"></script>
    <title>Moon of Doom</title>
  </head>
  <body>
    <?php
    /*
    VALIDATE // TODO:
    - make sure post has a wanted int value
    - check if post was used at the right time
    - check if next was used at right time
    - check if you are supposed to be in the place you are
    */
      session_start();
      require_once "ascii_art.php";
      require_once "subtitle.php";
      require_once "config.php";
      // require_once "inventory.php";
      $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWORD);

      if($_SESSION["first"]){
        $_SESSION["shopping"] = false;
        $_SESSION["event"] = 0;
        // save the progress id for later usage!
        $getProgress = $dbh->prepare("SELECT * FROM user WHERE `user_id` = :id;");
        $getProgress->bindValue(":id", $_SESSION["user_id"]);
        $getProgress->execute();

        // define variables that can be used at any time
        $progress = $getProgress->fetch();

        // get the obstacle id of the progress
        $getObst = $dbh->prepare("SELECT * FROM progress WHERE `progress_id` = :id;");
        $getObst->bindValue(":id", $progress["progress_id"]);
        $getObst->execute();
        $resultProg = $getObst->fetch();
        $_SESSION["obstacle_id"] = $resultProg["obstacle_id"];
        $_SESSION["progress_id"] = $resultProg["progress_id"];
        $_SESSION["fighting"] = false;
      }

      if ($_SESSION["newAcc"] && $_SESSION["first"]){
        $_SESSION["obstacle_id"] = 0;
      }
      $_SESSION["first"] = false;

      $message = "";
      if ($_SESSION["obstacle_id"] != 0){
        if (isset($_POST["enter"])){
          $_SESSION["shopping"] = true;
        }
        if (isset($_POST["exit"])){
          {$_SESSION["shopping"] = false;}
        }
        //shopping stuffs
        if (isset($_POST["item1"])){
          if ($_SESSION["temp"]["money"] - ($_POST["item1"]*10) > 0){
            $_SESSION["shopping"] = false;
            $inv = $dbh->prepare(
              "INSERT INTO inventory
                (`progress_id`, `item_id`)
              VALUES
                (:prog, :item)
              ;"
            );
            $inv->bindValue(":prog", $_SESSION["progress_id"]);
            $inv->bindValue(":item", $_POST["item1"]);
            $inv->execute();
            $cost = $_POST["item1"]*10;
            $_SESSION["temp"]["money"] -= $cost;
          }
        }
        if (isset($_POST["item2"])){
          if ($_SESSION["temp"]["money"] - ($_POST["item2"]*10) > 0){
            $_SESSION["shopping"] = false;
            $inv = $dbh->prepare(
              "INSERT INTO inventory
                (`progress_id`, `item_id`)
              VALUES
                (:prog, :item)
              ;"
            );
            $inv->bindValue(":prog", $_SESSION["progress_id"]);
            $inv->bindValue(":item", $_POST["item2"]);
            $inv->execute();
            $cost = $_POST["item2"]*10;
            $_SESSION["temp"]["money"] -= $cost;
          }
        }
        // on Intro
        if ($_SESSION["event"] == 0) {
        }
        // on Player Turn
        if ($_SESSION["event"] == 1) {
          if (isset($_POST["heal"])){
            //first find the inventory record for select item
            $getInvRecord = $dbh->prepare("SELECT * FROM inventory WHERE `inventory_id` = :id1;");
            $getInvRecord->bindValue(":id1", $_POST["heal"]);
            $getInvRecord->execute();
            $item = $getInvRecord->fetch()["item_id"];
            //then get the item's heal stat
            $getItem = $dbh->prepare("SELECT * FROM item WHERE `item_id` = :id2;");
            $getItem->bindValue(":id2", $item);
            $getItem->execute();
            $selectItem = $getItem->fetch();
            $itemStat = $selectItem["stat"];
            //test if health will go over 200 (cap it)
            if (($item + $_SESSION["temp"]["health"]) > 200) {
              $itemStat = 200 - $_SESSION["temp"]["health"];
            }
            //add the health
            $_SESSION["temp"]["health"] += $itemStat;
            //now delete the inventory record
            $deleteInvRecord = $dbh->prepare("DELETE FROM inventory WHERE `inventory_id` = :id3;");
            $deleteInvRecord->bindValue(":id3", $_POST["heal"]);
            $deleteInvRecord->execute();
            $message = "[<b>".$_SESSION["username"]."</b> used <b>".$selectItem["name"]."</b>!]";
          }

          if (isset($_POST["atk"])){
            //get the item attack stat
            $getInvRecord = $dbh->prepare("SELECT * FROM inventory WHERE `inventory_id` = :id1;");
            $getInvRecord->bindValue(":id1", $_POST["atk"]);
            $getInvRecord->execute();
            $item = $getInvRecord->fetch()["item_id"];
            //then get the item's atk dmg
            $getItem = $dbh->prepare("SELECT * FROM item WHERE `item_id` = :id2;");
            $getItem->bindValue(":id2", $item);
            $getItem->execute();
            $selectItem = $getItem->fetch();
            $itemStat = $selectItem["stat"];
            //now damage that boiiiiiii
            $_SESSION["obstacle"]["health"] -= $itemStat;
            //check if death
            if ($_SESSION["obstacle"]["health"] < 1){
              $_SESSION["obstacle"]["health"] = 0;
              win($dbh);
            }
            $message = "[<b>".$_SESSION["username"]."</b> used <b>".$selectItem["name"]."</b>!]";

          }
          if (isset($_POST["atk"])){
            if ($_SESSION["obstacle"]["health"] > 0){
              $_SESSION["temp"]["health"] -= $_SESSION["obstacle"]["atk_stat"];
              if ($_SESSION["temp"]["health"] < 1){
                loss($dbh);
              }
            }
          }
        }

      } else if ($_SESSION["obstacle_id"] == 0){
        if ($_SESSION["event"] > 3){
          $_SESSION["reset"] = true;
          $_SESSION["obstacle_id"] = 1;
        }
      }
      $getP = $dbh->prepare("SELECT * FROM `progress` WHERE `progress_id` = :id;");
      $getP->bindValue(":id", $_SESSION["progress_id"]);
      $getP->execute();
      $progress = $getP->fetch();

      if(isset($_POST["next"]) && !isset($_POST["heal"]) && !isset($_POST["atk"])){
        if (isset($_SESSION["storeObstID"])){
          $_SESSION["obstacle_id"] = $_SESSION["storeObstID"];
          $_SESSION["event"] = 0;
          unset($_SESSION["storeObstID"]);
        }
        if($_SESSION["event"] == 0 || $_SESSION["event"] == 4 || $_SESSION["obstacle_id"] == 0){
          $_SESSION["event"]+=1;
        } else if ($_POST["next"] == 2){
          $_SESSION["storeObstID"] = $_SESSION["obstacle_id"];
          $_SESSION["obstacle_id"] = 8;
          $_SESSION["event"] = 2;
        } else if ($_POST["next"] == 3){
          $_SESSION["event"] = 0;
        }
      }
      if ($_SESSION["obstacle_id"] != 0 && $_SESSION["event"] == 1){
        $_SESSION["fighting"] = true;
      }

      if ($_SESSION["reset"]){
        resetvals($dbh, NULL);
        $_SESSION["event"] = 0;
      }

      echo "[<b>".$_SESSION["username"]."</b>] {$_SESSION["temp"]["health"]}hp {$_SESSION["temp"]["money"]}coins<br>";
      if($_SESSION["fighting"]){
        echo "[<b>".$_SESSION["obstacle"]["name"]."</b>] {$_SESSION["obstacle"]["health"]}hp {$_SESSION["obstacle"]["atk_stat"]}atk<br>";
      }
      echo "<br><br>";
      echo $message;

      function renderGame($obstacle_index, $event, $ascii_text) {
        echo "<div class='game'>";
        echo "<pre>";
        foreach($ascii_text[$obstacle_index][$event] as $line){
          echo $line."<br>";
        }
        echo "</pre></div>";
      }

      function renderText($obstacle_index, $event, $sub_text){
        $text = "next";
        if ($obstacle_index == 0 && $event == 4){
          $text = "start";
        }
        if ($obstacle_index != 0 && $event == 3){
          $text = "try again";
        }
        // make sure we didnt get an empty string
        if(isset($sub_text[$obstacle_index][$event])){
          echo "<div class='text'>";
          echo $sub_text[$obstacle_index][$event];
           $displayButton = false;
          if ($_SESSION["obstacle_id"] == 0 || !$_SESSION["fighting"] && !$_SESSION["shopping"]){
            echo "<form action='game.php' method='post'><button type='submit' name='next' value='{$_SESSION["event"]}'>{$text}</button></form>";
          }
          echo "</div>";
        }
      }

      function show($obstacle_index, $event, $ascii_text, $sub_text){
        renderGame($obstacle_index, $event, $ascii_text);
        renderText($obstacle_index, $event, $sub_text);
      }

      function loss($dbh) {
          // here, put what will happen if the player loses
        $_SESSION["event"] = 3;
        $_SESSION["fighting"] = false;
        resetvals($dbh, 0);
      }

      function win($dbh){
        if($_SESSION["obstacle_id"] == 4){
          $inv = $dbh->prepare(
            "INSERT INTO inventory
              (`progress_id`, `item_id`)
            VALUES
              (:prog, 9)
            ;"
          );
          $inv->bindValue(":prog", $_SESSION["progress_id"]);
          $inv->execute();
        }
        if($_SESSION["obstacle_id"] == 6){
          $inv = $dbh->prepare(
            "INSERT INTO inventory
              (`progress_id`, `item_id`)
            VALUES
              (:prog, 10)
            ;"
          );
          $inv->bindValue(":prog", $_SESSION["progress_id"]);
          $inv->execute();
        }
        //TODO: this aint working?!
        //set database vals to temp vars
        //50*obst id money won per battle
        $_SESSION["temp"]["money"] += $_SESSION["obstacle_id"]*50;
        $_SESSION["dub"] = true;
      }

      function resetvals($dbh, $obst){
        $_SESSION["fighting"] = false;
        $getObst = $dbh->prepare("SELECT * FROM progress WHERE `progress_id` = :id;");
        $getObst->bindValue(":id", $_SESSION["progress_id"]);
        $getObst->execute();
        $resultProg = $getObst->fetch();
        $currentObst = $dbh->prepare("SELECT * FROM obstacle WHERE `obstacle_id` = :id;");
        if (isset($obst)){
          $temp = $_SESSION["obstacle_id"] + 1;
          $currentObst->bindValue(":id", $temp);
        } else {
          $currentObst->bindValue(":id", $_SESSION["obstacle_id"]);
        }
        $currentObst->execute();
        $thisObst = $currentObst->fetch();
        //if this was their first visit/they died L then show event 0
        $_SESSION["temp"] = array(
          "health"=>$resultProg["health"],
          "money"=>$resultProg["money"]
        );
        //get the obstacle they fighting, store it in session
        $_SESSION["obstacle"] = array(
          "obstacle_id"=>$thisObst["obstacle_id"],
          "name"=>$thisObst["name"],
          "health"=>$thisObst["health"],
          "atk_stat"=>$thisObst["atk_stat"]
        );
        $_SESSION["reset"] = false;
      }

      if (!$_SESSION["shopping"]){
        if (isset($_SESSION["dub"])){
          resetvals($dbh, 2);
          $_SESSION["event"] = 2;
          show($_SESSION["obstacle_id"], $_SESSION["event"], $ascii_text, $sub_text);
          unset($_SESSION["dub"]);
          $_SESSION["obstacle_id"] += 1;
        } else {
          show($_SESSION["obstacle_id"], $_SESSION["event"], $ascii_text, $sub_text);
        }

      } else {
        show(8, 0, $ascii_text, $sub_text);
      }

      require_once("footer.php");
      better_var_dump($_SESSION);
      better_var_dump($_POST);
      $getObst = $dbh->prepare("SELECT * FROM progress WHERE `progress_id` = :id;");
      $getObst->bindValue(":id", $_SESSION["progress_id"]);
      $getObst->execute();
      $resultProg = $getObst->fetch();
      better_var_dump($resultProg);
    ?>
  </body>
</html>
