#! /usr/bin/perl

use Mojolicious::Lite;

get '/' => sub {

	my $q = shift;

	$q->render(templates => 'index');

};
