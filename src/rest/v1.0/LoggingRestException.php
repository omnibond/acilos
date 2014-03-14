<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines an error handler for Slim
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
