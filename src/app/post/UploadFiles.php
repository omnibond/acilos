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
	$target = "tmpUpload";

	//print_r($_FILES);

	$file = $_FILES['file'];
	$name = $_FILES['file']['name'][0];
	$tmp_name = $_FILES['file']['tmp_name'][0];
	$size = $_FILES['file']['size'][0];
	$type = $_FILES['file']['type'][0];

	/*print_r($name);
	print_r($tmp_name);
	print_r($size);
	print_r($type);*/

	if(is_dir($target)){
		$target = $target . "/" . basename($name);
	}else{
		mkdir($target);
		$target = $target . "/" . basename($name);
	}

	//print_R($target);
	
	$ok = 1;
	
	//This is our size condition 10megs
	if($size > 10000000){
		$ok=0;

		return json_encode(array("error" => "Sorry, your file is too large to upload."));
	}
	
	//This is our limit file type condition
	if($type == "text/php"){
		$ok=0;

		return json_encode(array("error" => "Sorry, no PHP files allowed."));
	}
	 
	//Here we check that $ok was not set to 0 by an error
	if($ok == 0){
		return json_encode(array("error" => "Sorry, your file was not uploaded"));
	}else{
	    if(move_uploaded_file($tmp_name, $target)){
			return json_encode(array("success" => "The file has been uploaded"));
	    }else{
	        return json_encode(array("error" => "Sorry, there was a problem uploading your file."));
	    }
	} 
?>