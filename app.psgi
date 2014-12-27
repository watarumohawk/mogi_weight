#!/usr/bin/env perl

use Mojolicious::Lite;

use lib 'lib';
use DB;

my $config;
if(-e 'config.pl'){
	$config = require 'config.pl';
}else{
	$config = require 'config-default.pl';
}

my ($db_dir, $db_name, $table) = ( $config->{dir}, $config->{dbfile}, $config->{table});
my $db;
my $output = { result => 'unknown mode'};


under sub {
	my $self = shift;

	if( defined $self->param('mogiweight') && $self->param('mogiweight') == 1 ){
		$table = 'recordsmogiweight';
	}else{
		$table = 'records';
	}

	$db = DB->new({ path => [$db_dir, $db_name], table => $table });

	return 1;
};

get '/' => sub {
  my $self = shift;

  $self->render(template =>'index');
};

get '/weight_edit' => sub {
  my $self = shift;

  $self->render(template =>'weight_edit');
};

any '/weight_history_json' => sub {
	my $self = shift;

	$output = $db->weight_history( );

	my $weightval = DB->new({ path => [$db_dir, $db_name], table => 'recordsmogiweight' });
	$output->{'weight_val'} = $weightval->weight_history;

 	$self->render(json => $output);
};

any '/weight_history' => sub {
	my $self = shift;

	$self->render(template =>'weight_history');
};

any '/saved_data_list' => sub {
	my $self = shift;

	$self->render(template =>'saved_data_list');
};

any '/saved_data_list_json' => sub {
	my $self = shift;

	$output = $db->saved_data_list( );
 	$self->render(json => $output);
};

any '/edit' => sub {
	my $self = shift;

	$self->render(template =>'edit');
};

any '/retrieve' => sub {
	my $self = shift;

	$self->render(template =>'edit');
};

any '/retrieve_json' => sub {
	my $self = shift;

	$output = $db->retrieve( $self->param('date') );
	$output->[2] = decode_json( $output->[2]) ;

	$self->render(json => $output);
};


any '/save_json' => sub {
	my $self = shift;

	use JSON;
	my $q = $self;
	my $dummy = { date => $q->param('date') ? $q->param('date') : undef , weight => $q->param('weight') };
	my $post = $q->param('packed_data') ? $q->param('packed_data') : encode_json( $dummy ) ;
	$output = $db->save( $post );
	$self->render(json => $output);
};

any '/delete_json' => sub {
	my $self = shift;

	$output = $db->delete( $self->param('date') );
	$self->render(json => $output);
};


if( defined $config->{log_level} ){
	app->log->level( $config->{log_level} );
}
app->start();