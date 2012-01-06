/*
 * Copyright (c) Novedia Group 2012.
 *
 *     This file is part of Hubiquitus.
 *
 *     Hubiquitus is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     Hubiquitus is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with Hubiquitus.  If not, see <http://www.gnu.org/licenses/>.
 */

var options = { };
var winston = require('winston');
var hSession  = require("./lib/hsession.js");

function launch(opt){
	
	winston.handleExceptions();
	winston.info('Launching clients !');

	var session=null;
	var clients = new Array();
	
	for (var i=0;i<opt.workers;i++)
	{

		session = new hSession(opt);
		session.connect();
		clients[i] = session;
	}

}

function main() {
	
	var opts = require('tav').set({
		username: {
			note: 'The username to login as'
		} 
		,password: {
			note: 'The password to use'
		} 
		,endpoint: {
			note: 'The BOSH service endpoint (default: http://localhost:5280/http-bind/)', 
			value: 'http://localhost:5280/http-bind/'
		}
		,node: {
			note: 'The name of the node to suscribe to'
		} 
		,route: {
			note: 'The route attribute to use (default: <empty>)', 
			value: ''
		}
		,workers: {
			note: 'The number of workers to launch (default: 2)', 
			value: 1
		}
	});

	options = opts;
	
	launch(options);

}

// GO!!
main();
