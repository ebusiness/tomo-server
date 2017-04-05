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

var siList = [];
var endList = [];
var groupList = [];

[{project:{name:"明治安田生命保険相互会社様向け システム開発支援業務(事務フロント基盤公開 )",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命保険相互会社様向け システム開発支援業務(営業フロント 基盤公開)",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命（営業フロントHOST）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命保険相互会社様向け(営業フロント) システム開発支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命保険相互会社様向け(営業フロント申し込み) システム開発支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命保険相互会社様向け(保守) システム開発支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命保険相互会社様向け(企業保険) システム開発支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命保険相互会社様向け(法人フロント) システム開発支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命（刷新システム）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命資産運用（有価証券）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"明治安田生命資産運用（特別勘定）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"明治安田生命保険相互会社",address:"〒100-0005 東京都千代田区丸の内2-1-1",station:"東京",latitude:"35.6778558197085",longitude:"139.760937719708"}},{project:{name:"日銀ネット開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"日本銀行",address:"〒103-8660 東京都中央区日本橋本石町2-1-1",station:"三越前",latitude:"35.6882252802915",longitude:"139.772690480291"}},{project:{name:"401K案件",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"NRK",address:"",station:"",latitude:"",longitude:""}},{project:{name:"ジブラルタ生命向けシステム開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"ジブラルタ生命",address:"〒100-8953 東京都千代田区永田町2-13-10",station:"赤坂見附",latitude:"35.6743777197085",longitude:"139.737389619708"}},{project:{name:"営業店",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"三菱UFJ銀行",address:"東京都千代田区丸の内二丁目7番1号",station:"東京",latitude:"35.6800371802915",longitude:"139.765538380291"}},{project:{name:"円ガストディ",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"三菱UFJ銀行",address:"東京都千代田区丸の内二丁目7番1号",station:"東京",latitude:"35.6800371802915",longitude:"139.765538380291"}},{project:{name:"ACS-スマホ決済　開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"イオン",address:"",station:"",latitude:"",longitude:""}},{project:{name:"信託銀行の債券レポシステムの再構築",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"みずほ信託銀行",address:"〒103-8670 東京都中央区八重洲1丁目2番1号",station:"日本橋",latitude:"35.6754515",longitude:"139.7658238"}},{project:{name:"楽天生命一括案件",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"楽天生命",address:"東京都世田谷区玉川1-14-1（楽天クリムゾンハウス）",station:"二子玉川",latitude:"35.6092030197085",longitude:"139.628740919708"}},{project:{name:"第一生命向け個人保険ワークフロー(.NET) システム保守開発支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"第一生命",address:"〒100-8411　東京都千代田区有楽町1-13-1",station:"有楽町",latitude:"35.6744964197085",longitude:"139.759445319708"}},{project:{name:"第一生命（タブレット開発　JAVA）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社DTS",address:"〒105-0004　東京都港区新橋6-19-13",station:"御成門",latitude:"35.6593799197085",longitude:"139.752611019708",homepage:"http://www.dts.co.jp/"},end:{name:"第一生命",address:"〒100-8411　東京都千代田区有楽町1-13-1",station:"有楽町",latitude:"35.6744964197085",longitude:"139.759445319708"}},{project:{name:"次期ファイナンスシステム構築作業における請負契約　",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社Minoriソリューションズ",address:"〒163-0817　東京都新宿区西新宿二丁目4番1号　新宿NSビル17F",station:"新宿",latitude:"35.6894390302915",longitude:"139.694795080291",homepage:"http://minori-sol.jp/"},end:{name:"三井住友",address:"東京都千代田区丸の内一丁目1番2号",station:"大手町",latitude:"35.6863335802915",longitude:"139.763771680291"}},{project:{name:"延滞管理システム保守対応に関する請負契約　",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社Minoriソリューションズ",address:"〒163-0817　東京都新宿区西新宿二丁目4番1号　新宿NSビル18F",station:"新宿",latitude:"35.6894390302915",longitude:"139.694795080291",homepage:"http://minori-sol.jp/"},end:{name:"三井住友",address:"東京都千代田区丸の内一丁目1番2号",station:"大手町",latitude:"35.6863335802915",longitude:"139.763771680291"}},{project:{name:"アプラス社向け情報系システムに関する請負契約",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社Minoriソリューションズ",address:"〒163-0817　東京都新宿区西新宿二丁目4番1号　新宿NSビル19F",station:"新宿",latitude:"35.6894390302915",longitude:"139.694795080291",homepage:"http://minori-sol.jp/"},end:{name:"三井住友",address:"東京都千代田区丸の内一丁目1番2号",station:"大手町",latitude:"35.6863335802915",longitude:"139.763771680291"}},{project:{name:"SMBCFS統合契約精算システム保守契約に関する請負契約（王）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社Minoriソリューションズ",address:"〒163-0817　東京都新宿区西新宿二丁目4番1号　新宿NSビル20F",station:"新宿",latitude:"35.6894390302915",longitude:"139.694795080291",homepage:"http://minori-sol.jp/"},end:{name:"三井住友",address:"東京都千代田区丸の内一丁目1番2号",station:"大手町",latitude:"35.6863335802915",longitude:"139.763771680291"}},{project:{name:"東京電力様向け託送システム開発",address:"",station:"",latitude:"",longitude:""},si:{name:"スミセイ情報システム株式会社",address:"〒160-0023 東京都新宿区西新宿6-14-1 新宿グリーンタワービル",station:"西新宿",latitude:"35.6937046802915",longitude:"139.690974430291",homepage:"http://www.slcs.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"Maｎulife",address:"",station:"",latitude:"",longitude:""},si:{name:"MBPジャパン",address:"〒140-0013 東京都品川区南大井六丁目22番7号 大森ベルポートE館12階",station:"大森",latitude:"35.5905957802914",longitude:"139.733524130291",homepage:"http://www.mbpsoft.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"GNS開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"年金",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"勘定系/外国為替システム開発",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"次期システム3-2推進PT支援",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"生命保険会社向け保険金・給付金支払システム構築　　　",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"証券会社向けESTREX導入開発　",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"銀行システムに関わる業パ・開発・保守",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"生命保険システム支援",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"新生産フォロー",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"港運VB案件",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"東西統合通信案件",address:"",station:"",latitude:"",longitude:""},si:{name:"アイエックス・ナレッジ株式会社",address:"〒108-0022 東京都港区海岸3-22-23 MSCセンタービル",station:"芝浦ふ頭",latitude:"35.6427151802915",longitude:"139.758481230291",homepage:"https://www.ikic.co.jp/index.html"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"android開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社電通国際情報サービス",address:"〒108-0075 東京都港区港南2-17-1",station:"品川",latitude:"35.6262317802915",longitude:"139.740703280291",homepage:"https://www.isid.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"i*Standard保守作業",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社電通国際情報サービス",address:"〒108-0075 東京都港区港南2-17-1",station:"品川",latitude:"35.6262317802915",longitude:"139.740703280291",homepage:"https://www.isid.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"パイソン開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社電通国際情報サービス",address:"〒108-0075 東京都港区港南2-17-1",station:"品川",latitude:"35.6262317802915",longitude:"139.740703280291",homepage:"https://www.isid.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"Minds/Afit 殿町DC移転",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社電通国際情報サービス",address:"〒108-0075 東京都港区港南2-17-1",station:"品川",latitude:"35.6262317802915",longitude:"139.740703280291",homepage:"https://www.isid.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"フロントエンド開発",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社電通国際情報サービス",address:"〒108-0075 東京都港区港南2-17-1",station:"品川",latitude:"35.6262317802915",longitude:"139.740703280291",homepage:"https://www.isid.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"バックエンド開発",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社電通国際情報サービス",address:"〒108-0075 東京都港区港南2-17-1",station:"品川",latitude:"35.6262317802915",longitude:"139.740703280291",homepage:"https://www.isid.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"かんぽ生命殿向け支払業務システム",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社東邦システムサイエンス",address:"〒112-0002 東京都文京区小石川1-12-14　日本生命小石川ビル5F",station:"春日",latitude:"35.7136822302915",longitude:"139.753379930291",homepage:"http://www.tss.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"コープ共済",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社東邦システムサイエンス",address:"〒112-0002 東京都文京区小石川1-12-14　日本生命小石川ビル6F",station:"春日",latitude:"35.7136822302915",longitude:"139.753379930291",homepage:"http://www.tss.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"シンプレクス証券デリバティブ取引システム",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社東邦システムサイエンス",address:"〒112-0002 東京都文京区小石川1-12-14　日本生命小石川ビル7F",station:"春日",latitude:"35.7136822302915",longitude:"139.753379930291",homepage:"http://www.tss.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"カード会社システム統合に伴う不正検知・構築作業",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社東邦システムサイエンス",address:"〒112-0002 東京都文京区小石川1-12-14　日本生命小石川ビル8F",station:"春日",latitude:"35.7136822302915",longitude:"139.753379930291",homepage:"http://www.tss.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"倉庫管理WMS",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社エフケイ·ジャパン",address:"〒221-0045 横浜市神奈川区神奈川 2-18-16 京浜興産コヤマビル4F",station:"東神奈川",latitude:"35.4767604802914",longitude:"139.636015430291",homepage:"http://www.fk-j.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"情報システムに関する技術支援業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社イーティーアイ",address:"〒110-0016　東京都台東区台東4-17-1　偕楽ビル新台東4F ",station:"新御徒町",latitude:"35.7077984302915",longitude:"139.781090080291",homepage:"http://www.eti-g.co.jp/profile.htm"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"BSシステムFI/AA保守開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"TIS株式会社",address:"〒160-0023 東京都新宿区西新宿8丁目17番1号",station:"西新宿",latitude:"35.6973800802915",longitude:"139.691871980291",homepage:"https://www.tis.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"生命保険システムパッケージの保守開発",address:"",station:"",latitude:"",longitude:""},si:{name:"TIS株式会社",address:"〒160-0023 東京都新宿区西新宿8丁目17番1号",station:"西新宿",latitude:"35.6973800802915",longitude:"139.691871980291",homepage:"https://www.tis.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"POJ生命保険",address:"",station:"",latitude:"",longitude:""},si:{name:"TIS株式会社",address:"〒160-0023 東京都新宿区西新宿8丁目17番1号",station:"西新宿",latitude:"35.6973800802915",longitude:"139.691871980291",homepage:"https://www.tis.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"人材派遣",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社クレスコ",address:"〒108-6026 東京都港区港南2-15-1 品川インターシティA棟",station:"品川",latitude:"35.6289461802914",longitude:"139.743320180291",homepage:"https://www.cresco.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"Ntt docomo の社内管理システム",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社ミライト",address:"〒135-0061 東京都江東区豊洲五丁目6番36号",station:"豊洲",latitude:"35.6534656802915",longitude:"139.799353280291",homepage:"http://www.mrt.mirait.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"JICA海外融資事業システム更改(次期)",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"JICA",address:"〒102-8012 東京都千代田区二番町5-25　二番町センタービル　1階から6階",station:"麹町",latitude:"35.6844011197085",longitude:"139.734547319708"}},{project:{name:"ゆうちょJC開発　2017年1月及び5月案件及び付帯作業",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"日本郵政",address:"〒100-8798 東京都千代田区霞が関一丁目3番2号",station:"虎ノ門",latitude:"35.6699925197085",longitude:"139.749449919708"}},{project:{name:"SMCC殿向け次期クレジットシステム再構築に係る業務",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"三井住友銀行",address:"東京都千代田区丸の内一丁目1番2号",station:"大手町",latitude:"35.6863335802915",longitude:"139.763771680291"}},{project:{name:"未来革新",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"損保JAPAN",address:"〒160-8338 東京都新宿区西新宿1-26-1",station:"新宿",latitude:"35.6979653",longitude:"139.7001583"}},{project:{name:"金融庁向け報告用データの計算数出処理構築",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"みずほ銀行",address:"〒100–8176 東京都千代田区大手町1–5–5（大手町タワー）",station:"大手町",latitude:"35.6842606197085",longitude:"139.764229019708"}},{project:{name:"銀行システム勘定系",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"郵貯銀行",address:"",station:"",latitude:"",longitude:""}},{project:{name:"統合情報システム",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"ミドリ銀行",address:"",station:"",latitude:"",longitude:""}},{project:{name:"証券マスター管理",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"証券保険振替機構",address:"〒103-0025　東京都中央区日本橋茅場町二丁目1番1号",station:"茅場町",latitude:"35.6813152802915",longitude:"139.779545880291"}},{project:{name:"JASTEMシステムの開発案件に関する開発作業",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"明治安田損保",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"UCカード",address:"",station:"",latitude:"",longitude:""},si:{name:"TDCソフトウェアエンジニアリング株式会社",address:"〒151-0053 東京都渋谷区代々木3-22-7 新宿文化クイントビル",station:"新宿",latitude:"35.6875519802915",longitude:"139.696155780291",homepage:"https://www.tdc.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"みずほ担保オンラインプロジェクト設計・開発",address:"",station:"",latitude:"",longitude:""},si:{name:"セントラル技研",address:"〒141-0022 東京都品川区東五反田1丁目25番地13号",station:"五反田",latitude:"35.6271257802914",longitude:"139.729573580291",homepage:"http://www.cgk.co.jp/"},end:{name:"みずほ銀行",address:"",station:"",latitude:"",longitude:""}},{project:{name:"リクルートじゃらん支援",address:"",station:"",latitude:"",longitude:""},si:{name:"エヌシーアイ総合システム株式会社",address:"〒164-0011　東京都中野区中央1丁目38番1号住友中野坂上ビル12階",station:"中野坂上",latitude:"35.6986368802915",longitude:"139.684887930291",homepage:"http://www.nci.co.jp/"},end:{name:"リクルート",address:"",station:"",latitude:"",longitude:""}},{project:{name:"修理支援業務改善（RSR）詳細仕様対応",address:"",station:"",latitude:"",longitude:""},si:{name:"ネオクリエイト株式会社",address:"〒460-0002 名古屋市中区丸の内3丁目16番19号 丸の内ニューネットビル4階",station:"栄町",latitude:"35.1760837302915",longitude:"136.906168480291",homepage:"http://neocreate-corp.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"赤カード",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"赤カード",address:"",station:"",latitude:"",longitude:""}},{project:{name:"テスト作業",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"三菱UFJ銀行",address:"東京都千代田区丸の内二丁目7番1号",station:"東京",latitude:"35.6800371802915",longitude:"139.765538380291"}},{project:{name:"開発案件",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"ローソン銀行",address:"",station:"",latitude:"",longitude:""}},{project:{name:"Java開発・証券業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"円カストディ",address:"",station:"",latitude:"",longitude:""}},{project:{name:"DataStage案件（SQL）府中",address:"",station:"府中",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"三井住友銀行",address:"",station:"",latitude:"",longitude:""}},{project:{name:"H28/9末 拠点業績対応",address:"埼玉県さいたま市浦和区針ヶ谷 4-2-20",station:"与野",latitude:"35.8804453802915",longitude:"139.641755980291"},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"日本生命",address:"〒541-8501 大阪府大阪市中央区今橋3-5-12",station:"淀屋橋",latitude:"34.6922953802915",longitude:"135.502830880291"}},{project:{name:"営人給与関連システムの保守業務",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"第一生命",address:"〒100-8411　東京都千代田区有楽町1-13-1",station:"豊洲",latitude:"35.6771943802915",longitude:"139.762143280291"}},{project:{name:"日立受け　戦略（中期）自火　CDPT",address:"東京都東久留米市南沢４丁目９−２３",station:"ひばりヶ丘",latitude:"35.7478506802914",longitude:"139.528180480291"},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"損保ジャパン",address:"",station:"",latitude:"",longitude:""}},{project:{name:"未来革新",address:"",station:"中野",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"損保ジャパン",address:"",station:"",latitude:"",longitude:""}},{project:{name:"VB.net開発",address:"東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291"},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"富国生命",address:"〒100-0011 東京都千代田区内幸町2-2-2",station:"内幸町",latitude:"35.6717459802915",longitude:"139.755694980291"}},{project:{name:"ＤＦＬ新商品開発対応（１６＿２Ｑ）",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"生保会社",address:"",station:"",latitude:"",longitude:""}},{project:{name:"東京海上損害保険　 新契約業務 vb6.0からvb.netコンバージョン",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"Dreamweaver",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"MS＆AD　損害保険",address:"",station:"高田馬場",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"MS＆AD",address:"〒104-0033 東京都中央区新川2丁目27番2号 東京住友ツインビルディング西館",station:"八丁堀",latitude:"35.6755494802915",longitude:"139.785673380291"}},{project:{name:"代理店・新契約",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"あいおい生命保険",address:"東京都中央区新川2-27-2",station:"八丁堀",latitude:"35.6728515197085",longitude:"139.782975419708"}},{project:{name:"大和証券開発",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"SEIBI詳細設計支援",address:"",station:"千石",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"ＭＨＩＲ",address:"〒101-8443 東京都千代田区神田錦町2-3",station:"新御茶ノ水",latitude:"35.6938229802915",longitude:"139.763966980291"}},{project:{name:"YSDフィナンシャル新基幹開発支援",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"ＹＳＤ",address:"",station:"",latitude:"",longitude:""}},{project:{name:"deskリニューアル案件 Phase1",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"ANA",address:"",station:"",latitude:"",longitude:""}},{project:{name:"Kailasシステム構築_要件定義フェーズ",address:"",station:"勝どき",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"JI",address:"東京都中央区晴海１-８-１０ 晴海アイランド トリトンスクエア オフィスタワーＸ １６階",station:"月島",latitude:"35.6550838197085",longitude:"139.780812219708"}},{project:{name:"日本アクセス",address:"東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291"},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"CTC",address:"",station:"",latitude:"",longitude:""}},{project:{name:"宝くじ案件",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"NTT DATA",address:"〒135-6033 東京都江東区豊洲3-3-3　豊洲センタービル",station:"豊洲",latitude:"35.6573009802915",longitude:"139.797536980291"}},{project:{name:"年金案件",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"7&i増員",address:"",station:"麹町",
latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"7&i",address:"〒102-8452　東京都千代田区二番町8番地8",station:"麹町",latitude:"35.6872409802915",longitude:"139.735442980291"}},{project:{name:"",address:"",station:"",latitude:"",longitude:""},si:{name:"株式会社NSD",address:"〒101-0063　東京都千代田区神田淡路町2-101　ワテラスタワー",station:"新御茶ノ水",latitude:"35.6990146802915",longitude:"139.768926480291",homepage:"http://www.nsd.co.jp/"},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"名古屋システム開発",address:"",station:"",latitude:"",longitude:""},si:{name:"ネオクリエイト株式会社",address:"",station:"",latitude:"",longitude:"",homepage:""},end:{name:"",address:"",station:"",latitude:"",longitude:""}},{project:{name:"ロジスター案件",address:"",station:"中目黒",latitude:"",longitude:""},si:{name:"",address:"",station:"",latitude:"",longitude:"",homepage:""},end:{name:"株式会社パスコ",address:"〒153-0043東京都目黒区東山1-1-2 東山ビル",station:"中目黒",latitude:"35.6497439802915",longitude:"139.693750980291"}},{project:{name:"windchill開発",address:"",station:"住吉",latitude:"",longitude:""},si:{name:"",address:"",station:"",latitude:"",longitude:"",homepage:""},end:{name:"株式会社LIXIL",address:"〒136-8535 東京都江東区大島2-1-1",station:"住吉",latitude:"35.6883348197084",longitude:"139.820068019708"}}]
.forEach(function(a){

  addIfNeeded(siList, a.si, "si", a.project);
  addIfNeeded(endList, a.end, "end", a.project);
  fixGroupIfNeeded(a);
});

