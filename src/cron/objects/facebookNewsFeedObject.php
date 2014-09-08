<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the facebook object used for mining feedData
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
class FacebookContent{
    public $objectType = '';
    public $url = '';
    public $text = '';
    public $id = '';
    public $likes = '';
    public $comments = '';
    public $story = '';
    public $storyTags = '';
    public $to = '';
    public $picture = '';
    public $commentURL = '';
    public $likeURL = '';
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
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setStory($story){
		$this->story = $story;
	}
	public function setStoryTags($storyTags){
		$this->storyTags = $storyTags;
	}
	public function setTo($to){
		$this->to = $to;
	}
	public function setPicture($picture){
		$this->picture = $picture;
	}
	public function setCommentURL($cURL){
		$this->commentURL = $cURL;
	}
	public function setLikeURL($lURL){
		$this->likeURL = $lURL;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class FacebookTo{
	public $name = '';
	public $id = '';

	public function setName($name){
		$this->name = $name;
	}
	public function setId($id){
		$this->id = $id;
	}
}

class FacebookStoryTags {
	public $name = '';
	public $id = '';
	public $type = '';

	public function setName($name){
		$this->name = $name;
	}
	public function setId($id){
		$this->id = $id;
	}
	public function setType($type){
		$this->type = $type;
	}
}

class FacebookLike {
	public $name = '';
	public $id = '';
	public $likeURL = '';

	public function setName($name){
		$this->name = $name;
	}
	public function setId($id){
		$this->id = $id;
	}
}

class FacebookComment{
	public $commentId = '';
	public $name = '';
	public $text = '';
	public $published = '';
	public $userId = '';
	public $commentURL = '';

	public function setCommentId($commentId){
		$this->commentId = $commentId;
	}
	public function setName($name){
		$this->name = $name;
	}
	public function setText($text){
		$this->text = $text;
	}
	public function setPublished($published){
		$this->published = $published;
	}
	public function setUserId($userId){
		$this->userId = $userId;
	}
}

#CONCRETE BUILDER
class facebookNewsFeedObjectBuilder extends activityObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtotime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}

   public function buildActor($obj){
        $actor = new Actor();

        $actor->setName($obj['from']['name']);
        $actor->setId($obj['from']['id']);
		$actor->setSearchable($obj['from']['id']);
        $actor->setdisplayName($obj['from']['name']);
        $actor->setImage("");
        $actor->setURL("https://www.facebook.com/" . $obj['from']['id']);
        $actor->setLocation("");
        $actor->setGeoLocation("");
        $actor->setDescription("");

       
        $this->activityObject->setActor($actor);
    }

