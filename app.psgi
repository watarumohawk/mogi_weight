use Mojolicious::Lite;

get '/' => sub {
	my $self = shift;
	$self->render(template => 'index', format => 'html', handler => 'ep');
};

get '/edit' => sub {
  my $self = shift;
  $self->render(template => 'edit', format => 'html', handler => 'ep');


};

app->start;