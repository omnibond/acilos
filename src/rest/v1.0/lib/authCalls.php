<?php
if(session_id() == '') {
	session_start();
	if(isset($_SESSION['authed']) && $_SESSION['authed'] !== true){
		header("Location: login.php?logout=true");
		header('HTTP/1.0 403 Forbidden');
		die();			
	}
}

?>