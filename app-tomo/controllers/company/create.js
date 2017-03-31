var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Company, Activity) {

  return function(req, res, next) {
    // fixTestData(res);
    // return;
    createTestData(Company, res);
    return;

    req.body = req.query;

    async.waterfall([

      function createCompany(callback) {

        req.body.owner = req.user.id;
        req.body.members = [req.user.id];
        Company.create(req.body, callback);
      },

      function createRelateInfo(company, callback) {
        callback(null, company);

        async.parallel({

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'company-new',
              relateCompany: company._id
            }, callback);
          }

        }, function(err, result) {
          if (err) console.log("" + err);
        });
      }

    ], function(err, result) {
      if (err) next(err);
      else res.json(result);
    });

  };
};

function fixTestData(res) {
  data = getEndUser();
  data.forEach(function(obj, index){
    var coordinate = [];
    coordinate[0] = obj.coordinate[1];
    coordinate[1] = obj.coordinate[0];
    obj.coordinate = coordinate;
  });
  res.json(data);
}

function getEndUser() {
  return [{"address":"","name":"みずほ銀行","coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"株式会社ランドコンピュータ","coordinate":["35.64044","139.748067"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"電通","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"CROWDGATE","coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"NCI","coordinate":["35.67358","139.781646"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"あいおい損保","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"G生命保険","coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"東電","coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"ANA","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"明治安田生命","coordinate":["35.666605","139.815657"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"三井住友海上火災保険","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"},{"address":"","name":"ユーキャン","coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"end","homepage":"http:///"}];
}

function getSI() {
  return [{"address":"","name":"株式会社　エスプロシステム","coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社ランドコンピュータ","coordinate":["35.64044","139.748067"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社　電通国際情報サービス","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社ティファナ·ドットコム","coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"エヌシーアイ総合システム株式会社","coordinate":["35.67358","139.781646"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社東邦システムサイエンス","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"アイエックス·ナレッジ株式会社","coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"ファーストレイン·テクノロジー株式会社","coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社クラウドアンドデータサービス","coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社ＮＳＤ","coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社 Navi J&C","coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社システムイオ","coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社　DTS","coordinate":["35.666605","139.815657"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社Minoriソリューションズ","coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"},{"address":"","name":"株式会社サイバネット","coordinate":["35.694835","139.696038"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"si","homepage":"http:///"}];
}

function getGroup() {
  return [{"address":"","name":"みずほ銀行向け業務の開発支援①","relation":["株式会社　エスプロシステム","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ銀行向け業務の開発支援②","relation":["株式会社　エスプロシステム","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"Salesforce技術支援","relation":["株式会社ランドコンピュータ","株式会社ランドコンピュータ"],"coordinate":["35.64044","139.748067"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"i*Standard保守作業","relation":["株式会社　電通国際情報サービス","電通"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"クラウドゲートシステム開発費用","relation":["株式会社ティファナ·ドットコム","CROWDGATE"],"coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"リクルートじゃらん支援","relation":["エヌシーアイ総合システム株式会社","NCI"],"coordinate":["35.67358","139.781646"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"あいおいニッセイ同和損害保険","relation":["株式会社東邦システムサイエンス","あいおい損保"],"coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"G生命向け保険金・給付金支払システム構築","relation":["アイエックス·ナレッジ株式会社","G生命保険"],"coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"システム開発作業","relation":["ファーストレイン·テクノロジー株式会社","電通"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"ローン再構築STEPS代替対応","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"FINEMAX　FFGh品質向上","relation":["株式会社クラウドアンドデータサービス","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"東京電力　託送検針機能開発に関するるSES支援（H27-01）","relation":["株式会社ＮＳＤ","東電"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期シス基本設計","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ銀行海外系システム整備基本設計支援","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期シス基本設計支援","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.549985","139.674098"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"システム開発支援","relation":["株式会社 Navi J&C"],"coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほＢＫ勘定系／外国為替システム開発","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ次期システム3－2推進ＰＴ支援","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"ＡＮＡ様向けＰＯＳＩＴＩＶＥ導入（給与領域）","relation":["株式会社　電通国際情報サービス","ANA"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ銀行向け次期システム・市場系","relation":["株式会社東邦システムサイエンス","みずほ銀行"],"coordinate":["35.617046","139.779922"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"アジア仕様変更対応","relation":["株式会社クラウドアンドデータサービス","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期シス詳細設計（外為）","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"MHIR稟協","relation":["株式会社システムイオ"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"明治安田生命保険相互会社様向けシステム開発・保守作業支援","relation":["株式会社　DTS","明治安田生命"],"coordinate":["35.666605","139.815657"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"GOB一元化（IT1）移行開発及びIT1実施","relation":["株式会社　電通国際情報サービス"],"coordinate":["35.625153","139.739338"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"三井住友海上火災保険","relation":["株式会社東邦システムサイエンス","三井住友海上火災保険"],"coordinate":["35.805928","140.117401"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"3月のシステム開発","relation":["株式会社ティファナ·ドットコム","CROWDGATE"],"coordinate":["35.650506","139.753094"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"東京電力　託送検機能開発に関するるSES支援（H27-01）","relation":["株式会社ＮＳＤ","東電"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"生命保険会社向け・給付金支払システム構築","relation":["アイエックス·ナレッジ株式会社","G生命保険"],"coordinate":["35.696266","139.812318"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"次期システム３－2推進PT支援","relation":["アイエックス·ナレッジ株式会社","みずほ銀行"],"coordinate":["35.685685","139.765351"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"東京電力　託送検針機能開発に関するるSES支援（H26-01）","relation":["株式会社ＮＳＤ","東電"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"ユーキャン様システム再構築開発支援","relation":["株式会社　DTS","ユーキャン"],"coordinate":["35.660173","139.79617"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほ海外整備プロジェクト開発支援","relation":["株式会社Minoriソリューションズ","みずほ銀行"],"coordinate":["35.729554","139.746607"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"わが街統合型ＧＩＳ　ソース改善対応","relation":["株式会社サイバネット"],"coordinate":["35.694835","139.696038"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"},{"address":"","name":"みずほＦＧ　統合ＤＢ整備","relation":["株式会社ＮＳＤ","みずほ銀行"],"coordinate":["35.617046","139.779922"],"owner":"55ee510b7e4cf649089bdc56","createDate":"2015-09-11T10:26:36.034Z","type":"group","homepage":"http:///"}];
}

function createTestData(Company, res) {
  async.parallel({

    si: function (callback) {
      var list = getSI();

      Company.create(list, function(err, result) {
        callback(null, result);
      });
    },
    end: function (callback) {
      var list = getEndUser();

      Company.create(list, function(err, result) {
        callback(null, result);
      });
    }

  }, function(err, result) {
    if (err) console.log("" + err);
    createGroup(res, result.si, result.end)
  });

}

function createGroup(res, siList, endList) {
  var mongoose = require('mongoose'),
    Group = mongoose.model('Group');

  var list = getGroup();
  list.forEach(function(obj) {
    var companyIds = [];
    obj.relation.forEach(function(companyName) {
      siList.every(function(company) {
        if(company.name == companyName && companyIds.indexOf(company._id) == -1) {
          companyIds.push(company._id);
          return false;
        }
        return true;
      });
      endList.every(function(company) {
        if(company.name == companyName && companyIds.indexOf(company._id) == -1) {
          companyIds.push(company._id);
          return false;
        }
        return true;
      });
    });
    obj.companies = companyIds;
  });
  Group.create(list, function(err, result) {
    res.json(result);
  });
  return;
}
