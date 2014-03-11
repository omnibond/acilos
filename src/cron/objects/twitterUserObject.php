<?php

require_once('userBaseObject.php');

#PRODUCT

#CONCRETE BUILDER
class twitterUserObjectBuilder extends userObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtotime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}
		
   public function buildUser($obj){
        $user = new User();
	
	$nameArr = explode(" ", $obj['name']);
	
	if(count($nameArr) > 2){
		$middle = $nameArr[1];
	}else{
		$middle = '';
	}
	
	if(end($nameArr) == ""){
		$last = $nameArr[1];
	}else{
		$last = end($nameArr);
	}
	
        $user->setName($obj['name']);
        $user->setFirstName($nameArr[0]);
        $user->setLastName($last);
	$user->setMiddleName($middle);
        $user->setGender('');
        $user->setId($obj['id_str']);
        $user->setUserName($obj['screen_name']);
        $user->setBirthday('');
        $user->setEmail('');
        $user->setLocation($obj['location']);
        $user->setGeoLocation($obj['location']);
        $user->setReligion('');
        $user->setHomeTown($obj['time_zone']);
        $user->setGeoHomeTown($obj['time_zone']);
        $user->setPolitics('');
        $user->setBio($obj['description']);
	$user->setLanguages($obj['lang']);
       
        $this->userObject->setUser($user);
    }
    public function buildId($obj){
        $this->userObject->setId("twitter-----".$obj['id_str']);
    }
    public function buildService($obj){
	$this->userObject->setService('Twitter');
    }
    public function buildSearchable($obj){
	$this->userObject->setSearchable($obj['screen_name']);
    }
    public function buildDateAdded($obj){
	$this->userObject->setDateAdded(time());
    }
}