<?php
	 $target = "tmpUpload/";
	 $target = $target . basename( $_FILES['file']['name']) ;
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