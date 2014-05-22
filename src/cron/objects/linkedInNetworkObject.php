<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the linkedin object used for mining feedData
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

class LinkedInLikes{
	public $id = "N/A";
	public $firstName = "N/A";
	public $lastName = "N/A";
	public $headline = "N/A";
	public $pictureURL = "N/A";

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
	public $commentUserId = "N/A";
	public $firstName = "N/A";
	public $lastName = "N/A";
	public $headline = "N/A";
	public $pictureURL = "N/A";
	public $text = "N/A";
	public $commentId = "N/A";

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

class LinkedInPerson{
    public $id = "N/A";
    public $firstName = "N/A";
    public $lastName = "N/A";
    public $headline = "N/A";
    public $url = "N/A";
    public $picture = "N/A";
   
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

class LinkedInContentVIRL{
    public $networkObjectType = "N/A";
    public $action = array();
    public $originalContent = array();
    public $likes = array();
    public $comments = array();
    public $queryString = "N/A";
   
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

class LinkedInContentMSFC{
	public $networkObjectType = "N/A";
	public $companyID = "N/A";
	public $companyName = "N/A";
	public $personType = "N/A";
	public $person = array();
	public $comments = array();
	public $likes = array();
	public $queryString = "N/A";

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setCompanyID($companyID){
		$this->companyID = $companyID;
	}
	public function setCompanyName($companyName){
		$this->companyName = $companyName;
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

class LinkedInContentDISCUSS{
	public $discussion = '';
	public $attachment = '';
	public $comments = array();
	public $likes = array();
	public $networkObjectType = '';
	public $id = "N/A";
	public $commentURL = "N/A";
	public $likeURL = "N/A";
	public $queryString = "N/A";


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

class LinkedInDiscussion{
	public $title = "N/A";
	public $summary = "N/A";
	public $groupName = "N/A";
	public $groupId = "N/A";
	public $groupStatus = "N/A";

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

class LinkedInAttachments{
	public $contentDomain = "N/A";
	public $contentUrl = "N/A";
	public $imageUrl = "N/A";
	public $summary = "N/A";
	public $title = "N/A";

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

class LinkedInContentSHAR{
    public $networkObjectType = "N/A";
    public $status = array();
    public $contentURL = "N/A";
    public $contentTitle = "N/A";
    public $contentSource = "N/A";
    public $authorFirstName = "N/A";
    public $authorLastName = "N/A";
    public $authorID = "N/A";
    public $authorHeadline = "N/A";
    public $id = "N/A";
    public $postTime = "N/A";
    public $comments = array();
    public $likes = array();
    public $queryString = "N/A";
   
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

class LinkedInContentCMPY{
	public $networkObjectType = "N/A";
	public $companyID = "N/A";
	public $companyName = "N/A";
	public $personType = "N/A";
	public $description = array();
	public $title = array();
	public $person = array();
	public $job = array();
	public $updatedField = "N/A";
	public $likes = array();
	public $comments = array();
	public $queryString = "N/A";
	public $url = "N/A";
	public $imageUrl = "N/A";
	public $comment = array();

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setCompanyID($companyID){
		$this->companyID = $companyID;
	}
	public function setCompanyName($companyName){
		$this->companyName = $companyName;
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
	public function setDescription($description){
		$this->description = $description;
	}
	public function setTitle($title){
		$this->title = $title;
	}
	public function setUrl($url){
		$this->url = $url;
	}
	public function setImageUrl($imageUrl){
		$this->imageUrl = $imageUrl;
	}
	public function setComment($comment){
		$this->comment = $comment;
	}
}

class LinkedInContentJOBP{
	public $networkObjectType = "N/A";
	public $jobID = "N/A";
	public $jobPosition = "N/A";
	public $jobCompany = "N/A";
	public $jobURL = "N/A";
	public $jobPoster = "N/A";
	public $jobLocation = "N/A";
	public $jobDescription = "N/A";
	public $likes = array();
	public $comments = array();
	public $queryString = "N/A";

	public function setNetworkObjectType($networkObjectType){
		$this->networkObjectType = $networkObjectType;
	}
	public function setJobID($jobID){
		$this->jobID = $jobID;
	}
	public function setJobPosition($jobPosition){
		$this->jobPosition = $jobPosition;
	}
	public function setJobCompany($jobCompany){
		$this->jobCompany = $jobCompany;
	}
	public function setJobURL($jobURL){
		$this->jobURL = $jobURL;
	}
	public function setJobPoster($jobPoster){
		$this->jobPoster = $jobPoster;
	}
	public function setJobLocation($location){
		$this->jobLocation = $location;
	}
	public function setJobDescription($description){
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

class LinkedInContentCONN{
    public $networkObjectType = "N/A";
    public $person = "N/A";
    public $connection = array();
    public $actionString = "N/A";
    public $comments = array();
    public $likes = array();
    public $queryString = "N/A";
   
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

#CONCRETE BUILDER
class linkedInNetworkObjectBuilder extends activityObjectBuilder{
	public function normalizeDate($date){
		if(strtotime($date) == false || strtotime($date) == -1){
			return $date;
		}else{
			return strtotime($date);
		}
	}

	public function buildActor($obj){
		if(isset($obj['updateType'])){
			if($obj['updateType'] == "CMPY"){
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['company'])){
						$actor = new Actor();

						if(isset($obj['updateContent']['company']['name'])){
							$actor->setName($obj['updateContent']['company']['name']);
							$actor->setdisplayName($obj['updateContent']['company']['name']);
						}

						if(isset($obj['updateContent']['company']['id'])){
							$actor->setId((string)$obj['updateContent']['company']['id']);

							try{
								$companyObj = file_get_contents("companyObj.json");

								$companyObj = json_decode($companyObj, true);

								if(isset($companyObj[$obj['updateContent']['company']['id']])){
									if(isset($companyObj[$obj['updateContent']['company']['id']]['description']) && $companyObj[$obj['updateContent']['company']['id']]['description'] != "undefined" && $companyObj[$obj['updateContent']['company']['id']]['description'] != "N/A"){
										$actor->setDescription($companyObj[$obj['updateContent']['company']['id']]['description']);
									}

									if(isset($companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl']) && $companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl'] != "undefined" && $companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl'] != "" && $companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl'] != "N/A"){
										//We have what we need and will reset it on the object just in case

										$actor->setImage($companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl']);
									}elseif(isset($companyObj[$obj['updateContent']['company']['id']]['logoUrl']) && $companyObj[$obj['updateContent']['company']['id']]['logoUrl'] != "undefined" && $companyObj[$obj['updateContent']['company']['id']]['logoUrl'] != "" && $companyObj[$obj['updateContent']['company']['id']]['logoUrl'] != "N/A"){
										$actor->setImage($companyObj[$obj['updateContent']['company']['id']]['logoUrl']);
									}else{
										$filename = "../../serviceCreds.json";
										$file = file_get_contents($filename);

										$tokenObject = json_decode($file, true);
										
										if(count($tokenObject['linkedin']) > 0){
											if(isset($tokenObject['linkedin'][0]['accounts'])){
												if(isset($tokenObject['linkedin'][0]['accounts'][0]['accessToken'])){
													$accessToken = $tokenObject['linkedin'][0]['accounts'][0]['accessToken'];

													$url = "https://api.linkedin.com/v1/companies/" . $obj['updateContent']['company']['id'] . ":(id,name,website-url,logo-url,square-logo-url,description)?format=json&oauth2_access_token=".$accessToken;

													//print_r($url);

													$ch = curl_init($url);
													curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
													$response = curl_exec($ch);
													$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
													curl_close($ch);

													$response = json_decode($response, true);

													print_r($response);

													if(isset($response['squareLogoUrl'])){
														$actor->setImage($response['squareLogoUrl']);
														$companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl'] = $response['squareLogoUrl'];
													}elseif(isset($response['logoUrl'])){
														$actor->setImage($response['logoUrl']);
														$companyObj[$obj['updateContent']['company']['id']]['logoUrl'] = $response['logoUrl'];
													}

													if(isset($response['description'])){
														$actor->setDescription($response['description']);
														$companyObj[$obj['updateContent']['company']['id']]['description'] = $response['description'];
													}

													if(isset($response['name'])){
														$companyObj[$obj['updateContent']['company']['id']]['name'] = $response['name'];
													}

													if(isset($response['websiteUrl'])){
														$companyObj[$obj['updateContent']['company']['id']]['websiteUrl'] = $response['websiteUrl'];
													}

													file_put_contents("companyObj.json", json_encode($companyObj));
												}	
											}
										}
									}
								}else{
									$filename = "../../serviceCreds.json";
									$file = file_get_contents($filename);

									$tokenObject = json_decode($file, true);
									
									if(count($tokenObject['linkedin']) > 0){
										if(isset($tokenObject['linkedin'][0]['accounts'])){
											if(isset($tokenObject['linkedin'][0]['accounts'][0]['accessToken'])){
												$accessToken = $tokenObject['linkedin'][0]['accounts'][0]['accessToken'];

												$url = "https://api.linkedin.com/v1/companies/" . $obj['updateContent']['company']['id'] . ":(id,name,website-url,logo-url,square-logo-url,description)?format=json&oauth2_access_token=".$accessToken;

												//print_r($url);

												$ch = curl_init($url);
												curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
												$response = curl_exec($ch);
												$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
												curl_close($ch);

												$response = json_decode($response, true);

												print_r($response);

												if(isset($response['squareLogoUrl'])){
													$actor->setImage($response['squareLogoUrl']);
													$companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl'] = $response['squareLogoUrl'];
												}elseif(isset($response['logoUrl'])){
													$actor->setImage($response['logoUrl']);
													$companyObj[$obj['updateContent']['company']['id']]['logoUrl'] = $response['logoUrl'];
												}

												if(isset($response['description'])){
													$actor->setDescription($response['description']);
													$companyObj[$obj['updateContent']['company']['id']]['description'] = $response['description'];
												}

												if(isset($response['name'])){
													$companyObj[$obj['updateContent']['company']['id']]['name'] = $response['name'];
												}

												if(isset($response['websiteUrl'])){
													$companyObj[$obj['updateContent']['company']['id']]['websiteUrl'] = $response['websiteUrl'];
												}

												file_put_contents("companyObj.json", json_encode($companyObj));
											}	
										}
									}
								}
							}catch (Exception $e){
								if(isset($e)){
									print_R($e);
								}

								$companyObj = array();

								$filename = "../../serviceCreds.json";
								$file = file_get_contents($filename);

								$tokenObject = json_decode($file, true);
								
								if(count($tokenObject['linkedin']) > 0){
									if(isset($tokenObject['linkedin'][0]['accounts'])){
										if(isset($tokenObject['linkedin'][0]['accounts'][0]['accessToken'])){
											$accessToken = $tokenObject['linkedin'][0]['accounts'][0]['accessToken'];

											$url = "https://api.linkedin.com/v1/companies/" . $obj['updateContent']['company']['id'] . ":(id,name,website-url,logo-url,square-logo-url,description)?format=json&oauth2_access_token=".$accessToken;

											//print_r($url);

											$ch = curl_init($url);
											curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
											$response = curl_exec($ch);
											$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
											curl_close($ch);

											$response = json_decode($response, true);

											print_r($response);

											if(isset($response['squareLogoUrl'])){
												$actor->setImage($response['squareLogoUrl']);
												$companyObj[$obj['updateContent']['company']['id']]['squareLogoUrl'] = $response['squareLogoUrl'];
											}elseif(isset($response['logoUrl'])){
												$actor->setImage($response['logoUrl']);
												$companyObj[$obj['updateContent']['company']['id']]['logoUrl'] = $response['logoUrl'];
											}

											if(isset($response['description'])){
												$actor->setDescription($response['description']);
												$companyObj[$obj['updateContent']['company']['id']]['description'] = $response['description'];
											}

											if(isset($response['name'])){
												$companyObj[$obj['updateContent']['company']['id']]['name'] = $response['name'];
											}

											if(isset($response['websiteUrl'])){
												$companyObj[$obj['updateContent']['company']['id']]['websiteUrl'] = $response['websiteUrl'];
											}

											file_put_contents("companyObj.json", json_encode($companyObj));
										}	
									}
								}
							}

							$actor->setURL("http://linkedin.com/company/" . $obj['updateContent']['company']['id']);
						}
					}
				}

				$this->activityObject->setActor($actor);
			}elseif($obj['updateType'] == "CONN"){
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						$actor = new Actor();

						if(isset($obj['updateContent']['person']['firstName']) && isset($obj['updateContent']['person']['lastName'])){
							$actor->setName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
							$actor->setdisplayName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
						}elseif(isset($obj['updateContent']['person']['firstName'])){
							$actor->setName($obj['updateContent']['person']['firstName']);
							$actor->setdisplayName($obj['updateContent']['person']['firstName']);
						}elseif(isset($obj['updateContent']['person']['lastName'])){
							$actor->setName($obj['updateContent']['person']['lastName']);
							$actor->setdisplayName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['id'])){
							$actor->setId((string)$obj['updateContent']['person']['id']);
							$actor->setSearchable((string)$obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$actor->setImage($obj['updateContent']['person']['pictureUrl']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$actor->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$actor->setDescription($obj['updateContent']['person']['headline']);
						}
					}

					if(isset($actor)){
						$this->activityObject->setActor($actor);
					}
				}
			}elseif($obj['updateType'] == "SHAR"){
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						$actor = new Actor();

						if(isset($obj['updateContent']['person']['firstName']) && isset($obj['updateContent']['person']['lastName'])){
							$actor->setName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
							$actor->setdisplayName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
						}elseif(isset($obj['updateContent']['person']['firstName'])){
							$actor->setName($obj['updateContent']['person']['firstName']);
							$actor->setdisplayName($obj['updateContent']['person']['firstName']);
						}elseif(isset($obj['updateContent']['person']['lastName'])){
							$actor->setName($obj['updateContent']['person']['lastName']);
							$actor->setdisplayName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['id'])){
							$actor->setId((string)$obj['updateContent']['person']['id']);
							$actor->setSearchable((string)$obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$actor->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$actor->setDescription($obj['updateContent']['person']['headline']);
						}
					}
				}
			}elseif($obj['updateType'] == "VIRL"){
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						$actor = new Actor();

						if(isset($obj['updateContent']['person']['firstName']) && isset($obj['updateContent']['person']['lastName'])){
							$actor->setName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
							$actor->setdisplayName($obj['updateContent']['person']['firstName']." ".$obj['updateContent']['person']['lastName']);
						}elseif(isset($obj['updateContent']['person']['firstName'])){
							$actor->setName($obj['updateContent']['person']['firstName']);
							$actor->setdisplayName($obj['updateContent']['person']['firstName']);
						}elseif(isset($obj['updateContent']['person']['lastName'])){
							$actor->setName($obj['updateContent']['person']['lastName']);
							$actor->setdisplayName($obj['updateContent']['person']['lastName']);
						}

						if(isset($obj['updateContent']['person']['id'])){
							$actor->setId((string)$obj['updateContent']['person']['id']);
							$actor->setSearchable((string)$obj['updateContent']['person']['id']);
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$actor->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$actor->setDescription($obj['updateContent']['person']['headline']);
						}
					}
				}
			}elseif($obj['updateType'] == "MSFC"){
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['companyPersonUpdate'])){
						if(isset($obj['updateContent']['companyPersonUpdate']['person'])){
							$actor = new Actor();

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['firstName']) && isset($obj['updateContent']['companyPersonUpdate']['person']['lastName'])){
								$actor->setdisplayName($obj['updateContent']['companyPersonUpdate']['person']['firstName'] . " " . $obj['updateContent']['companyPersonUpdate']['person']['lastName']);
								$actor->setName($obj['updateContent']['companyPersonUpdate']['person']['firstName'] . " " . $obj['updateContent']['companyPersonUpdate']['person']['lastName']);
							}elseif(isset($obj['updateContent']['companyPersonUpdate']['person']['firstName'])){
								$actor->setdisplayName($obj['updateContent']['companyPersonUpdate']['person']['firstName']);
								$actor->setName($obj['updateContent']['companyPersonUpdate']['person']['firstName']);
							}elseif(isset($obj['updateContent']['companyPersonUpdate']['person']['lastName'])){
								$actor->setdisplayName($obj['updateContent']['companyPersonUpdate']['person']['lastName']);
								$actor->setName($obj['updateContent']['companyPersonUpdate']['person']['lastName']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['id'])){
								$actor->setId((string)$obj['updateContent']['companyPersonUpdate']['person']['id']);
								$actor->setSearchable((string)$obj['updateContent']['companyPersonUpdate']['person']['id']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['pictureUrl'])){
								$actor->setImage($obj['updateContent']['companyPersonUpdate']['person']['pictureUrl']);
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest'])){
								if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url'])){
									$actor->setURL($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url']);
								}
							}

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['headline'])){
								$actor->setDescription($obj['updateContent']['companyPersonUpdate']['person']['headline']);
							}
						}
					}
				}

