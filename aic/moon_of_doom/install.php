<?php
$installation;
require_once "config.php";
try {
    $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
    $query = file_get_contents('databases.sql');
    $dbh->exec($query);
    $installation = "<p>Successfully installed databases</p>";
}
catch (PDOException $e) {
    $installation = "<p>Error: {$e->getMessage()}</p>";
}
echo $installation;
echo "<a href='login.php'>to index</a>";
?>
