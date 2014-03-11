<?php

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
