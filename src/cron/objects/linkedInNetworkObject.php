<?php

require_once('activityObject.php');
#PRODUCT
class LinkedInLikes{
	public $id = '';
	public $firstName = '';
	public $lastName = '';
	public $headline = '';
	public $pictureURL = '';

	public function setUserID($id){
		$this->id = $id;
	}
	public function setFirstName($firstName){
		$this->firstName = $firstName;
	}
	public function setLastName($lastName){
		$this->lastName = $lastName;
	}
	public function setHeadline($headline){
		$this->headline = $headline;
	}
	public function setPictureURL($pictureURL){
		$this->pictureURL = $pictureURL;
	}
}

class LinkedInComments{
	public $commentUserId = '';
	public $firstName = '';
	public $lastName = '';
	public $headline = '';
	public $pictureURL = '';
	public $text = '';
	public $commentId = '';

	public function setUserID($commentUserId){
		$this->commentUserId = $commentUserId;
	}
	public function setFirstName($firstName){
		$this->firstName = $firstName;
	}
	public function setLastName($lastName){
		$this->lastName = $lastName;
	}
	public function setHeadline($headline){
		$this->headline = $headline;
	}
	public function setPictureURL($pictureURL){
		$this->pictureURL = $pictureURL;
	}
	public function setText($text){
		$this->text = $text;
	}
	public function setCommentID($commentID){
		$this->commentID = $commentID;
	}
}

class LinkedInGroups{
    public $groupID = '';
    public $groupName = '';
    public $groupURL = '';
   
    public function setGroupID($groupID){
        $this->groupID = $groupID;
    }
    public function setGroupName($groupName){
        $this->groupName = $groupName;
    }
    public function setGroupURL($groupURL){
        $this->groupURL = $groupURL;
    }
}

class LinkedInReccomendations{
	public $recID = '';
	public $recType = '';
	public $recComment = '';
	public $reccommenderID = '';
	public $reccommenderFirstName = '';
	public $reccommenderLastName = '';
	public $reccommenderHeadline = '';
	public $reccommenderURL = '';
	public $pictureURL = '';

    public function setRecID($recID){
        $this->recID = $recID;
    }
    public function setRecType($recType){
        $this->recType = $recType;
    }
    public function setRecComment($recComment){
        $this->recComment = $recComment;
    }
    public function setReccommenderID($reccommenderID){
        $this->reccommenderID = $reccommenderID;
    }
    public function setReccommenderFirstName($reccommenderFirstName){
        $this->reccommenderFirstName = $reccommenderFirstName;
    }
    public function setReccommenderLastName($reccommenderLastName){
        $this->reccommenderLastName = $reccommenderLastName;
    }
    public function setReccommenderHeadline($reccommenderHeadline){
        $this->reccommenderHeadline = $reccommenderHeadline;
    }
    public function setReccommenderURL($reccommenderURL){
        $this->reccommenderURL = $reccommenderURL;
    }
    public function setPictureURL($pictureURL){
        $this->pictureURL = $pictureURL;
    }
}

class LinkedInPerson{
    public $id = '';
    public $firstName = '';
    public $lastName = '';
    public $headline = '';
    public $url = '';
    public $picture = '';
   
    public function setID($id){
        $this->id = $id;
    }
    public function setFirstName($firstName){
        $this->firstName = $firstName;
    }
    public function setLastName($lastName){
        $this->lastName = $lastName;
    }
    public function setHeadline($headline){
        $this->headline = $headline;
    }
    public function setURL($url){
        $this->url = $url;
    }
    public function setPicture($picture){
        $this->picture = $picture;
    }
}

class LinkedInPosition{
	public $ID = '';
	public $name = '';
	public $companyID = '';
	public $companyName = '';

	public function setID($ID){
		$this->ID = $ID;
	}
	public function setTitle($title){
		$this->name = $title;
	}
	public function setCompanyID($companyID){
		$this->companyID = $companyID;
	}
	public function setCompanyName($companyName){
		$this->companyName = $companyName;
	}
}

class LinkedInEducations{
	public $ID = '';
	public $title = '';
	public $companyID = '';
	public $companyName = '';

	public function setID($ID){
		$this->ID = $ID;
	}
	public function setTitle($title){
		$this->title = $title;
	}
	public function setCompanyID($companyID){
		$this->companyID = $companyID;
	}
	public function setCompanyName($companyName){
		$this->companyName = $companyName;
	}
}

class LinkedInSkills{
	public $name = '';

	public function setSkills($skill){
		$this->name = $skill;
	}
}

class LinkedInUpdatedFields{
	public $updatedField = '';

	public function setUpdatedField($updatedField){
		$this->updatedField = $updatedField;
	}
}

class LinkedInPatents{
	public $ID = '';
	public $name = '';

	public function setPatentID($patentID){
		$this->ID = $patentID;
	}
	public function setPatentTitle($patentTitle){
		$this->name = $patentTitle;
	}
}

class LinkedInPublications{
	public $ID = '';
	public $name = '';

	public function setPubID($publicationID){
		$this->ID = $publicationID;
	}
	public function setPubTitle($publicationTitle){
		$this->name = $publicationTitle;
	}
}

class LinkedInLanguages{
	public $name = '';

	public function setLanguages($language){
		$this->name = $language;
	}
}

class LinkedInAttachments{
	public $contentDomain = '';
	public $contentUrl = '';
	public $imageUrl = '';
	public $summary = '';
	public $title = '';

	public function setContentDomain($contentDomain){
		$this->contentDomain = $contentDomain;
	}
	public function setContentUrl($contentUrl){
		$this->contentUrl = $contentUrl;
	}
	public function setImageUrl($imageUrl){
		$this->imageUrl = $imageUrl;
	}
	public function setSummary($summary){
		$this->summary = $summary;
	}
	public function setTitle($title){
		$this->title = $title;
	}
}

class LinkedInDiscussion{
	public $title = '';
	public $summary = '';
	public $groupName = '';
	public $groupId = '';
	public $groupStatus = '';

	public function setTitle($title){
		$this->title = $title;
	}
	public function setSummary($summary){
		$this->summary = $summary;
	}
	public function setGroupName($groupName){
		$this->groupName = $groupName;
	}
	public function setGroupID($groupId){
		$this->groupId = $groupId;
	}
	public function setGroupStatus($groupStatus){
		$this->groupStatus = $groupStatus;
	}
}

