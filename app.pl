#! /usr/bin/perl

use Mojolicious::Lite;

	get '/' => {text => 'Hello World!'};


app->start;