				$this->activityObject->setActor($actor);
			}
		}elseif(isset($obj['networkObjectType'])){
			if($obj['networkObjectType'] == "DISCUSS"){
				if(isset($obj['creator'])){
					$actor = new Actor();

					if(isset($obj['creator']['id'])){
						$actor->setId((string)$obj['creator']['id']);
						$actor->setSearchable((string)$obj['creator']['id']);
					}

					if(isset($obj['creator']['pictureUrl'])){
						$actor->setImage($obj['creator']['pictureUrl']);
					}

					if(isset($obj['creator']['headline'])){
						$actor->setDescription($obj['creator']['headline']);
					}

					if(isset($obj['creator']['firstName']) && isset($obj['creator']['lastName'])){
						$actor->setName($obj['creator']['firstName'] . " " . $obj['creator']['lastName']);
						$actor->setdisplayName($obj['creator']['firstName'] . " " . $obj['creator']['lastName']);
					}elseif(isset($obj['creator']['firstName'])){
						$actor->setName($obj['creator']['firstName']);
						$actor->setdisplayName($obj['creator']['firstName']);
					}elseif(isset($obj['creator']['lastName'])){
						$actor->setName($obj['creator']['lastName']);
						$actor->setdisplayName($obj['creator']['lastName']);
					}
				}

				if(isset($actor)){
					$this->activityObject->setActor($actor);
				}
			}
		}
	}

	public function buildContent($obj){	
		$queryString = '';
		if(isset($obj['updateType'])){
			if($obj['updateType'] == "CMPY"){
				$company = new LinkedInContentCMPY();
				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['companyProfileUpdate'])){
						if(isset($obj['updateContent']['companyProfileUpdate']['editor'])){
							if(isset($obj['updateContent']['companyProfileUpdate']['editor']['id'])){
								$dude->setID((string)$obj['updateContent']['companyProfileUpdate']['editor']['id']);
							}

							if(isset($obj['updateContent']['companyProfileUpdate']['editor']['firstName'])){
								$dude->setFirstName($obj['updateContent']['companyProfileUpdate']['editor']['firstName']);
							}

							if(isset($obj['updateContent']['companyProfileUpdate']['editor']['lastName'])){
								$dude->setLastName($obj['updateContent']['companyProfileUpdate']['editor']['lastName']);
							}

							if(isset($obj['updateContent']['companyProfileUpdate']['editor']['headline'])){
								$dude->setHeadline($obj['updateContent']['companyProfileUpdate']['editor']['headline']);
							}

							if(isset($obj['updateContent']['companyProfileUpdate']['editor']['siteStandardProfileRequest'])){
								if(isset($obj['updateContent']['companyProfileUpdate']['editor']['siteStandardProfileRequest']['url'])){
									$dude->setURL($obj['updateContent']['companyProfileUpdate']['editor']['siteStandardProfileRequest']['url']);
								}
							}
						}

						$company->setNetworkObjectType($obj['updateType']);

						if(isset($obj['updateContent']['company'])){
							if(isset($obj['updateContent']['company']['id'])){
								$company->setCompanyID((string)$obj['updateContent']['company']['id']);
							}

							if(isset($obj['updateContent']['company']['name'])){
								$company->setCompanyName($obj['updateContent']['company']['name']);
							}
						}

						$company->setPersonType('employer');

						if(isset($dude)){
							$company->setPerson($dude);
						}
					}

					if(isset($obj['updateContent']['companyJobUpdate'])){
						if(isset($obj['updateContent']['companyJobUpdate']['job'])){
							$job = new LinkedInContentJOBP();

							if(isset($obj['updateContent']['companyJobUpdate']['job']['id'])){
								$job->setJobID((string)$obj['updateContent']['companyJobUpdate']['job']['id']);
							}

							if(isset($obj['updateContent']['companyJobUpdate']['job']['position'])){
								if(isset($obj['updateContent']['companyJobUpdate']['job']['position']['title'])){
									$job->setJobPosition($obj['updateContent']['companyJobUpdate']['job']['position']['title']);
								}
							}

							if(isset($obj['updateContent']['companyJobUpdate']['job']['company'])){
								if(isset($obj['updateContent']['companyJobUpdate']['job']['company']['name'])){
									$job->setJobCompany($obj['updateContent']['companyJobUpdate']['job']['company']['name']);
								}
							}

							if(isset($obj['updateContent']['companyJobUpdate']['job']['siteJobRequest'])){
								if(isset($obj['updateContent']['companyJobUpdate']['job']['siteJobRequest']['url'])){
									$job->setJobURL($obj['updateContent']['companyJobUpdate']['job']['siteJobRequest']['url']);
								}
							}

							if(isset($obj['updateContent']['companyJobUpdate']['job']['locationDescription'])){
								$job->setJobLocation($obj['updateContent']['companyJobUpdate']['job']['locationDescription']);
							}

							if(isset($obj['updateContent']['companyJobUpdate']['job']['description'])){
								$text = new textBlockWithURLS();
								$text->setText($obj['updateContent']['companyJobUpdate']['job']['description']);
								$text->setLinks($obj['updateContent']['companyJobUpdate']['job']['description']);
								$queryString .= $obj['updateContent']['companyJobUpdate']['job']['description'];
								$job->setJobDescription($text);
							}
						}

						$company->setNetworkObjectType($obj['updateType']);	

						if(isset($obj['updateContent']['company'])){
							if(isset($obj['updateContent']['company']['id'])){
								$company->setCompanyID((string)$obj['updateContent']['company']['id']);
							}
							if(isset($obj['updateContent']['company']['name'])){
								$company->setCompanyName($obj['updateContent']['company']['name']);
							}
						}

						$company->setPersonType('employee');
						$company->setJob($job);
					}

					if(isset($obj['updateContent']['companyStatusUpdate'])){
						$company->setNetworkObjectType($obj['updateType']);

						if(isset($obj['updateContent']['company'])){
							if(isset($obj['updateContent']['company']['id'])){
								$company->setCompanyID((string)$obj['updateContent']['company']['id']);
							}

							if(isset($obj['updateContent']['company']['name'])){
								$company->setCompanyName($obj['updateContent']['company']['name']);
							}

							if(isset($obj['updateContent']['companyStatusUpdate']['share'])){
								if(isset($obj['updateContent']['companyStatusUpdate']['share']['comment'])){
									$text = new textBlockWithURLS();
									$text->setText($obj['updateContent']['companyStatusUpdate']['share']['comment']);
									$text->setLinks($obj['updateContent']['companyStatusUpdate']['share']['comment']);
									$company->setComment($text);
									$queryString .= $obj['updateContent']['companyStatusUpdate']['share']['comment'];
								}								

								if(isset($obj['updateContent']['companyStatusUpdate']['share']['content'])){
									if(isset($obj['updateContent']['companyStatusUpdate']['share']['content']['description'])){
										$text = new textBlockWithURLS();
										$text->setText($obj['updateContent']['companyStatusUpdate']['share']['content']['description']);
										$text->setLinks($obj['updateContent']['companyStatusUpdate']['share']['content']['description']);
										$company->setDescription($text);
										$queryString .= $obj['updateContent']['companyStatusUpdate']['share']['content']['description'];
									}

									if(isset($obj['updateContent']['companyStatusUpdate']['share']['content']['title'])){
										$text = new textBlockWithURLS();
										$text->setText($obj['updateContent']['companyStatusUpdate']['share']['content']['title']);
										$text->setLinks($obj['updateContent']['companyStatusUpdate']['share']['content']['title']);
										$company->setTitle($text);
										$queryString .= $obj['updateContent']['companyStatusUpdate']['share']['content']['title'];
									}

									if(isset($obj['updateContent']['companyStatusUpdate']['share']['content']['submittedImageUrl'])){
										$company->setImageUrl($obj['updateContent']['companyStatusUpdate']['share']['content']['submittedImageUrl']);
									}

									if(isset($obj['updateContent']['companyStatusUpdate']['share']['content']['eyebrowUrl'])){
										$company->setUrl($obj['updateContent']['companyStatusUpdate']['share']['content']['eyebrowUrl']);
									}elseif(isset($obj['updateContent']['companyStatusUpdate']['share']['content']['shortenedUrl'])){
										$company->setUrl($obj['updateContent']['companyStatusUpdate']['share']['content']['shortenedUrl']);
									}
								}
							}

							$company->setPersonType('employer');
							$company->setUpdatedField('N/A');
						}
					}

					if(isset($obj['updateContent']['companyPersonUpdate'])){
						if(isset($obj['updateContent']['companyPersonUpdate']['person'])){
							$dude = new LinkedInPerson();

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['id'])){
								$dude->setID((string)$obj['updateContent']['companyPersonUpdate']['person']['id']);
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

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest'])){
								if(isset($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url'])){
									$dude->setURL($obj['updateContent']['companyPersonUpdate']['person']['siteStandardProfileRequest']['url']);
								}
							}
						}

						$company->setNetworkObjectType($obj['updateType']);

						if(isset($obj['updateContent']['company'])){
							if(isset($obj['updateContent']['company']['id'])){
								$company->setCompanyID((string)$obj['updateContent']['company']['id']);
							}

							if(isset($obj['updateContent']['company']['name'])){
								$company->setCompanyName($obj['updateContent']['company']['name']);
							}
						}

						$company->setPersonType('employee');

						if(isset($dude)){
							$company->setPerson($dude);
						}

						if(isset($obj['updateContent']['companyPersonUpdate']['newPosition'])){
							if(isset($obj['updateContent']['companyPersonUpdate']['newPosition']['title'])){
								$company->setJob($obj['updateContent']['companyPersonUpdate']['newPosition']['title']);
							}
						}
					}
				}

				$company->setQueryString($queryString);
				if(isset($company)){
					$this->activityObject->setContent($company);
				}
			}elseif($obj['updateType'] == "CONN"){
				$content = new LinkedInContentCONN();

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						$person = new LinkedInPerson();

						if(isset($obj['updateContent']['person']['id'])){
							$person->setID((string)$obj['updateContent']['person']['id']); 
						}

						if(isset($obj['updateContent']['person']['firstName'])){
							$person->setID($obj['updateContent']['person']['firstName']); 
						}

						if(isset($obj['updateContent']['person']['lastName'])){
							$person->setID($obj['updateContent']['person']['lastName']); 
						}

						if(isset($obj['updateContent']['person']['headline'])){
							$person->setID($obj['updateContent']['person']['headline']); 
						}

						if(isset($obj['updateContent']['person']['pictureUrl'])){
							$person->setID($obj['updateContent']['person']['pictureUrl']); 
						}

						if(isset($obj['updateContent']['person']['siteStandardProfileRequest'])){
							if(isset($obj['updateContent']['person']['siteStandardProfileRequest']['url'])){
								$person->setURL($obj['updateContent']['person']['siteStandardProfileRequest']['url']);
							}
						}

						if(isset($obj['updateContent']['person']['connections'])){
							$connArray = array();

							if(isset($obj['updateContent']['person']['connections']['values'])){
								for($k=0; $k<count($obj['updateContent']['person']['connections']['values']); $k++){
									if(isset($obj['updateContent']['person']['connections']['values'][$k])){	
										$connection = new LinkedInPerson();

										if(isset($obj['updateContent']['person']['connections']['values'][$k]['id'])){
											$connection->setID((string)$obj['updateContent']['person']['connections']['values'][$k]['id']);
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

				$queryString .= " is now connected to ";

				$content->setQueryString($queryString);

				if(isset($person)){
					$content->setPerson($person);
				}
			
				if(isset($conArray)){
					$content->setConnection($connArray);	
				}
				
				$content->setComments(array());
				$content->setLikes(array());

				if(isset($content)){
					$this->activityObject->setContent($content);
				}
			}elseif($obj['updateType'] == "SHAR"){
				$content = new LinkedInContentSHAR();

				$content->setNetworkObjectType($obj['updateType']);

				if(isset($obj['updateContent'])){
					if(isset($obj['updateContent']['person'])){
						if(isset($obj['updateContent']['person']['currentShare'])){
							if(isset($obj['updateContent']['person']['currentShare']['comment'])){
								$text =  new textBlockWithURLS();
								$text->setText($obj['updateContent']['person']['currentShare']['comment']);
								$text->setLinks($obj['updateContent']['person']['currentShare']['comment']);
							}

							if(isset($obj['updateContent']['person']['currentShare']['timestamp'])){
								$content->setPostTime($obj['updateContent']['person']['currentShare']['timestamp']);
							}

							if(isset($obj['updateContent']['person']['currentShare']['id'])){
								$content->setID((string)$obj['updateContent']['person']['currentShare']['id']);
							}

							if(isset($obj['updateContent']['person']['currentShare']['source'])){
								if(isset($obj['updateContent']['person']['currentShare']['source']['serviceProvider'])){
									if(isset($obj['updateContent']['person']['currentShare']['source']['serviceProvider']['name'])){
										$content->setContentSource($obj['updateContent']['person']['currentShare']['source']['serviceProvider']['name']);
									}
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
									$content->setAuthorID((string)$obj['updateContent']['person']['currentShare']['author']['id']);
								}

								if(isset($obj['updateContent']['person']['currentShare']['author']['headline'])){
									$content->setAuthorHeadline($obj['updateContent']['person']['currentShare']['author']['headline']);
								}
							}
						}
					}
				}

				if(isset($text)){
					$content->setStatus($text);	
				}
				
				if(isset($content)){
					$this->activityObject->setContent($content);
				}
			}elseif($obj['updateType'] == "VIRL"){
				if(isset($obj['likes'])){
					if(isset($obj['likes']['values'])){
						$likeArr = array();

						for($k=0; $k<count($obj['likes']['values']); $k++){
							$like = new LinkedInLikes();

							if(isset($obj['likes']['values'][$k])){
								if(isset($obj['likes']['values'][$k]['person'])){
									if(isset($obj['likes']['values'][$k]['person']['id'])){
										$like->setUserID((string)$obj['likes']['values'][$k]['person']['id']);
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

				if(isset($obj['updateComments'])){
					$commentArray = array();

					if(isset($obj['updateComments']['values'])){
						for($g=0; $g<count($obj['updateComments']['values']); $g++){
							$comment = new LinkedInComments();

							if(isset($obj['updateComments']['values'][$g])){
								if(isset($obj['updateComments']['values'][$g]['person'])){
									if(isset($obj['updateComments']['values'][$g]['person']['id'])){
										$comment->setUserID((string)$obj['updateComments']['values'][$g]['person']['id']);
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
									$comment->setCommentID((string)$obj['updateComments']['values'][$g]['id']);
								}

								if(isset($text)){
									$comment->setText($text);
								}

								if(isset($comment) && isset($commentArray)){
									array_push($commentArray, $comment);
								}
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

						if(isset($obj['updateAction']['originalUpdate']['updateContent'])){
							if(isset($obj['updateAction']['originalUpdate']['updateContent']['person'])){
								if(isset($obj['updateAction']['originalUpdate']['updateContent']['person']['currentShare'])){
									if(isset($obj['updateAction']['originalUpdate']['updateContent']['person']['currentShare']['comment'])){
										$queryString .= $obj['updateAction']['originalUpdate']['updataeContent']['person']['currentShare']['comment'];
									}
								}
							}
						}
					}
				}

				if(isset($likeArray)){
					$content->setLikes($likeArray);
				}

				if(isset($commentArray)){
					$content->setComments($commentArray);
				}

				if(isset($content)){
					$this->activityObject->setContent($content);
				}
			}elseif($obj['updateType'] == "MSFC"){
				if(isset($obj['updateContent'])){
					$companyFollow = new LinkedInContentMSFC();

					if(isset($obj['updateContent']['companyPersonUpdate'])){
						if(isset($obj['updateContent']['companyPersonUpdate']['person'])){
							$dude = new LinkedInPerson();

							if(isset($obj['updateContent']['companyPersonUpdate']['person']['id'])){
								$dude->setID((string)$obj['updateContent']['companyPersonUpdate']['person']['id']);
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
							$companyFollow->setCompanyID((string)$obj['updateContent']['company']['id']);
						}

						if(isset($obj['updateContent']['company']['name'])){
							$companyFollow->setCompanyName($obj['updateContent']['company']['name']);
						}
					}

					$companyFollow->setNetworkObjectType($obj['updateType']);

					$companyFollow->setPersonType('person');

					if(isset($dude)){
						$companyFollow->setPerson($dude);
					}
					
					$companyFollow->setComments(array());
					$companyFollow->setLikes(array());
					
					if(isset($companyFollow)){
						$this->activityObject->setContent($companyFollow);
					}
				}
			}
		}elseif(isset($obj['networkObjectType'])){
			if($obj['networkObjectType'] == "DISCUSS"){
				$content = new LinkedInContentDISCUSS();

				if(isset($obj['likes'])){
					$likeArr = array();

					for($k=0; $k<count($obj['likes']); $k++){
						$like = new LinkedInLikes();

						if(isset($obj['likes'][$k])){
							if(isset($obj['likes'][$k]['person'])){
								if(isset($obj['likes'][$k]['person']['id'])){
									$like->setUserID((string)$obj['likes'][$k]['person']['id']);
								}

								if(isset($obj['likes'][$k]['person']['firstName'])){
									$like->setFirstName($obj['likes'][$k]['person']['firstName']);
								}

								if(isset($obj['likes'][$k]['person']['lastName'])){
									$like->setLastName($obj['likes'][$k]['person']['lastName']);
								}

								if(isset($obj['likes'][$k]['person']['headline'])){
									$like->setHeadline($obj['likes'][$k]['person']['headline']);
								}

								if(isset($obj['likes'][$k]['person']['headline'])){
									$like->setPictureURL($obj['likes'][$k]['person']['pictureUrl']);
								}
							}
						}

						if(isset($likeArr) && isset($like)){
							array_push($likeArr, $like);
						}
					}
				}

				if(isset($obj['comments'])){
					$commentArray = array();

					for($g=0; $g<count($obj['comments']); $g++){
						$comment = new LinkedInComments();
						$text =  new textBlockWithURLS();

						if(isset($obj['comments'][$g])){
							if(isset($obj['comments'][$g]['person'])){
								if(isset($obj['comments'][$g]['person']['id'])){
									$comment->setUserID((string)$obj['comments'][$g]['person']['id']);
								}

								if(isset($obj['comments'][$g]['person']['firstName'])){
									$comment->setFirstName($obj['comments'][$g]['person']['firstName']);
								}

								if(isset($obj['comments'][$g]['person']['lastName'])){
									$comment->setLastName($obj['comments'][$g]['person']['lastName']);
								}

								if(isset($obj['comments'][$g]['person']['headline'])){
									$comment->setHeadline($obj['comments'][$g]['person']['headline']);
								}

								if(isset($obj['comments'][$g]['person']['pictureUrl'])){
									$comment->setPictureURL($obj['comments'][$g]['person']['pictureUrl']);
								}
							}

							if(isset($obj['comments'][$g]['text'])){
								$text->setText($obj['comments'][$g]['text']);
								$text->setLinks($obj['comments'][$g]['text']);
							}

							if(isset($obj['comments'][$g]['id'])){
								$comment->setCommentID((string)$obj['comments'][$g]['id']);
							}
						}

						$comment->setText($text);

						array_push($commentArray, $comment);
					}
				}

				if(isset($obj['attachment'])){
					$attachmentArr = array();

					for($g=0; $g<count($obj['attachment']); $g++){
						$attachment = new LinkedInAttachments();

						if(isset($obj['attachment'][$g])){
							if(isset($obj['attachment'][$g]['contentDomain'])){
								$attachment->setContentDomain($obj['attachment'][$g]['contentDomain']);
							}

							if(isset($obj['attachment'][$g]['contentUrl'])){
								$attachment->setContentUrl($obj['attachment'][$g]['contentUrl']);
							}

							if(isset($obj['attachment'][$g]['imageUrl'])){
								$attachment->setImageUrl($obj['attachment'][$g]['imageUrl']);
							}

							if(isset($obj['attachment'][$g]['summary'])){
								$attachment->setSummary($obj['attachment'][$g]['summary']);
							}

							if(isset($obj['attachment'][$g]['title'])){
								$attachment->setTitle($obj['attachment'][$g]['title']);
							}
						}

						if(isset($attachmentArr) && isset($attachment)){
							array_push($attachmentArr, $attachment);
						}
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
						$discussion->setGroupID((string)$obj['group']['id']);
					}

					if(isset($obj['group']['status'])){
						$discussion->setGroupStatus($obj['group']['status']);
					}
				}

				$content->setNetworkObjectType($obj['networkObjectType']);

				if(isset($obj['id'])){
					$content->setID((string)$obj['id']);
					$content->setCommentURL("http://api.linkedin.com/v1/posts/".$obj['id']."/comments");
					$content->setLikeURL("http://api.linkedin.com/v1/posts/".$obj['id']."/relation-to-viewer/is-liked");
				}

				if(isset($discussion)){
					$content->setDiscussion($discussion);	
				}
				
				if(isset($attachmentArr)){
					$content->setAttachment($attachmentArr);	
				}
				
				if(isset($commentArray)){
					$content->setComments($commentArray);	
				}
				
				if(isset($likeArr)){
					$content->setLikes($likeArr);
				}
				
				if(isset($queryString)){
					$content->setQueryString($queryString);	
				}
				
				if(isset($content)){
					$this->activityObject->setContent($content);
				}
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
	public function buildStarred($obj){
		$this->activityObject->setStarred("false");
	}
	public function buildPostLink($obj, $account){
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