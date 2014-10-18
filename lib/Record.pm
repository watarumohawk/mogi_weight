#ckage Record;

use strict;
use warnings;

use JSON;

sub new{
	my $package = shift;
	my $json_string = shift;

	my $json = from_json( $json_string );

	my $data = {
		date => $json->{date},
		sum  => $json->{sum},
		json_string => $json_string
	};

	bless $data, $package;
}


1;
