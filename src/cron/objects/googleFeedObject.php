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
	public $text = '';
	public $url = '';
	public $picture = '';
	public $album = '';
	public $header = '';

	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
	public function setText($text){
		$this->text = $text;
	}
	public function setURL($url){
		$this->url = $url;
	}
	public function setPicture($picture){
		$this->picture = $picture;
	}
	public function setAlbum($album){
		$this->album = $album;
	}
	public function setHeader($header){
		$this->header = $header;
	}
}

class GoogleAlbum{
	public $url = array();
	
	public function setURL($url){
		array_push($this->url, $url);
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

		$actor->setName($obj['actor']['displayName']);
		$actor->setId($obj['actor']['id']);
		$actor->setSearchable($obj['actor']['displayName']);
		$actor->setdisplayName($obj['actor']['displayName']);
		$actor->setImage($obj['actor']['image']['url']);
		$actor->setURL($obj['actor']['url']);
		$actor->setLocation("");
		$actor->setGeoLocation("");
		$actor->setDescription("");

		$this->activityObject->setActor($actor);
	}

	public function buildContent($obj){
		$content = new GoogleContent();
		$queryString = '';
		
		$text = new textBlockWithURLS();
		if(isset($obj['object']['attachments'][0]['content'])){
			$text->setText($obj['object']['attachments'][0]['content']);
			$text->setLinks($obj['object']['attachments'][0]['content']);
			$queryString = $queryString . " " . $obj['object']['attachments'][0]['content'];
		}else{
			$text->setText($obj['object']['content']);
			$text->setLinks($obj['object']['content']);
			$queryString = $queryString . " " . $obj['object']['content'];
		}
		$content->setText($text);
		$content->setURL($obj['object']['attachments'][0]['url']);
		
		$picArr = new GoogleAlbum();
		if(isset($obj['object']['attachments'][0]['thumbnails'])){
			for($x = 0; $x < count($obj['object']['attachments'][0]['thumbnails']); $x++){
				$picArr->setURL($obj['object']['attachments'][0]['thumbnails'][$x]['image']['url']);
			}
		}
		$content->setAlbum($picArr);
		
		if(isset($obj['object']['attachments'][0]['image'])){
			$content->setPicture($obj['object']['attachments'][0]['image']['url']);
		}
		$content->setHeader($obj['object']['attachments'][0]['displayName']);
		$queryString = $queryString . " " . $obj['object']['attachments'][0]['displayName'];
		$content->setQueryString($queryString);
		
		$this->activityObject->setContent($content);
	}
	
	public function buildPublished($obj){
		$this->activityObject->setPublished(strtotime($obj['published']));
	}
	public function buildGenerator($obj){
		$this->activityObject->setGenerator('Google');
	}
	public function buildTitle($obj){
		$this->activityObject->setTitle($obj['title']);
	}
	public function buildVerb($obj){
		$this->activityObject->setVerb($obj['verb']);
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
		$this->activityObject->setPostLink($obj['url']);
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