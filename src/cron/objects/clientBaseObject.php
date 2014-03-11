<?php

class clientObject{

	public $data = array(
		"credentials" => array(
			"Facebook" => array(),
			"Twitter" => array(),
			"Instagram" => array(),
			"Linkedin" => array()			
		),
		'post' => array(
			'recentPost' => '',
			'recentPostTime' => 0,
			'totalPosts' => 0
		),
		'friendDegree' => 'first',
		'friendStatus' => 'true',
		'starred' => "false",
		'circles' => array(),
		'displayName' => '',
		'shh' => 0,
		'givenName' => '',
		'searchIndex' => '',
		'alphaIndex' => '',
		'homeTown' => '',
		'currentTown' => '',
		'owns' => array(),
		'ownedBy' => "none",
		'id' => '',
		'service' => '',
		'about' => array(
			'description' => "",
			'link' => ""
		)
	);
	
	public function getObj(){
		return $this->data;
	}
	
	public function setCredential($type, $credential){
		array_push($this->data['credentials'][$type], 
			array('id' => $credential['id'], 'givenName' => $credential['givenName'], 'displayName' => $credential['displayName']) 
		);
	}
	
	public function setRecentPost($post){
		$this->data['post']['recentPost'] = $post;
	}
	public function setRecentPostTime($time){
		$this->data['post']['recentPostTime'] = $time;
	}
	public function setTotalPosts($totalPosts){
		$this->data['post']['totalPosts'] = $totalPosts;
	}
	
	public function setStarred($starred){
		$this->data['starred'] = $starred;
	}
	
	public function setFriendDegree($degree){
		$this->data['friendDegree'] = $degree;
	}
	public function setFriendStatus($status){
		$this->data['friendStatus'] = $status;
	}
	
	public function setShh($shh){
		$this->data['shh'] = $shh;
	}
	
	public function addCircle($circle){
		array_push($this->data['circles'], $circle);
	}
	public function removeCircle($circle){
		foreach($this->data['circles'] as $key => $value){
			if($value == $circle){
				array_splice($this->data['circles'], $key, 1);
			}
		}
	}
	public function setHomeTown($homeTown){
		$this->data['homeTown'] = $homeTown;
	}
	public function setCurrentTown($currentTown){
		$this->data['currentTown'] = $currentTown;
	}
	public function setOwns($owns){
		array_push($this->data['owns'], $owns);
	}
	public function setOwnedBy($ownedBy){
		$this->data['ownedBy'] = $ownedBy;
	}
	
	public function setID($id){
		$this->data['id'] = $id;
	}
	
	public function setService($service){
		$this->data['service'] = $service;
	}

	public function setGivenName($givenName){
		$this->data['givenName'] = $givenName;
	}

	public function setDisplayName($displayName){
		$this->data['displayName'] = $displayName;
		$searchIndex = explode(" ", $displayName);
		$this->data['searchIndex'] = $searchIndex[0];
		$searchIndex = explode(" ", $displayName);
		$this->data['alphaIndex'] = $searchIndex[0];
	}
	
	public function setAbout($type, $data){
		if($type == "Facebook"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}elseif($type == "Instagram"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}elseif($type == "Twitter"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}elseif($type == "Linkedin"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}
	}
}

