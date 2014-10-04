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


	#app.psgi
	--
	
	#! /usr/bin/perl
	
	get '/' => sub {
		my $q = shift;
		$q->render(template => 'index');
	};


templateの中にあるindex.html.epを読み込むようにしたけど、サーバーのエラーを見ると
	
	Couldn't load application from file "app.psgi": syntax error at app.psgi line 3, near "get '/'"

と出る。

Mojoliciousの書き忘れ。

	#! /usr/bin/perl
	
	use Mojolicious::Lite;
	
	get '/' => sub {
	
		my $q = shift;
	
		$q->render(templates => 'index');
	
	};

cal_viewの様に書いたのに、以下のエラー
	
	File "app.psgi" did not return an application object.


----

記述ミス修正

	#! /usr/bin/perl
	
	use Mojolicious::Lite;
	
	get '/' => sub {
	
		my $q = shift;
	
		$q->render(template => 'index');
	
	};
	
	app->start;

これで、http://localhost:3000/　にアクセスすれば表示されるが、herokuにはApplication Errorになってしまう。

---
依存モジュールのインストールの部分でつまずく。


	$ cpanm --installdeps .
	--> Working on .
	Configuring /Users/WataruSekiguchi/Sites/GitHub/mogi_weight ... N/A
	! Configuring . failed. See /Users/WataruSekiguchi/.cpanm/work/1412434035.54406/build.log for details.


Cartonをcapnmで入れて、以下を実行したがダメ。

	$ carton install
	Can't locate cpanfile: (cpanfile)

---

「cpanfile」を「cpanfile.pl」としていたのが原因。ファイル名を直したら、依存モジュールをインストールできた。

それでも、サイトの方は表示されず


	#app.psgi
	
	requires 'app.pl';

と書いていたけど、それがダメだったらしい。

app.pl内の記述を、app.psgiに書いたら上手くいった。



####【参考】

* [テンプレートの基礎 | Mojolicious入門](http://d.hatena.ne.jp/perlcodesample/20140405/1396426029)

* [テンプレートヘルパー | Mojolicious入門](http://d.hatena.ne.jp/perlcodesample/20140414/1397452753)

* [cpanmとcpanfileでバージョンを指定してモジュールをインストールする](http://d.hatena.ne.jp/perlcodesample/20130318/1363589513)

* [HerokuでApplicationErrorが発生したときの対処法](http://qiita.com/Oakbow/items/1565922ddcdea0ce9ab5) 

* [Perl製のWebアプリケーションをherokuで3分で動かすの法](http://www.songmu.jp/riji/archives/2013/05/perlwebheroku3.html)

* [Heroku deployment with cpanfile By Miyagawa](https://gist.github.com/miyagawa/3131370)

* [cpanfileの書き方](http://search.cpan.org/~miyagawa/Module-CPANfile-1.0002/lib/cpanfile.pod)

* [Heroku buildpack: Perl] (https://github.com/miyagawa/heroku-buildpack-perl)







