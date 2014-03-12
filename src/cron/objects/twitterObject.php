<?php

require_once('activityObject.php');

#PRODUCT
class TwitterContent{
    public $objectType = '';
    public $url = '';
    public $text = '';
    public $id = "";
    public $retweet = "";
    public $favorite = "";
    public $replyTo = "";
    public $location = "";
    public $mediaUrl = "";
    public $queryString = "";
   
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
    public function setRetweet($retweet){
        $this->retweet = $retweet;
    }
    public function setFavorite($favorite){
        $this->favorite = $favorite;
    }
     public function setLocation($location){
        $this->location = $location;
    }
    public function setReplyTo($replyTo){
        $this->replyTo = $replyTo;
    }
    public function setMediaUrl($mediaUrl){
        $this->mediaUrl = $mediaUrl;
    }
    public function setQueryString($queryString){
        $this->queryString = $queryString;
    }

}

#CONCRETE BUILDER
class twitterObjectBuilder extends activityObjectBuilder{   
    
    public function buildActor($obj){
        $actor = new Actor();

        $actor->setName($obj['user']['name']);
        $actor->setId($obj['user']['id_str']);
	    $actor->setSearchable($obj['user']['screen_name']);
        $actor->setdisplayName($obj['user']['screen_name']);
        $actor->setImage($obj['user']['profile_image_url']);
        $actor->setURL($obj['user']['url']);
        $actor->setLocation($obj['user']['location']);
        $actor->setGeoLocation($obj['user']['location']);
        $actor->setDescription($obj['user']['description']);

       
        $this->activityObject->setActor($actor);
    }
    public function buildContent($obj){
        $content = new TwitterContent();
        $queryString = '';

	$content->setId($obj['id_str']);
        $content->setObjectType('tweet');
		$text = new textBlockWithURLS();
		$text->setText($obj['text']);
		$text->setLinks($obj['text']);
		$queryString = $queryString . " " . $obj['text'];
	$content->setText($text);
        $content->setURL($obj['source']);
        $content->setRetweet($obj['retweet_count']);
        $content->setFavorite($obj['favourite_count']);
        $content->setLocation($obj['coordinates'][0]['coordinates']);
        $content->setReplyTo($obj['in_reply_to_status_id']);

        if(isset($obj['entities']['media'][0]['media_url'])){
            $content->setMediaUrl($obj['entities']['media'][0]['media_url']);
        }
       
	$content->setQueryString($queryString);
        $this->activityObject->setContent($content);
    }
    public function buildPublished($obj){
        $this->activityObject->setPublished(intval(substr(strtotime($obj['created_at']),0 ,10)));
    }
    public function buildGenerator($obj){
        $this->activityObject->setGenerator($obj['source']);
    }
    public function buildTitle($obj){
        $this->activityObject->setTitle($obj['text']);
    }
    public function buildVerb($obj){
        $this->activityObject->setVerb("post");
    }
    public function buildId($obj){
        $this->activityObject->setId("twitter-----".$obj['id_str']);
    }
    public function buildService($obj){
	    $this->activityObject->setService('Twitter');
    }
    public function buildDateAdded($obj){
	    $this->activityObject->setDateAdded(time());
    }
    public function buildStarred($obj){
	    $this->activityObject->setStarred("false");
    }
    public function buildPostLink($obj){
	    $this->activityObject->setPostLink("https://twitter.com/" . $obj['user']['screen_name'] . "/status/" . $obj['id']);
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