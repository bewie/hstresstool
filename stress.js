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
var nbOpenedSessions = 0;
var openedSessions = new Array();

/*
Each session is launched asynchronously
 */
function launch(opt){

    var session = new hSession(opt);
    session.connect();
    openedSessions[nbOpenedSessions] = session;
    nbOpenedSessions++;
    winston.info('Opening session # '+ nbOpenedSessions);

    if (opt.workers>nbOpenedSessions){
        setTimeout(launch(opt), 5000);
    }

}

function main() {

    winston.handleExceptions();

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
		,sessions: {
			note: 'The number of sessions to launch (default: 2)',
			value: 2
		}
	});

	options = opts;
	
	launch(options);

}

// GO!!
main();