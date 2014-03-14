<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the facebook user object used for mining userData
** This code is DEPRECATED
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/

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