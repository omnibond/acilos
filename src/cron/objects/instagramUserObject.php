<?php

require_once('userBaseObject.php');

#PRODUCT

#CONCRETE BUILDER
class instagramUserObjectBuilder extends userObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtotime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}
		
   public function buildUser($obj){
        $user = new User();
	
	$nameArr = explode(" ", $obj['full_name']);
	
	if(count($nameArr) > 2){
		$middle = $nameArr[1];
	}else{
		$middle = '';
	}
	
        $user->setName($obj['full_name']);
        $user->setFirstName($nameArr[0]);
        $user->setLastName(end($nameArr));
	$user->setMiddleName($middle);
        $user->setGender('');
        $user->setId($obj['id']);
        $user->setUserName($obj['username']);
        $user->setBirthday('');
        $user->setEmail('');
        $user->setLocation('');
        $user->setGeoLocation('');
        $user->setReligion('');
        $user->setHomeTown('');
        $user->setGeoHomeTown('');
        $user->setPolitics('');
        $user->setBio($obj['bio']);
	$user->setLanguages('');
       
        $this->userObject->setUser($user);
    }
    public function buildId($obj){
        $this->userObject->setId("instagram-----".$obj['id']);
    }
    public function buildService($obj){
	$this->userObject->setService('Instagram');
    }
    public function buildSearchable($obj){
	$this->userObject->setSearchable($obj['username']);
    }
    public function buildDateAdded($obj){
	$this->userObject->setDateAdded(time());
    }
}