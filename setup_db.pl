
use strict;
use warnings;

use utf8;
use feature 'say';
#use 5.016;
use File::Spec;

my $conf;
if(-e 'config.pl'){
	$conf = require 'config.pl';
}else{
	$conf = require 'config-default.pl';
}

my $dir = $conf->{'dir'};
if( -d $dir ){
	say "[ $dir ] dir OK";
}else{
	say 'mkdir [ $dir ]';
	mkdir $dir || die $!;
	say  "[ $dir ] dir is made";
}

my $dbfile = File::Spec->catfile($dir, $conf->{'dbfile'} );
if(-e $dbfile){
	say "[ $dbfile ] exists";
}else{
	say "making db file [ $dbfile ]";
	open my $fh, '>', $dbfile or die $!;
	close $fh;
	say "[ $dbfile] is made";
}

use File::stat;
use Fcntl ':mode';

say $dbfile, "---------";
my $st_dbfile = stat($dbfile) or die "No $dbfile: $!";
printf ("permission %o\n", S_IMODE( $st_dbfile->mode ));


say $dir, "---------";
my $st_dir = stat($dir) or die "No $dir: $!";
printf ("permission %o\n", S_IMODE( $st_dir->mode ));
