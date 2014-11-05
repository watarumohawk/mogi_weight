use Mojolicious::Lite;

use lib;
use DB;


my $config;
if(-e 'config.pl'){
	$config = require 'config.pl';
}else{
	$config = require 'config-default.pl';
}

# my ($db_dir, $db_name, $table) = ( $config->{dir}, $config->{dbfile}, $config->{table});
my $db;
my $output = { result => 'unknown mode'};


get '/' => sub {
	my $self = shift;
	$self->render(template => 'index', format => 'html', handler => 'ep');
};

get '/edit' => sub {
  my $self = shift;
  $self->render(template => 'edit', format => 'html', handler => 'ep');
};

any '/save_json' => sub {
	my $self = shift;

	use JSON;
	my $q = $self;
	my $dummy = {date => $q->param('date') ? $q->param('date') : undef , weight => $q->param('weight') };
	# my $post = $q->param('packed_data') ? $q->param('packed_data') : encode_json( $dummy ) ;
	# $output = $db->save( $post );
	$output = $db->save( encode_json($dummy) );
	$self->render(json => $output);
};


app->start;