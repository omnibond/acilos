<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the base client object used for mining userData
** This is used in favor of the user objects
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

class clientObject{

	public $data = array(
		"credentials" => array(
			"Facebook" => array(),
			"Twitter" => array(),
			"Instagram" => array(),
			"Linkedin" => array(),
			"Google" => array()
		),
		'post' => array(
			'recentPost' => '',
			'recentPostTime' => 0,
			'totalPosts' => 0
		),
		'friendDegree' => 'first',
		'friendStatus' => 'true',
		'starred' => "false",
		'circles' => array(),
		'displayName' => '',
		'shh' => 0,
		'image' => "",
		'givenName' => '',
		'searchIndex' => '',
		'alphaIndex' => '',
		'homeTown' => '',
		'currentTown' => '',
		'owns' => array(),
		'ownedBy' => "none",
		'id' => '',
		'service' => '',
		'about' => array(
			'description' => "",
			'link' => ""
		)
	);
	
	public function getObj(){
		return $this->data;
	}
	
	public function setCredential($type, $credential){
		array_push($this->data['credentials'][$type], 
			array('id' => $credential['id'], 'givenName' => $credential['givenName'], 'displayName' => $credential['displayName']) 
		);
	}
	
	public function setRecentPost($post){
		$this->data['post']['recentPost'] = $post;
	}
	public function setRecentPostTime($time){
		$this->data['post']['recentPostTime'] = $time;
	}
	public function setTotalPosts($totalPosts){
		$this->data['post']['totalPosts'] = $totalPosts;
	}
	
	public function setStarred($starred){
		$this->data['starred'] = $starred;
	}
	
	public function setFriendDegree($degree){
		$this->data['friendDegree'] = $degree;
	}
	public function setFriendStatus($status){
		$this->data['friendStatus'] = $status;
	}
	
	public function setShh($shh){
		$this->data['shh'] = $shh;
	}
	
	public function setImage($img){
		$this->data['image'] = $img;
	}
	
	public function addCircle($circle){
		array_push($this->data['circles'], $circle);
	}
	public function removeCircle($circle){
		foreach($this->data['circles'] as $key => $value){
			if($value == $circle){
				array_splice($this->data['circles'], $key, 1);
			}
		}
	}
	public function setHomeTown($homeTown){
		$this->data['homeTown'] = $homeTown;
	}
	public function setCurrentTown($currentTown){
		$this->data['currentTown'] = $currentTown;
	}
	public function setOwns($owns){
		array_push($this->data['owns'], $owns);
	}
	public function setOwnedBy($ownedBy){
		$this->data['ownedBy'] = $ownedBy;
	}
	
	public function setID($id){
		$this->data['id'] = $id;
	}
	
	public function setService($service){
		$this->data['service'] = $service;
	}

	public function setGivenName($givenName){
		$this->data['givenName'] = $givenName;
	}

	public function setDisplayName($displayName){
		$this->data['displayName'] = $displayName;
		$searchIndex = explode(" ", $displayName);
		$this->data['searchIndex'] = $searchIndex[0];
		$searchIndex = explode(" ", $displayName);
		$this->data['alphaIndex'] = strtolower($searchIndex[0]);
	}
	
	public function setAbout($type, $data){
		if($type == "Facebook"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}elseif($type == "Instagram"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}elseif($type == "Twitter"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}elseif($type == "Linkedin"){
			$this->data['about']['description'] = $data['description'];
			$this->data['about']['link'] = $data['link'];
		}
	}
}

