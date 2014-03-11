<?php


class Notifications{

        /*public function query(){
                $fileName = "appNotificationStatus.txt";

                if(($status = file_get_contents("../../oAuth/notifications/" . $fileName)) == false){
                    echo json_encode($notificationObject = array(
                        "Linkedin" => array(),
                        "Twitter" => array(),
                        "Facebook" => array(),
                        "Instagram" => array()
                    ));
                }else{
                    return $status;
                }
        }*/
	
	  public function checkNotifications(){
            $fileName = "appNotificationStatus.txt";

            if(isset($status)){
                if(($status = file_get_contents("../../oAuth/notifications/" . $fileName)) == false){
                    echo json_encode($notificationObject = array(
                        "Linkedin" => array(),
                        "Twitter" => array(),
                        "Facebook" => array(),
                        "Instagram" => array()
                    ));
                }else{
                    return $status;
                }
            }
        }

        public function clear(){
            $fileName = "appNotificationStatus.txt"; 
            $service = $_GET['service'];
            
            if(($status = file_get_contents("../../oAuth/notifications/" . $fileName)) == false){
                echo "Cannot read file";
            }else{
                $status = json_decode($status, true); 
                $status[$service] = array("notes" => 0, "friends" => array(), "messages" => 0);
            }
                 
            if(($fp = fopen("../../oAuth/notifications/" . $fileName, 'w')) == false){
                echo "Cannot open file";
            }else{
                fwrite($fp, json_encode($status));
                fclose($fp);
            }
        }
}

?>
