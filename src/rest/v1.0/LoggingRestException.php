<?php

class LoggingRestException extends Exception
{

    public function __construct($errorMessage,$httpStatusCode)
    {
        $message = "";
        
        if(isset($httpStatusCode)){
            $message .= 'RestException code: "'.$httpStatusCode.'"';
        }

        if($errorMessage){
            $message = $message . '; Message: "'. $errorMessage.'"';
        }

        error_log($message);

        parent::__construct ( $errorMessage, $httpStatusCode );
    }
}

?>
