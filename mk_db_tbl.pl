#!/usr/bin/env perl

use strict;
use warnings;

use utf8;
use lib 'lib';
use DB;
use Data::Dumper::Concise;
use JSON;

my $conf;
if(-e 'config.pl'){
	$conf = require 'config.pl';
}else{
	$conf = require 'config-default.pl';
}

my $db = DB->new({
	path => [$conf->{dir}, $conf->{dbfile}],
	table => $conf->{table}
});

# :create_table あったら作らない
warn "#create_table";
eval{ $db->create_table( $conf->{table} ); };
warn $@ if $@;
warn "#create_table mogi weight";
eval{ $db->create_table( $conf->{table}.'mogiweight' ); };
warn $@ if $@;
