<?php
#data to be appended to authorization url, with format of "original url"?data & data & data &(i.e. id=ID)
#Question mark signifies data coming after, 
#& marks signify next part
#example would be "www.example.com?id=ID&data=DATA"

$client_id = "vjDjKMulBmV9dg";
$client_secret = "av4zfjodSnDn0703s5ReNjijVcI";
$response_type = "code";
$state = "State";
$redirect_uri = "http://" . ($_SERVER['HTTP_HOST'] . "/test.php");
$duration = "permanent";
$scope = "identity";
$str = "client_id=" . $client_id . "&response_type=" . $response_type . "&state=" . $state . "&redirect_uri=" .  
	$redirect_uri . "&duration=" . $duration . "&scope=" . $scope;
$headerCode = base64_encode($client_id.":".$client_secret);

function login(){
	global $str;
	#redirects to auth url for user login.
	header("Location: https://www.reddit.com/api/v1/authorize?" . $str);
}

#checks to see if code was returned from auth URL, aka if user is authorized
if(isset($_GET['code'])){
	#gets code and state from auth url
	$code = $_GET["code"];
	$state = $_GET['state'];
	echo $code;
	echo "<br>";

	$headers = array(
		"Authorization" => "basic " . $headerCode
	);
	$params = array(
			"grant_type" => "authorization_code",
			"code" => $code,
			"redirect_uri" => $redirect_uri
			
			#"state" => $state
			#"scope" => $scope
			
	);
	$token_url = "https://www.reddit.com/api/v1/access_token";
	
	$ch = curl_init($token_url);
	curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	curl_setopt($curl, CURLOPT_USERPWD, $client_id.":".$client_secret);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	#curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);	
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	$response = curl_exec($ch);
	$json = json_decode($response, true);
	curl_close($ch);
	
	var_dump($response);
	echo "<br>";
	var_dump($json);
	echo "<br>";
}else{
	login();
}



#javas = array.length
#php count(array)

#print_r($_SERVER);
#grabs from url using ?thing="value"
#$thing = $_GET['thing'];
#print_r($thing);
#echo $str;
#https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&
 #   state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING

?>	
