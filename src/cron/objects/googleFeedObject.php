<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the google object used for mining feedData
** 
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

require_once('activityObject.php');

#PRODUCT
class GoogleContent{
	public $queryString = '';

	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class GoogleLike {
	public $id = '';

	public function setId($id){
		$this->id = $id;
	}
}

class GoogleComment{
	public $id = '';

	public function setId($id){
		$this->id = $id;
	}
}

#CONCRETE BUILDER
class googleObjectBuilder extends activityObjectBuilder{

   public function buildActor($obj){
        $actor = new Actor();

        $actor->setName("");
        $actor->setId("");
	$actor->setSearchable("");
        $actor->setdisplayName("");
        $actor->setImage("");
        $actor->setURL("");
        $actor->setLocation("");
        $actor->setGeoLocation("");
        $actor->setDescription("");
       
        $this->activityObject->setActor($actor);
    }

    public function buildContent($obj){
		$content = new GoogleContent();
		
		$content->setQueryString("");
		
		$this->activityObject->setContent($content);
	}
    public function buildPublished($obj){
        	$this->activityObject->setPublished("");
    }
    public function buildGenerator($obj){
        $this->activityObject->setGenerator('Google');
    }
    public function buildTitle($obj){
        	$this->activityObject->setTitle("");
    }
    public function buildVerb($obj){
        $this->activityObject->setVerb("");
    }
    public function buildId($obj){
        if(isset($obj['id'])){
        	$this->activityObject->setId("google-----".$obj['id']);
        }
    }
    public function buildService($obj){
	$this->activityObject->setService('Google');
    }
    public function buildDateAdded($obj){
	$this->activityObject->setDateAdded(time());
    }
    public function buildStarred($obj){
	$this->activityObject->setStarred("false");
    }
    public function buildPostLink($obj, $account){
	$filename = "../../serviceCreds.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$tok = json_decode($file, true);

	for($x = 0; $x < count($tok['google']); $x++){
		if($tok['google'][$x]['user'] == $account['user']){
			$temp = $tok['google'][$x];
		}
	}

	$this->activityObject->setPostLink("");
    }
	public function buildIsLiked($obj){
		$this->activityObject->setIsLiked("false");
	}
	public function buildIsCommented($obj){
		$this->activityObject->setIsCommented("false");
	}
	public function buildIsFavorited($obj){
		$this->activityObject->setIsFavorited("false");
	}
	public function buildMainAccountName($account){
		$this->activityObject->setMainAccountName($account['name']);
	}
	public function buildMainAccountID($account){
		$this->activityObject->setMainAccountID($account['user']);
	}
	public function buildMainAccountColor($account){
		$this->activityObject->setMainAccountColor($account['color']);
	}
}