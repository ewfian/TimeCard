class Calendar {
    constructor(query, data) {
        this.container = document.querySelector(query);

        let now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth() + 1;

        this.data = data || this._mock();

        this.build();
        this.bindEvent();
        this.updade();
    }

    build() {
        let root = this.container;
        root.innerHTML = '<section class="picker">\
                            <div class="year_picker">\
                                <span>Year:</span>\
                                <select name="year" id="year_select"></select>\
                            </div>\
                            <table class="month_picker"></table>\
                         </section>';

        root.innerHTML += '<section class="calendar">\
                              <table class="calendar_table" >\
                                <thead class="calendar_table_title"></thead>\
                                <tbody class="calendar_table_body" ></tbody>\
                              <table>\
                        </section>';

        let year_select = root.querySelector('#year_select');
        let month_picker = root.querySelector('.month_picker');

        //创建年份选择器
        for (let i = 0; i < 5; i++) {
            let option = document.createElement('option');
            option.value = this.currentYear - i;
            option.text = this.currentYear - i;
            year_select.appendChild(option);
        }

        //创建月份按钮
        let monthName = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        for (let i = 0; i < monthName.length / 2; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < 2; j++) {
                let index = i * 2 + j;
                let td = document.createElement('td');
                let text = document.createTextNode(monthName[index]);
                td.appendChild(text);

                if (index === this.currentMonth - 1) {
                    td.classList.add('month_selected');
                }
                tr.appendChild(td);
            }
            month_picker.appendChild(tr);
        }

        let header = root.querySelector('.calendar_table_title');

        //创建thead（表头星期）
        let weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let trh = document.createElement('tr');
        weekName.forEach(i => {
            let th = document.createElement('th');
            let text = document.createTextNode(i);
            th.appendChild(text);
            trh.appendChild(th);
        });
        header.appendChild(trh);
    }

    updade() {
        //本月的全部日期
        let days = this._generateDays(this.currentYear, this.currentMonth);

        //本月的假期和调休的工作日
        let free = this.holidays.hasOwnProperty(this.currentYear) ? this.holidays[this.currentYear].free : [];
        let work = this.holidays.hasOwnProperty(this.currentYear) ? this.holidays[this.currentYear].work : [];

        //本月的工作数据
        let data = this.data.hasOwnProperty(this.currentYear) ? this.data[this.currentYear] : [];

        let scbody = this.container.querySelector('.calendar_table_body');
        scbody.innerHTML = '';
        //创建tbody
        for (let i = 0; i < days.length / 7; i++) {
            //创建一行
            let trb = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                let currentDay = days[7 * i + j];

                //当日容器div
                let td = document.createElement('td');
                let day = document.createElement('div');
                day.className = 'calendar_day';
                //非本月变淡
                if (this.currentMonth != currentDay.getMonth() + 1) {
                    day.classList.add('fade');
                }

                //title（日期）
                let title = document.createElement('div');
                title.className = 'calendar_day_title';
                title.appendChild(document.createTextNode(formatDate(currentDay)));

                //footer
                let footer = document.createElement('div');
                footer.className = 'calendar_day_footer';

                if ((currentDay.getDay() === 0 || currentDay.getDay() === 6) && (work.indexOf(formatDateFull(currentDay)) === -1)) {
                    //周末
                    footer.appendChild(document.createTextNode('周末'));
                    footer.classList.add('calendar_day_footer_holiday');
                } else if (free.indexOf(formatDateFull(currentDay)) != -1) {
                    //节假日
                    footer.appendChild(document.createTextNode('节假日'));
                    footer.classList.add('calendar_day_footer_holiday');
                } else {
                    //工作日
                    footer.appendChild(document.createTextNode('工作日'));

                    if (data.hasOwnProperty(formatDateFull(currentDay))) {
                        let currentData = data[formatDateFull(currentDay)];

                        let tipsClasses = ['calendar_day_tips', 'calendar_day_tips_leave', 'calendar_day_tips_late'];
                        //tips
                        let tips = document.createElement('div');
                        tips.className = 'calendar_day_tips';
                        tips.appendChild(document.createTextNode(currentData.attendance.text));
                        tips.classList.add(tipsClasses[currentData.attendance.level]);

                        //content
                        if (currentData.punch_time) {
                            let content = document.createElement('div');
                            content.className = 'calendar_day_content';
                            let ul = document.createElement('ul');
                            currentData.punch_time.forEach(t => {
                                let li = document.createElement('li');
                                let text = document.createTextNode(formatTime(new Date(t)));
                                li.appendChild(text);
                                ul.appendChild(li);
                            });
                            content.appendChild(ul);
                            day.appendChild(content);
                        }
                        day.appendChild(tips);
                    }
                }

                day.appendChild(title);
                day.appendChild(footer);
                td.appendChild(day);
                trb.appendChild(td);
            }
            scbody.appendChild(trb);
        }

        function formatDate(date) {
            return tap2(date.getMonth() + 1) + '-' + tap2(date.getDate());
        }

        function formatDateFull(date) {
            return date.getFullYear() + '' + tap2(date.getMonth() + 1) + '' + tap2(date.getDate());
        }

        function formatTime(date) {
            return tap2(date.getHours()) + ':' + tap2(date.getMinutes()) + ':' + tap2(date.getSeconds());
        }

        function tap2(i) {
            return ('0' + i).slice(-2);
        }
    }

    bindEvent() {
        let year_select = this.container.querySelector('#year_select');
        let month_picker = this.container.querySelector('.month_picker');
        let lastSelectedMonth = this.container.querySelector('.month_selected');

        year_select.onchange = () => {
            this.currentYear = year_select.options[year_select.selectedIndex].value;
            this.updade();
        };

        month_picker.querySelectorAll('td').forEach((td, index) => {
            td.onclick = () => {

                lastSelectedMonth.classList.remove('month_selected');
                td.classList.add('month_selected');
                lastSelectedMonth = td;

                this.currentMonth = index + 1;
                this.updade();
            };
        });
    }

    _generateDays(year, month) {
        let days = [];

        //本月的第一天是周几（上月剩余几天）
        let daysOfLastMonth = new Date(year, month - 1, 1).getDay();
        //本月的总天数
        let daysOfThisMonth = new Date(year, month, 0).getDate();

        //添加上个月最后的几天
        for (let i = daysOfLastMonth; i > 0; i--) {
            days.push(new Date(year, month - 1, -i + 1));
        }

        //添加本月的日期
        for (let i = 0; i < daysOfThisMonth; i++) {
            days.push(new Date(year, month - 1, i + 1));
        }

        let currentDays = daysOfLastMonth + daysOfThisMonth;
        //添加下个月开始的几天
        for (let i = 0; i < Math.ceil(currentDays / 7) * 7 - currentDays; i++) {
            days.push(new Date(year, month, i + 1));
        }
        //console.log(days);
        return days;
    }

    _mock() {
        let data = {};
        let attendances = [{
            text: '辛苦了!',
            level: 0
        }, {
            text: '需请假',
            level: 1
        }, {
            text: '晚到',
            level: 2
        }];

        let currentYear = (new Date()).getFullYear();
        for (let i = 0; i < 5; i++) {
            let year = currentYear - i;
            data[year] = {};
            for (let j = 0; j < 12; j++) {
                //本月总天数
                let totalDays = (new Date(year, j + 1, 0)).getDate();

                //随机生成本月请假和迟到的日期
                let leave = [];
                let late = [];

                for (let m = 0; m < rand(0, 3); m++) {
                    leave.push(rand(1, totalDays));
                }
                for (let n = 0; n < rand(0, 2); n++) {
                    late.push(rand(1, totalDays));
                }

                for (let k = 1; k <= totalDays; k++) {
                    let current = new Date(year, j, k);
                    if (current > new Date()) continue;
                    let month_day = year + tap2(j + 1) + tap2(k);

                    if (leave.indexOf(k) != -1) {
                        //请假
                        data[year][month_day] = {
                            attendance: attendances[1],
                        };

                    } else if (late.indexOf(k) != -1) {
                        //迟到
                        data[year][month_day] = {
                            attendance: attendances[2],
                            punch_time: [
                                new Date(year, j, k, rand(9, 12), rand(0, 60), rand(0, 60)).toUTCString(),
                                new Date(year, j, k, rand(17, 18), rand(0, 60), rand(0, 60)).toUTCString()
                            ]
                        };

                    } else {
                        //正常
                        data[year][month_day] = {
                            attendance: attendances[0],
                            punch_time: [
                                //随机生成当日的上下班时间
                                new Date(year, j, k, rand(8, 9), rand(0, 60), rand(0, 60)).toUTCString(),
                                new Date(year, j, k, rand(17, 18), rand(0, 60), rand(0, 60)).toUTCString()
                            ]
                        };

                    }


                }
            }
        }
        //console.log(data);
        return data;

        //得到一个两数之间的随机整数，包含端点
        function rand(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
        }

        function tap2(i) {
            return ('0' + i).slice(-2);
        }
    }
}