#NETWORK OBJECTS BASED ON OBJECT TYPE
##FOR TYPES CONN / NCON / CCEM
class LinkedInContentDISCUSS{
	public $discussion = '';
	public $attachment = '';
	public $comments = '';
	public $likes = '';
	public $networkObjectType = '';
	public $id = '';
	public $commentURL = '';
	public $likeURL = '';
	public $queryString = '';


	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setDiscussion($discussion){
		$this->discussion = $discussion;
	}
	public function setAttachment($attachments){
		$this->attachment = $attachments;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setID($id){
		$this->id = $id;
	}
	public function setCommentURL($commentURL){
		$this->commentURL = $commentURL;
	}
	public function setLikeURL($likeURL){
		$this->likeURL = $likeURL;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

##"Actor is now connected to Content"
class LinkedInContentCONN{
    public $networkObjectType = '';
    public $person = '';
    public $connection = '';
    public $actionString = '';
    public $comments = '';
    public $likes = '';
    public $queryString = '';
   
    public function setNetworkObjectType($networkObjectType){
        $this->networkObjectType = $networkObjectType;
    }
    public function setPerson($person){
        $this->person = $person;
    }
    public function setConnection($connection){
        $this->connection = $connection;
    }
    public function setActionString($actionString){
        $this->actionString = $actionString;
    }
    public function setComments($comments){
        $this->comments = $comments;
    }
    public function setLikes($likes){
        $this->likes = $likes;
    }
    public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

#Author is where the content came from
class LinkedInContentSHAR{
    public $networkObjectType = '';
    public $status = '';
    public $contentURL = '';
    public $contentTitle = '';
    public $contentSource = '';
    public $authorFirstName = '';
    public $authorLastName = '';
    public $authorID = '';
    public $authorHeadline = '';
    public $id = '';
    public $postTime = '';
    public $comments = '';
    public $likes = '';
   public $queryString = '';
   
    public function setNetworkObjectType($networkObjectType){
        $this->networkObjectType = $networkObjectType;
    }
    public function setContentURL($contentURL){
        $this->contentURL = $contentURL;
    }
    public function setContentTitle($contentTitle){
        $this->contentTitle = $contentTitle;
    }
    public function setContentSource($contentSource){
        $this->contentSource = $contentSource;
    }   
    public function setAuthorFirstName($authorFirstName){
        $this->authorFirstName = $authorFirstName;
    }
    public function setAuthorLastName($authorLastName){
        $this->authorLastName = $authorLastName;
    }
    public function setAuthorID($authorID){
        $this->authorID = $authorID;
    }
    public function setAuthorHeadline($authorHeadline){
        $this->authorHeadline = $authorHeadline;
    }
    public function setId($id){
        $this->id = $id;
    }
    public function setPostTime($postTime){
	$this->postTime = $postTime;
    }
    public function setStatus($status){
        $this->status = $status;
    }
    public function setComments($comments){
        $this->comments = $comments;
    }
    public function setLikes($likes){
        $this->likes = $likes;
    }
    public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class LinkedInContentSTAT{
    public $networkObjectType = '';
    public $status = '';
    public $person = '';
    public $likes = '';
    public $comments = '';
   public $queryString = '';
    public function setNetworkObjectType($networkObjectType){
        $this->networkObjectType = $networkObjectType;
    }
    public function setStatus($status){
        $this->status = $status;
    }
    public function setPerson($person){
        $this->person = $person;
    }
    public function setComments($comments){
        $this->comments = $comments;
    }
    public function setLikes($likes){
        $this->likes = $likes;
    }
    public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class LinkedInContentVIRL{
    public $networkObjectType = '';
    public $action = '';
    public $originalContent = '';
    public $likes = '';
    public $comments = '';
    public $queryString = '';
   
    public function setNetworkObjectType($networkObjectType){
        $this->networkObjectType = $networkObjectType;
    }
    public function setAction($status){
        $this->status = $status;
    }
     public function setLikes($likes){
        $this->likes = $likes;
    }
     public function setComments($comments){
        $this->comments = $comments;
    }
     public function setOriginalContent($originalContent){
        $this->originalContent = $originalContent;
    }
    public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class LinkedInContentJGRP{
    public $networkObjectType = '';
    public $groups = '';
    public $person = '';
    public $comments = '';
    public $likes = '';
    public $queryString = '';
   
    public function setNetworkObjectType($networkObjectType){
        $this->networkObjectType = $networkObjectType;
    }
    public function setGroups($groups){
        $this->groups = $groups;
    }
    public function setPerson($person){
        $this->person = $person;
    }
    public function setLikes($comments){
        $this->comments = $comments;
    }
     public function setComments($likes){
        $this->likes = $likes;
    }
    public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

#actor reccoments the PREC for something
class LinkedInContentPREC{
	public $networkObjectType = '';
	public $recommendations = '';
	public $person = '';
	public $likes = '';
	public $comments = '';
	public $queryString = '';

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setRecommendations($recommendations){
		$this->recommendations = $recommendations;
	}
	public function setPerson($person){
		$this->person = $person;
	}
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

#actor will be the job poster
class LinkedInContentJOBP{
	public $networkObjectType = '';
	public $jobID = '';
	public $jobPosition = '';
	public $jobCompany = '';
	public $jobURL = '';
	public $jobPoster = '';
	public $jobLocation = '';
	public $jobDescription = '';
	public $likes = '';
	public $comments = '';
	public $queryString = '';

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setJobID($jobID){
		$this->jobID = $jobID;
	}
	public function setJobPosition($jobPosition){
		$this->jobPosition = $jobPosition;
	}
	public function setJ($jobCompany){
		$this->jobCompany = $jobCompany;
	}
	public function setJobURL($jobURL){
		$this->jobURL = $jobURL;
	}
	public function setJobPoster($jobPoster){
		$this->jobPoster = $jobPoster;
	}
	public function setLocation($location){
		$this->jobLocation = $location;
	}
	public function setDescription($description){
		$this->jobDescription = $description;
	}
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class LinkedInContentCMPY{
	public $networkObjectType = '';
	public $companyID = '';
	public $companyName = '';
	public $actionType = '';
	public $action = '';
	public $personType = '';
	public $person = '';
	public $job = '';
	public $updatedField = '';
	public $likes = '';
	public $comments = '';
	public $queryString = '';

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setCompanyID($companyID){
		$this->companyID = $companyID;
	}
	public function setCompanyName($companyName){
		$this->companyName = $companyName;
	}
	public function setActionType($actionType){
		$this->actionType = $actionType;
	}
	public function setAction($action){
		$this->action = $action;
	}
	public function setPersonType($personType){
		$this->personType = $personType;
	}
	public function setPerson($person){
		$this->person = $person;
	}
	public function setJob($job){
		$this->job = $job;
	}
	public function setUpdatedField($updatedField){
		$this->updatedField = $updatedField;
	}
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class LinkedInContentMSFC{
	public $networkObjectType = '';
	public $companyID = '';
	public $companyName = '';
	public $actionType = '';
	public $action = '';
	public $personType = '';
	public $person = '';
	public $comments = '';
	public $likes = '';
	public $queryString = '';

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setCompanyID($companyID){
		$this->companyID = $companyID;
	}
	public function setCompanyName($companyName){
		$this->companyName = $companyName;
	}
	public function setActionType($actionType){
		$this->actionType = $actionType;
	}
	public function setAction($action){
		$this->action = $action;
	}
	public function setPersonType($personType){
		$this->personType = $personType;
	}
	public function setPerson($person){
		$this->person = $person;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

class LinkedInContentPICU{
	public $networkObjectType = '';
	public $jobLocation = '';
	public $firstName = '';
	public $lastName = '';
	public $headline = '';
	public $picture = '';
	public $URL = '';
	public $patents = '';
	public $languages = '';
	public $publications = '';
	public $action = '';
	public $positions = '';
	public $educations = '';
	public $updatedFields = '';
	public $comments = '';
	public $likes = '';
	public $skills = '';
	public $queryString = '';

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setID($profileID){
		$this->id = $profileID;
	}
	public function setFirstName($profileFirstName){
		$this->firstName = $profileFirstName;
	}
	public function setLastName($profileLastName){
		$this->lastName = $profileLastName;
	}
	public function setHeadline($profileHeadline){
		$this->headline = $profileHeadline;
	}
	public function setPicture($profilePicture){
		$this->picture = $profilePicture;
	}
	public function setURL($profileURL){
		$this->URL = $profileURL;
	}
	public function setPatents($patents){
		$this->patents = $patents;
	}
	public function setLanguages($languages){
		$this->languages = $languages;
	}
	public function setPublications($publications){
		$this->publications = $publications;
	}
	public function setSkills($skills){
		$this->skills = $skills;
	}
	public function setAction($profileAction){
		$this->action = $profileAction;
	}
	public function setPositions($position){
		$this->positions = $position;
	}
	public function setEducations($education){
		$this->educations = $education;
	}
	public function setUpdatedFields($updateField){
		$this->updatedFields = $updateField;
	}
	public function setComments($comments){
		$this->comments = $comments;
	}
	public function setLikes($likes){
		$this->likes = $likes;
	}
	public function setQueryString($queryString){
		$this->queryString = $queryString;
	}
}

#CONCRETE BUILDER
class linkedInNetworkObjectBuilder extends activityObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtostime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}

	public function buildActor($obj){
		if(isset($obj['updateType'])){
			if($obj['updateType'] == "JOBP"){
				$actor = new Actor();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['job'])){
						if(isset($obj['updateContent']['job']['id'])){
							$objUJI = $obj['updateContent']['job']['id'];

							$actor->setId($objUJI);
							$actor->setSearchable($objUJI);
						}

						if(isset($obj['updateContent']['job']['pictureUrl'])){
							$objUJP = $obj['updateContent']['job']['pictureUrl'];

							$actor->setImage($objUJP);
						}

						if(isset($obj['updateContent']['job']['headline'])){
							$objUJH = $obj['updateContent']['job']['headline'];

							$actor->setDescription($objUJH);
						}

						if(isset($obj['updateContent']['job']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['job']['siteStandardProfileRequest']['url'])){
								$objUJSU = $obj['updateContent']['job']['siteStandardProfileRequest']['url'];

								$actor->setURL($objUJSU);
							}
						}

						if(isset($obj['updateContent']['job']['firstName'])){
							$objUJF = $obj['updateContent']['job']['firstName'];

							if(isset($obj['updateContent']['person'])){
								if(isset($obj['updateContent']['person']['lastName'])){
									$objUPL = $obj['updateContent']['person']['lastName'];

									$actor->setName($objUJF . " " . $objUPL);
									$actor->setdisplayName($objUJF . " " . $objUPL);
								}
							}
						}
					}
				}
				$this->activityObject->setActor($actor);
			}if($obj['updateType'] == "MSFC"){
				$actor = new Actor();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['companyPersonUpdate'])){
						if(isset($obj['updateContent']['companyPersonUpdate']['person'])){
							if(isset($obj['updateContent']['companyPersonUpdate']['person']['firstName'])){
								$objUCPF = $obj['updateContent']['companyPersonUpdate']['person']['firstName'];

								if(isset($obj['updateContent']['companyPersonUpdate']['person']['lastName'])){
								$objUCPL = $obj['updateContent']['companyPersonUpdate']['person']['lastName'];

								$actor->setdisplayName($objUCPF . " " . $objUCPL);
								$actor->setName($objUCPF . " " . $objUCPL);
								}
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['id'])){
								$objUCPI = $obj['updateContent']['companyPersonUpdate']['person']['id'];

								$actor->setId($objUCPI);
								$actor->setSearchable($objUCPI);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['pictureUrl'])){
								$objUCPP = $obj['updateContent']['companyPersonUpdate']['person']['pictureUrl'];

								$actor->setImage($objUCPP);
							}

							#if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest'])){
							#	$objUCPS = $obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest'];

							#	$actor->setURL($objUCPS);
							#}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['headline'])){
								$objUCPH = $obj['updateContent']['companyPersonUpdate']['person']['headline'];

								$actor->setDescription($objUCPH);
							}
						}
					}
				}
				$this->activityObject->setActor($actor);
			}elseif($obj['updateType'] == "CONN" || $obj['updateType'] == "JGRP" || $obj['updateType'] == "STAT" || $obj['updateType'] == "PROF" || $obj['updateType'] == "PREC" || $obj['updateType'] == "APPM"){
				$actor = new Actor();
				if(isset($obj['updateContent'])){
					$actor->setName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
					$actor->setId($obj['updateContent']['person']['id']);
					$actor->setSearchable($obj['updateContent']['person']['id']);
					$actor->setdisplayName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
					$actor->setImage($obj['updateContent']['person']['pictureUrl']);
					$actor->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
					$actor->setLocation("");
					$actor->setDescription($obj['updateContent']['person']['headline']);
				}
				$this->activityObject->setActor($actor);
			}
		}elseif(isset($obj['networkObjectType'])){
			if($obj['networkObjectType'] == "DISCUSS"){
				$actor = new Actor();

				if(isset($obj['creator'])){
					if(isset($obj['creator']['id'])){
						$objCI = $obj['creator']['id'];

						$actor->setId($objCI);
						$actor->setSearchable($objCI);
					}

					if(isset($obj['creator']['pictureUrl'])){
						$objCP = $obj['creator']['pictureUrl'];

						$actor->setImage($objCP);
					}

					if(isset($obj['creator']['headline'])){
						$objCH = $obj['creator']['headline'];

						$actor->setDescription($objCH);
					}

					if(isset($obj['creator']['firstName'])){
						$objCF = $obj['creator']['firstName'];

						if(isset($obj['creator']['lastName'])){
							$objCL = $obj['creator']['lastName'];

							$actor->setName($objCF . " " . $objCL);
							$actor->setdisplayName($objCF . " " . $objCL);
						}
					}
				}

				$this->activityObject->setActor($actor);
			}
		}
	}

	public function buildContent($obj){	
		$queryString = '';
		if(isset($obj['updateType'])){
			if($obj['updateType'] == "CONN"){
				$content = new LinkedInContentCONN();

				$person = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$objUPI = $obj['updateContent']['person']['id'];

							$person->setID($objUPI); 
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$objUPF = $obj['updateContent']['person']['firstName'];

							$person->setFirstName($objUPF);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$objUPL = $obj['updateContent']['person']['lastName'];

							$person->setLastName($objUPL);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$objUPH = $obj['updateContent']['person']['headline'];

							$person->setHeadline($objUPH);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$objUPP = $obj['updateContent']['person']['pictureUrl'];

							$person->setPicture($objUPP);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$objUPSU = $obj['updateContent']['person']['siteStandardProfileRequest']['url'];

								$person->setURL($objUPSU);
							}
						}
					}
				}

