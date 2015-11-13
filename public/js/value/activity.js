angular.module('tripod')
  .value('ActivityValue', [{
    code: "user-activated",
    name: "用户注册"
  }, {
    code: "friend-invited",
    name: "交友邀请"
  }, {
    code: "friend-accepted",
    name: "交友邀请许可"
  }, {
    code: "friend-refused",
    name: "交友邀请拒绝"
  }, {
    code: "friend-break",
    name: "交友解除"
  }, {
    code: "user-blocked",
    name: "屏蔽用户"
  }, {
    code: "user-unblocked",
    name: "屏蔽用户（解除）"
  }, {
    code: "post-new",
    name: "帖子发布"
  }, {
    code: "post-commented",
    name: "帖子评论"
  }, {
    code: "post-liked",
    name: "赞贴"
  }, {
    code: "post-bookmarked",
    name: "收藏帖子"
  }, {
    code: "post-unliked",
    name: "赞贴（取消）"
  }, {
    code: "post-unbookmarked",
    name: "收藏帖子（取消）"
  }, {
    code: "message-new",
    name: "即时消息"
  }, {
    code: "group-new",
    name: "群组建立"
  }, {
    code: "group-joined",
    name: "加入群组"
  }, {
    code: "group-left",
    name: "离开群组"
  }, {
    code: "post-reported",
    name: "举报帖子"
  }, {
    code: "user-reported",
    name: "举报用户"
  }]);
