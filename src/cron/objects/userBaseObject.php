<?php

require_once('twitterUserObject.php');
require_once('facebookUserObject.php');
require_once('instagramUserObject.php');
require_once('linkedInUserObject.php');

#PRODUCT
class User{
    public $name = '';
    public $firstName = '';
    public $lastName = '';
    public $middleName = '';
    public $gender = '';
    public $userName = '';
    public $birthday = '';
    public $email = '';
    public $location = '';
    public $geoLocation = '';
    public $religion = '';
    public $homeTown = '';
    public $geoHomeTown = '';
    public $languages = '';
    public $politics = '';
    public $bio = '';
   
   public function getGeoLocation($loc){
	if($loc == ""){
		return $loc;
	}else{
		$cityclean = str_replace(" ", "+", $loc);
		$url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $cityclean . "&sensor=false";
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		
		$var = json_decode($response, true);
		
		$latLong = "";
		if($var['status'] == "ZERO_RESULTS"){
			$latLong = "";
		}else{
			$latLong = $var['results'][0]['geometry']['location']['lat'] . "#" . $var['results'][0]['geometry']['location']['lng'];
		}
		return $latLong;
	}
   }
   
    public function setName($name){
        $this->name = $name;
    }
    public function setFirstName($firstName){
        $this->firstName = $firstName;
    }
    public function setLastName($lastName){
        $this->lastName = $lastName;
    }
    public function setMiddleName($middleName){
        $this->middleName = $middleName;
    }
    public function setGender($gender){
        $this->gender = $gender;
    }
    public function setId($id){
        $this->id = $id;
    }
    public function setUserName($userName){
        $this->userName = $userName;
    }
    public function setBirthday($birthday){
        $this->birthday = $birthday;
    }
    public function setEmail($email){
        $this->email = $email;
    }
    public function setLocation($location){
        $this->location = $location;
    }
    public function setGeoLocation($geoLocation){
	$vars = $this->getGeoLocation($geoLocation);
        $this->geoLocation = $vars;
    }
    public function setReligion($religion){
        $this->religion = $religion;
    }
    public function setHomeTown($homeTown){
        $this->homeTown = $homeTown;
    }
    public function setGeoHomeTown($geoLocation){
	$vars = $this->getGeoLocation($geoLocation);
        $this->geoHomeTown = $vars;
    }
    public function setLanguages($languages){
        $this->languages = $languages;
    }
    public function setPolitics($politics){
        $this->politics = $politics;
    }
    public function setBio($bio){
        $this->bio = $bio;
    }
}

#PRODUCT
class userObject{
    public $user = '';
    public $id = '';
    public $service = '';
    public $searchable = '';
    public $dateAdded = '';
   
    public function setUser($user){
        $this->user = $user;
    }
     public function setId($id){
        $this->id = $id;
    }
    public function setService($service){
        $this->service = $service;
    }
    public function setSearchable($searchable){
        $this->searchable = $searchable;
    }
    public function setDateAdded($dateAdded){
	$this->dateAdded = $dateAdded;
    }
}

#ABSTRACT BUILDER
abstract class userObjectBuilder {
    public $userObject;
   
    public function getUserObj() {
        return $this->userObject;
    }
    public function createUserObj() {
        $this->userObject = new userObject();
    }
   
    public abstract function buildUser($user);
    public abstract function buildId($id);
    public abstract function buildService($service);
    public abstract function buildSearchable($searchable);
    public abstract function buildDateAdded($dateAdded);
}

#DIRECTOR
class userManager {
    public $userObjectBuilder;
   
    public function setBuilder(userObjectBuilder $userObjectBuilder){
        $this->userObjectBuilder = $userObjectBuilder;
    }
    public function getUserObj(){
        return $this->userObjectBuilder->getUserObj();
    }
    public function parseActivityObj($obj){
        $this->userObjectBuilder->createUserObj();
        $this->userObjectBuilder->buildUser($obj);
        $this->userObjectBuilder->buildId($obj);
        $this->userObjectBuilder->buildService($obj);
        $this->userObjectBuilder->buildSearchable($obj);
        $this->userObjectBuilder->buildDateAdded($obj);
    }   
}