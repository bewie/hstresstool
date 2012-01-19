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
 
var winston = require('winston');
var strophe = require("./strophe.js").Strophe;
var spubsub = require("./strophe.pubsub.js");
var dutil   = require("./dutil.js");

var Strophe = strophe.Strophe;
var $iq     = strophe.$iq;
var $msg    = strophe.$msg;
var $build  = strophe.$build;	
var $pres   = strophe.$pres;

// Constructor
var hSessionBosh = function(opts) {
	this.options = opts;
	this.conn = null;
	this.suscribed = false;
}

hSessionBosh.prototype = {
	
	options: null,
	conn: null,
	suscribed: false,
	msgReceivedCount: 0,

	debug: function(msg) 
	{
		winston.debug(msg);
	},

	connect: function() {

	    this.conn = new Strophe.Connection(this.options.endpoint);
	    this.conn.rawInput = this.rawInput;
	    this.conn.rawOutput = this.rawOutput;
	    
	    this.conn.connect(
		    	this.options.username, 
		    	this.options.password, 
		    	this.onConnect.bind(this), 
		    	null,
		    	null, 
		    	this.options.route);

		//process.on('SIGINT', this.disconnect().bind(this) );

	    return this;
	},

	disconnect: function() {
	    this.conn.flush();
	    this.conn.disconnect();
	},

	suscribe: function() {

		var iqid3 = this.conn.pubsub.subscribe(
			this.options.node,
			null,
			this.onMessage.bind(this),
			this.onSuscribed.bind(this),
			null,
			false);

		return this;
	},

	// CALLBACKS

	onConnect: function(status)
	{
		this.debug("onConnect:", status, dutil.rev_hash(Strophe.Status)[status]);

	    if (status == Strophe.Status.CONNECTING) {
			this.debug('Strophe is connecting.');
	    } else if (status == Strophe.Status.CONNFAIL) {
			this.debug('Strophe failed to connect.');
			process.exit(1);
	    } else if (status == Strophe.Status.DISCONNECTING) {
			this.debug('Strophe is disconnecting.');
	    } else if (status == Strophe.Status.DISCONNECTED) {
			this.debug('Strophe is disconnected.');
			//process.exit(0);
		} else if (status == Strophe.Status.CONNECTED) {
			this.debug('Strophe is connected. Suscribing to node.');
			//this.suscribe();
			//disconnect();
			this.conn.send($pres());
			this.conn.addHandler(this.onMessage.bind(this),null,'message','headline',null,null,null);

	    }
	},

	onSuscribed: function(sub) {
		this.suscribed = true;
		this.debug('Subscription was successfull ! Now awaiting messages...');
		return true;
	},

	onMessage: function(message) {
		
		this.msgReceivedCount++;

		this.debug(this.conn.jid +' has received ' + this.msgReceivedCount + ' messages!');

		if (!this.suscribed) {
			return true;
		}

		var pubsubservice = 'pubsub.socialtv-livebattle.fr';

		var server = "^" + pubsubservice.replace(/\./g, "\\.");
		var re = new RegExp(server);

		return true;

	},

	rawInput: function(data)
	{
		//winston.debug("\nReceived:", data);
		return;
	},

	rawOutput: function(data)
	{
		//winston.debug("\nSent:", data);
		return;
	}

}

module.exports = hSessionBosh;
