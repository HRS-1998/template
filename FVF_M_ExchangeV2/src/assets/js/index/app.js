//@ts-nocheck
$(function () {
    var countdownValue = 5;
    var timer = null;
    var exchangeDgComfirm; // 兑换弹窗对象
    function setAjaxError() {
        $.ajaxSetup({
            contentType: 'application/json;',
            timeout: 30000, // 超时30秒
            beforeSend: function (xhr, settings) {
                if (settings.type === 'POST' && settings.data) {
                    var _data = JSON.parse(settings.data);
                    var newData = $.extend({ _t: Date.now() }, _data);
                    settings.data = JSON.stringify(newData);
                }
            },
            error: function (xhr, status, error) {
                var msg =
                    xhr.statusText === 'timeout' ? 'timeout' : 'server error';
                gcommon.toastText(msg);
            }
        });
    }

    function fmtRoute(data, configData) {
        var routeObj = gcommon.config.routeObj;
        var arr = [];
        for (let i = 0; i < data.length; i++) {
            var item = data[i];
            var url =
                configData['txtid_server_pic_carrier_' + routeObj[item.Route]];
            if (url == null) {
                url =
                    '/assets/img/servicelist/' +
                    `carrier-${routeObj[item.Route]}.png`;
            }
            arr.push({
                type: routeObj[item.Route],
                routeid: item.Route,
                imgUrl: url
            });
        }
        return arr;
    }

    function removeNonBreakingSpaces(obj) {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/\xa0/g, ' '); // 去除\xa0空格
            }
        });
        return obj;
    }

    function fmtData(sourcedata) {
        var data = removeNonBreakingSpaces(sourcedata.TweetCfg);
        var ServiceList = fmtRoute(
            sourcedata.RewardConfig,
            sourcedata.TweetCfg
        );
        var arr = [];
        arr.push({
            Name: data.txtid_server_tip_name1,
            RoleName: data.txtid_server_tip_admin,
            HeadUrl: data.txtid_server_headurl1,
            //   Date: gtools.fmtTime.formatEnglishDate(data.Timestamp),
            Date: data.txtid_server_tip_date1,
            Content: data.txtid_server_desc_content1,
            Link: data.txtid_server_desc_link1,
            AppLink: data.txtid_server_link_download,
            ServiceList: ServiceList,
            ServerListBg:
                sourcedata.TweetCfg['txtid_server_pic_servicelist_bg'],
            PicBig: ''
        });
        arr.push({
            Name: data.txtid_server_tip_name2,
            RoleName: data.txtid_server_tip_admin,
            HeadUrl: data.txtid_server_headurl2,
            //   Date: gtools.fmtTime.formatEnglishDate(data.Timestamp),
            Date: data.txtid_server_tip_date2,
            Content: data.txtid_server_desc_content2,
            Link: data.txtid_server_desc_link2,
            AppLink: data.txtid_server_link_download,
            ServiceList: ServiceList,
            PicBig: sourcedata.TweetCfg['txtid_server_pic_big']
        });
        return arr;
    }

    // 渲染swiper
    function renderSwiper(data) {
        template.defaults.escape = false; // 全局关闭转义
        var render = template.compile(gcommon.tpl.swiperTpl);
        var generateHtml = render({
            data: data
        });
        $('#J-swiper').show().html(generateHtml);

        // 确保DOM已经渲染完成后再初始化Swiper
        setTimeout(() => {
            if (window.pageSwiper) window.pageSwiper.destroy(true, true);
            var pageSwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                slidesPerView: 1,
                loop: true,
                autoplay: 3000,
                paginationClickable: true,
                pagination: '.swiper-pagination'
            });
            // 绑定事件
            $('.swiper-container').on('swipeleft', function () {
                window.pageSwiper.slideNext();
            });
            $('.swiper-container').on('swiperight', function () {
                window.pageSwiper.slidePrev();
            });
            var imgs = $('.swiper-container img');
            for (var i = 0; i < imgs.length; i++) {
                $(imgs[i]).on('click', function () {
                    // window.location.href = $(this).attr('data-url');
                    //埋点
                    dataLayer.push({
                        event: 'swiper_click',
                        swiper_jump_url: $(this).attr('data-url'),
                        // 当前时间
                        date_time: gtools.fmtRecordTime(Date.now())
                    });
                    window.open($(this).attr('data-url'));
                });
            }
        }, 100);
    }

    // 渲染广播列表
    function renderBroadcast(data) {
        template.defaults.escape = false; // 全局关闭转义
        var render = template.compile(gcommon.tpl.broadcastTpl);
        var generateHtml = render({
            data: data
        });
        $('#J-broadcast-container').show().html(generateHtml);

        // 初始化翻页效果
        setTimeout(function () {
            initFlipScrollWithPause(5000); // 每条消息显示5秒
        }, 100);
    }

    // 初始化垂直翻页效果
    function initFlipScrollWithPause(displayTime) {
        var $broadcastList = $('.broadcast-list');
        var $broadcastItems = $('.broadcast-item');
        var itemHeight = 60; // 与CSS中的高度一致

        // // 如果消息少于2条，不需要翻页
        // if ($broadcastItems.length < 2) {
        //     if ($broadcastItems.length > 0) {
        //         $broadcastItems.each(function (index) {
        //             $(this).css('top', index * itemHeight + 'px');
        //         });
        //     }
        //     return;
        // }

        // 克隆项目以实现无缝循环
        $broadcastItems.each(function (index) {
            var $clone = $(this).clone();
            $clone.attr('data-clone', 'true');
            $broadcastList.append($clone);
        });

        // 重新获取所有项目（包括克隆的）
        var $allItems = $('.broadcast-item');

        // 设置所有项目的位置
        $allItems.each(function (index) {
            $(this).css('top', index * itemHeight + 'px');
        });

        var currentIndex = 0;
        var totalItems = $broadcastItems.length;
        var flipTimer = null;
        var isAnimating = false;

        // 开始翻页
        function startFlip() {
            if (flipTimer) {
                clearTimeout(flipTimer);
            }

            flipTimer = setTimeout(function () {
                if (isAnimating) return;

                isAnimating = true;

                // 增加当前索引
                var previousIndex = currentIndex;
                currentIndex = (currentIndex + 1) % totalItems;

                // 计算需要移动的距离
                // 对currentIndex ==0 的情况做特殊处理

                var translateY = -(currentIndex * itemHeight);
                if (currentIndex == 0 && previousIndex == totalItems - 1) {
                    translateY = -(totalItems * itemHeight);
                }

                // 应用变换实现垂直滚动
                $broadcastList.css(
                    'transform',
                    'translateY(' + translateY + 'px)'
                );

                // 特殊处理：当从最后一条切换到第一条时
                if (previousIndex === totalItems - 1 && currentIndex === 0) {
                    setTimeout(function () {
                        $broadcastList.css('transition', 'none');
                        $broadcastList.css('transform', 'translateY(0px)');
                        $broadcastList[0].offsetHeight;
                        // 恢复过渡效果
                        $broadcastList.css(
                            'transition',
                            'transform 0.8s ease-in-out'
                        );
                    }, 800);
                }

                // 动画完成后重置状态
                setTimeout(function () {
                    isAnimating = false;
                }, 800); // 与CSS transition时间匹配

                // 递归调用继续翻页
                startFlip();
            }, displayTime);
        }

        // 开始翻页
        startFlip();
    }
    // 渲染商城 这里store有四种情况 groupId 1推荐 2话费 3金币 4实物
    function renderStore(data, tweetCfg) {
        for (var i = 0; i < data.length; i++) {
            var len = data[i].StoreGoodCfg.length;
            console.log(len, 'len');
            for (var j = 0; j < len; j++) {
                data[i].StoreGoodCfg[j].Consume.Amount = gtools.changeMoney(
                    data[i].StoreGoodCfg[j].Consume.Amount
                );
            }
        }
        template.defaults.escape = false; // 全局关闭转义
        var render = template.compile(gcommon.tpl.storeTpl);
        var generateHtml = render({
            data: data,
            tweetCfg: tweetCfg
        });
        $('#J-store-container').show().html(generateHtml);

        // 添加事件
        $('#J-store-container')
            .find('.group-list-item')
            .click(function () {
                var groupId = $(this).attr('data-groupid');
                var redeemId = $(this).attr('data-redeemid');
                var groupItemIndex = $(this).attr('data-index');

                // 查找当前点击的商品信息
                var currentItem = null;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].GroupId == groupId) {
                        var awards = data[i].StoreGoodCfg;
                        for (var j = 0; j < awards.length; j++) {
                            if (awards[j].Id == redeemId) {
                                currentItem = {
                                    awards: awards[j]
                                };
                                break;
                            }
                        }
                        if (currentItem) break;
                    }
                }

                if (!currentItem) {
                    gcommon.toastText('未找到商品信息');
                    return;
                }

                // 根据type打开弹窗  同一个SupportAwards中所有的兑换列表的type是同一个：1：话费 2：虚拟道具：3：实物
                var dgComfirmTpl;
                if (currentItem.awards.SupportAwards[0].Type === 1) {
                    // 话费充值，需要输入手机号
                    dgComfirmTpl = createPhoneExchangeTemplate(
                        currentItem,
                        tweetCfg
                    );
                } else {
                    // 其他类型，显示默认兑换界面
                    dgComfirmTpl = createDefaultExchangeTemplate(
                        currentItem,
                        tweetCfg
                    );
                }

                //埋点
                dataLayer.push({
                    event: 'good_click',
                    groupId: groupId,
                    groupId_index: groupItemIndex,
                    good_name: currentItem.awards.Name,
                    date_time: gtools.fmtRecordTime(Date.now())
                });

                exchangeDgComfirm = layer.open({
                    type: 1, //页面层
                    content: dgComfirmTpl,
                    shadeClose: false,
                    className: 'dg-border-radius',
                    success: function (elem) {
                        $('.J-btn-dg-close').click(function () {
                            layer.close(exchangeDgComfirm);
                        });

                        // 运营商选择功能
                        $('.operator-item').click(function () {
                            $('.operator-item').removeClass('selected');
                            $(this).addClass('selected');
                        });

                        // 输入手机号功能 限制10-11位数】
                        $('#J-phone-ipt').on('input', function () {
                            var mobile = $(this).val();
                            $(this).val(mobile.replace(/[^0-9]/g, ''));
                            if (mobile.length > 11) {
                                $(this).val(mobile.substring(0, 11));
                            }
                        });

                        // 绑定确认兑换按钮事件
                        $('#J-pop-btn-exchange').click(function () {
                            if (
                                currentItem.awards.SupportAwards[0].Type === 1
                            ) {
                                var mobile = $('#J-phone-ipt').val();
                                var selectedOperator = $(
                                    '.operator-item.selected'
                                ).attr('data-id');

                                // 运营商选择
                                if (
                                    !selectedOperator &&
                                    currentItem.awards.SupportAwards[0].Type ===
                                        1
                                ) {
                                    gcommon.toastText(
                                        tweetCfg.txtid_redeem_tip_selectreward
                                    );
                                    return;
                                }
                                if (isNotCorrectMobile(mobile)) {
                                    // 输入正确手机号
                                    gcommon.toastText(
                                        tweetCfg.txtid_redeem_tip_invalidnum
                                    );
                                    return;
                                }

                                // 二次确认弹窗
                                showSecondConfirmDialog(
                                    tweetCfg,
                                    mobile,
                                    currentItem,
                                    selectedOperator
                                );
                                return;
                            }
                            // 执行兑换逻辑
                            performExchange(
                                tweetCfg,
                                currentItem,
                                mobile,
                                selectedOperator
                            );
                        });
                    }
                });
            });
    }

    function isNotCorrectMobile(mobile) {
        return !mobile || (mobile.length !== 11 && mobile.length !== 10);
    }

    // 创建话费充值弹窗模板
    function createPhoneExchangeTemplate(item, TweetCfg) {
        // 动态生成运营商
        var operatorsHtml = '';
        for (var i = 0; i < item.awards.SupportAwards.length; i++) {
            var operator = item.awards.SupportAwards[i];
            if (operator.AwardId == 1000) {
                operatorsHtml += ` <div class="operator-item" data-id="1000">
                <img src="${
                    TweetCfg.txtid_server_pic_carrier_globe
                }?_t=${new Date().getTime()}" alt="">
                </div>`;
            }
            if (operator.AwardId == 1100) {
                operatorsHtml += ` <div class="operator-item " data-id="1100">
                <img src="${TweetCfg.txtid_server_pic_carrier_smart}" alt="">
                </div>`;
            }
            if (operator.AwardId == 1200) {
                operatorsHtml += ` <div class="operator-item " data-id="1200">
                <img src="${TweetCfg.txtid_server_pic_carrier_tm}" alt="">
                </div>`;
            }
            if (operator.AwardId == 1101) {
                operatorsHtml += ` <div class="operator-item " data-id="1101">
                <img src="${TweetCfg.txtid_server_pic_carrier_tnt}" alt="">
                </div>`;
            }
        }
        return (
            `
        <div class="exchange-tel-dialog">
            <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                <div class="icon">
                     <img src="${item.awards.Pic}" alt=""></img>
                </div>
                <div class="title">${item.awards.Name}</div>
                <div class="tel-container">
                    <div class='tel-operators'>` +
            operatorsHtml +
            `</div>
                    <div class="iptbox__phone">
                        <span class="phone__prefix">${TweetCfg.txtid_redeem_desc_number}</span>
                        <input class="phone__ipt" id="J-phone-ipt" type="tel" placeholder="${TweetCfg.txtid_redeem_tip_input}">
                    </div>
                </div>
                <div class="btn" id="J-pop-btn-exchange">${TweetCfg.txtid_redeem_btn_redeem}</div>
                <div class="tips">${TweetCfg.txtid_redeem_tip_loadselect}</div>
            </div>
        </div>
    `
        );
    }

    // 创建默认兑换弹窗模板(虚拟物品和实物)
    function createDefaultExchangeTemplate(item, TweetCfg) {
        var type = item.awards.SupportAwards[0].Type;
        var tips = '';
        if (type === 2) {
            tips = TweetCfg.txtid_redeem_tip_goldselect;
        }
        if (type === 3) {
            tips = TweetCfg.txtid_redeem_tip_itemselect;
        }
        return `
        <div class="exchange-default-dialog">
            <div class="dg__close J-btn-dg-close"></div>
            <div class="dg__con">
                <div class="icon">
                     <img src="${item.awards.Pic}" alt=""></img>
                </div>
                <div class="title">${item.awards.Name}</div>
                <div class="btn" id="J-pop-btn-exchange">${TweetCfg.txtid_redeem_btn_redeem}</div>
                <div class="tips">${tips}</div>
            </div>
        </div>
    `;
    }

    // 话费兑换二次弹出
    function showSecondConfirmDialog(
        TweetCfg,
        mobile,
        currentItem,
        selectedOperator
    ) {
        var confirmText = TweetCfg.txtid_popup_tip_confirm.split('<br>'); // 分隔数据
        var t1 = confirmText[0].replace(
            '{0}',
            `<span>P${currentItem.awards.SupportAwards[0].AwardAmount}</span>`
        );
        var t2 = confirmText[1].replace('{1}', mobile);
        var t3 = confirmText[2];

        let dgComfirmTpl = gcommon.tpl.dgComfirmTpl.replace(
            '{{data.BtnName}}',
            TweetCfg.txtid_popup_btn_confirm
        );
        dgComfirmTpl = dgComfirmTpl.replace(
            '{{data.Content}}',
            `
                <div class="title">${t1}</div>
                <div class="phone">${t2}</div>
                <div class="tips">${t3}</div>`
        );
        // 二次确认弹窗
        var dgComfirm = layer.open({
            type: 1, //页面层
            content: dgComfirmTpl, // 失败
            shadeClose: false,
            className: 'dg-border-radius',
            success: function (elem) {
                $('.J-btn-dg-close').click(function () {
                    layer.close(dgComfirm);
                });
                $('#J-btn-seconde-confirm-exchange').click(function () {
                    console.log('执行兑换逻辑');
                    layer.close(dgComfirm);
                    // 执行兑换逻辑
                    performExchange(
                        TweetCfg,
                        currentItem,
                        mobile,
                        selectedOperator
                    );
                });
            }
        });
    }

    // 倒计时相关
    function setCountdownValue(num) {
        if ($('#J-countdown-num')) {
            $('#J-countdown-num').html(num);
        }
    }

    function countdown(seconds) {
        if (seconds <= 0) {
            //   console.log('倒计时结束！');
            countdownValue = 0;
            setCountdownValue('');
        } else {
            countdownValue = seconds;
            setCountdownValue(countdownValue);
            timer = setTimeout(() => {
                countdown(seconds - 1); // 递归调用，每次减少1秒
            }, 1000); // 1000毫秒 = 1秒
        }
    }

    function showCountdownPop() {
        var dgLoadingCountdown = layer.open({
            type: 1, //页面层
            content: gcommon.tpl.dgLoadingCountdownTpl, // loading倒计时弹窗
            shadeClose: false,
            className: 'dg-border-radius',
            success: function (elem) {}
        });
        return dgLoadingCountdown;
    }

    //  兑换失败弹窗
    function doExchangeFail(TweetCfg, res) {
        let dgFailTpl = gcommon.tpl.dgFailTpl.replace(
            '{{data.Content}}',
            TweetCfg.txtid_popup_tip_fail
        );
        dgFailTpl = dgFailTpl.includes('{1}')
            ? dgFailTpl.replaceAll('{1}', res.Message)
            : dgFailTpl;
        dgFailTpl = dgFailTpl.includes('{0}')
            ? dgFailTpl.replaceAll('{0}', res.Code)
            : dgFailTpl;
        var dgFail = layer.open({
            type: 1, //页面层
            content: dgFailTpl, // 失败
            className: 'dg-border-radius',
            shadeClose: false,
            success: function (elem) {
                $('.J-btn-dg-close,#J-pop-btn-comfirm').click(function () {
                    layer.close(dgFail);
                });
            }
        });
    }

    // 兑换成功更新银子
    function updateBalance() {
        var uid = Number(gtools.cookies.getCookie('UserId') || '');
        $.ajax({
            type: 'POST',
            url: gcommon.url.getRedemptionStoreCfg,
            data: JSON.stringify({ UserId: uid, UserToken: '' }), // 该接口不校验登录状态
            dataType: 'json',
            success: function (res) {
                res.Data.from =
                    gtools.cookies.getCookie('LinkFrom') || 'outLink';
                res.Data.isLogin = true;
                gcommon.renderTop(res.Data, false); // 渲染顶部
            },
            error: function (xhr, status, error) {
                var msg =
                    xhr.statusText === 'timeout' ? 'timeout' : 'server error';
                gcommon.toastText(msg);
                layer.close(loadingIdx);
            }
        });
    }

    // 兑换成功弹窗
    function doExchangeSuccess(TweetCfg, res) {
        let dgSuccessTpl = gcommon.tpl.dgSuccessTpl
            .replace('{{data.Title}}', TweetCfg.txtid_popup_title_sucessful)
            .replace('{{data.Content}}', TweetCfg.txtid_popup_tip_sucessful);
        dgSuccessTpl = dgSuccessTpl.includes('{0}')
            ? dgSuccessTpl.replaceAll('{0}', res.Code)
            : dgSuccessTpl;
        var dgSucces = layer.open({
            type: 1, //页面层
            content: dgSuccessTpl, // 成功
            className: 'dg-border-radius',
            shadeClose: false,
            success: function (elem) {
                $('.J-btn-dg-close,#J-pop-btn-comfirm').click(function () {
                    layer.close(dgSucces);
                    // window.location.reload();
                    updateBalance();
                });
            }
        });
    }

    // 执行兑换操作
    function performExchange(
        tweetCfg,
        currentItem,
        mobile,
        selectedOperatorId
    ) {
        var loadingIdx = gcommon.showLoading();
        var userid = gtools.cookies.getCookie('UserId') || '';
        var usertoken = gtools.cookies.getCookie('UserToken') || '';
        var timeStamp = Math.floor(Date.now() / 1000);
        var RedeemId = currentItem.awards.Id;
        var requestData = {
            UserId: Number(userid),
            UserToken: usertoken,
            RedeemId: RedeemId,
            TimeStamp: timeStamp
        };

        // 如果是话费充值，添加手机号,运营商
        if (mobile) {
            requestData.AwardId = Number(selectedOperatorId);
            requestData.PhoneNumber = mobile;
        }
        var md5data = gtools.sortAndConcatJSON(requestData);
        requestData.Sign = md5(`${md5data}W3sQ2mZx8N`);

        var dgLoadingCountdown = showCountdownPop();
        countdownValue = 5;
        countdown(countdownValue);
        $.ajax({
            type: 'POST',
            url: gcommon.url.redemptionStoreBuy,
            data: JSON.stringify(requestData),
            success: function (res) {
                if (gcommon.isNotLogin(res.Code)) return;
                if (res.Code === 0) {
                    doExchangeSuccess(tweetCfg, res);
                } else {
                    doExchangeFail(tweetCfg, res);
                }
                layer.close(exchangeDgComfirm); // 成功再关闭
            },
            error: function (xhr, status, error) {
                var msg =
                    xhr.statusText === 'timeout' ? 'timeout' : 'server error';
                gcommon.toastText(msg);
                layer.close(loadingIdx);
            },
            complete: function () {
                clearTimeout(timer);
                timer = null;
                layer.close(dgLoadingCountdown);
                layer.close(loadingIdx);
            }
        });
    }
    // 渲染底部
    function renderFooter(data) {
        template.defaults.escape = false; // 全局关闭转义
        var render = template.compile(gcommon.tpl.footerTpl);
        var generateHtml = render({
            data: data
        });
        $('#J-footer-container')
            .addClass('footer-show')
            .show()
            .html(generateHtml);
    }

    function apiGenerateUserToken() {
        var loadingIdx = gcommon.showLoading();
        $.ajax({
            type: 'POST',
            url: gcommon.url.generateUserToken,
            data: JSON.stringify({
                UserId: Number(gtools.getUrlParam('UserId')),
                Sign: gtools.getUrlParam('Sign')
            }),
            dataType: 'json',
            success: function (res) {
                if (res.Code !== 0) {
                    gcommon.toastText(res.Message);
                    return;
                }
                gtools.cookies.setCookie('UserId', res.Data.UserId);
                gtools.cookies.setCookie(
                    'NickName',
                    encodeURIComponent(res.Data.NickName)
                );
                gtools.cookies.setCookie('UserToken', res.Data.UserToken);
                apiGetBaseConfig('innerLink');
            },
            complete: function () {
                layer.close(loadingIdx);
            }
        });
    }

    function apiGetBaseConfig(from) {
        var loadingIdx = gcommon.showLoading();
        var uid = Number(
            gtools.cookies.getCookie('UserId') ||
                gtools.getUrlParam('UserId') ||
                ''
        );
        $.ajax({
            type: 'POST',
            url: gcommon.url.getRedemptionStoreCfg,
            data: JSON.stringify({ UserId: uid, UserToken: '' }), // 该接口不校验登录状态
            dataType: 'json',
            success: function (res) {
                if (res.Code !== 0) {
                    gcommon.toastText(res.Message);
                    return;
                }
                if (from === 'innerLink') {
                    res.Data.isLogin = true;
                }
                if (from === 'outLink') {
                    res.Data.isLogin = false;
                    var token = gtools.cookies.getCookie('UserToken');
                    if (token) {
                        res.Data.isLogin = true;
                    }
                }
                res.Data.from = from;
                renderPage(res);
            },
            complete: function () {
                layer.close(loadingIdx);
            },
            error: function (xhr, status, error) {
                var msg =
                    xhr.statusText === 'timeout' ? 'timeout' : 'server error';
                gcommon.toastText(msg);
                layer.close(loadingIdx);
            }
        });
    }

    function renderPage(res) {
        gcommon.replaceDgTplText(res.Data.TweetCfg); // 初始化时替换弹窗模版文案
        document.title = res.Data.TweetCfg.txtid_server_title;
        gcommon.setHeadData(res.Data);
        gcommon.renderTop(res.Data, false); // 渲染顶部
        renderSwiper(res.Data.CarouselCfg); // 渲染轮播
        renderBroadcast(res.Data.BroadcastList); // 渲染广播
        renderStore(res.Data.StoreCfg, res.Data.TweetCfg); // 渲染商城
        if (res.Data.HideFooter && gtools.getUrlParam('Sign')) {
            $('.footer-container').hide();
            $('body').removeClass('pd-b-150').addClass('pd-b-0');
        } else {
            $('body').removeClass('pd-b-0').addClass('pd-b-150');
            renderFooter(res.Data.TweetCfg); // 渲染底部
        }
        $('body').show();
    }

    // 这里判断下是从外部进入还是客户端进入
    function isInnerClient() {
        var sign = gtools.getUrlParam('Sign');
        var uid = gtools.getUrlParam('UserId');
        if (sign && uid) return true;
        return false;
    }
    function init() {
        setAjaxError(); // 设置通用错误
        if (isInnerClient()) {
            apiGenerateUserToken();
            gtools.cookies.setCookie('LinkFrom', 'innerLink');
            return;
        }
        // 外部进入逻辑，查看是否有google或facebook登录的Cookie
        apiGetBaseConfig('outLink');
        gtools.cookies.setCookie('LinkFrom', 'outLink');
    }

    init();
});
