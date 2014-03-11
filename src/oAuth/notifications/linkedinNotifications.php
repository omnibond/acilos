<?php
	
	function objectToArray($d){
		if(is_object($d)){
			$d = get_object_vars($d);
		}
		if(is_array($d)){
			return array_map(__FUNCTION__, $d);
		}
		else{
			return $d;
		}
	}
	
	function linkedInFetch($method, $resource, $token) {
		$params = array('oauth2_access_token' => $token,
			'format' => 'json',
		);

		// Need to use HTTPS
		$url = 'https://api.linkedin.com' . $resource . '?' . http_build_query($params);
		// Tell streams to make a (GET, POST, PUT, or DELETE) request
		$context = stream_context_create(
			array('http' => array(
				'method' => $method)
			)
		);

		// Hocus Pocus
		$response = file_get_contents($url, false, $context);

		// Native PHP object, please
		return json_decode($response);
	}
	
	$filename = "../linkedinUserCreds.txt";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	//$feed = linkedInFetch('GET', '/v1/people/~/connections', $obj['access_token']);
	$feed = linkedInFetch('POST', '/v1/people/~/mailbox', $obj['access_token']);
	$feed = objectToArray($feed);
	print_r($feed);
	
?>	
	
	