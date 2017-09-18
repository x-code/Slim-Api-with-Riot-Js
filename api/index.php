<?php

require 'Slim/Slim.php';

$app = new Slim();
$app->get('/', 'getNews');
$app->get('/:id',	'getNew');
$app->get('/search/:query', 'findByName');
$app->post('/', 'addNew');
$app->put('/:id', 'updateNew');
$app->delete('/:id',	'deleteNew');
$app->run();

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="mysql";
	$dbname="slim-api";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}


function getNews() {
	$sql = "select * FROM news ORDER BY created_at";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$total = count($data);

		$news =  array(
			'status' => true,
			'offset' => 0,
			'limit' => 25,
			'total' => $total,
			'data' => $data,
			);
		// echo '{"news": ' . json_encode($news) . '}';
		echo json_encode($news);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getNew($id) {
	$sql = "SELECT * FROM news WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$news = $stmt->fetchObject();  
		$db = null;
		echo json_encode($news); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addNew() {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$news = json_decode($request->getBody());
	$sql = "INSERT INTO news (title, content) VALUES (:title, :content)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("title", $news->title);
		$stmt->bindParam("content", $news->content);
		$stmt->execute();
		$news->id = $db->lastInsertId();
		$news->created_at = date('Y-m-d H:i:s');
		$news->updated_at = date('Y-m-d H:i:s');
		$db = null;
		echo json_encode($news); 
	} catch(PDOException $e) {
		// error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateNew($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$news = json_decode($request->getBody());
	$sql = "UPDATE news SET title=:title, content=:content WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("title", $news->title);
		$stmt->bindParam("content", $news->content);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		$news->created_at = date('Y-m-d H:i:s');
		$news->updated_at = date('Y-m-d H:i:s');
		echo json_encode($news); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteNew($id) {
	$sql = "DELETE FROM news WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM news WHERE UPPER(title) LIKE :query ORDER BY title";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$news = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"news": ' . json_encode($news) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

?>