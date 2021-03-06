<?php
session_start();

if(isset($_SESSION['login']) && $_SESSION['login']) {
    require_once "../other/dbConnection.php";
    require_once "../model/breedModel.php";

    $breedModel = new \model\breedModel($db);

    $broods = $breedModel->getBroods($_SESSION['loadedBreed']['id']);

    echo json_encode(array('success' => true, 'broods' => $broods), JSON_FORCE_OBJECT);
} else {
    echo json_encode(array('success' => false, 'msg' => 'Fehler'));
}
?>