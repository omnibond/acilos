<?php

class authObject{

	public $auth = array(
		"facebook" => array(),
		'instagram' => array(),
		'twitter' => array(),
		'linkedin' => array(),
	);
	public $login = "first";
	
	public function getObj(){
		return $this;
	}
		
	public function setFacebook($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['facebook'], $temp);
	}
	public function setLinkedin($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['linkedin'], $temp);
	}
	public function setTwitter($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['twitter'], $temp);
	}
	public function setInstagram($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['instagram'], $temp);
	}
	public function setLogin($login){
		$this->login = $login;
	}
}

