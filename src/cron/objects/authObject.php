<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the base auth object 
** This code is DEPRECATED in favor of everything being on the server in serviceCreds.json
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

class authObject{

	public $auth = array(
		"facebook" => array(),
		'instagram' => array(),
		'twitter' => array(),
		'linkedin' => array(),
	);
	public $login = "first";
	
	public function getObj(){
		return $this;
	}
		
	public function setFacebook($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['facebook'], $temp);
	}
	public function setLinkedin($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['linkedin'], $temp);
	}
	public function setTwitter($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['twitter'], $temp);
	}
	public function setInstagram($id, $name, $color, $key, $secret, $redirect){
		$temp = array(
			"name" => $name,
			"id" => $id,
			"color" => $color,
			"key" => $key,
			"secret" => $secret,
			"redirect" => $redirect
		);
		array_push($this->auth['instagram'], $temp);
	}
	public function setLogin($login){
		$this->login = $login;
	}
}

