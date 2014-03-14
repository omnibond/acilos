<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to app contacts
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

require_once('clientHelpers.php');

class Contacts{
	
	public function getContact(){
		$id = $_GET['id'];
		
		$clients = getClient($id);
		 
		print_r($clients);
	}
	
	public function getContacts(){
		$from = $_GET['from'];
		
                $clients = getClients($from);
		
                $dataArr = array();
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['displayName'] != ""){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }

                return json_encode($dataArr); 
        }
	
	public function getAlphaContacts(){
		$from = $_GET['from'];
		
                $clients = getAlphaClients($from);
		
                $dataArr = array();
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['displayName'] != ""){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }

                return json_encode($dataArr); 
        }
	
	public function getFriendContacts(){
		$from = $_GET['from'];
		
                $clients = getFirstClients($from);

                $dataArr = array();
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['displayName'] != "" && $clients['hits']['hits'][$x]['_source']['data']['friendDegree'] == "first"){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }

                return json_encode($dataArr); 
        }
	
	public function getSecondFriendContacts(){
		$from = $_GET['from'];
		
                $clients = getSecondClients($from);
		
                $dataArr = array();
		
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['displayName'] != "" && $clients['hits']['hits'][$x]['_source']['data']['friendDegree'] == "second"){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }

                return json_encode($dataArr); 
        }
	
	public function getChattyContacts(){
		$from = $_GET['from'];
		
                $clients = getChattyClients($from);
		
                $dataArr = array();
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['displayName'] != ""){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }

                return json_encode($dataArr); 
        }

        public function getTopContacts(){
                $numClients = $_GET['numClients'];
                
                $clients = getTopClients($numClients);

                $dataArr = array();

                for($i = 0; $i < count($clients['hits']['hits']); $i++){
                        array_push($dataArr, $clients['hits']['hits'][$i]['_id']);
                }
                
                /*$dataArr = array();
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['displayName'] != ""){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }*/

                //print_r($dataArr);

               return json_encode($dataArr); 
        }
	
        public function getRecentContacts(){
		$from = $_GET['from'];
                $clients = getRecentClients($from);
                $dataArr = array();
                for($x = 0; $x < count($clients['hits']['hits']); $x++){
                        if($clients['hits']['hits'][$x]['_source']['data']['post']['recentPostTime'] != "" && $clients['hits']['hits'][$x]['_source']['data']['friendDegree'] == "first" && $clients['hits']['hits'][$x]['_source']['data']['post']['totalPosts'] != 0){
                                $dataArr[$clients['hits']['hits'][$x]['_source']['data']['displayName']] = $clients['hits']['hits'][$x]['_source'];
                        }
                }
                return json_encode($dataArr);
        }

        function getSpecificClients(){
                $var = file_get_contents("php://input");
                $arr = json_decode($var, true);
                $idArr = $arr['ids'];
                
                $res = array();
                for($h = 0; $h < count($idArr); $h++){
                        $peep = getClient($idArr[$h]);
                        array_push($res, $peep);
                }
                
                return json_encode($res);   
        }
	
	function shushFriend(){
		$var = file_get_contents("php://input");
                $arr = json_decode($var, true);
                $time = $arr['time'];
                $client = $arr['client'];
		
		$time = time() + $time;
		
		$res = shh($client, $time);
		
		return json_encode($res);
	}
	
	function setFriendStatus(){
		$var = file_get_contents("php://input");
                $arr = json_decode($var, true);
                $status = $arr['status'];
                $friend = $arr['friend'];
		
		$res = setFriendStat($status, $friend);
		
		return json_encode($res);
	}

}

?>
