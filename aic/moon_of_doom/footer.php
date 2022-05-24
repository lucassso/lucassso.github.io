<?php
  require_once "function_shortcut.php";
  // VALIDATION TODO:
  /*
  check if session is defined
  check if page was visited from pure url
  */
  echo "<div class='footer'><ul>";

  if (!$_SESSION["shopping"]){
    echo "<li><form action='game.php' method='post' id='shop'>";
    if (!$_SESSION["fighting"] && $_SESSION["obstacle_id"] != 0){
      echo "<input type='submit' value='visit shop' name='enter'>";
    } else { echo "<input type='submit' disabled value='visit shop'>";}
    echo "</form></li>";
    //break
    echo
    "<li><form action='game.php' method='post' id='atk'>
    <select name='atk'>
    <option disabled selected value=NULL>attack</option>";
    // save the progress id for later usage!
    $getProgress1 = $dbh->prepare("SELECT * FROM user WHERE `user_id` = :id;");
    $getProgress1->bindValue(":id", $_SESSION["user_id"]);
    $getProgress1->execute();

    // define variables that can be used at any time
    $progressID1 = $getProgress1->fetch()["progress_id"];
    $getInventory = $dbh->prepare(
      "SELECT * FROM inventory
      JOIN item ON inventory.item_id = item.item_id
      WHERE `progress_id` = :id;"
    );
    $getInventory->bindValue(":id", $progressID1);
    $getInventory->execute();
    $inventory = $getInventory->fetchAll();
    for ($i = 0; $i < count($inventory); $i++) {
      if ($inventory[$i]["use"] == "weapon") {
        echo "<option value='{$inventory[$i]["inventory_id"]}'>{$inventory[$i]["name"]} [{$inventory[$i]["stat"]}dmg]</option>";
      }
    }
    if ($_SESSION["fighting"]){
      echo "<input type='submit' value='use'>";
    } else { echo "<input type='submit' disabled value='use'>";}
    echo "</form></li>";
    //break
    echo
    "<li><form action='game.php' method='post' id='heal'>
    <select name='heal'>
    <option disabled selected value=NULL>heal</option>";
    for ($i = 0; $i < count($inventory); $i++) {
      if ($inventory[$i]["use"] == "heal") {
        echo "<option value='{$inventory[$i]["inventory_id"]}'>{$inventory[$i]["name"]} [{$inventory[$i]["stat"]}hp]</option>";
      }
    }
    if ($_SESSION["fighting"]){
      echo "<input type='submit' value='use'>";
    } else { echo "<input type='submit' disabled value='use'>";}
    echo "</li></form>";
  }

  if ($_SESSION["shopping"]){
    echo "<li><form action='game.php' method='post' id='shop2'>";
    echo "<input type='submit' value='exit shop' name='exit'>";
    echo "</form></li>";
    //break
    echo "<li><form action='game.php' method='post' id='atk'>";


    $random_id = rand(1, 8);
    $getSellable = $dbh->prepare("SELECT * FROM item WHERE `item_id` = :id;");
    $getSellable->bindValue(":id", $random_id);
    $getSellable->execute();
    $item1 = $getSellable->fetch();
    $cost = $random_id*10;
    $use;
    if ($item1["use"] == "weapon"){
      $use = "dmg";
    } else {
      $use = "hp";
    }

    echo "<li><form action='game.php' method='post' id='atk'>";
    echo "<button type='submit' value='{$random_id}' name='item2'>{$item1["name"]} - {$item1["stat"]}{$use}[{$cost}coins]</button>";
    echo "</form></li>";
    //break

    $random_id2 = rand(1, 8);
    $getSellable2 = $dbh->prepare("SELECT * FROM item WHERE `item_id` = :id;");
    $getSellable2->bindValue(":id", $random_id2);
    $getSellable2->execute();
    $item2 = $getSellable2->fetch();
    $cost2 = $random_id2*10;
    $use2;
    if ($item2["use"] == "weapon"){
      $use2 = "dmg";
    } else {
      $use2 = "hp";
    }

    echo "<li><form action='game.php' method='post' id='atk'>";
    echo "<button type='submit'value='{$random_id2}' name='item2'>{$item2["name"]} - {$item2["stat"]}{$use2}[{$cost2}coins]</button>";
    echo "</form></li>";

  }

  echo "<li><form action='logout.php' method='post' id='logout'>";
  if (!$_SESSION["fighting"] && !$_SESSION["shopping"]){
    echo "<input type='submit' value='log out'>";
  } else { echo "<input type='submit' disabled value='log out'>";}
  echo "</form></li>";
  echo "</ul></div>";












?>