console.log(siList.length);
console.log(endList.length);
console.log(groupList.length);


makeData();
function makeData() {
  async.parallel({
    si: function (callback) {
      Company.create(siList, callback);
    },
    end: function (callback) {
      Company.create(endList, callback);
    }

  }, function(err, result) {
    // console.log(err);
    // console.log(result);
    groupList.forEach(function(group){
      var relationCompanies = [];
      result.si.forEach(function(si){
        if (si.name == group.siname) {
          group.companies.si.push(si._id);
          relationCompanies.push(si);
        }
      });
      result.end.forEach(function(end){
        if (end.name == group.endname) {
          group.companies.end.push(end._id);
          relationCompanies.push(end);
        }
      });
      console.log("si" + group.companies.si.length);
      console.log("end" + group.companies.end.length);

      // var groups = [];
      // for(var i = 0; i < 1000; i++ ) {
      //   groups.push(group);
      // }
      Group.create(group, function(err, result) {
        relationCompanies.forEach(function(company){
          if(!company.groups) {company.groups = [];}
          company.groups.addToSet(result._id);
          company.save();
        });
        console.log("over");
      });
    });
  });
}

function addIfNeeded(list, company, type, project) {
  if (company.name == "") {
    return;
  }
  var isNeeded = true;
  list.forEach(function(obj){
    if(obj.name == company.name) {
      isNeeded = false;
    }
  })
  if (!isNeeded) {
    return;
  }
  if (company.latitude == "" && company.longitude == "") {
    company.latitude = project.latitude;
    company.longitude = project.longitude;
    company.address = project.address;
  }

  if (company.latitude == "" && company.longitude == "") {
    company.latitude = 0.0;
    company.longitude = 0.0;
  }
  company.coordinate = [company.latitude, company.longitude];
  delete company.latitude;
  delete company.longitude;
  company.owner = owner;
  company.createDate = createDate;
  company.type = type;
  if (!company.homepage) {
    company.homepage = "http:///"
  }

  list.push(company);
}

