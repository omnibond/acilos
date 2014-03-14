<?php
/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the fileList of the post module
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
	$target = "tmpUpload/";
	 
	 if(is_dir($target)){
		$target = $target . "/" . basename( $_FILES['file']['name']) ;
	 }else{
		mkdir($target);
		$target = $target . "/" . basename( $_FILES['file']['name']) ;
	 }
	
	 $ok=1;
	
	$uploaded_size = $_FILES['file']['size'];
	$uploaded_type = $_FILES['file']['type'];
	
	//This is our size condition 2megs
	if ($uploaded_size > 2000000) {
	    echo "Your file is too large. <br>";
	    $ok=0;
	}
	
	//This is our limit file type condition
	if ($uploaded_type =="text/php"){
	    echo "No PHP files allowed. <br>";
	    $ok=0;
	}
	 
	//Here we check that $ok was not set to 0 by an error
	if ($ok==0){
	    echo "Sorry your file was not uploaded";
	}else {
	    if(move_uploaded_file($_FILES['file']['tmp_name'], $target)){
	       echo json_encode(array("success" => "The file ". basename( $_FILES['file']['name']). " has been uploaded"));
	    }else{
	        echo json_encode(array("error" => "Sorry, there was a problem uploading your file."));
	    }
	}
	 
?>