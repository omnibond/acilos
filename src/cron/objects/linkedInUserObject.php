<?php

require_once('userBaseObject.php');

#PRODUCT

#CONCRETE BUILDER
class linkedInUserObjectBuilder extends userObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtotime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}
		
   public function buildUser($obj){
        $user = new User();
	
	$firstNameArr = explode(",", $obj['firstName']);
	$lastNameArr = explode(",", $obj['lastName']);
	$fullName = $firstNameArr[0] . " " . $lastNameArr[0];
	
        $user->setName($fullName);
        $user->setFirstName($obj['firstName']);
        $user->setLastName($obj['lastName']);
	$user->setMiddleName('');
        $user->setGender('');
        $user->setId($obj['id']);
        $user->setUserName('');
        $user->setBirthday('');
        $user->setEmail('');
        $user->setLocation($obj['location']['name']);
        $user->setGeoLocation($obj['location']['name']);
        $user->setReligion('');
        $user->setHomeTown('');
        $user->setGeoHomeTown('');
        $user->setPolitics('');
        $user->setBio($obj['headline']);
	$user->setLanguages('');
        $this->userObject->setUser($user);
    }
    public function buildId($obj){
        $this->userObject->setId("linkedIn-----".$obj['id']);
    }
    public function buildService($obj){
	$this->userObject->setService('LinkedIn');
    }
    public function buildSearchable($obj){
	$this->userObject->setSearchable($obj['id']);
    }
    public function buildDateAdded($obj){
	$this->userObject->setDateAdded(time());
    }
}