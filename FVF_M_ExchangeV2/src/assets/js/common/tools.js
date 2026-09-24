// @ts-nocheck

var gtools = {
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.slice(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return '';
    },
    fmtTime: {
        formatEnglishDate: function (timestamp) {
            var date = new Date(timestamp);
            var months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            var days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];
            //   return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            return `${months[date.getMonth()]} ${date.getDate()}`;
        }
    },
    // 格式化日期 YYYY-MM-DD HH:mm:ss
    fmtRecordTime: function (timestamp) {
        var date = new Date(timestamp);
        return `${date.getFullYear()}-${
            date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },

    cookies: {
        // 设置 Cookie
        setCookie: function (name, value, days) {
            var expires = '';
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = '; expires=' + date.toUTCString();
            }
            // 编码值避免特殊字符问题
            var encodedValue = encodeURIComponent(value);
            document.cookie = name + '=' + encodedValue + expires + '; path=/';
        },
        // 获取 Cookie
        getCookie: function (name) {
            var nameEQ = name + '=';
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
                if (cookie.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(cookie.substring(nameEQ.length));
                }
            }
            return null;
        },
        delCookie: function (name) {
            // 标准删除方式
            document.cookie =
                name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
            // IE9 专用删除方式
            if (document.documentMode && document.documentMode <= 9) {
                document.cookie = name + '=; expires=-1; path=/;';
            }
        }
    },
    sortAndConcatJSON: function (obj) {
        // 获取所有键并排序
        const sortedKeys = Object.keys(obj).sort();

        // 拼接成 Key=Value&Key=Value 格式
        const result = sortedKeys
            .map((key) => {
                return `${key}=${obj[key]}`;
            })
            .join('&');

        return result;
    },
    // 对金额进行千分分隔
    splitMoney: function (money) {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    // 对商品金额进行K,M 单位换算
    changeMoney: function (money) {
        if (money >= 1000000) {
            return money / 1000000 + 'M';
        }
        if (money >= 1000) {
            return money / 1000 + 'K';
        }
        return money;
    },
    isNotEmpty: function (value) {
        return value !== null && value !== undefined;
    }
};
