<?php

require_once('matchHelpers.php');
require_once('clientHelpers.php');

use \ElasticSearch\Client;

class Charts{
	
	public function getAllBarGraphClients(){
	        $var = matchAllClients(0);
	        $data = $var['hits']['hits'];
	
	        $returnData = array();
	
	        for($x=0; $x<count($data); $x++){
			$returnData[$data[$x]['_source']['data']['displayName']] = array(
				'Service' => $data[$x]['_source']['data']['service'],
				'PostNum' => $data[$x]['_source']['data']['post']['totalPosts']
			);
	        }
	
	        return json_encode($returnData);
	    }
	
	public function getBarGraphClients(){
		$var = file_get_contents("php://input");
		$arr = json_decode($var, true);
		$users = $arr['users'];
	
		$var = matchBarGraphClients($users);
		$data = $var['hits']['hits'];

		$returnData = array(
			
		);

		for($x=0; $x<count($data); $x++){
			$returnData[$data[$x]['_source']['data']['displayName']] = array(
				'Service' => $data[$x]['_source']['data']['service'],
				'PostNum' => $data[$x]['_source']['data']['post']['totalPosts']
			);
		}

		return json_encode($returnData);
	}

	public function getPieChartUsers(){
		$var = matchAllClients(0);
		$data = $var['hits']['hits'];

		$returnArray = array(
			'Facebook' => 0,
			'Twitter' => 0,
			'Instagram' => 0,
			'LinkedIn' => 0
		);

		for($x = 0; $x < count($data); $x++){
			if($data[$x]['_source']['data']['service'] == 'Facebook'){
				$returnArray['Facebook']++;
			}
			if($data[$x]['_source']['data']['service'] == 'Twitter'){
				$returnArray['Twitter']++;
			}
			if($data[$x]['_source']['data']['service'] == 'Instagram'){
				$returnArray['Instagram']++;
			}
			if($data[$x]['_source']['data']['service'] == 'LinkedIn'){
				$returnArray['LinkedIn']++;
			}
		}

		return json_encode($returnArray);
	}

	public function getLineChartServices(){
		$returnArray = array();
		
		$var = matchTotalPostsInterval(0, 'Facebook');
		for($x=0; $x<count($var['facets']['histo1']['entries']); $x++){
			$returnArray[$x]['TotalPosts'] = $x;
			$returnArray[$x]['Facebook'] = $var['facets']['histo1']['entries'][$x]['count'];
		}
		
		$var = matchTotalPostsInterval(0, 'Twitter');
		for($x=0; $x<count($var['facets']['histo1']['entries']); $x++){
			$returnArray[$x]['TotalPosts'] = $x;
			$returnArray[$x]['Twitter'] = $var['facets']['histo1']['entries'][$x]['count'];
		}

		$var = matchTotalPostsInterval(0, 'Instagram');
		for($x=0; $x<count($var['facets']['histo1']['entries']); $x++){
			$returnArray[$x]['TotalPosts'] = $x;
			$returnArray[$x]['Instagram'] = $var['facets']['histo1']['entries'][$x]['count'];
		}

		$var = matchTotalPostsInterval(0, 'LinkedIn');
		for($x=0; $x<count($var['facets']['histo1']['entries']); $x++){
			$returnArray[$x]['TotalPosts'] = $x;
			$returnArray[$x]['Linkedin'] = $var['facets']['histo1']['entries'][$x]['count'];
		}

		return json_encode($returnArray);
	}

	public function getLineChartUsers(){
		//$users = array("Instagram-98476", "Twitter-288452305", "Instagram-8787820");

		#print_r($_GET);
		$var = file_get_contents("php://input");
		$arr = json_decode($var, true);
		$users = $arr['users'];

		$returnArr = array();

		for($x=0; $x<count($users); $x++){
			$tempArr = array();
			$id = $users[$x];
			/*$id = explode("-", $id);
			$id = $id[1];*/
			$client = matchSelectedLineChartUser($id);
			$dude = $client['hits']['hits'][0]['_source'];
			$ownsArr = $dude['data']['owns'];

			$mainUser = explode("-----", $users[$x]);
			array_push($tempArr, $mainUser[1]);
			for($y = 0; $y < count($ownsArr); $y++){
				$tempUser = explode("-----", $ownsArr[$y]);
				array_push($tempArr, $tempUser[1]);
			}

			$response = matchDateIntervalClients($tempArr);
			$bucketArray = $response['facets']['histo2']['entries'];
			
			$returnArr[$dude['data']['displayName']] = $bucketArray;

		}

		return json_encode($returnArr);
	}
}