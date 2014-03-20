/*
dojo-mama: a JavaScript framework
Copyright (C) 2014 Clemson University

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
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
			return (/^dojo-mama\/resources\//.test(filename) && !/\.css$/.test(filename));
		},

		// Files that are AMD modules.
		amd: function (filename, mid) {
			return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
		},

		// Files that should not be copied when the `mini` build flag is set to true.
		miniExclude: function (filename, mid) {
			return {
				'dojo-mama/package': 1
			}.hasOwnProperty(mid);
		}
	}
};
