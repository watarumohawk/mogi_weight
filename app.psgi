use Mojolicious::Lite;

get '/' => sub {

	my $self = shift;

	$self->render(template => 'index');
};

get '/edit' => sub {
  my $self = shift;

  $self->render(template => 'edit');
};

app->start;