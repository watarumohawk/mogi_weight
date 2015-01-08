requires 'Mojolicious', '4.94';
requires 'File::Spec', '3.47';
requires 'JSON', '2.90';
requires 'DBD::SQLite', '1.37';
requires 'DBI', '1.622';

on 'develop' => sub {
	recommends 'DBD::SQLite';
};

feature 'sqlite', 'SQLite support' => sub {
    recommends 'DBD::SQLite';
};