function fixGroupIfNeeded(a) {
  if (a.project.latitude == "" && a.project.longitude == "") {
    a.project.latitude = a.si.latitude;
    a.project.longitude = a.si.longitude;
    a.project.address = a.si.address;
  }
  if (a.project.latitude == "" && a.project.longitude == "") {
    a.project.latitude = a.end.latitude;
    a.project.longitude = a.end.longitude;
    a.project.address = a.end.address;
  }
  if (a.project.latitude && a.project.longitude) {
    a.project.coordinate = [a.project.latitude, a.project.longitude];
  }
  delete a.project.latitude;
  delete a.project.longitude;
  a.project.owner = owner;
  a.project.createDate = createDate;

  a.project.companies = {si:[], end:[]};
  a.project.siname = a.si.name;
  a.project.endname = a.end.name;
  groupList.push(a.project);
}



// function getEndUser() {
//   return [{"address":"","name":"みずほ銀行","coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"株式会社ランドコンピュータ","coordinate":["35.64044","139.748067"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"電通","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"CROWDGATE","coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"NCI","coordinate":["35.67358","139.781646"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"あいおい損保","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"G生命保険","coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"東電","coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"ANA","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"明治安田生命","coordinate":["35.666605","139.815657"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"三井住友海上火災保険","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"ユーキャン","coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"}];
// }
//
// function getSI() {
//   return [{"address":"","name":"株式会社　エスプロシステム","coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社ランドコンピュータ","coordinate":["35.64044","139.748067"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社　電通国際情報サービス","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社ティファナ·ドットコム","coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"エヌシーアイ総合システム株式会社","coordinate":["35.67358","139.781646"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社東邦システムサイエンス","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"アイエックス·ナレッジ株式会社","coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"ファーストレイン·テクノロジー株式会社","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社クラウドアンドデータサービス","coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社ＮＳＤ","coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社 Navi J&C","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社システムイオ","coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社　DTS","coordinate":["35.666605","139.815657"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社Minoriソリューションズ","coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社サイバネット","coordinate":["35.694835","139.696038"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"}];
// }
//
// function getGroup() {
//   return [{"address":"","name":"みずほ銀行向け業務の開発支援①","relation":["株式会社　エスプロシステム","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ銀行向け業務の開発支援②","relation":["株式会社　エスプロシステム","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"Salesforce技術支援","relation":["株式会社ランドコンピュータ","株式会社ランドコンピュータ"],"coordinate":["35.64044","139.748067"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"i*Standard保守作業","relation":["株式会社　電通国際情報サービス","電通"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"クラウドゲートシステム開発費用","relation":["株式会社ティファナ·ドットコム","CROWDGATE"],"coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"リクルートじゃらん支援","relation":["エヌシーアイ総合システム株式会社","NCI"],"coordinate":["35.67358","139.781646"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"あいおいニッセイ同和損害保険","relation":["株式会社東邦システムサイエンス","あいおい損保"],"coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"G生命向け保険金・給付金支払システム構築","relation":["アイエックス·ナレッジ株式会社","G生命保険"],"coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"システム開発作業","relation":["ファーストレイン·テクノロジー株式会社","電通"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"ローン再構築STEPS代替対応","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"FINEMAX　FFGh品質向上","relation":["株式会社クラウドアンドデータサービス","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"東京電力　託送検針機能開発に関するるSES支援（H27-01）","relation":["株式会社ＮＳＤ","東電"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期シス基本設計","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ銀行海外系システム整備基本設計支援","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期シス基本設計支援","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.549985","139.674098"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"システム開発支援","relation":["株式会社 Navi J&C"],"coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほＢＫ勘定系／外国為替システム開発","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ次期システム3－2推進ＰＴ支援","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"ＡＮＡ様向けＰＯＳＩＴＩＶＥ導入（給与領域）","relation":["株式会社　電通国際情報サービス","ANA"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ銀行向け次期システム・市場系","relation":["株式会社東邦システムサイエンス","みずほ銀行"],"coordinate":["35.617046","139.779922"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"アジア仕様変更対応","relation":["株式会社クラウドアンドデータサービス","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期シス詳細設計（外為）","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"MHIR稟協","relation":["株式会社システムイオ"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"明治安田生命保険相互会社様向けシステム開発・保守作業支援","relation":["株式会社　DTS","明治安田生命"],"coordinate":["35.666605","139.815657"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"GOB一元化（IT1）移行開発及びIT1実施","relation":["株式会社　電通国際情報サービス"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"三井住友海上火災保険","relation":["株式会社東邦システムサイエンス","三井住友海上火災保険"],"coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"3月のシステム開発","relation":["株式会社ティファナ·ドットコム","CROWDGATE"],"coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"東京電力　託送検機能開発に関するるSES支援（H27-01）","relation":["株式会社ＮＳＤ","東電"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"生命保険会社向け・給付金支払システム構築","relation":["アイエックス·ナレッジ株式会社","G生命保険"],"coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期システム３－2推進PT支援","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"東京電力　託送検針機能開発に関するるSES支援（H26-01）","relation":["株式会社ＮＳＤ","東電"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"ユーキャン様システム再構築開発支援","relation":["株式会社　DTS","ユーキャン"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ海外整備プロジェクト開発支援","relation":["株式会社Minoriソリューションズ","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"わが街統合型ＧＩＳ　ソース改善対応","relation":["株式会社サイバネット"],"coordinate":["35.694835","139.696038"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほＦＧ　統合ＤＢ整備","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.617046","139.779922"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"}];
// }
//
//
// async.parallel({
//
//   si: function (callback) {
//     var list = getSI();
//
//     Company.create(list, function(err) {
//       console.log(err);
//       var result = [];
//       for (var i=1; i<arguments.length; ++i) {
//         var obj = arguments[i];
//         result.push(obj);
//         console.log(obj);
//         // do some stuff with candy
//       }
//       callback(null, result);
//     });
//   },
//   end: function (callback) {
//     var list = getEndUser();
//
//     Company.create(list, function(err) {
//       console.log(err);
//       var result = [];
//       for (var i=1; i<arguments.length; ++i) {
//         var obj = arguments[i];
//         result.push(obj);
//         console.log(obj);
//         // do some stuff with candy
//       }
//       callback(null, result);
//     });
//   }
//
// }, function(err, result) {
//   if (err) console.log("" + err);
// });
//
//
// async.waterfall([
//   function createEnd(callback) {
//
//   },
//
//   function createSI(companies, callback) {
//     var list = getSI();
//     list.forEach(function() {
//
//     });
//
//     Company.create(list, function(err) {
//       console.log(err);
//       var result = [];
//       for (var i=1; i<arguments.length; ++i) {
//         var obj = arguments[i];
//         result.push(obj);
//         console.log(obj);
//         // do some stuff with candy
//       }
//       callback(null, result);
//     });
//   },
//
//   function createRelateInfo(company, callback) {
//     callback(null, company);
//
//     async.parallel({
//
//       activity: function (callback) {
//         Activity.create({
//           owner: req.user.id,
//           type: 'company-new',
//           relateCompany: company._id
//         }, callback);
//       }
//
//     }, function(err, result) {
//       if (err) console.log("" + err);
//     });
//   }
//
// ], function(err, result) {
//   if (err) next(err);
//   else res.json(result);
// });



