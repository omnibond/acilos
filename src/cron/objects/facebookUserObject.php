<?php

require_once('userBaseObject.php');

#PRODUCT
class Languages{
	public $languages = '';
	
	public function setLanguages($languages){
		$this->languages = $languages;
	}
   }

#CONCRETE BUILDER
class facebookUserObjectBuilder extends userObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtotime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}
		
   public function buildUser($obj){
        $user = new User();
	
	$langArray = array();
	for($d = 0; $d < count($obj['languages']); $d++){
		$lang = new Languages();
		$lang->setLanguages($obj['languages'][$d]['name']);
		
		array_push($langArray, $lang);
	}
	
        $user->setName($obj['name']);
        $user->setFirstName($obj['first_name']);
        $user->setLastName($obj['last_name']);
	$user->setMiddleName($obj['middle_name']);
        $user->setGender($obj['gender']);
        $user->setId($obj['id']);
        $user->setUserName($obj['username']);
        $user->setBirthday($obj['birthday']);
        $user->setEmail($obj['email']);
        $user->setLocation($obj['location']['name']);
        $user->setGeoLocation($obj['location']['name']);
        $user->setReligion($obj['religion']);
        $user->setHomeTown($obj['hometown']['name']);
        $user->setGeoHomeTown($obj['hometown']['name']);
        $user->setPolitics($obj['political']);
        $user->setBio($obj['bio']);
	$user->setLanguages($langArray);
       
        $this->userObject->setUser($user);
    }
    public function buildId($obj){
        $this->userObject->setId("facebook-----".$obj['id']);
    }
    public function buildService($obj){
	$this->userObject->setService('Facebook');
    }
    public function buildSearchable($obj){
	$this->userObject->setSearchable($obj['id']);
    }
    public function buildDateAdded($obj){
	$this->userObject->setDateAdded(time());
    }
}