    public function buildContent($obj){
		$queryString = '';

		$likeArray = array();
		if(isset($obj['likes'])){
			if(isset($obj['likes']['data'])){
				$objLD = $obj['likes']['data'];

				for($p = 0; $p < count($objLD); $p++){
					$thing = $objLD[$p];

					$like = new FacebookLike();
					$like->setName($thing['name']);
					$like->setid($thing['id']);

					array_push($likeArray, $like);
				}
			}
		}

		$commentArray = array();
		if(isset($obj['comments'])){
			if(isset($obj['comments']['data'])){
				$objCD = $obj['comments']['data'];

				for($d = 0; $d < count($objCD); $d++){
					$thang = $objCD[$d];

					$comment = new FacebookComment();
					$comment->setCommentId($thang['id']);
					$comment->setName($thang['from']['name']);
						$text = new textBlockWithURLS();
						$text->setText($thang['message']);
						$text->setLinks($thang['message']);
					$comment->setText($text);
					$comment->setPublished($thang['created_time']);
					$comment->setUserId($thang['from']['id']);

					array_push($commentArray, $comment);
				}

			}
		}

		$storyTagArray = array();
		if(isset($obj['story_tags'])){
			$objS = $obj['story_tags'];
			for($d = 0; $d < count($objS); $d++){
				if(isset($objS[$d])){
					for($f = 0; $f < count($objS[$d]); $f++){
						$thung = $objS[$d][$f];

						$storyTag = new FacebookStoryTags();
						$storyTag->setId($thung['id']);
						$storyTag->setName($thung['name']);
						$storyTag->setType($thung['type']);

						array_push($storyTagArray, $storyTag);
					}
				}
			}
		}

		$toArray = array();
		if(isset($obj['to'])){
			if(isset($obj['to']['data'])){
				$objTD = $obj['to']['data'];
				for($d = 0; $d < count($objTD); $d++){
					$thong = $objTD[$d];

					$to = new FacebookTo();
					$to->setName($thong['name']);
					$to->setId($thong['id']);

					array_push($toArray, $to);
				}
			}
		}

		$content = new FacebookContent();

		if(isset($obj['id'])){
			$content->setId($obj['id']);
		}
		if(isset($obj['type'])){
			$content->setObjectType($obj['type']);
		}
		if(isset($obj['link'])){
			$content->setURL($obj['link']);
		}

		$text = new textBlockWithURLS();

		if(isset($obj['message'])){
			$text->setText($obj['message']);
			$text->setLinks($obj['message']);
			$queryString = $queryString . " " . $obj['message'];
		}

	    $content->setText($text);

	    if(isset($obj['actions'])){
        	if(isset($obj['actions'][0])){
        		if(isset($obj['actions'][0]['link'])){
        			$content->setCommentURL($obj['actions'][0]['link']);
					$content->setLikeURL($obj['actions'][0]['link']);
        		}
        	}
        }

        if(isset($obj['type'])){									//ADDED BLOCK HERE TO GET BIG PICTURES
            if($obj['type'] == "photo"){
                $url = 'http://graph.facebook.com/' . $obj['object_id'] . "?fields=images";
				$ch = curl_init($url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$response = curl_exec($ch);
				curl_close($ch);
				$res = json_decode($response, TRUE);
					
				if(isset($res['images'])){
					if(isset($res['images'][0])){
						$content->setPicture($res['images'][0]['source']);
					}else{
						if(isset($obj['picture'])){
			           		$content->setPicture($obj['picture']);
			           	}
					}
				}else{
					if(isset($obj['picture'])){
		           		$content->setPicture($obj['picture']);
		           	}
				}	
            }else{
	           	if(isset($obj['picture'])){
	           		$content->setPicture($obj['picture']);
	           	}
            }
        }else{
       		$content->setPicture($obj['picture']);
        }
		$text = new textBlockWithURLS();

		if(isset($obj['story'])){
			$text->setText($obj['story']);
			$text->setLinks($obj['story']);
			$queryString = $queryString . " " . $obj['story'];
		}

		$content->setStory($text);
		$content->setStoryTags($storyTagArray);
		$content->setLikes($likeArray);
		$content->setComments($commentArray);
		$content->setTo($toArray);

		$content->setQueryString($queryString);
		$this->activityObject->setContent($content);
	}
    public function buildPublished($obj){
        if(isset($obj['created_time'])){
        	$this->activityObject->setPublished(intval(substr(@strtotime($obj['created_time']), 0, 10)));
        }
    }
    public function buildGenerator($obj){
        $this->activityObject->setGenerator('Facebook');
    }
    public function buildTitle($obj){
        if(isset($obj['story'])){
        	$this->activityObject->setTitle($obj['story']);
        }
    }
    public function buildVerb($obj){
        $this->activityObject->setVerb("post");
    }
    public function buildId($obj){
        if(isset($obj['id'])){
        	$this->activityObject->setId("facebook-----".$obj['id']);
        }
    }
    public function buildService($obj){
		$this->activityObject->setService('Facebook');
    }
    public function buildStarred($obj){
		$this->activityObject->setStarred("false");
    }
    public function buildPostLink($obj, $account){
    	//print_R($account);
		$filename = $_SERVER['SERVICECREDS'];
		$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
		$tok = json_decode($file, true);

		//print_r($tok);

		//print_R($account);

		for($x = 0; $x < count($tok['facebook'][0]['accounts']); $x++){
			if($tok['facebook'][0]['accounts'][$x]['user'] == $account['user']){
				//echo "bob";
				$temp = $tok['facebook'][0]['accounts'][$x];
				break;
			}
		}

		$link = '';

		//print_r($temp);

		$url = 'https://graph.facebook.com/'
		. 'fql?q=SELECT+permalink+FROM+stream+WHERE+post_id="'.$obj['id'].'"'
		. '&access_token=' . $temp['accessToken'];
		$response = file_get_contents($url);
		$var = json_decode($response, true);

		if(isset($var['data'])){
			if(isset($var['data'][0])){
				if($var['data'][0]['permalink'] == null){
					$url = 'https://graph.facebook.com/'
					. 'fql?q=SELECT+attachment+FROM+stream+WHERE+post_id="'.$obj['id'].'"'
					. '&access_token=' . $temp['accessToken'];
					$response = file_get_contents($url);
					$var = json_decode($response, true);

					if(isset($var['data'][0]['attachment'])){
						if(isset($var['data'][0]['attachment']['media'])){
							if(isset($var['data'][0]['attachment']['media'][0])){
								if(isset($var['data'][0]['attachment']['media'][0]['href'])){
									if($var['data'][0]['attachment']['media'][0]['href'] == null){
										if(isset($obj['link'])){
											$link = $obj['link'];
										}
									}else{
										$link = $var['data'][0]['attachment']['media'][0]['href'];
									}			
								}
							}
						}
					}
				}else{
					if(isset($var['data'][0]['permalink'])){
						$link = $var['data'][0]['permalink'];
					}
				}
			}
		}

		$this->activityObject->setPostLink($link);
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