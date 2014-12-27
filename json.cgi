#!/usr/bin/env perl

use strict;
use warnings;

use utf8;
use CGI qw/:standard/;
use CGI::Carp qw(fatalsToBrowser warningsToBrowser);
use lib 'lib';
use DB;
use JSON;

my ($db_dir, $db_name, $table) = ('db', 'mogi_weight.sqlite3', 'records');

my $db = DB->new({ path => [$db_dir, $db_name], table => $table });

my $q = CGI->new;
my $mode = $q->param('mode');

my $output = { result => 'unknown mode'};

if($mode eq 'save'){
	my $dummy = { date => $q->param('date') ? $q->param('date') : undef , weight => $q->param('weight') };
	my $post = $q->param('packed_data') ? $q->param('packed_data') : encode_json( $dummy ) ;
	$output = $db->save( $post );
}elsif($mode eq 'weight_history'){
	$output = $db->weight_history( );
}elsif($mode eq 'saved_data_list'){
	$output = $db->saved_data_list( );
}elsif($mode eq 'retrieve'){
	$output = $db->retrieve( $q->param('date') );
}elsif($mode eq 'delete'){
	$output = $db->delete( $q->param('date') );
}


#$output->{db_permission} = $db->{db_perm};
answer_to_browser( $output );


sub answer_to_browser{
	my $out = shift;

	print header( -type => 'application/json', -charset => 'UTF-8' );
	print to_json( $out );
}


__END__