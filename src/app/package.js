/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file is referenced by the `dojoBuild` key in `package.json` and provides extra hinting specific to the Dojo
** build system about how certain files in the package need to be handled at build time. Build profiles for the
** application itself are stored in the `profiles` directory.
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
var profile = {
	// Resource tags are functions that provide hints to the build system about the way files should be processed.
	// Each of these functions is called once for every file in the package directory. The first argument passed to
	// the function is the filename of the file, and the second argument is the computed AMD module ID of the file.
	resourceTags: {
		// Files that contain test code and should be excluded when the `copyTests` build flag exists and is `false`.
		// It is strongly recommended that the `mini` build flag be used instead of `copyTests`. Therefore, no files
		// are marked with the `test` tag here.
		test: function (filename, mid) {
			return false;
		},

		// Files that should be copied as-is without being modified by the build system.
		copyOnly: function (filename, mid) {
			// return (/^app\/img\//).test(filename);
			return (/app\/resources\//.test(filename) && !/\.css$/.test(filename));
		},

		// Files that are AMD modules.
		amd: function (filename, mid) {
			return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
		},

		// Files that should not be copied when the `mini` build flag is set to true.
		miniExclude: function (filename, mid) {
			return {
				'app/package': 1
			}.hasOwnProperty(mid);
		}
	}
};
