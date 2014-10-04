deployは出来たけど、サイトにアクセスすると「Application Error」の表示。


	$heroku logs

でログを見ると、

	2014-10-04T02:21:56.239336+00:00 app[web.1]: BEGIN failed--compilation aborted at /app/app.psgi line 3.
	2014-10-04T02:21:56.239320+00:00 app[web.1]: Error while loading /app/app.psgi: Can't locate Mojolicious/Lite.pm in @INC (@INC contains: /app/local/lib/perl5/x86_64-linux-gnu-thread-multi /app/local/lib/perl5 /etc/perl /usr/local/lib/perl/5.10.1 /usr/local/share/perl/5.10.1 /usr/lib/perl5 /usr/share/perl5 /usr/lib/perl/5.10 /usr/share/perl/5.10 /usr/local/lib/site_perl .) at /app/app.psgi line 3.


cpanfile.plに記述追加

	requires 'Mojolicious::Lite', '==4.94';


cpanfile.plとapp.psgiのパーミッションを変更。

	chmod 755
	
これは関係なかった。

	morbo app.psgi

だと、以下のエラー

	Can't create listen socket: IO::Socket::INET: Address already in use at /Users/WataruSekiguchi/.plenv/versions/5.16.2/lib/perl5/site_perl/5.16.2/Mojo/IOLoop.pm line 120.
	
ターミナルの他の窓でサーバー起動して（cal_view起動してた）ポートを使ってたのが原因だった…

でも、hello worldだけのapp.plは起動出来るけど、app.psgiがうまくいかない。