Calendar.prototype.holidays = {
    '2013': {
        free: ['20130101', '20130102', '20130103', '20130209', '20130210', '20130211', '20130212', '20130213', '20130214', '20130215', '20130404', '20130405', '20130406', '20130429', '20130430', '20130501', '20130610', '20130611', '20130612', '20130919', '20130920', '20130921', '20131001', '20131002', '20131003', '20131004', '20131005', '20131006', '20131007'],
        work: ['20130105', '20130106', '20130216', '20130217', '20130407', '20130428', '20130608', '20130609', '20130922', '20130929', '20131012']
    },
    '2014': {
        free: ['20140101', '20140131', '20140203', '20140204', '20140205', '20140206', '20140407', '20140501', '20140502', '20140602', '20140908', '20141001', '20141002', '20141003', '20141006', '20141007'],
        work: ['20140126', '20140208', '20140504', '20140928', '20141011']
    },
    '2015': {
        free: ['20150101', '20150102', '20150218', '20150219', '20150220', '20150223', '20150224', '20150406', '20150501', '20150622', '20150927', '20151001', '20151002', '20151005', '20151006', '20151007'],
        work: ['20150104', '20150215', '20150228', '20151010']
    },
    '2016': {
        free: ['20160101', '20160208', '20160209', '20160210', '20160211', '20160212', '20160213', '20160404', '20160502', '20160609', '20160610', '20160915', '20160916', '20161003', '20161004', '20161005', '20161006', '20161007'],
        work: ['20160206', '20160214', '20160612', '20160918', '20161008', '20161009']
    },
    '2017': {
        free: ['20170102', '20170126', '20170127', '20170130', '20170131', '20170201', '20170202', '20170403', '20170404', '20170501', '20170529', '20170530', '20171002', '20171003', '20171004', '20171005', '20171006'],
        work: ['20170122', '20170204', '20170401', '20170527', '20170930']
    }
};