				$connArray = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['connections'])){
							if(isset($obj['updateContent']['person']['connections']['values'])){
								for($k=0; $k<count($obj['updateContent']['person']['connections']['values']); $k++){
									$connection = new LinkedInPerson();

									if(isset($obj['updateContent']['person']['connections']['values'][$k])){
										if(isset($obj['updateContent']['person']['connections']['values'][$k]['id'])){
											$connection->setID($obj['updateContent']['person']['connections']['values'][$k]['id']);
										}

										if(isset($obj['updateContent']['person']['connections']['values'][$k]['firstName'])){
											$connection->setFirstName($obj['updateContent']['person']['connections']['values'][$k]['firstName']);
										}

										if(isset($obj['updateContent']['person']['connections']['values'][$k]['lastName'])){
											$connection->setLastName($obj['updateContent']['person']['connections']['values'][$k]['lastName']);
										}

										if(isset($obj['updateContent']['person']['connections']['values'][$k]['headline'])){
											$connection->setHeadline($obj['updateContent']['person']['connections']['values'][$k]['headline']);
										}

										if(isset($obj['updateContent']['person']['connections']['values'][$k]['pictureUrl'])){
											$connection->setPicture($obj['updateContent']['person']['connections']['values'][$k]['pictureUrl']);
										}

										if(isset($obj['updateContent']['person']['connections']['values'][$k]['siteStandardProfileRequest'])){
											if(isset($obj['updateContent']['person']['connections']['values'][$k]['siteStandardProfileRequest']['url'])){
												$connection->setURL($obj['updateContent']['person']['connections']['values'][$k]['siteStandardProfileRequest']['url']);
											}
										}

										array_push($connArray, $connection);
									}
								}
							}
						}
					}
				}

				$content->setNetworkObjectType($obj['updateType']);
				$content->setActionString("is now connected to");
				$content->setPerson($person);
				$content->setConnection($connArray);
				$content->setComments(array());
				$content->setLikes(array());

				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "NCON"){
				$content = new LinkedInContentCONN();

				$connection = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$connection->setID($obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$connection->setFirstName($obj['updateContent']['person']['firstName']);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$connection->setLastName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$connection->setHeadline($obj['updateContent']['person']['headline']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$connection->setPicture($obj['updateContent']['person']['pictureUrl']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$connection->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}

				$content->setNetworkObjectType($obj['updateType']);
				$content->setActionString("is now a connection");
				$content->setConnection($connection);
				$content->setComments(array());
				$content->setLikes(array());

				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "CCEM"){
				$content = new LinkedInContentCONN();

				$person = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$person->setID($obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$person->setFirstName($obj['updateContent']['person']['firstName']);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$person->setLastName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$person->setHeadline($obj['updateContent']['person']['headline']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$person->setPicture($obj['updateContent']['person']['pictureUrl']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$person->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}

				$content->setNetworkObjectType($obj['updateType']);
				$content->setActionString("has joined Linkedin");
				$content->setPerson($person);
				$content->setComments(array());
				$content->setLikes(array());

				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "SHAR"){
				$content = new LinkedInContentSHAR();

				$content->setNetworkObjectType($obj['updateType']);

				$text =  new textBlockWithURLS();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['currentShare'])){
							if(isset($obj['updateContent']['person']['currentShare']['comment'])){
								$objUPCC = $obj['updateContent']['person']['currentShare']['comment'];

								$text->setText($objUPCC);
								$text->setLinks($objUPCC);
							}

							if(isset($obj['updateContent']['person']['currentShare']['timestamp'])){
								$content->setPostTime($obj['updateContent']['person']['currentShare']['timestamp']);
							}

							if(isset($obj['updateContent']['person']['currentShare']['id'])){
								$content->setID($obj['updateContent']['person']['currentShare']['id']);
							}

							if(isset($obj['updateContent']['person']['currentShare']['source'])){
								if(isset($obj['updateContent']['person']['currentShare']['source']['serviceProvider'])){
									$content->setContentSource($obj['updateContent']['person']['currentShare']['source']['serviceProvider']);
								}
							}

							if(isset($obj['updateContent']['person']['currentShare']['content'])){
								if(isset($obj['updateContent']['person']['currentShare']['content']['submittedUrl'])){
									$content->setContentURL($obj['updateContent']['person']['currentShare']['content']['submittedUrl']);
								}

								if(isset($obj['updateContent']['person']['currentShare']['content']['title'])){
									$content->setContentTitle($obj['updateContent']['person']['currentShare']['content']['title']);
								}
							}

							if(isset($obj['updateContent']['person']['currentShare']['author'])){
								if(isset($obj['updateContent']['person']['currentShare']['author']['firstName'])){
									$content->setAuthorFirstName($obj['updateContent']['person']['currentShare']['author']['firstName']);
								}

								if(isset($obj['updateContent']['person']['currentShare']['author']['lastName'])){
									$content->setAuthorLastName($obj['updateContent']['person']['currentShare']['author']['lastName']);
								}

								if(isset($obj['updateContent']['person']['currentShare']['author']['id'])){
									$content->setAuthorID($obj['updateContent']['person']['currentShare']['author']['id']);
								}

								if(isset($obj['updateContent']['person']['currentShare']['author']['headline'])){
									$content->setAuthorHeadline($obj['updateContent']['person']['currentShare']['author']['headline']);
								}
							}
						}
					}
				}

				$content->setStatus($text);
				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "STAT"){
				$content = new LinkedInContentSTAT();

				$likeArr = array();
				if(isset($obj['likes'])){
					if(isset($obj['likes']['values'])){
						for($k=0; $k<count($obj['likes']['values']); $k++){
							$like = new LinkedInLikes();

							if(isset($obj['likes']['values'][$k])){
								if(isset($obj['likes']['values'][$k]['person'])){
									if(isset($obj['likes']['values'][$k]['person']['id'])){
										$like->setUserID($obj['likes']['values'][$k]['person']['id']);
									}

									if(isset($obj['likes']['values'][$k]['person']['firstName'])){
										$like->setFirstName($obj['likes']['values'][$k]['person']['firstName']);
									}

									if(isset($obj['likes']['values'][$k]['person']['lastName'])){
										$like->setLastName($obj['likes']['values'][$k]['person']['lastName']);
									}

									if(isset($obj['likes']['values'][$k]['person']['headline'])){
										$like->setHeadline($obj['likes']['values'][$k]['person']['headline']);
									}

									if(isset($obj['likes']['values'][$k]['person']['pictureUrl'])){
										$like->setPictureURL($obj['likes']['values'][$k]['person']['pictureUrl']);
									}

									array_push($likeArr, $like);
								}
							}
						}
					}
				}

				$commentArray = array();
				if(isset($obj['updateComments'])){
					if(isset($obj['updateComments']['values'])){
						for($g=0; $g<count($obj['updateComments']['values']); $g++){
							$comment = new LinkedInComments();

							if(isset($obj['updateComments']['values'][$g])){
								if(isset($obj['updateComments']['values'][$g]['id'])){
									$comment->setCommentID($obj['updateComments']['values'][$g]['id']);
								}

								if(isset($obj['updateComments']['values'][$g]['comment'])){
									$objUVGC = $obj['updateComments']['values'][$g]['comment'];

									$text =  new textBlockWithURLS();
									$text->setText($objUVGC);
									$text->setLinks($objUVGC);
								}

								if(isset($obj['updateComments']['values'][$g]['person'])){
									$objUVGP = $obj['updateComments']['values'][$g]['person'];

									if(isset($obj['updateComments']['values'][$g]['person']['id'])){
										$comment->setUserID($objUVGP['id']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['firstName'])){
										$comment->setFirstName($objUVGP['firstName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['lastName'])){
										$comment->setLastName($objUVGP['lastName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['headline'])){
										$comment->setHeadline($objUVGP['headline']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['pictureUrl'])){
										$comment->setPictureURL($objUVGP['pictureUrl']);
									}
								}
							}

							$comment->setText($text);

							array_push($commentArray, $comment);
						}
					}
				}

				$person = new LinkedInPerson();
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$person->setID($obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$person->setFirstName($obj['updateContent']['person']['firstName']);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$person->setLastName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$person->setHeadline($obj['updateContent']['person']['headline']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$person->setPicture($obj['updateContent']['person']['pictureUrl']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$person->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}

				$content->setNetworkObjectType($obj['updateType']);

				$stat =  new textBlockWithURLS();
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['currentStatus'])){
							$objUPC = $obj['updateContent']['person']['currentStatus'];
							$queryString = $queryString . " " . $objUPC;
							$stat->setText($objUPC);
							$stat->setLinks($objUPC);
						}
					}
				}

				$content->setStatus($stat);
				$content->setPerson($person);
				$content->setLikes($likeArr);
				$content->setComments($commentArray);

				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "VIRL"){
				$likeArr = array();

				if(isset($obj['likes'])){
					if(isset($obj['likes']['values'])){
						for($k=0; $k<count($obj['likes']['values']); $k++){
							$like = new LinkedInLikes();

							if(isset($obj['likes']['values'][$k])){
								if(isset($obj['likes']['values'][$k]['person'])){
									if(isset($obj['likes']['values'][$k]['person']['id'])){
										$like->setUserID($obj['likes']['values'][$k]['person']['id']);
									}

									if(isset($obj['likes']['values'][$k]['person']['firstName'])){
										$like->setFirstName($obj['likes']['values'][$k]['person']['firstName']);
									}

									if(isset($obj['likes']['values'][$k]['person']['lastName'])){
										$like->setLastName($obj['likes']['values'][$k]['person']['lastName']);
									}

									if(isset($obj['likes']['values'][$k]['person']['headline'])){
										$like->setHeadline($obj['likes']['values'][$k]['person']['headline']);
									}

									if(isset($obj['likes']['values'][$k]['person']['pictureUrl'])){
										$like->setPictureURL($obj['likes']['values'][$k]['person']['pictureUrl']);
									}

									array_push($likeArr, $like);
								}
							}
						}
					}
				}

				$commentArray = array();
				if(isset($obj['likes'])){
					if(isset($obj['likes']['values'])){
						for($g=0; $g<count($obj['updateComments']['values']); $g++){
							$comment = new LinkedInComments();

							if(isset($obj['updateComments']['values'][$g])){
								if(isset($obj['updateComments']['values'][$g]['person'])){
									if(isset($obj['updateComments']['values'][$g]['person']['id'])){
										$comment->setUserID($obj['updateComments']['values'][$g]['person']['id']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['firstName'])){
										$comment->setFirstName($obj['updateComments']['values'][$g]['person']['firstName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['lastName'])){
										$comment->setLastName($obj['updateComments']['values'][$g]['person']['lastName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['headline'])){
										$comment->setHeadline($obj['updateComments']['values'][$g]['person']['headline']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['pictureUrl'])){
										$comment->setPictureURL($obj['updateComments']['values'][$g]['person']['pictureUrl']);
									}
								}

								if(isset($obj['updateComments']['values'][$g]['comment'])){
									$text =  new textBlockWithURLS();
									$text->setText($obj['updateComments']['values'][$g]['comment']);
									$text->setLinks($obj['updateComments']['values'][$g]['comment']);
								}

								if(isset($obj['updateComments']['values'][$g]['id'])){
									$comment->setCommentID($obj['updateComments']['values'][$g]['id']);
								}

								$comment->setText($text);

								array_push($commentArray, $comment);
							}
						}
					}
				}

				$content = new LinkedInContentVIRL();

				$content->setNetworkObjectType($obj['updateType']);

				if(isset($obj['updateAction'])){
					if(isset($obj['updateAction']['action'])){
						$content->setAction($obj['updateAction']['action']);
					}

					if(isset($obj['updateAction']['originalUpdate'])){
						if(isset($obj['updateAction']['originalUpdate']['updateContent'])){
							$content->setOriginalContent($obj['updateAction']['originalUpdate']['updateContent']);
						}
					}
				}

				$content->setLikes($likeArray);
				$content->setComments($commentArray);

				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "JGRP"){
				$groupArray = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['memberGroups'])){
							if(isset($obj['updateContent']['person']['memberGroups'])){
								if(isset($obj['updateContent']['person']['memberGroups']['values'])){
									for($g=0; $g<count($obj['updateContent']['person']['memberGroups']['values']); $g++){
										$group = new LinkedInGroups();

										if(isset($obj['updateContent']['person']['memberGroups']['values'][$g])){
											if(isset($obj['updateContent']['person']['memberGroups']['values'][$g]['id'])){
												$group->setGroupID($obj['updateContent']['person']['memberGroups']['values'][$g]['id']);
											}

											if(isset($obj['updateContent']['person']['memberGroups']['values'][$g]['name'])){
												$group->setGroupName($obj['updateContent']['person']['memberGroups']['values'][$g]['name']);
											}

											if(isset($obj['updateContent']['person']['memberGroups']['values'][$g]['siteGroupRequest'])){
												if(isset($obj['updateContent']['person']['memberGroups']['values'][$g]['siteGroupRequest']['url'])){
													$group->setGroupURL($obj['updateContent']['person']['memberGroups']['values'][$g]['siteGroupRequest']['url']);
												}
											}

											array_push($groupArray, $group);
										}
									}
								}
							}
						}
					}
				}


				$person = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$person->setID($obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$person->setFirstName($obj['updateContent']['person']['firstName']);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$person->setLastName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$person->setHeadline($obj['updateContent']['person']['headline']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$person->setPicture($obj['updateContent']['person']['pictureUrl']); 
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$person->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}

				$content = new LinkedInContentJGRP();

				$content->setNetworkObjectType($obj['updateType']);
				$content->setGroups($groupArray);
				$content->setPerson($person);
				$content->setComments(array());
				$content->setLikes(array());

				$this->activityObject->setContent($content);
			}elseif($obj['updateType'] == "PREC" || $obj['updateType'] == "SVPR"){
				$likeArr = array();

				if(isset($obj['likes'])){
					if(isset($obj['likes']['values'])){
						for($k=0; $k<count($obj['likes']['values']); $k++){
							$like = new LinkedInLikes();

							if(isset($obj['likes']['values'][$k])){
								if(isset($obj['likes']['values'][$k]['person'])){
									if(isset($obj['likes']['values'][$k]['person']['id'])){
										$like->setUserID($obj['likes']['values'][$k]['person']['id']);
									}

									if(isset($obj['likes']['values'][$k]['person']['firstName'])){
										$like->setFirstName($obj['likes']['values'][$k]['person']['firstName']);
									}

									if(isset($obj['likes']['values'][$k]['person']['lastName'])){
										$like->setLastName($obj['likes']['values'][$k]['person']['lastName']);
									}

									if(isset($obj['likes']['values'][$k]['person']['headline'])){
										$like->setHeadline($obj['likes']['values'][$k]['person']['headline']);
									}

									if(isset($obj['likes']['values'][$k]['person']['pictureUrl'])){
										$like->setPictureURL($obj['likes']['values'][$k]['person']['pictureUrl']);
									}
								}

								array_push($likeArr, $like);
							}
						}
					}
				}

				$commentArray = array();
				if(isset($obj['updateComments'])){
					if(isset($obj['updateComments']['values'])){
						for($g=0; $g<count($obj['updateComments']['values']); $g++){
							$comment = new LinkedInComments();

							if(isset($obj['updateComments']['values'][$g])){
								if(isset($obj['updateComments']['values'][$g]['person'])){
									if(isset($obj['updateComments']['values'][$g]['person']['id'])){
										$comment->setUserID($obj['updateComments']['values'][$g]['person']['id']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['firstName'])){
										$comment->setFirstName($obj['updateComments']['values'][$g]['person']['firstName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['lastName'])){
										$comment->setLastName($obj['updateComments']['values'][$g]['person']['lastName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['headline'])){
										$comment->setHeadline($obj['updateComments']['values'][$g]['person']['headline']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['pictureUrl'])){
										$comment->setPictureURL($obj['updateComments']['values'][$g]['person']['pictureUrl']);
									}
								}

								if(isset($obj['updateComments']['values'][$g]['comment'])){
									$objUVGC = $obj['updateComments']['values'][$g]['comment'];

									$text =  new textBlockWithURLS();
									$text->setText($objUVGC);
									$text->setLinks($objUVGC);
								}

								if(isset($obj['updateComments']['values'][$g]['id'])){
									$comment->setCommentID($obj['updateComments']['values'][$g]['id']);
								}

								$comment->setText($text);

								array_push($commentArray, $comment);
							}
						}
					}
				}

				$person = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$person->setID($obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$person->setFirstName($obj['updateContent']['person']['firstName']);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$person->setLastName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$person->setHeadline($obj['updateContent']['person']['headline']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$person->setPicture($obj['updateContent']['person']['pictureUrl']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$person->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}

				$recArray = array();
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['recommendationsGiven'])){
							if(isset($obj['updateContent']['person']['recommendationsGiven']['values'])){
								for($d=0; $d<count($obj['updateContent']['person']['recommendationsGiven']['values']); $d++){
									$rec = new LinkedInReccomendations();

									if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d])){
										if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['id'])){
											$rec->setRecID($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['id']);
										}

										if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendationSnippet'])){
											$rec->setRecComment($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendationSnippet']);
										}

										if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendationType'])){
											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendationType']['code'])){
												$rec->setRecType($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendationType']['code']);
											}
										}

										if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee'])){
											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['id'])){
												$rec->setReccommenderID($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['id']);
											}

											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['firstName'])){
												$rec->setReccommenderFirstName($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['firstName']);
											}

											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['lastName'])){
												$rec->setReccommenderLastName($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['lastName']);
											}

											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['headline'])){
												$rec->setReccommenderHeadline($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['headline']);
											}

											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['pictureUrl'])){
												$rec->setPictureURL($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['pictureUrl']);
											}

											if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['siteStandardProfileRequest'])){
												if(isset($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['siteStandardProfileRequest']['url'])){
													$rec->setReccommenderURL($obj['updateContent']['person']['recommendationsGiven']['values'][$d]['recommendee']['siteStandardProfileRequest']['url']);
												}
											}
										}

										array_push($recArray, $rec);
									}
								}
							}
						}
					}
				}

				$reccomend = new LinkedInContentPREC();

				$reccomend->setNetworkObjectType($obj['updateType']);
				$reccomend->setRecommendations($recArray);
				$reccomend->setPerson($person);
				$reccomend->setLikes($likeArr);
				$reccomend->setComments($commentArray);

				$this->activityObject->setContent($reccomend);
			}elseif($obj['updateType'] == "JOBP"){
				$person = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['job'])){
						if(isset($obj['updateContent']['job']['jobPoster'])){
							if(isset($obj['updateContent']['job']['jobPoster']['id'])){
								$person->setID($obj['updateContent']['job']['jobPoster']['id']);
							}

							if(isset($obj['updateContent']['job']['jobPoster']['firstname'])){
								$person->setFirstName($obj['updateContent']['job']['jobPoster']['firstname']);
							}

							if(isset($obj['updateContent']['job']['jobPoster']['lastName'])){
								$person->setLastName($obj['updateContent']['job']['jobPoster']['lastName']);
							}

							if(isset($obj['updateContent']['job']['jobPoster']['lastName'])){
								$person->setHeadline($obj['updateContent']['job']['jobPoster']['headline']);
							}

							if(isset($obj['updateContent']['job']['jobPoster']['lastName'])){
								$person->setPicture($obj['updateContent']['job']['jobPoster']['pictureUrl']);
							}

							if(isset($obj['updateContent']['job']['jobPoster']['siteStandardProfileRequest'])){
								if(isset($obj['updateContent']['job']['jobPoster']['siteStandardProfileRequest']['url'])){
									$person->setURL($obj['updateContent']['job']['jobPoster']['siteStandardProfileRequest']['url']);
								}
							}
						}
					}
				}

				$jobPosting = new LinkedInContentJOBP();

				$jobPosting->setNetworkObjectType($obj['updateType']);

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['job'])){
						if(isset($obj['updateContent']['job']['id'])){
							$jobPosting->setJobID($obj['updateContent']['job']['id']);
						}

						if(isset($obj['updateContent']['job']['siteJobRequest'])){
							$jobPosting->setJobURL($obj['updateContent']['job']['siteJobRequest']);
						}

						if(isset($obj['updatecontent']['job']['position'])){
							if(isset($obj['updatecontent']['job']['position']['title'])){
								$jobPosting->setJobPosition($obj['updateContent']['job']['position']['title']);
							}
						}

						if(isset($obj['updatecontent']['job']['company'])){
							if(isset($obj['updatecontent']['job']['company']['name'])){
								$jobPosting->setJobCompany($obj['updateContent']['job']['company']['name']);
							}
						}
					}
				}

				$jobPosting->setJobPoster($person);

				$this->activityObject->setContent($jobPosting);
			}elseif($obj['updateType'] == "CMPY"){							//we will test this block later
				$company = new LinkedInContentCMPY();

				if(isset($obj['updateType']['companyProfileUpdate'])){
					$dude = new LinkedInPerson();
					$dude->setID($obj['updateContent']['companyProfileUpdate']['editor']['id']);
					$dude->setFirstName($obj['updateContent']['companyProfileUpdate']['editor']['firstName']);
					$dude->setLastName($obj['updateContent']['companyProfileUpdate']['editor']['lastName']);
					$dude->setHeadline($obj['updateContent']['companyProfileUpdate']['editor']['headline']);
					$dude->setURL($obj['updateContent']['companyProfileUpdate']['editor']['siteStandardProfileRequest']['url']);

					$company->setNetworkObjectType($obj['updateType']);
					$company->setCompanyID($obj['updateContent']['company']['id']);
					$company->setCompanyName($obj['updateContent']['company']['name']);
					$company->setActionType('Company profile update');
					$company->setAction($obj['updateContent']['companyProfileUpdate']['action']['code']);
					$company->setPersonType('employer');
					$company->setPerson($dude);
					$company->setUpdatedField($obj['updateContent']['companyProfileUpdate']['profileField']['code']);
				}elseif(isset($obj['updateType']['companyJobUpdate'])){
					$job = LinkedInContentJOBP();

					$job->setJobID($obj['updateContent']['companyJobUpdate']['job']['id']);
					$job->setJobPosition($obj['updateContent']['companyJobUpdate']['job']['position']['title']);
					$job->setJobCompany($obj['updateContent']['companyJobUpdate']['job']['company']['name']);
					$job->setJobURL($obj['updateContent']['companyJobUpdate']['job']['siteJobRequest']['url']);
					$job->setJobLocation($obj['updateContent']['companyJobUpdate']['job']['location']);
					$job->setJobDescription($obj['updateContent']['companyJobUpdate']['job']['description']);

					$company->setNetworkObjectType($obj['updateType']);
					$company->setCompanyID($obj['updateContent']['company']['id']);
					$company->setCompanyName($obj['updateContent']['company']['name']);
					$company->setActionType('Company Job update');
					$company->setAction($obj['updateContent']['companyJobUpdate']['action']['code']);
					$company->setPersonType('employee');
					$company->setJob($job);
				}elseif(isset($obj['updateType']['companyStatusUpdate'])){
					$company->setNetworkObjectType($obj['updateType']);
					$company->setCompanyID($obj['updateContent']['company']['id']);
					$company->setCompanyName($obj['updateContent']['company']['name']);
					$company->setActionType('Company status update');
					$company->setAction($obj['updateContent']['companyStatusUpdate']['action']['code']);
					$company->setPersonType('employer');
					$company->setUpdatedField('SomeFieldorStatus');
				}elseif(isset($obj['updateType']['companyPersonUpdate'])){
					$dude = new LinkedInPerson();
					$dude->setID($obj['updateContent']['companyPersonUpdate']['person']['id']);
					$dude->setFirstName($obj['updateContent']['companyPersonUpdate']['person']['firstName']);
					$dude->setLastName($obj['updateContent']['companyPersonUpdate']['person']['lastName']);
					$dude->setHeadline($obj['updateContent']['companyPersonUpdate']['person']['headline']);
					$dude->setURL($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url']);

					$company->setNetworkObjectType($obj['updateType']);
					$company->setCompanyID($obj['updateContent']['company']['id']);
					$company->setCompanyName($obj['updateContent']['company']['name']);
					$company->setActionType('companyPersonUpdate');
					$company->setAction($obj['updateContent']['companyPersonUpdate']['action']['code']);
					$company->setPersonType('employee');
					$company->setPerson($dude);
					$company->setJob($obj['updateContent']['companyPersonUpdate']['newPosition']['title']);
				}

				$this->activityObject->setContent($company);
			}elseif($obj['updateType'] == "MSFC"){
				$companyFollow = new LinkedInContentMSFC();

				$dude = new LinkedInPerson();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['companyPersonUpdate'])){
						if(isset($obj['updateContent']['companyPersonUpdate']['action'])){
							if(isset($Obj['updateContent']['companyPersonUpdate']['action']['code'])){
								$companyFollow->setAction($obj['updateContent']['companyPersonUpdate']['action']['code']);
							}
						}

						if(isset($obj['updateContent']['companyPersonUpdate']['person'])){
							if(isset($obj['updateContent']['companyPersonUpdate']['person']['id'])){
								$dude->setID($obj['updateContent']['companyPersonUpdate']['person']['id']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['firstName'])){
								$dude->setFirstName($obj['updateContent']['companyPersonUpdate']['person']['firstName']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['lastName'])){
								$dude->setLastName($obj['updateContent']['companyPersonUpdate']['person']['lastName']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['headline'])){
								$dude->setHeadline($obj['updateContent']['companyPersonUpdate']['person']['headline']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['pictureUrl'])){
								$dude->setPicture($obj['updateContent']['companyPersonUpdate']['person']['pictureUrl']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest'])){
								if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url'])){
									$dude->setURL($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url']);
								}
							}
						}
					}

					if(isset($obj['updateContent']['company'])){
						if(isset($obj['updateContent']['company']['id'])){
							$companyFollow->setCompanyID($obj['updateContent']['company']['id']);
						}

						if(isset($obj['updateContent']['company']['name'])){
							$companyFollow->setCompanyName($obj['updateContent']['company']['name']);
						}
					}
				}

				$companyFollow->setNetworkObjectType($obj['updateType']);

				$companyFollow->setPersonType('person');
				$companyFollow->setPerson($dude);
				$companyFollow->setComments(array());
				$companyFollow->setLikes(array());
				$this->activityObject->setContent($companyFollow);
			}elseif($obj['updateType'] == "PROF" || $obj['updateType'] == "PICU" || $obj['updateType'] == "PRFX"){
				$profile = new LinkedInContentPICU();

				$positionArr = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['positions'])){
							if(isset($obj['updateContent']['person']['positions']['values'])){
								for($g=0; $g<count($obj['updateContent']['person']['positions']['values']); $g++){			//need to ask cory if there should be a ['values'] before the g increment inside the for
									$position = new LinkedInPosition();														//there was not one originally

									if(isset($obj['updateContent']['person']['positions']['values'][$g])){
										$objUPPVG = $obj['updateContent']['person']['positions']['values'][$g];

										if(isset($objUPPVG['id'])){
											$position->setID($obj['updateContent']['person']['positions']['values'][$g]['id']);
										}

										if(isset($objUPPVG['title'])){
											$position->setTitle($obj['updateContent']['person']['positions']['values'][$g]['title']);
										}

										if(isset($objUPPVG['company'])){
											if(isset($objUPPVG['company']['id'])){
												$position->setCompanyID($obj['updateContent']['person']['positions']['values'][$g]['company']['id']);
											}

											if(isset($objUPPVG['company']['name'])){
												$position->setCompanyName($obj['updateContent']['person']['positions']['values'][$g]['company']['name']);
											}
										}
									}

									array_push($positionArr, $position);
								}
							}
						}
					}
				}

				$educationArr = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['educations'])){
							if(isset($obj['updateContent']['person']['educations']['values'])){
								for($d=0; $d<count($obj['updateContent']['person']['educations']['values']); $d++){						//need to ask cory if there should be a ['values'] before the g increment inside the for
									$educations = new LinkedInEducations();																//there was not one originally

									if(isset($obj['updateContent']['person']['educations']['values'][$d])){
										$objUPEVD = $obj['updateContent']['person']['educations']['values'][$d];

										if(isset($objUPEVD['id'])){
											$educations->setID($obj['updateContent']['person']['educations']['values'][$d]['id']);
										}

										if(isset($objUPEVD['title'])){
											$educations->setTitle($obj['updateContent']['person']['educations']['values'][$d]['title']);
										}

										if(isset($objUPEVD['company'])){
											if(isset($objUPEVD['company']['id'])){
												$educations->setCompanyID($obj['updateContent']['person']['educations']['values'][$d]['company']['id']);
											}

											if(isset($objUPEVD['company']['name'])){
												$educations->setCompanyName($obj['updateContent']['person']['educations']['values'][$d]['company']['name']);
											}
										}
									}

									array_push($educationArr, $educations);
								}
							}
						}
					}
				}

				$updatedFieldArr = array();

				if(isset($obj['updatedFields'])){
					if(isset($obj['updatedFields']['values'])){
						for($e=0; $e<count($obj['updatedFields']['values']); $e++){
							$updatedField = new LinkedInUpdatedFields();

							if(isset($obj['updatedFields']['values'][$e])){
								if(isset($obj['updatedFields']['values'][$e]['name'])){
									$updatedField->setUpdatedField($obj['updatedFields']['values'][$e]['name']);
								}
							}

							array_push($updatedFieldArr, $updatedField);
						}
					}
				}

				$skillsArr = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['skills'])){
							if(isset($obj['updateContent']['person']['skills']['values'])){
								for($f=0; $f<count($obj['updateContent']['person']['skills']['values']); $f++){
									$skill = new LinkedInSkills();

									if(isset($obj['updateContent']['person']['skills']['values'][$f])){
										if(isset($obj['updateContent']['person']['skills']['values'][$f]['skill'])){
											if(isset($obj['updateContent']['person']['skills']['values'][$f]['skill']['name'])){
												$skill->setSkills($obj['updateContent']['person']['skills']['values'][$f]['skill']['name']);
											}
										}
									}

									array_push($skillsArr, $skill);
								}
							}	
						}
					}
				}

				$patentArr = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['patents'])){
							if(isset($obj['updateContent']['person']['patents']['values'])){
								for($f=0; $f<count($obj['updateContent']['person']['patents']['values']); $f++){
									$patent = new LinkedInPatents();

									if(isset($obj['updateContent']['person']['patents']['values'][$f])){
										if(isset($obj['updateContent']['person']['patents']['values'][$f]['id'])){
											$patent->setPatentID($obj['updateContent']['person']['patents']['values'][$f]['id']);
										}

										if(isset($obj['updateContent']['person']['patents']['values'][$f]['title'])){
											$patent->setPatentTitle($obj['updateContent']['person']['patents']['values'][$f]['title']);
										}
									}

									array_push($patentArr, $patent);
								}
							}
						}
					}
				}

				$publicationArr = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['publications'])){
							if(isset($obj['updateContent']['person']['publications']['values'])){
								for($f=0; $f<count($obj['updateContent']['person']['publications']['values']); $f++){
									$publication = new LinkedInPublications();

									if(isset($obj['updateContent']['person']['publications']['values'][$f])){
										if(isset($obj['updateContent']['person']['publications']['values'][$f]['id'])){
											$publication->setPubID($obj['updateContent']['person']['publications']['values'][$f]['id']);
										}

										if(isset($obj['updateContent']['person']['publications']['values'][$f]['title'])){
											$publication->setPubTitle($obj['updateContent']['person']['publications']['values'][$f]['title']);
										}
									}

									array_push($publicationArr, $publication);
								}
							}
						}
					}
				}

				$languageArr = array();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['languages'])){
							if(isset($obj['updateContent']['person']['languages']['values'])){
								for($f=0; $f<count($obj['updateContent']['person']['languages']['values']); $f++){
									$language = new LinkedInLanguages();

									if(isset($obj['updateContent']['person']['languages']['values'][$f])){
										if(isset($obj['updateContent']['person']['languages']['values'][$f]['language'])){
											if(isset($obj['updateContent']['person']['languages']['values'][$f]['language']['name'])){
												$language->setLanguages($obj['updateContent']['person']['languages']['values'][$f]['language']['name']);
											}
										}
									}

									array_push($languageArr, $language);
								}
							}
						}
					}
				}

				$likeArr = array();

				if(isset($obj['likes'])){
					if(isset($obj['likes']['values'])){
						for($k=0; $k<count($obj['likes']['values']); $k++){
							$like = new LinkedInLikes();

							if(isset($obj['likes']['values'][$k])){
								if(isset($obj['likes']['values'][$k]['person'])){
									$objLVKP = $obj['likes']['values'][$k]['person'];

									if(isset($objLVKP['id'])){
										$like->setUserID($obj['likes']['values'][$k]['person']['id']);
									}

									if(isset($objLVKP['firstName'])){
										$like->setFirstName($obj['likes']['values'][$k]['person']['firstName']);
									}

									if(isset($objLVKP['lastName'])){
										$like->setLastName($obj['likes']['values'][$k]['person']['lastName']);
									}

									if(isset($objLVKP['headline'])){
										$like->setHeadline($obj['likes']['values'][$k]['person']['headline']);
									}

									if(isset($objLVKP['pictureUrl'])){
										$like->setPictureURL($obj['likes']['values'][$k]['person']['pictureUrl']);
									}
								}
							}

							array_push($likeArr, $like);
						}
					}
				}

				$commentArray = array();

				if(isset($obj['updateComments'])){
					if(isset($obj['updateComments']['values'])){
						for($g=0; $g<count($obj['updateComments']['values']); $g++){
							$comment = new LinkedInComments();
							$text =  new textBlockWithURLS();

							if(isset($obj['updateComments']['values'][$g])){
								if(isset($obj['updateComments']['values'][$g]['comment'])){
									$text->setText($obj['updateComments']['values'][$g]['comment']);
									$text->setLinks($obj['updateComments']['values'][$g]['comment']);
								}

								if(isset($obj['updateComments']['values'][$g]['id'])){
									$comment->setCommentID($obj['updateComments']['values'][$g]['id']);
								}

								if(isset($obj['updateComments']['values'][$g]['person'])){
									if(isset($obj['updateComments']['values'][$g]['person']['id'])){
										$comment->setUserID($obj['updateComments']['values'][$g]['person']['id']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['firstName'])){
										$comment->setFirstName($obj['updateComments']['values'][$g]['person']['firstName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['lastName'])){
										$comment->setLastName($obj['updateComments']['values'][$g]['person']['lastName']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['headline'])){
										$comment->setHeadline($obj['updateComments']['values'][$g]['person']['headline']);
									}

									if(isset($obj['updateComments']['values'][$g]['person']['pictureUrl'])){
										$comment->setPictureURL($obj['updateComments']['values'][$g]['person']['pictureUrl']);
									}
								}
							}

							$comment->setText($text);

							array_push($commentArray, $comment);
						}
					}
				}

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['id'])){
							$profile->setID($obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$profile->setFirstName($obj['updateContent']['person']['firstName']);
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$profile->setLastName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$profile->setHeadline($obj['updateContent']['person']['headline']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$profile->setPicture($obj['updateContent']['person']['pictureUrl']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$profile->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}
				$profile->setNetworkObjectType($obj['updateType']);

				$profile->setPublications($publicationArr);
				$profile->setPatents($patentArr);
				$profile->setLanguages($languageArr);
				$profile->setAction('Updated Positions / Educations');
				$profile->setPositions($positionArr);
				$profile->setEducations($educationArr);
				$profile->setUpdatedFields($updatedFieldArr);
				$profile->setSkills($skillsArr);
				$profile->setComments($commentArray);
				$profile->setLikes($likeArr);

				$this->activityObject->setContent($profile);
			}
		}elseif(isset($obj['networkObjectType'])){
			if($obj['networkObjectType'] == "DISCUSS"){
				$content = new LinkedInContentDISCUSS();

				$likeArr = array();

				if(isset($obj['likes'])){
					for($k=0; $k<count($obj['likes']); $k++){
						$like = new LinkedInLikes();

						if(isset($obj['likes'][$k])){
							if(isset($obj['likes'][$k]['person'])){
								$objLKP = $obj['likes'][$k]['person'];

								if(isset($objLKP['id'])){
									$like->setUserID($obj['likes'][$k]['person']['id']);
								}

								if(isset($objLKP['firstName'])){
									$like->setFirstName($obj['likes'][$k]['person']['firstName']);
								}

								if(isset($objLKP['lastName'])){
									$like->setLastName($obj['likes'][$k]['person']['lastName']);
								}

								if(isset($objLKP['headline'])){
									$like->setHeadline($obj['likes'][$k]['person']['headline']);
								}

								if(isset($objLKP['headline'])){
									$like->setPictureURL($obj['likes'][$k]['person']['pictureUrl']);
								}
							}
						}

						array_push($likeArr, $like);
					}
				}

				$commentArray = array();

				if(isset($obj['comments'])){
					for($g=0; $g<count($obj['comments']); $g++){
						$comment = new LinkedInComments();
						$text =  new textBlockWithURLS();

						if(isset($obj['comments'][$g])){
							if(isset($obj['comments'][$g]['person'])){
								$objCGP = $obj['comments'][$g]['person'];

								if(isset($objCGP['id'])){
									$comment->setUserID($obj['comments'][$g]['person']['id']);
								}

								if(isset($objCGP['firstName'])){
									$comment->setFirstName($obj['comments'][$g]['person']['firstName']);
								}

								if(isset($objCGP['lastName'])){
									$comment->setLastName($obj['comments'][$g]['person']['lastName']);
								}

								if(isset($objCGP['headline'])){
									$comment->setHeadline($obj['comments'][$g]['person']['headline']);
								}

								if(isset($objCGP['pictureUrl'])){
									$comment->setPictureURL($obj['comments'][$g]['person']['pictureUrl']);
								}
							}

							if(isset($obj['comments'][$g]['text'])){
								$text->setText($obj['comments'][$g]['text']);
								$text->setLinks($obj['comments'][$g]['text']);
							}

							if(isset($obj['comments'][$g]['id'])){
								$comment->setCommentID($obj['comments'][$g]['id']);
							}
						}

						$comment->setText($text);

						array_push($commentArray, $comment);
					}
				}

				$attachmentArr = array();

				if(isset($obj['attachment'])){
					for($g=0; $g<count($obj['attachment']); $g++){
						$attachment = new LinkedInAttachments();

						if(isset($obj['attachment'][$g])){
							$objAG = $obj['attachment'][$g];

							if(isset($objAG['contentDomain'])){
								$attachment->setContentDomain($obj['attachment'][$g]['contentDomain']);
							}

							if(isset($objAG['contentUrl'])){
								$attachment->setContentUrl($obj['attachment'][$g]['contentUrl']);
							}

							if(isset($objAG['imageUrl'])){
								$attachment->setImageUrl($obj['attachment'][$g]['imageUrl']);
							}

							if(isset($objAG['summary'])){
								$attachment->setSummary($obj['attachment'][$g]['summary']);
							}

							if(isset($objAG['title'])){
								$attachment->setTitle($obj['attachment'][$g]['title']);
							}
						}

						array_push($attachmentArr, $attachment);
					}
				}

				$discussion = new LinkedInDiscussion();

				$title =  new textBlockWithURLS();

				if(isset($obj['title'])){
					$title->setText($obj['title']);
					$queryString = $queryString . " " . $obj['title'];
					$title->setLinks($obj['title']);
				}

				$discussion->setTitle($title);

				$summary =  new textBlockWithURLS();

				if(isset($obj['summary'])){
					$summary->setText($obj['summary']);
					$queryString = $queryString . " " . $obj['summary'];
					$summary->setLinks($obj['summary']);
				}

				$discussion->setSummary($summary);

				if(isset($obj['group'])){
					if(isset($obj['group']['name'])){
						$discussion->setGroupName($obj['group']['name']);
					}

					if(isset($obj['group']['id'])){
						$discussion->setGroupID($obj['group']['id']);
					}

					if(isset($obj['group']['status'])){
						$discussion->setGroupStatus($obj['group']['status']);
					}
				}

				$content->setNetworkObjectType($obj['networkObjectType']);

				if(isset($obj['id'])){
					$content->setID($obj['id']);
					$content->setCommentURL("http://api.linkedin.com/v1/posts/".$obj['id']."/comments");
					$content->setLikeURL("http://api.linkedin.com/v1/posts/".$obj['id']."/relation-to-viewer/is-liked");
				}

				$content->setDiscussion($discussion);
				$content->setAttachment($attachmentArr);
				$content->setComments($commentArray);
				$content->setLikes($likeArr);

				$content->setQueryString($queryString);
				$this->activityObject->setContent($content);
			}
		}
	}
	public function buildPublished($obj){
		if(isset($obj['timestamp'])){
			$this->activityObject->setPublished(intval(substr($obj['timestamp'], 0, 10)));
		}	
	}
	public function buildGenerator($obj){
		$this->activityObject->setGenerator('Linkedin');
	}
	public function buildTitle($obj){
		if(isset($obj['networkObjectType'])){
			if($obj['networkObjectType'] != null){
				$this->activityObject->setTitle($obj['networkObjectType']);
			}
		}elseif(isset($obj['updateType'])){
			$this->activityObject->setTitle($obj['updateType']);
		}
	}
	public function buildVerb($obj){
		$this->activityObject->setVerb("post");
	}
	public function buildId($obj){
		if(isset($obj['networkObjectType']) && $obj['networkObjectType'] == "DISCUSS"){
			if(isset($obj['id'])){
				$this->activityObject->setId("linkedin-----".$obj['id']);
			}	
		}else{
			if(isset($obj['updateKey'])){
				$this->activityObject->setId("linkedin-----".$obj['updateKey']);
			}else{
				$this->activityObject->setId("linkedin-----".uniqid());
			}
		}
	}
	public function buildService($obj){
		$this->activityObject->setService('Linkedin');
	}
	public function buildDateAdded($obj){
		$this->activityObject->setDateAdded(time());
	}
	public function buildStarred($obj){
		$this->activityObject->setStarred("false");
	}
	public function buildPostLink($obj){
		if(isset($obj['networkObjectType'])){
			if($obj['networkObjectType'] == "DISCUSS"){
				if(isset($obj['group'])){
					if(isset($obj['group']['id'])){
						$this->activityObject->setPostLink("http://www.linkedin.com/groups?gid=" . $obj['group']['id']);
					}
				}
			}
		}else{
			if(isset($obj['updateType'])){
				if($obj['updateType'] == "JOBP"){
					if(isset($obj['updateContent'])){
						if(isset($obj['updateContent']['job'])){
							if(isset($obj['updateContent']['job']['siteStandardProfileRequest'])){
								if(isset($obj['updateContent']['job']['siteStandardProfileRequest']['url'])){
									$this->activityObject->setPostLink($obj['updateContent']['job']['siteStandardProfileRequest']['url']);
								}
							}
						}
					}	
				}
				if($obj['updateType'] == "MSFC"){
					if(isset($obj['updateContent'])){
						if(isset($obj['updateContent']['companyPersonUpdate'])){
							if(isset($obj['updateContent']['companyPersonUpdate']['person'])){
								if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest'])){
									if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url'])){
										$this->activityObject->setPostLink($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url']);
									}
								}
							}
						}
					}	
				}
			}else{
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$this->activityObject->setPostLink($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}
					}
				}				
			}
		}	
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


?>