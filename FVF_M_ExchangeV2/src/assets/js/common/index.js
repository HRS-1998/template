// @ts-nocheck

var gcommon = {
    url: {
        generateUserToken: '/api/generateUserToken', // 生成用户令牌
        websiteLogin: '/api/websiteLogin', // 外部登录（不是从客户端链接过来的，客户端过来的链接有sign和uid，而是分享到facebook等平台链接过来的）
        getRedemptionStoreCfg: '/api/getRedemptionStoreCfg', // 获取兑换商城配置 get
        redemptionStoreBuy: '/api/redemptionStoreBuy' // 兑换商城购买 post
        // getBaseConfig: '/api/getBaseConfig', // 获取奖励配置 1.0
        // redeemAward: '/api/redeemAward', // 兑换请求 1.0
    },

    config: {
        routeObj: {
            1000: 'globe',
            1100: 'smart',
            1101: 'tnt',
            1200: 'tm'
        },
        code: {
            NOTLOGIN: 21010 // UserToken校验失败
        }
    },

    tpl: {
        // 二次确认弹窗
        dgComfirmTpl: `
        <div class="dg dg-confirm">
            <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                {{data.Content}}
            </div>
            <div class="dg__bottom">
                <div class="btn-comfirm btn-seconde-confirm-exchange" id="J-btn-seconde-confirm-exchange">{{data.BtnName}}</div>
            </div>
        </div>`,
        // loading倒计时弹窗
        dgLoadingCountdownTpl: `
        <div class="dg dg-loading">
            <div class="dg__con">
                <div class="circle">
                    <svg class="circle__loading" viewbox="25 25 50 50">
                        <circle class="path" cx="50" cy="50" r="20" fill="none" />
                    </svg>
                    <span class="circle__countdown-num" id="J-countdown-num"></span>
                </div>
                <div class="tips">{{data.Content}}</div>
            </div>
        </div>`,
        // 兑换成功弹窗
        dgSuccessTpl: `
        <div class="dg dg-success">
            <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                <div class="icon"></div>
                <div class="title">{{data.Title}}</div>
                <div class="tips">{{data.Content}}</div>
            </div>
            <div class="dg__bottom">
                <div class="btn-comfirm" id="J-pop-btn-comfirm">Ok!</div>
            </div>
        </div>`,
        // 兑换失败弹窗
        dgFailTpl: `
        <div class="dg dg-fail">
            <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                <div class="icon"></div>
                <div class="tips">{{data.Content}}</div>
            </div>
            <div class="dg__bottom">
                <div class="btn-comfirm" id="J-pop-btn-comfirm">Ok!</div>
            </div>
        </div>`,
        // 登录失败提示
        dgLoginFailTpl: `
        <div class="dg dg-fail dg-fail--loginfail">
         <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                <div class="title">{{data.TitleText}}</div>
                <div class="tips">{{data.DomHtml}}</div>
            </div>
             <div class="dg__bottom">
                <div class="btn-comfirm" id="J-btn-loginfail-comfirm">Close</div>
            </div>
        </div>`,
        // google和facebook登录
        dgLoginTpl: `
         <div class="dg dg-login">
            <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                 <div class="title">Account login</div>
                 <div class="btn btn-facebook" id="J-facebook-login">
                 <div class="social-icon"></div>
                 <div class="social-name">Continue with Facebook</div>
                 </div>
                 <div class="btn btn-google" id="J-google-login">
                  <div class="social-icon"></div>
                  <div class="social-name"> Continue with Google</div>
                  <div id="J-google-renderBtn"></div>
                </div>
                 <div class="link">By continuing, you agree to our <a href="//rightwork.games/service.html" target="_blank">Terms of Service</a>
    and <a href="//rightwork.games/privacy.html" target="_blank">Privacy Policy</a></div>
            </div>

        </div>
        `,
        // 头部模板
        topTpl: `
          <div class="top__nav">
            {{if data.IsShowBack}}
            <span class="btn-back" id="J-btn-back"></span>
            {{/if}}
      </div>
      <div class=header>
        <div class="header-title">
           <div class="logo"><img src="{{data.LogoUrl}}?_t=${new Date().getTime()}" /></div>
           <div class="title-text"> {{data.Title}}</div>
        </div>
        <div class="header-sub-title">
           <span class="welcome">{{data.Welcome}}</span>
           {{if  data.isLogin  }}
           <span class="sub-title-text">{{data.NickName}}</span>
           {{if data.from=='outLink'}}  <div class="logout" id="J-btn-logout"></div>{{/if}}
           {{else}}
           <div class="btn-login" id="J-btn-login">Account login</div>
           {{/if}}
        </div>
        {{if  data.isLogin  }}
        <div class="user-gold">
        <div class="user-gold-left">
        <div class="user-gold-left__icon">
        <img src="{{data.VouchersLogo}}?_t=${new Date().getTime()}"alt="" />
        </div>
        <div class="user-gold-left__value">Vouchers:{{data.Vouchers}}</div>
        </div>
        <div class="user-gold-right">Value≈{{data.Value}} PHP</div>
        </div>
          {{else}}
        <div class="user-gold-login">
         <div class="user-gold-login-left">
        <div class="user-gold-login-left__icon">
        <img src="{{data.VouchersLogo}}?_t=${new Date().getTime()}"alt="" />
        </div>
        </div>
        <div class="user-gold-login-right">Please log in first.</div>
        </div>
        {{/if}}
      </div>
    `,

        // swiper模块
        swiperTpl: `
        <div class="swiper-container">
           <div class="swiper-wrapper" >
            {{each data as item index}}
            <div class="swiper-slide" >
                <img src="{{item.Pic}}?_t=${new Date().getTime()}" data-url="{{item.JumpUrl}}" />
            </div>
            {{/each}}
            </div>
            <div class="swiper-pagination"></div>
        </div>
    `,
        // 广播模块
        broadcastTpl: `
    <div class="broadcast-content">
        <div class="broadcast-content-logo"></div>
        <div class="broadcast-content-text">
        <div class="broadcast-list">
         {{each data as item index}}
         <div class="broadcast-item"> {{item}}</div>
         {{/each}}
        </div>
           </div>
    </div>
    `,
        // 商店模块
        storeTpl: `
        {{each data as item index}}
        <div class="group">
        {{if item.GroupId===1}}
        <div class="group-header group-recommend">{{item.GroupName}}</div>
        {{else}}
        <div class="group-header group-normal">{{item.GroupName}}</div>
        {{/if}}
        <div class="group-list">
           {{each item.StoreGoodCfg as exchangeGift index1}}
           {{if item.GroupId===1}}
           <div class="group-list-item group-list-item__recommend" data-groupid="{{item.GroupId}}" data-redeemid="{{exchangeGift.Id}}" data-supportaward="{{exchangeGift.SupportAward}}" data-index="{{index1}}">
           {{else}}
           <div class="group-list-item group-list-item__normal"  data-id="{{exchangeGift.Id}}" data-groupid="{{item.GroupId}}" data-redeemid="{{exchangeGift.Id}}" data-supportaward="{{exchangeGift.SupportAward}}" data-index="{{index1}}">
           {{/if}}

           {{if exchangeGift.Tag}}
           <div class="tag"></div>
           {{/if}}
           <div class="list-item__img">
               <img src="{{exchangeGift.Pic}}?_t=${new Date().getTime()}" alt="">
           </div>
           <div class="list-item__title">
           {{exchangeGift.Name}}
           </div>
           <div class="list-item__price" >
           <div class="price-logo">
           <img src="{{tweetCfg.txtid_server_voucher_icon2}}?_t=${new Date().getTime()}" alt="">
           </div>
           <div>{{exchangeGift.Consume.Amount}}</div>
           </div>
           </div>
           {{/each}}
           </div>
        </div>
        </div>
        {{/each}}
      `,
        // 底部下载模块
        footerTpl: `
      <div class="footer-content">
      <div class="footer-content__pic">
      <img src="{{data.txtid_redeem_pic_gameicon}}?_t=${new Date().getTime()}" alt="" />
      </div>
      <div class="footer-content__dec">
      <div class="title">{{data.txtid_redeem_pic_gamename}}</div>
      <div class="sub-title">{{data.txtid_redeem_pic_gamedesc.split('<br>')[0]}}</div>
      <div class="sub-title">{{data.txtid_redeem_pic_gamedesc.split('<br>')[1]}}</div>
      </div>
      <a  class="footer-content__btn" href="{{data.txtid_redeem_pic_download}}" target="_blank">
      </a>
      <div class="footer-content__icon"></div>
      </div>
`
    },

    // 替换弹窗文本
    replaceDgTplText: function (datatext) {
        this.tpl.dgLoginFailTpl = this.tpl.dgLoginFailTpl
            .replace('{{data.DomHtml}}', datatext.txtid_logfail_desc_fail)
            .replace('{{data.TitleText}}', datatext.txtid_logfail_title_fail);
        this.tpl.dgLoadingCountdownTpl = this.tpl.dgLoadingCountdownTpl.replace(
            '{{data.Content}}',
            datatext.txtid_popup_tip_loading
        );
    },

    // 弹窗
    pop: function (tpl) {
        var dgPop = layer.open({
            type: 1, //页面层
            content: tpl, // 模版
            shadeClose: false,
            success: function (elem) {
                $('.J-btn-dg-close').click(function () {
                    layer.close(dgPop);
                });
            }
        });
    },

    setHeadData: function (data) {
        document.title = data.TweetCfg.txtid_server_title;
        if (data.TweetCfg.txtid_server_pic_top_ico) {
            $('link[rel="shortcut icon"]').attr(
                'href',
                data.TweetCfg.txtid_server_pic_top_ico +
                    '?v=' +
                    new Date().getTime()
            );
        }
    },

    // 头部渲染
    renderTop: function (data, bool) {
        var that = this;
        var nicknameFromCookie = gtools.cookies.getCookie('NickName');
        var nickname = decodeURIComponent(nicknameFromCookie);

        template.defaults.escape = false; // 全局关闭转义
        var render = template.compile(gcommon.tpl.topTpl);
        var generateHtml = render({
            data: {
                IsShowBack: bool, // 隐藏返回按钮
                Title: data.TweetCfg.txtid_server_title,
                LogoUrl: data.TweetCfg.txtid_server_pic_top,
                Welcome: data.TweetCfg.txtid_server_tip_welcome.slice(0, -3),
                NickName: nickname,
                Vouchers: gtools.splitMoney(data.VoucherInfo.voucherNum),
                VouchersLogo: data.TweetCfg.txtid_server_voucher_icon1,
                Value: data.VoucherInfo.voucherValue,
                isLogin: data.isLogin,
                from: data.from
            }
        });
        $('#J-top').show().html(generateHtml);

        $('#J-btn-login').click(function () {
            // google和facebook登录
            var loginLayerIndex = layer.open({
                type: 1, //页面层
                content: that.tpl.dgLoginTpl, // 模版// 失败
                shadeClose: false,
                className: 'dg-border-radius',
                success: function (elem) {
                    $('#J-google-login').click(function () {
                        // 执行google登录逻辑
                        // onGoogleSDKLoad(true, function () {
                        //     layer.close(loginLayerIndex);
                        // });
                    });
                    $('#J-facebook-login').click(function () {
                        // 执行facebook登录逻辑
                        facebookLogin(function () {
                            layer.close(loginLayerIndex);
                        });
                    });
                    $('.J-btn-dg-close').click(function () {
                        layer.close(loginLayerIndex);
                    });
                    // 这里加载谷歌原生按钮
                    onGoogleSDKLoad(true, function () {
                        layer.close(loginLayerIndex);
                    });
                }
            });
        });
        $('#J-btn-logout').click(function () {
            console.log('logout');
            //只考虑第三方google和facebook的登录退出
            gtools.cookies.delCookie('UserId');
            gtools.cookies.delCookie('UserToken');
            gtools.cookies.delCookie('NickName');
            const unLoginData = {
                IsShowBack: false,
                TweetCfg: {
                    txtid_server_title: data.TweetCfg.txtid_server_title,
                    txtid_server_pic_top: data.TweetCfg.txtid_server_pic_top,
                    txtid_server_tip_welcome:
                        data.TweetCfg.txtid_server_tip_welcome,
                    txtid_server_voucher_icon1:
                        data.TweetCfg.txtid_server_voucher_icon1
                },
                VoucherInfo: {
                    voucherNum: 0,
                    voucherValue: 0
                },
                isLogin: false,
                from: 'outLink'
            };
            gcommon.renderTop(unLoginData, false);
        });
    },

    toastText: function (msg) {
        layer.open({
            type: 0,
            content: msg || 'error',
            skin: 'msg',
            className: 'dg-border-radius',
            time: 2 //2秒后自动关闭
        });
    },

    showLoading: function () {
        var loadingIdx = layer.open({
            type: 2,
            shade: 'background-color: rgba(0,0,0,0)'
        });
        return loadingIdx;
    },

    isNotLogin: function (resCode) {
        if (resCode === this.config.code.NOTLOGIN) {
            var content = this.tpl.dgLoginFailTpl.includes('{0}')
                ? this.tpl.dgLoginFailTpl.replaceAll('{0}', resCode)
                : this.tpl.dgLoginFailTpl;
            var loginFailIndex = layer.open({
                type: 1, //页面层
                content: content, // 失败
                shadeClose: false,
                className: 'dg-border-radius',
                success: function (elem) {
                    $('.J-btn-dg-close').click(function () {
                        layer.close(loginFailIndex);
                    });
                    $('#J-btn-loginfail-comfirm').click(function () {
                        layer.close(loginFailIndex);
                    });
                }
            });
            return true;
        }
        return false;
    },

    // 获取奖券数量描述信息
    getVoucherNumText: function (voucherCount) {
        voucherCount = voucherCount || 0;
        return `Voucher: ${this.formatToMKB(voucherCount)}`;
    },

    // 获取奖券价值描述信息
    getVoucherValueText: function (voucherValue) {
        voucherValue = voucherValue || 0;
        return `Value≈${this.formatToMKB(voucherValue)} PHP`;
    },

    // 转换数值到 MKB 格式 保留k为小数点
    formatToMKB: function (value, decimals = 2) {
        value = Number(value) || 0;
        decimals = Math.max(0, Math.min(Number(decimals) || 0, 8)); // 限制 0-8 位
        let unit = '';
        let divisor = 1;

        if (value >= 1000000000) {
            unit = 'B';
            divisor = 1000000000;
        } else if (value >= 1000000) {
            unit = 'M';
            divisor = 1000000;
        } else if (value >= 1000) {
            unit = 'K';
            divisor = 1000;
        }

        var num = value / divisor;
        var formatted = num.toFixed(decimals);
        // 如果是整数，去除小数点及后面的 0；否则保留格式化结果
        return (
            (Number(formatted) % 1 === 0
                ? Number(formatted).toString()
                : formatted) + unit
        );
    }
};

// 扩展 String.prototype 替换多语言文本中的{0}，{1}...{n}
if (!String.prototype.replaceParams) {
    String.prototype.replaceParams = function (...params) {
        let args =
            params.length === 1 && Array.isArray(params[0])
                ? params[0]
                : params;
        return this.replace(/\{(\d+)\}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    };
}
