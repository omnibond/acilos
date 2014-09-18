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

	if(isset($_FILES['fUploader'])){
		$stuff = $_FILES['fUploader'];
	}

	$name = $stuff['name'];
	$tmp_name = $stuff['tmp_name'];
	$size = $stuff['size'];
	$type = $stuff['type'];

	if(is_dir($target)){
		$target = $target . "/" . basename($name);
	}else{
		mkdir($target);
		$target = $target . "/" . basename($name);
	}
	
	$ok = 1;
	
	//This is our size condition 10megs
	if($size > 30000000){
		$ok = 0;

		print_r(json_encode(array("error" => "Sorry, your file is too large to upload.")));
	}
	
	//This is our limit file type condition
	if($type == "text/php"){
		$ok = 0;

		print_r(json_encode(array("error" => "Sorry, no PHP files allowed.")));
	}
	 
	//Here we check that $ok was not set to 0 by an error
	if(isset($ok)){
		if($ok === 0){
			print_r(json_encode(array("error" => "Sorry, your file was not uploaded")));
		}else{
		    if(move_uploaded_file($tmp_name, $target)){
				print_r(json_encode(array("success" => "The file was uploaded successfully")));
		    }else{
		        print_r(json_encode(array("error" => "Sorry, there was a problem uploading your file.")));
		    }
		} 
	}else{
		print_r(json_encode(array("error" => "Sorry, your file was not uploaded")));
	}
?>