<?php
	//this will check for friend requests, new messages, and posted/likes
	$filename = "../../facebookToken.txt";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	function runURL($url){
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		
		$var = json_decode($response, true);
		return $var;
	}
	
	$notificationArray = array(
		"friends" => "",
		"messages" => "",
		"notes" => "",
	);
	
	//,read_mailbox  
	$url = 'https://graph.facebook.com/me/inbox?&access_token=' . $obj['access_token'];
	$response = runURL($url);
	$totalUnreadMsg = 0;
	for($x = 0; $x < count($response['data']); $x++){
		if($response['data'][$x]['unseen'] > 0){
			$totalUnreadMsg += $response['data'][$x]['unseen'];
		}
	}
	$notificationArray['messages'] = $totalUnreadMsg;	
	
	//,read_requests 
	$url = 'https://graph.facebook.com/me/friendrequests?&access_token=' . $obj['access_token'];
	$response = runURL($url);
	$totalUnreadReq = array();
	for($x = 0; $x < count($response['data']); $x++){
		array_push($totalUnreadReq, $response['data'][$x]['from']['name']);
	}
	$notificationArray['friends'] = $totalUnreadReq;
	
	//,manage_notifications
	$url = 'https://graph.facebook.com/me/notifications?&access_token=' . $obj['access_token'];
	$response = runURL($url);
	$totalUnreadNote = 0;
	if(count($response['summary']) != 0){
		if($response['summary']['unseen_count'] > 0){
			$totalUnreadNote += $response['summary']['unseen_count'];
		}
	}
	$notificationArray['notes'] = $totalUnreadNote;
	
	$filename = "appNotificationStatus.txt";
	$wholeShebang = json_decode(file_get_contents($filename), true);
	
	if($wholeShebang != null){
		$wholeShebang['Facebook'] = $notificationArray;
	}else{
		$wholeShebang = array(
			"Linkedin" => array("notes" => 0, "friends" => array(), "messages" => 0),
			"Facebook" => $notificationArray,
			"Twitter" => array("notes" => 0, "friends" => array(), "messages" => 0),
			"Instagram" => array("notes" => 0, "friends" => array(), "messages" => 0)
		);
	}
	
	$filename = "appNotificationStatus.txt";
	$fp = fopen($filename, 'w'); // or die("Cannot open file " . $filename);
	fwrite($fp, json_encode($wholeShebang));
	fclose($fp);
	
?>