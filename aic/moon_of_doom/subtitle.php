<?php
  /*
  purpose of the page:

  the subtitles to match every sub art in the game
  30-32 characters per line, 6 lines max
  (that means the subtitle must be under 160-192 characters)
  */

  /*
  variable formatting:

  also each variable is named $sub[obstacle_index]_[event],
  so we can call each as it comes up in the story
  event has 4 values that will be changed:
  (0) INTRO: the obstacle is introduced
  (1) FIGHT: fighting whatever it is
  (2) WIN: you kill obstacle
  (3) LOSE: you die L
  */

  //intro sequence
  $sub0_0 = "You have just crash landed on the Moon of Doom. Welcome, {$_SESSION["username"]}.";
  $sub0_1 = "All you have is your clothes and a mysterious backpack which seems to hold an infinite supply of objects. At least you won't run out of space. As well as this, the weight of the bag does not change no matter what.";
  $sub0_2 = "You must explore the Moon of Doom, attempting to find an ancient artifact, fighting many obstacles along the way.";
  $sub0_3 = "As you progress, you may encounter shops that you will able to buy additional items from.";
  $sub0_4 = "Are you ready to begin?";
  //others
  $sub8_0 = "Welcome to the shop! See anything you like?";
  $sub8_1 = "You win!";
  $sub8_2 = "You keep walking...";
  //obstacle 1
  $sub1_0 = "As you look around for signs of life, you notice an old man. He slowly approaches, giving you a bag with something in it. You slowly open the bag to reveal a very ugly monster!";
  $sub1_1 = "You start attacking the mirror, and it cracks, sending glistening shards flying at you!";
  $sub1_2 = "You shatter the mirror, then realize that the ugly monster was your reflection in the mirror. Embarrassing.";
  $sub1_3 = "The mirror shards shatter you. You lose!";
  //obstacle 2
  $sub2_0 = "this is test code.[potato]";
  $sub2_1 = "this is test code.";
  $sub2_2 = "this is test code.";
  $sub2_3 = "this is test code.";
  //obstacle 3
  $sub3_0 = "this is test code.[bartender]";
  $sub3_1 = "this is test code.";
  $sub3_2 = "this is test code.";
  $sub3_3 = "this is test code.";
  //obstacle 4
  $sub4_0 = "this is test code.[gun guy]";
  $sub4_1 = "this is test code.";
  $sub4_2 = "this is test code. put extra dialogue saying you picked up his gun";
  $sub4_3 = "this is test code.";
  //obstacle 5
  $sub5_0 = "this is test code.[bee nest]";
  $sub5_1 = "this is test code.";
  $sub5_2 = "this is test code.";
  $sub5_3 = "this is test code.";
  //obstacle 6
  $sub6_0 = "this is test code.[minion]";
  $sub6_1 = "this is test code.";
  $sub6_2 = "this is test code.put extra dialogue saying you stole his long stick";
  $sub6_3 = "this is test code.";
  //obstacle 7
  $sub7_0 = "this is test code.[rogue ai]";
  $sub7_1 = "this is test code.";
  $sub7_2 = "this is test code.";
  $sub7_3 = "this is test code.";

  //the big scary 3d array!
  $sub_text = array(
    array(
      $sub0_0,
      $sub0_1,
      $sub0_2,
      $sub0_3,
      $sub0_4
    ),
    array(
      $sub1_0,
      $sub1_1,
      $sub1_2,
      $sub1_3
    ),
    array(
      $sub2_0,
      $sub2_1,
      $sub2_2,
      $sub2_3
    ),
    array(
      $sub3_0,
      $sub3_1,
      $sub3_2,
      $sub3_3
    ),
    array(
      $sub4_0,
      $sub4_1,
      $sub4_2,
      $sub4_3
    ),
    array(
      $sub5_0,
      $sub5_1,
      $sub5_2,
      $sub5_3
    ),
    array(
      $sub6_0,
      $sub6_1,
      $sub6_2,
      $sub6_3
    ),
    array(
      $sub7_0,
      $sub7_1,
      $sub7_2,
      $sub7_3
    ),
    array(
      $sub8_0,
      $sub8_1,
      $sub8_2
    )
  );
?>