// function fixTestData(res) {
//   names = [];
//   data = [];
//   [{
//      "address" : "",
//      "name" : "郵便国際DB-H27・8月-9月",
//      "relation" : "北港情報サービス株式会社,日本郵便",
//      "coordinate" : [
//          "0",
//          "0"
//     ],
//      "owner" :  "55ee510b7e4cf649089bdc56",
//      "createDate" : "2015-09-11T10:26:36.034Z",
//   },
//   {
//      "address" : "",
//      "name" : "みずほ銀行向け業務の開発支援①",
//      "relation" : "株式会社　エスプロシステム,みずほ銀行",
//      "coordinate" : [
//          "35.685685",
//          "139.765351"
//     ],
//      "owner" :  "55ee510b7e4cf649089bdc56",
//      "createDate" : "2015-09-11T10:26:36.034Z",
//   }]
//   .forEach(function(obj, index){
//
//     if (obj.coordinate[0] == "0") {
//       return;
//     }
//
//     obj.type="group";
//     obj.homepage="http:///";
//     if (obj.name != "" && obj.coordinate[0] != "0" && names.indexOf(obj.name) == -1) {
//       data.push(obj);
//       names.push(obj.name);
//     } else if(obj.type == "group" && names.indexOf(obj.name) != -1) { // group only
//       data.forEach(function(company, i) {
//         if(company.name != obj.name) { return; }
//         var relation = [];
//         obj.relation.forEach(function(c) {
//           if(company.relation.indexOf(c) == -1){
//             relation.push(c);
//           }
//         })
//         if (relation.length != obj.relation.length) {
//           return;
//         }
//         data.push(obj);
//       })
//     }
//   });
//   res.json(data);
// }
