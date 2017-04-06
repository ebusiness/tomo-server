var env = process.env.NODE_ENV || 'development',
  config = require('../config/global')[env],
  fs = require('fs'),
  async = require('async'),
  moment = require('moment'),
  mongoose = require('mongoose');

global.config = config;

  // Connect to MongoDB
  mongoose.connect(config.mongodb.host);
  mongoose.connection.on('open', function() {
    if ('production' !== config.app.env) mongoose.set('debug', true);
    console.log("DataBase " + config.mongodb.host + " connected.");
  });

  // Load MongoDB models
  var models_path = config.root + '/models';
  fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
  });

var User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Group = mongoose.model('Group'),
  Activity = mongoose.model('Activity');



var owner = "55ee510b7e4cf649089bdc56";
var createDate = "2017-04-01T10:26:36.034Z";

var data = [{"name":"株式会社クルー","address":"〒546-0044 大阪市東住吉区北田辺6-12-10", "homepage":"http://www.crew.to/", "type":"ses","coordinate":["34.63037","135.526926"]},
{"name":"シンフォニー株式会社","address":"〒460-0002 愛知県名古屋市中区丸の内2-19-25　MS桜通4F", "homepage":"http://www.symphony-com.co.jp/", "type":"ses","coordinate":["35.173526","136.899541"]},
{"name":"グローブネット株式会社","address":"〒240-0013 横浜市保土ヶ谷区帷子町2－47第一斉藤ビル601", "homepage":"http://globenet.co.jp/globewww/index.html", "type":"ses","coordinate":["35.446837","139.598301"]},
{"name":"株式会社 ブルーネットジャパン","address":"〒231-0005 神奈川県横浜市中区本町1-3 綜通横浜ビル10階", "homepage":"http://www.blue-net.co.jp/", "type":"ses","coordinate":["35.44788","139.641344"]},
{"name":"株式会社グローバルシステムズ","address":"〒231-0011 神奈川県横浜市中区太田町 6-84-2 三井生命横浜桜木町ビル 4階", "homepage":"http://www.global-systems.co.jp", "type":"ses","coordinate":["35.448966","139.634612"]},
{"name":"株式会社システムクリエーション","address":"〒231-0002 横浜市中区海岸通4ｰ17 東信ビル6F", "homepage":"http://www.system-creation.com/", "type":"ses","coordinate":["35.45023","139.638654"]},
{"name":"メタテック株式会社","address":"〒220-0051 横浜市西区中央1-35-3　三上ビル2Ｆ", "homepage":"http://www.metatec.co.jp/", "type":"ses","coordinate":["35.456859","139.617448"]},
{"name":"株式会社グラッド・ソフトウェア","address":"〒220-0004 神奈川県横浜市西区北幸2丁目10番33号　マニュライフプレイス5階", "homepage":"http://www.e-glad.co.jp/", "type":"ses","coordinate":["35.465711","139.61501"]},
{"name":"株式会社日中ソフト","address":"〒221-0835 横浜市神奈川区鶴屋町3-32-14新港ビル3Ｆ", "homepage":"http://www.ncsoft.ne.jp/", "type":"ses","coordinate":["35.468766","139.617538"]},
{"name":"株式会社 ビー・エス・ピー","address":"〒221-0052 神奈川県横浜市神奈川区栄町2-9 東部ヨコハマビル6F", "homepage":"http://www.bsp-web.co.jp/", "type":"ses","coordinate":["35.469688","139.627848"]},
{"name":"豊原技研株式会社","address":"〒242-0006 神奈川県大和市南林間１-4-6", "homepage":"http://www.thtech.co.jp/", "type":"ses","coordinate":["35.49363","139.447767"]},
{"name":"ケイアイエヌ株式会社","address":"〒210-0023 神奈川県川崎市川崎区小川町14-19 浜屋八秀ビル7階", "homepage":"http://www.kingsoft.co.jp/", "type":"ses","coordinate":["35.52779","139.699015"]},
{"name":"サンネット株式会社","address":"〒210-0005 神奈川県川崎市川崎区東田町9-6-7Ｆ", "homepage":"http://www.sun-star.co.jp/", "type":"ses","coordinate":["35.528803","139.703504"]},
{"name":"株式会社インフォブリッジ","address":"〒140-0003 東京都品川区八潮5丁目3番12-204号", "homepage":"http://www.infobridge.jp/", "type":"ses","coordinate":["35.602377","139.750953"]},
{"name":"アットワン 株式会社","address":"〒141-0033 東京都品川区西品川2-2-9", "homepage":"http://www.at-1.co.jp/", "type":"ses","coordinate":["35.614861","139.727575"]},
{"name":"株式会社 JCソフト","address":"〒141-0022 東京都品川区東五反田 1-10-7-304 ＡＩＯＳ五反田ビル", "homepage":"http://www.jcsoft.jp/", "type":"ses","coordinate":["35.627729","139.725883"]},
{"name":"JUPICON 株式会社","address":"〒261-0004 千葉県千葉市美浜区高洲3丁目3番8-403号", "homepage":"http://www.jupicon.com/", "type":"ses","coordinate":["35.628523","140.081517"]},
{"name":"NEUSOFT Japan 株式会社","address":"〒135-0063 東京都江東区有明3-6-11 東京ファッションタウンビル東館7階", "homepage":"http://www.neusoft.co.jp/", "type":"ses","coordinate":["35.630936","139.790571"]},
{"name":"株式会社ハイシンクジャパン","address":"〒108-0023 東京都港区芝浦3-2-16 田町イーストビル 6F", "homepage":"http://www.jhcc.co.jp", "type":"ses","coordinate":["35.644094","139.749197"]},
{"name":"インフォシー 株式会社 ","address":"〒108-0014 東京都港区芝5-29-20クロスオフィス三田3階", "homepage":"http://www.infosea.co.jp/", "type":"ses","coordinate":["35.646142","139.744682"]},
{"name":"株式会社 ウェイン","address":"〒108-0014 東京都港区芝5丁目5番1号 ラウンドクロス三田6階", "homepage":"http://www.wain.co.jp/", "type":"ses","coordinate":["35.649978","139.746602"]},
{"name":"株式会社ソフトロード","address":"〒105-0014 東京都港区芝1-14-4 芝桝田ビル7階", "homepage":"http://www.softroad.co.jp/", "type":"ses","coordinate":["35.650136","139.754068"]},
{"name":"エクミネット株式会社","address":"〒105-0014 東京都港区芝2丁目13-9 芝ホワイトビル2Ｆ", "homepage":"http://acmenet.co.jp/", "type":"ses","coordinate":["35.651261","139.753249"]},
{"name":"ニュータッチイーランド株式会社","address":"〒105-0014 東京都港区芝1丁目9-3芝マツラビル4F", "homepage":"http://www.eland-g.co.jp/", "type":"ses","coordinate":["35.651382","139.755026"]},
{"name":"ニュータッチ共達ネットワーク 株式会社","address":"〒105-0014 東京都港区芝1-9-3芝マツラビル3F", "homepage":"http://www.cncsys.co.jp/", "type":"ses","coordinate":["35.651416","139.75503"]},
{"name":"株式会社カイカ","address":"〒153-0044 東京都目黒区大橋一丁目5番1号（クロスエアタワー8階）", "homepage":"http://www.caica.jp/", "type":"ses","coordinate":["35.651477","139.688505"]},
{"name":"株式会社ネットコム","address":"〒105-0014 東京都港区芝3-17-12第2Mビル7F", "homepage":"http://www.netcome.co.jp/", "type":"ses","coordinate":["35.651508","139.745185"]},
{"name":"株式会社ジャンガ・テック","address":"〒261-0023 千葉県千葉市美浜区中瀬1-3幕張テクノガーデンB棟9階", "homepage":"http://www.janga.co.jp", "type":"ses","coordinate":["35.651797","140.041748"]},
{"name":"株式会社カナック","address":"〒105-0012 東京都港区芝大門2-10-1第一大門ビル5階", "homepage":"http://www.cannac.co.jp/", "type":"ses","coordinate":["35.654703","139.753109"]},
{"name":"株式会社ＪＣＤソリューション","address":"〒104-6115 東京都中央区晴海1丁目8番11号 晴海アイランド トリトンスクエア オフィスタワーY棟15階", "homepage":"https://www.jcdsol.co.jp/", "type":"ses","coordinate":["35.657471","139.782368"]},
{"name":"株式会社　セネット","address":"〒105-0004 東京都港区新橋6-5-4 DIK新橋317", "homepage":"http://www.senet-inc.co.jp/", "type":"ses","coordinate":["35.662104","139.754387"]},
{"name":"株式会社SWL JAPAN","address":"〒105-0004 東京都港区新橋6-5-3 山田屋ビル4F", "homepage":"http://www.chinasourcing.co.jp/", "type":"ses","coordinate":["35.662205","139.754588"]},
{"name":"株式会社シャインソフト","address":"〒105-0004 東京都港区新橋5-12-6 ウェルディ新橋4F", "homepage":"http://www.shinesoft.co.jp", "type":"ses","coordinate":["35.662919","139.756533"]},
{"name":"イースクェア 株式会社","address":"〒105-0004 東京都港区新橋2-11-1 村上建物ビル 2F", "homepage":"http://www.esquare.co.jp/", "type":"ses","coordinate":["35.667413","139.755325"]},
{"name":"株式会社オンリーインフォテック","address":"〒104-0042 東京都中央区入船1-9-8 ピエノアーク入船3F", "homepage":"http://only-info.com/", "type":"ses","coordinate":["35.672296","139.778028"]},
{"name":"株式会社E-Safenet","address":"〒104-0041 東京都中央区新富1-15-11マキプラザ405", "homepage":"http://www.esafenet.co.jp/", "type":"ses","coordinate":["35.672378","139.775052"]},
{"name":"リーディング株式会社","address":"〒104-0061 東京都中央区銀座1-14-6　銀座1丁目ビル6F", "homepage":"http://www.leading-net.co.jp/", "type":"ses","coordinate":["35.673027","139.769782"]},
{"name":"株式会社ビッグハンズ","address":"〒104-0033 東京都中央区新川1丁目28番25号 東京ダイヤビルディング3号館2F", "homepage":"http://www.bighandz.co.jp/", "type":"ses","coordinate":["35.674881","139.784363"]},
{"name":"東成ソフトウェア有限会社","address":"〒191-0061 東京都日野市大坂上3-11-1", "homepage":"http://www.tousei-soft.com/", "type":"ses","coordinate":["35.675259","139.388652"]},
{"name":"日本宝信株式会社","address":"〒104-0033 東京都中央区新川1-24-12 上海国際ビル5F", "homepage":"http://www.baosight-jp.com/", "type":"ses","coordinate":["35.676606","139.785019"]},
{"name":"株式会社 ノーステクノロジー","address":"〒104-0033 東京都中央区新川1丁目14-6 第7アカギビル 6F", "homepage":"http://www.north-t.co.jp", "type":"ses","coordinate":["35.676684","139.78345"]},
{"name":"ティービーケー・システムズ株式会社","address":"〒104-0033 東京都中央区新川1丁目22番11号フジライト新川THビル６階", "homepage":"http://www.tbk-sys.co.jp", "type":"ses","coordinate":["35.677411","139.785198"]},
{"name":"菱通ジャパン株式会社","address":"〒104-0033 東京都中央区新川1-22-11 フジライト新川ビル2階", "homepage":"http://www.ilingtong.com/", "type":"ses","coordinate":["35.677411","139.785198"]},
{"name":"株式会社 日本南天","address":"〒103-0025 東京都中央区日本橋茅場町2-11-8　茅場町駅前ビル7F", "homepage":"http://www.nantian.co.jp/", "type":"ses","coordinate":["35.678268","139.779366"]},
{"name":"株式会社 GKT","address":"〒103-0026 東京都中央区日本橋兜町 22-6 マルカ日甲ビル2F", "homepage":"http://www.gkt.co.jp/", "type":"ses","coordinate":["35.678549","139.775771"]},
{"name":"ＵＴＯ株式会社","address":"〒103-0025 東京都中央区日本橋茅場町2-8-8 共同ビル(市場通り)36室", "homepage":"http://www.uto.co.jp/", "type":"ses","coordinate":["35.67918","139.779047"]},
{"name":"ウェブグループ株式会社","address":"〒104-0033 東京都中央区新川1-1-6 七映第一ビル4F", "homepage":"http://www.webgroup.co.jp/", "type":"ses","coordinate":["35.679448","139.782554"]},
{"name":"株式会社ジェー・シー・ディ","address":"〒102-0094 東京都千代田区紀尾井町1番3号 東京ガーデンテラス紀尾井町 紀尾井タワー28階", "homepage":"http://www.jcd.co.jp/", "type":"ses","coordinate":["35.679517","139.737098"]},
{"name":"株式会社サイリン","address":"〒103-0014 東京都中央区日本橋蛎殻町1-18-4 山本ビル3Ｆ", "homepage":"http://www.cyaline.com/jp/", "type":"ses","coordinate":["35.682308","139.782891"]},
{"name":"アクティブネットワーク 株式会社","address":"〒103-0027 東京都中央区日本橋一丁目20番地8号　三木共栄ビル別館6F", "homepage":"http://www.activenetwork.co.jp/", "type":"ses","coordinate":["35.683244","139.777728"]},
{"name":"株式会社東忠","address":"〒160-0023 東京都新宿区西新宿3丁目11番20号 オフィススクエアビル5F", "homepage":"http://www.totyu.com/", "type":"ses","coordinate":["35.685752","139.689004"]},
{"name":"日本恒生ソフトウェア株式会社","address":"〒160-0023 新宿区西新宿3丁目2番地7号 KDX新宿ビル6階", "homepage":"http://www.hundsun.co.jp/", "type":"ses","coordinate":["35.686698","139.69381"]},
{"name":"株式会社インスパージャパン","address":"〒160-0023 東京都新宿区西新宿3-1-4　第二佐山ビル6F", "homepage":"http://jp.inspurworld.com/", "type":"ses","coordinate":["35.687297","139.694986"]},
{"name":"日本ワイドテクノロジーズ株式会社","address":"〒103-0023 東京都中央区日本橋本町2-3-6協同ビル202", "homepage":"http://www.nipponwide.com/", "type":"ses","coordinate":["35.687695","139.775632"]},
{"name":"株式会社 ワークボックス","address":"〒160-0022 東京都新宿区新宿1丁目12-15サンサーラ第四御苑302", "homepage":"http://www.wkbx.co.jp/", "type":"ses","coordinate":["35.68865","139.712898"]},
{"name":"サンビ株式会社","address":"〒103-0005 東京都中央区日本橋久松町13-4 トスパビル 8F", "homepage":"http://www.sunvy.co.jp/", "type":"ses","coordinate":["35.690532","139.784279"]},
{"name":"株式会社ヴィー•エス•シー•ジャパン","address":"〒103-0001 東京都中央区日本橋小伝馬町十二番二号　東屋ビル四階", "homepage":"http://www.vsc.co.jp", "type":"ses","coordinate":["35.69056","139.778887"]},
{"name":"誠和テクノロジー株式会社","address":"〒101-0032 東京都千代田区岩本町1-2-15 東京エムワイビル7Ｆ", "homepage":"http://swtech.jp/", "type":"ses","coordinate":["35.691647","139.776051"]},
{"name":"北海情報産業株式会社","address":"〒101-0032 東京都千代田区岩本町1-3-3　プロスパービル5F", "homepage":"http://www.e-northsea.com/", "type":"ses","coordinate":["35.69176","139.775392"]},
{"name":"株式会社アジアネット","address":"〒101-0032 東京都千代田区岩本町2-1-1福永ビル6F", "homepage":"http://www.asia-net.co.jp/", "type":"ses","coordinate":["35.691993","139.775102"]},
{"name":"中軟東京株式会社","address":"〒101-0047 東京都千代田区内神田1丁目14番6号福利久ビル6階", "homepage":"http://www.chinasoft-tokyo.co.jp/", "type":"ses","coordinate":["35.691995","139.765108"]},
{"name":"株式会社 日本凌佳システム","address":"〒160-0023 東京都新宿区西新宿6丁目17番10号西新宿プライムビル2階201室", "homepage":"http://www.ryouka-n.co.jp/", "type":"ses","coordinate":["35.692143","139.687249"]},
{"name":"株式会社 マルチテクノロジー","address":"〒103-0004 東京都中央区東日本橋2-8-5 東日本橋グリーンビルアネックス9F", "homepage":"http://www.multi-tech.co.jp/", "type":"ses","coordinate":["35.693511","139.785358"]},
{"name":"株式会社ソフトワイズ","address":"〒136-0071 東京都江東区亀戸1-28-6 タニビル2F", "homepage":"http://www.softwise.co.jp/", "type":"ses","coordinate":["35.694224","139.825538"]},
{"name":"ビスタシステムズ株式会社 ","address":"〒101-0032 東京都千代田区岩本町3-1-10　カネヒロビル 9F", "homepage":"http://www.vista-sys.com/", "type":"ses","coordinate":["35.694584","139.775771"]},
{"name":"株式会社ソフェスター","address":"〒101-0032 東京都千代田区岩本町3-1-10 カネヒロビル6階", "homepage":"http://www.sofestar.com", "type":"ses","coordinate":["35.694584","139.775771"]},
{"name":"株式会社 ディー・トレンド・ジャパン","address":"〒101-0032 東京都千代田区岩本町3-2-2キウチビル2Ｆ", "homepage":"http://www.dtrend-jpn.com/", "type":"ses","coordinate":["35.694895","139.775605"]},
{"name":"株式会社　日本ＬＺＴ","address":"〒101-0032 東京都千代田区岩本町3-2-2　キウチビル2F", "homepage":"http://www.lzt.co.jp/", "type":"ses","coordinate":["35.694895","139.775605"]},
{"name":"東京 FD 株式会社","address":"〒130-0026 東京都墨田区両国2-14-5　両国渡辺ビル　5F", "homepage":"http://www.firstdata-tokyo.com/", "type":"ses","coordinate":["35.695232","139.7916"]},
{"name":"株式会社　トレックス","address":"〒101-0031 東京都千代田区東神田2-10-14 日本センヂミアビル2階", "homepage":"https://www.trex-group.com/", "type":"ses","coordinate":["35.695566","139.781443"]},
{"name":"ニューエリート株式会社","address":"〒101-0032 東京都千代田区東神田2-6-2 タカラビル 8F", "homepage":"http://www.newelite.co.jp/", "type":"ses","coordinate":["35.695699","139.780165"]},
{"name":"エンコムウェア 株式会社","address":"〒101-0032 東京都千代田区岩本町3-9-17 スリーセブンビル7F", "homepage":"http://www.encomware.com/", "type":"ses","coordinate":["35.695739","139.77691"]},
{"name":"ディー・アール・テクノロジー株式会社","address":"〒101-0031 東京都千代田区東神田2-4-12　KVTビル2　3F", "homepage":"http://www.drtech.jp/", "type":"ses","coordinate":["35.696217","139.779845"]},
{"name":"株式会社 上海互恵JAPAN","address":"〒101-0026 東京都千代田区神田佐久間河岸91番地 リバーサイドトナカイビル202", "homepage":"http://www.gokeijapan.jp/", "type":"ses","coordinate":["35.697048","139.779724"]},
{"name":"株式会社　ホウヨク","address":"〒160-0023 東京都新宿区西新宿7-7-26ワコーレ新宿第一ビル608室", "homepage":"http://www.bbwit-jpn.com", "type":"ses","coordinate":["35.697421","139.697479"]},
{"name":"INGテクノロジー株式会社","address":"〒111-0053 東京都台東区浅草橋１丁目３６－９ユーゲンビル 302", "homepage":"http://www.ingtec.co.jp/", "type":"ses","coordinate":["35.698749","139.78348"]},
{"name":"日本獅龍株式会社","address":"〒101-0024 東京都千代田区神田和泉町1番地1-12 ミツバビル2階", "homepage":"http://www.japan-snow.com", "type":"ses","coordinate":["35.698951","139.77651"]},
{"name":"株式会社JCBC","address":"〒110-0016 東京都台東区台東1-7-2秋州ビル2F", "homepage":"http://jcbc.jp/", "type":"ses","coordinate":["35.700619","139.77669"]},
{"name":"日本光超株式会社","address":"〒110-0016 日本東京台東区台東1-33-6　セントオフィス秋葉原802", "homepage":"http://www.lightsuper.com/", "type":"ses","coordinate":["35.702299","139.777928"]},
{"name":"株式会社 アイディア","address":"〒110-0016 東京都台東区台東1-33-6セントオフィス秋葉原802", "homepage":"http://www.ideajp.com/", "type":"ses","coordinate":["35.702299","139.777928"]},
{"name":"東京現代株式会社","address":"〒112-0004 東京都文京区後楽1-1-5後楽園サイドビル8F", "homepage":"http://www.modern-jp.org/", "type":"ses","coordinate":["35.702647","139.75277"]},
{"name":"万国ソフト株式会社","address":"〒110-0016 東京都台東区台東2-10-2 竹田ビル３Ｆ", "homepage":"http://www.bkk-soft.com/", "type":"ses","coordinate":["35.703173","139.77682"]},
{"name":"株式会社三鋭システム","address":"〒101-0021 東京都千代田区外神田5-1-3 ニュー末広ビル6階", "homepage":"http://www.sanei-system.co.jp/", "type":"ses","coordinate":["35.703404","139.772097"]},
{"name":"株式会社アルマス","address":"〒101-0021 東京都千代田区外神田6-15-11日東ビル601号", "homepage":"http://www.almas.co.jp/", "type":"ses","coordinate":["35.704139","139.771558"]},
{"name":"方正株式会社","address":"〒112-0004 東京都文京区後楽2-3-19住友不動産飯田橋ビル4号館", "homepage":"https://www.founder.co.jp/", "type":"ses","coordinate":["35.704717","139.745284"]},
{"name":"株式会社　アイ･ティー･ビー","address":"〒113-0033 東京都文京区本郷3-14-15 美工本郷第二ビル4F", "homepage":"http://www.itb-g.com/", "type":"ses","coordinate":["35.705064","139.763022"]},
{"name":"株式会社テック・リンク","address":"〒113-0033 東京都文京区本郷2丁目19-7", "homepage":"http://www.techlink.co.jp/", "type":"ses","coordinate":["35.705146","139.758914"]},
{"name":"株式会社　エー・シー・ダブリュ","address":"〒164-0001 東京都中野区中野2-23-1 ニューグリーンビル409", "homepage":"http://www.acw.co.jp/", "type":"ses","coordinate":["35.705275","139.667511"]},
{"name":"センチュリーインフォテック株式会社","address":"〒110-0016 東京都台東区台東3丁目42番7号松田商事ビル5Ｆ", "homepage":"http://www.cit.co.jp/", "type":"ses","coordinate":["35.70564","139.77669"]},
{"name":"シードシステム株式会社","address":"〒110-0005 東京都台東区上野3-18-13今井ビル2F", "homepage":"http://www.seedsystem.co.jp/", "type":"ses","coordinate":["35.7058","139.773265"]},
{"name":"株式会社ケイ開発 ","address":"〒110-0005 東京都台東区上野3-17-4尾上貿易上野ビル6F、5F", "homepage":"http://www.keid.co.jp/", "type":"ses","coordinate":["35.705869","139.772407"]},
{"name":"ポピュラーソフト株式会社","address":"〒110-0005 東京都台東区上野1丁目11番9号イマスサニービル 3F", "homepage":"http://www.popular-soft.com/", "type":"ses","coordinate":["35.706256","139.771338"]},
{"name":"株式会社 ピー・エス・ビー","address":"〒110-0016 東京都台東区台東4-29-13 明和ビル 501", "homepage":"http://www.psb.co.jp/", "type":"ses","coordinate":["35.707098","139.778807"]},
{"name":"リアルシス株式会社 ","address":"〒110-0005 東京都台東区上野1-20-1 上野東相ビル4階", "homepage":"http://www.realsys.co.jp/", "type":"ses","coordinate":["35.70737","139.772416"]},
{"name":"株式会社ケネス","address":"〒110-0015 東京都台東区東上野1丁目11番1号 GOSHO春日通りビル7階", "homepage":"http://www.kenes.co.jp/", "type":"ses","coordinate":["35.70758","139.778487"]},
{"name":"日進テクノロジー株式会社","address":"〒110-0015 東京都台東区東上野1丁目1番8号　竹内ビル３階", "homepage":"http://www.nissin-tech.co.jp/", "type":"ses","coordinate":["35.70782","139.781683"]},
{"name":"株式会社錦松テクノロジー","address":"〒272-0015 千葉県市川市鬼高3丁目13番2号 マンションニュー中山327号", "homepage":"http://www.kstkk.co.jp", "type":"ses","coordinate":["35.710604","139.937851"]},
{"name":"ｅ２１(イーニジュウイチ)ジャパンシステム株式会社","address":"〒110-0015 東京都台東区東上野四丁目1番8号 501室", "homepage":"http://www.e21japan.com/", "type":"ses","coordinate":["35.710702","139.780948"]},
{"name":"株式会社 ファステクノロジー","address":"〒110-0015 東京都台東区東上野3丁目33番8号 渡井ビル5F", "homepage":"http://www.phastec.com", "type":"ses","coordinate":["35.711182","139.782172"]},
{"name":"天龍システム株式会社","address":"〒169-0075 東京都新宿区高田馬場4-29-31 新宿ビル6F", "homepage":"http://www.tenryu-sys.co.jp/", "type":"ses","coordinate":["35.711968","139.698855"]},
{"name":"ＴＳＲソリューションズ株式会社","address":"〒169-0075 東京都新宿区高田馬場三丁目23番3号 ORビル4階", "homepage":"http://www.tsrs.co.jp/", "type":"ses","coordinate":["35.712863","139.706654"]},
{"name":"長城コンサルティング株式会社","address":"〒113-0033 東京都文京区本郷6-26-1 トーカンキャステール本郷201号室", "homepage":"http://www.chojo.co.jp/", "type":"ses","coordinate":["35.714933","139.758639"]},
{"name":"AB情報システム株式会社","address":"〒111-0032 東京都台東区浅草2-19-7浅草永谷ビル 304A", "homepage":"http://www.ab-is.com/", "type":"ses","coordinate":["35.717015","139.793128"]},
{"name":"ブルームシステムズ株式会社","address":"〒187-0011 東京都小平市鈴木町二丁目195番地の23", "homepage":"http://www.bloomsystems.com/", "type":"ses","coordinate":["35.724418","139.506823"]},
{"name":"ヒトツウ商事株式会社","address":"〒170-0005 東京都豊島区南大塚2-40-1 大塚中央ビル206", "homepage":"http://www.hitotsu-cs.com/", "type":"ses","coordinate":["35.729586","139.730216"]},
{"name":"株式会社ゼニス","address":"〒170-0004 東京都豊島区北大塚1-13-4 オーク大塚ビル2F", "homepage":"http://www.zenith-j.com/", "type":"ses","coordinate":["35.731743","139.731723"]},
{"name":"株式会社名川ネットワーク","address":"〒170-0013 東京都豊島区東池袋3丁目9番12号　ニットービル8F", "homepage":"http://www.meisenjp.com/", "type":"ses","coordinate":["35.732506","139.718195"]},
{"name":"株式会社ユーシーアイ(聯創国際)","address":"〒170-0013 東京都豊島区東池袋3-9-9 明昌MGビル5Ｆ", "homepage":"http://www.ucinet.co.jp", "type":"ses","coordinate":["35.732719","139.717766"]},
{"name":"株式会社　ゴールデンソフト","address":"〒170-0013 東京都豊島区東池袋1丁目46番13号 ホリグチビル702号", "homepage":"http://www.goldensoft.co.jp/", "type":"ses","coordinate":["35.733549","139.715372"]},
{"name":"JCTop 株式会社","address":"〒170-0013 東京都豊島区東池袋1-48-10　25山京ビル　616号", "homepage":"http://www.jctop.biz/", "type":"ses","coordinate":["35.734077","139.715751"]},
{"name":"日本信和株式会社","address":"〒120-0006 東京都足立区谷中４丁目４−１５", "homepage":"http://www.sinwa-jp.com/", "type":"ses","coordinate":["35.781453","139.830768"]},
{"name":"株式会社 穎光社","address":"〒332-0023 埼玉県川口市飯塚1-3-26-202", "homepage":"http://www.eicosha.com/", "type":"ses","coordinate":["35.800236","139.715319"]},
{"name":"鶴祥システム 株式会社","address":"〒332-0021 埼玉県川口市西川口1-12-16 サイシンビル3階", "homepage":"http://www.trss.co.jp/", "type":"ses","coordinate":["35.816684","139.702874"]},
{"name":"株式会社キューウェブ","address":"〒362-0022 埼玉県上尾市瓦葺1394-1　シャンポワール東大宮301", "homepage":"http://qweb.co.jp/", "type":"ses","coordinate":["35.957923","139.637757"]},
{"name":"GEL研究所 株式会社","address":"〒210-0002 神奈川県川崎市川崎区榎木町1-8川崎ニッコービル 403", "homepage":"http://www.gel-lib.com/", "type":"ses","coordinate":["35.5297988","139.7056369"]},
{"name":"ウィングステック有限会社","address":"〒111-0055 東京都台東区三筋 1-6-5 吉川ビル302", "homepage":"http://wingstec.co.jp/", "type":"ses","coordinate":["35.7035053","139.7855763"]},
{"name":"エーブリッジ株式会社","address":"〒110-0016 東京都台東区台東1-1-16YSTビル3F", "homepage":"http://www.abridgecom.co.jp/", "type":"ses","coordinate":["35.7004055","139.7804239"]},
{"name":"グリッド・リサーチ株式会社","address":"〒103-0015 東京都中央区日本橋箱崎町18-11 COSMO8ビル 6階", "homepage":"http://www.grids.co.jp/", "type":"ses","coordinate":["35.6801637","139.7852881"]},
{"name":"サン・ベスト株式会社","address":"〒135-0022 東京都江東区三好1-8-3 越前屋ビル3F", "homepage":"http://www.3-best.jp/", "type":"ses","coordinate":["35.680369","139.799237"]},
{"name":"ニューコン株式会社","address":"〒116-0014 東京都荒川区東日暮里5丁目41番12号 日暮里コミュニティビル", "homepage":"http://www.newcon.co.jp/", "type":"ses","coordinate":["35.726805","139.774115"]},
{"name":"ネットプラウア株式会社","address":"〒104-0032 東京都中央区八丁堀4丁目12-20 第1 SS ビル9階D号室", "homepage":"http://www.netplower.co.jp/", "type":"ses","coordinate":["35.674","139.778822"]},
{"name":"ベース株式会社","address":"〒101-0021 東京都千代田区外神田4-14-1 秋葉原UDX8階", "homepage":"http://www.basenet.co.jp/", "type":"ses","coordinate":["35.700311","139.772502"]},
{"name":"日本新思ソフト株式会社","address":"〒103-0025 東京都中央区日本橋茅場町2－9－8友泉茅場町ビル7F", "homepage":"http://www.bis.com.cn/", "type":"ses","coordinate":["35.67873","139.778925"]},
{"name":"株式会社AOBO","address":"〒220-0055 横浜市西区浜松町7-24西青木ビル302室", "homepage":"http://www.aobo-corp.com/", "type":"ses","coordinate":["35.452857","139.612689"]},
{"name":"株式会社eビジネスソリューション","address":"〒135-0034 東京都江東区塩浜2-13-11 EBSビル", "homepage":"http://www.ebskk.com/", "type":"ses","coordinate":["35.663144","139.809925"]},
{"name":"株式会社アイ・プライド","address":"〒104-0041 東京都中央区新富2丁目4番4号　ソーエイビル8F", "homepage":"https://www.ipride.co.jp", "type":"ses","coordinate":["35.671589","139.773356"]},
{"name":"株式会社サニーアン","address":"〒108-0023 東京都港区芝五丁目32-10壁谷ビル３階", "homepage":"http://www.sunyan.co.jp/", "type":"ses","coordinate":["35.647325","139.747689"]},
{"name":"株式会社ベリルック・ドット・コム","address":"〒104-0041 東京都中央区新富1-15-11 マキプラザビル403号室", "homepage":"http://www.verylook.com/", "type":"ses","coordinate":["35.672378","139.775031"]},
{"name":"株式会社北京大学天公システム","address":"〒101-0037 東京都千代田区神田西福田町4番地メディックスビル4階", "homepage":"http://www.jadebird.co.jp/", "type":"ses","coordinate":["35.691301","139.77438"]}];

var owner = "55ee510b7e4cf649089bdc56";
var createDate = "2017-04-01T10:26:36.034Z";

data.forEach(function(obj) {
  obj.owner = owner;
  obj.createDate = createDate;
  Company.create(obj, function(err) {
    console.log("over");
  });
  // setTimeout(function(){
  //   request("https://maps.googleapis.com/maps/api/geocode/json?address=" + obj.address, {timeout: 10000, pool: false, json: 'body'}, function(err, msg, body) {
  //     console.log(body)
  //
  //   });
  // }, count * 2000);

});
