<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

$client_id = 'eaecd60c3a867c2aee49';
$client_secret = '70f8933ef1d22a091311eea3e462048689884426';
$redirect_uri = 'http://richardgpc.clemson.edu/socialreader/Trunk/src/oAuth/githubAccess.php';
$scope = '';

#this function gets the access_token and the refresh_token it is the callback for fakeCentral.php
if(isset($_GET['code'])){
	#code is what we get abck from fakeCentral calling google for the first quth step
	$code = $_GET["code"];

	#echo "The code is: " . $code; ?><br/><br/><?php
	
	$url = "https://github.com/login/oauth/access_token";
	
	#with the new code we set up the post to get the refreshToken and accessToken from google
	$params = array(
		"code" => $code,
		"client_id" => $client_id,
		"client_secret" => $client_secret,
		"redirect_uri" => $redirect_uri
	);
	
	$ch = curl_init($url);
	
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	#response should now be a json with the accessToken and refreshToken as a json string
	$response = curl_exec($ch);
	curl_close($ch);
	
	#decode that string and now u have a json that you can play with
	#the decode true param turns them into assoc arrays
	$var = explode("&", $response);
	$token = explode("=", $var[0]);
	echo $token[0] . $token[1];
	$type = explode("=", $var[1]);
	$time = `date +%s`;
	$obj = array(
		$token[0] => $token[1],
		$type[0] => $type[1],
		'time' => $time
	);
	
	$param = json_encode($obj);
	
#	$info['vaultkey'] = $param;

	#MODIFY
#	$ds = ldap_connect('ccedirdev.clemson.edu');
#	$login = ldap_bind($ds, 'cn=nimda,o=cuvault', 'd0j0h3ads');
	
#	$result = ldap_modify($ds, "Vaultzid=27247e25-9b4c-ff48-b15d-25871ced,ou=Identities,o=cuvault-gen", $info);

#	ldap_close($ds);
	
        if($obj['access_token']){
		$filename = "githubToken.txt";
		#write out $response to the file because then we can read the whole file later and json_encode it for use
		$fp = fopen($filename, 'w') or die("Cannot open file " . $filename);
		fwrite($fp, $param);
		fclose($fp);
	}else{
		echo "ERROR: No access token was returned" . $response; ?><br/><?php
	}

	echo "<html><head></head><body><div>You have successfully authenticated with GitHub, please close this window</div><script type=\"text/javascript\">window.close()</script></body></html>";
	
}else{
	echo "ERROR: No code was sent to this script"; ?><br/><?php
}

?>
