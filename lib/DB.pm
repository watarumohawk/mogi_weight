package DB;

use strict;
use warnings;

use File::Spec;
use DBI;
use Record;

sub new{
	my $package = shift;
	my $db_name = File::Spec->catfile( @{$_[0]->{path}} );

	my $dbh = DBI->connect( "dbi:SQLite:dbname=$db_name", undef, undef, { PrintError => 1 } ) or die;
	my $perm = substr( sprintf("%03o", [ stat $db_name ]->[2]) , 3);

	return bless { dbh => $dbh, table => $_[0]->{table}, db_perm => $perm }, $package;
}

sub save{
	my $self = shift;
	my $json_string = shift;

	my $msg = '';

	my $r = Record->new( $json_string );
	return { result => 'failed', msg => 'date is not specified' } unless $r->{date};

	#delete pre-exists
	my $search = "select * from $self->{table} where date = ?;";
	my $sth = $self->{dbh}->prepare( $search );
	$sth->execute( $r->{date} );
	if( $sth->fetchrow_array ){
		$msg .= 'delete -> ';
		$self->{dbh}->do("delete from $self->{table} where date = '$r->{date}';");
	}

	# insert new data
	my $query = "insert into $self->{table} (date, sum, json_string) values ( ?, ?, ?);";

	$sth = $self->{dbh}->prepare( $query );
	$sth->execute( $r->{date}, $r->{sum}, $r->{json_string} );

	return { result => 'success', msg => $msg.'insert '.$r->{date}, db_perm => $self->{db_perm} };
}

sub sum_history{
	my $self = shift;
	
	my $query = "SELECT date, sum FROM $self->{table} ORDER BY date asc;";

	my $sth = $self->{dbh}->prepare( $query );
	$sth->execute;
	#my $ref = $sth->fetchall_arrayref();

	my $dates = [];
	my $sums = [];
	while( my $row = $sth->fetch ){
		#print @row;
		push @$dates, $row->[0];
		push @$sums, $row->[1];
	}

	return { date => $dates, sum => $sums };
}

sub saved_data_list{
	my $self = shift;
	
	return $self->sum_history->{date};
}


sub retrieve{
	my $self = shift;
	my $date = shift;
	
	return { result => 'date is not specified'} unless $date;
	my $query = "SELECT * FROM $self->{table} WHERE date = ?;";

	my $sth = $self->{dbh}->prepare( $query );
	$sth->execute( $date );
	#my $ref = $sth->fetchall_hashref('date');
	my $ref = $sth->fetch;

	return $ref;
}

sub delete{
	my $self = shift;
	my $date = shift;

	return { result => 'failed', msg => 'date is not specified', mode => 'delete'} unless $date;
	my $query = "DELETE FROM $self->{table} WHERE date = ?;";

	my $sth = $self->{dbh}->prepare( $query );
	$sth->execute( $date );

	return { result => 'success', msg => "deleted: $date", mode => 'delete'};
}


sub disconnect{
	my $self = shift;

	$self->{dbh}->disconnect;	
}


# one shot method
# tableがある場合は作らないでdie
sub create_table{
	my $self = shift;
	my $table_name = shift;

	my $dbh = $self->{dbh};

	if( $dbh->tables( undef, undef, $table_name, 'TABLE' )){
		die "TABLE[ $table_name ] exists.";
	}
	my $query = <<"EOS";
create table $table_name (
	date UNIQUE NOT NULL,
	sum INT,
	json_string
)
EOS

	$dbh->do( $query );
}

1;