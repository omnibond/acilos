<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to social media notifications
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

require_once('authCalls.php');

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
