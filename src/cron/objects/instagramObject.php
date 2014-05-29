<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the instagram object used for mining feedData
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
class InstagramContent{
    public $objectType = '';
    public $url = '';
    public $text = '';
    public $id = '';
    public $location = '';
    public $likes = '';
    public $comments = '';
    public $tags = '';
    public $image = '';
    public $geoLocation = '';
    public $queryString = '';
    
   
    public function setObjectType($objectType){
        $this->objectType = $objectType;
    }
    public function setURL($url){
        $this->url = $url;
    }
    public function setText($text){
        $this->text = $text;
    }
    public function setId($id){
        $this->id = $id;
    }
    public function setLocation($location){
	$this->location = $location;
    }	
    public function setLikes($likes){
	$this->likes = $likes;
    }
    public function setComments($comments){
	$this->comments = $comments;
    }
    public function setTags($tags){
	$this->tags = $tags;
    }
    public function setImage($image){
	$this->image = $image;
    }
    public function setGeoLocation($geoLocation){
	if($geoLocation['latitude'] != "" && $geoLocation['longitude'] != ""){
		$latLong = $geoLocation['latitude'] . "#" . $geoLocation['longitude'];
		$this->geoLocation = $latLong;
	}else{
		$this->geoLocation = "";
	}
    }
    public function setQueryString($queryString){
	$this->queryString = $queryString;
    }
}

class InstaLike {
	public $username = '';
	public $profileImg = '';
	public $id = '';
	public $name = '';

	public function setUserName($userName){
		$this->username = $userName;
	}
	public function setProfileImg($profileImg){
		$this->profileImg = $profileImg;
	}
	public function setId($id){
		$this->id = $id;
	}
	public function setName($name){
		$this->name = $name;
	}
}

class InstaComment {
	public $createdTime = '';
	public $text = '';
	public $username = '';
	public $profileImg = '';
	public $commentId = '';
	public $name = '';
	public $commentUserId = '';

	public function setCreatedTime($time){
		$this->createdTime = $time;
	}
	public function setText($text){
		$this->text = $text;
	}
	public function setUserName($username){
		$this->username = $username;
	}
	public function setProfileImg($profileImg){
		$this->profileImg = $profileImg;
	}
	public function setCommentUserId($commentUserId){
		$this->commentUserId = $commentUserId;
	}
	public function setCommentId($commentId){
		$this->commentId = $commentId;
	}
	public function setName($name){
		$this->name = $name;
	}
}

class InstaTag {
	public $tagList = array();

	public function setTagList($tag){
		array_push($this->tagList, $tag);
	}
}

class InstaImage {
	public $lowRes = '';
	public $highRes = '';
	public $thumb = '';

	public function setLowRes($lowRes){
		$this->lowRes = $lowRes;
	}
	public function setHighRes($highRes){
		$this->highRes = $highRes;
	}
	public function setThumb($thumb){
		$this->thumb = $thumb;
	}
}

#CONCRETE BUILDER
class instagramObjectBuilder extends activityObjectBuilder{
   public function buildActor($obj){
        $actor = new Actor();

        $actor->setName($obj['user']['full_name']);
        $actor->setId($obj['user']['id']);
		$actor->setSearchable($obj['user']['username']);
        $actor->setdisplayName($obj['user']['username']);
        $actor->setImage($obj['user']['profile_picture']);
        $actor->setURL($obj['user']['website']);
        $actor->setLocation($obj['location']['latitude'] . "#" . $obj['location']['longitude']);
        $actor->setDescription($obj['user']['bio']);

       
        $this->activityObject->setActor($actor);
    }
    public function buildContent($obj){
	$queryString = '';

	$likeArray = array();
	for($d = 0; $d < count($obj['likes']['data']); $d++){
		$thing = $obj['likes']['data'][$d];

		$like = new InstaLike();
		$like->setUserName($thing['username']);
		$like->setProfileImg($thing['profile_picture']);
		$like->setId($thing['id']);
		$like->setName($thing['full_name']);

		array_push($likeArray, $like);
	}

	$commentArray = array();
	for($j = 0; $j < count($obj['comments']['data']); $j++){
		$thang = $obj['comments']['data'][$j];

		$comment = new InstaComment();
		$comment->setCreatedTime($thang['created_time']);
			$text =  new textBlockWithURLS();
			$text->setText($thang['text']);
			$text->setLinks($thang['text']);
		$comment->setText($text);
		$comment->setUserName($thang['from']['username']);
		$comment->setProfileImg($thang['from']['profile_picture']);
		$comment->setCommentId($thang['id']);
		$comment->setCommentUserId($thang['from']['id']);
		$comment->setName($thang['from']['full_name']);

		array_push($commentArray, $comment);
	}

	$tag = new InstaTag();
	for($h=0; $h < count($obj['tags']); $h++){
		$thung = $obj['tags'][$h];

		$tag->setTagList($thung);
	}

	$image = new InstaImage();
	$image->setHighRes($obj['images']['standard_resolution']['url']);
	$image->setLowRes($obj['images']['low_resolution']['url']);
	$image->setThumb($obj['images']['thumbnail']['url']);

        $content = new InstagramContent();

	$content->setId($obj['id']);
        $content->setObjectType($obj['type']);
		$text =  new textBlockWithURLS();
		$text->setText($obj['caption']['text']);
		$text->setLinks($obj['caption']['text']);
		$queryString = $queryString . " " . $obj['caption']['text'];
        $content->setText($text);
        $content->setURL($obj['link']);
        $content->setLocation($obj['location']['latitude'] . "#" . $obj['location']['longitude']);
        $content->setGeoLocation($obj['location']);
	$content->setLikes($likeArray);
	$content->setComments($commentArray);
	$content->setTags($tag);
	$content->setImage($image);

	$content->setQueryString($queryString);
        $this->activityObject->setContent($content);
    }
    public function buildPublished($obj){
        $this->activityObject->setPublished(intval(substr($obj['created_time'], 0 ,10)));
    }
    public function buildGenerator($obj){
        $this->activityObject->setGenerator('Instagram');
    }
    public function buildTitle($obj){
        $this->activityObject->setTitle($obj['caption']['text']);
    }
    public function buildVerb($obj){
        $this->activityObject->setVerb("post");
    }
    public function buildId($obj){
        $this->activityObject->setId("instagram-----".$obj['id']);
    }
    public function buildService($obj){
	$this->activityObject->setService('Instagram');
    }
    public function buildStarred($obj){
	$this->activityObject->setStarred("false");
    }
    public function buildPostLink($obj, $account){
	$this->activityObject->setPostLink($obj['link']);
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
		$this->activityObject->setMainAccountID((string)$account['user']);
	}
	public function buildMainAccountColor($account){
		$this->activityObject->setMainAccountColor($account['color']);
	}
}