/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
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
/****************************************************************************
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems: www.omnibond.com for Acilos.com
**
** OpenClemson Dojo-Mama framework: https://github.com/OpenClemson/dojo-mama
** Copyright (C) 2014 Clemson University and/or its subsidiary(-ies).
** All rights reserved.
** Clemson University - www.clemson.edu
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
** If you have questions regarding the use of this file, please contact
** Omnibond Systems - www.omnibond.com
** Clemson University - www.clemson.edu
**
** $QT_END_LICENSE$
*/
define(['dojo/_base/declare',
		'dojo-mama/views/_ModuleViewMixin',
		'dojox/mobile/Pane',
		'dijit/_Container'
], function(declare, ModuleViewMixin, Pane, Container) {

	// module:
	//     dojo-mama/views/ModuleView

	return declare([Pane, Container, ModuleViewMixin], {
		// summary:
		//     A base module view
		baseClass: ''
	});
});
