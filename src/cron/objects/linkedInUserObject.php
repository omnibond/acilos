<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the linkedin user object used for mining userData
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