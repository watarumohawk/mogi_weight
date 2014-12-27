#!/usr/bin/env perl

use strict;
use warnings;

use utf8;
use lib 'lib';
use DB;
use Data::Dumper::Concise;
use JSON;

my ($db_dir, $db_name, $table) = ('db', 'mogi_weight.sqlite3', 'records');
my $db = DB->new({ path => [$db_dir, $db_name], table => $table });

# :create_table
warn "#create_table";
eval{ $db->create_table( $table ); };
warn $@ if $@;
warn "#create_table mogi weight";
eval{ $db->create_table( $table.'mogiweight' ); };
warn $@ if $@;


# :save
warn "#save";
my $json = { date => '2013/12/10', weight => '66', remark=> 'hoge'};
print Dumper( $db->save( encode_json($json) ) );
my $json = { date => '2013/01/01', weight => '66', remark=> 'hoge'};
print Dumper( $db->save( encode_json($json) ) );

# :retrieve
warn "#retrieve";
my $date = '2013/12/17';
print Dumper( $db->retrieve( $date ) );

# :weight_history
warn "#weight_history";
print Dumper( $db->weight_history() );

# :saved_data_list
warn "#saved_data_list";
print Dumper( $db->saved_data_list() );

# :delete
warn "#delete";
print Dumper( $db->delete( '2013/01/01' ) );

# :saved_data_list
warn "#saved_data_list";
print Dumper( $db->saved_data_list() );



$db->disconnect;