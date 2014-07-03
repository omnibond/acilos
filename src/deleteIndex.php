<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines a method for clearing elasticsearch of all data
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

require_once('vendor/autoload.php');
use \ElasticSearch\Client;

$host = "localhost";
$port = "9200";
$index3 = "public";

#$es = Client::connection("http://$host:$port/$index3/$index3");
#$es->delete();

#$mapCommand = "curl -XPUT 'http://$host:$port/$index3' -d @public_mapping.json";
#$output = shell_exec($mapCommand);
#Now we should have a clean and mapped elasticsearch that is ready to go

var_dump($_SERVER);
?>
