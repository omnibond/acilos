<?php

$creds = file_get_contents($_SERVER['SERVICECREDS']);
$credObj = json_decode($creds, true);
$access_token = $credObj['google'][0]['accounts'][0]['accessToken'];

print_r($access_token);

$params = array(
	'object' => array(
		"originalContent" => "Acilos Google+ TestPost"
	)
);

$url = 'https://www.googleapis.com/plusDomains/v1/people/me/activities';

$ch = curl_init($url);
$headers = array('Authorization: Bearer ' . $access_token);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
curl_close($ch);

print_r($res);

$var = json_decode($res, true);

print_r($var);

?>