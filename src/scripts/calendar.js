class Calendar {
    constructor(query) {
        this.container = document.querySelector(query);

        let now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth() + 1;

        this.build();
        this.updade();
        this.bindEvent();
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

                if (index == this.currentMonth - 1) {
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
        let days = this.generateDays(this.currentYear, this.currentMonth);
        let scbody = this.container.querySelector('.calendar_table_body');
        scbody.innerHTML = '';
        //创建tbody
        for (let i = 0; i < days.length / 7; i++) {
            //创建一行
            let trb = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                let index = 7 * i + j;
                let currentDay = days[index].getDay();

                let td = document.createElement('td');
                let day = document.createElement('div');
                day.className = 'calendar_day';

                //title
                let title = document.createElement('div');
                title.className = 'calendar_day_title';
                //tips
                let tips = document.createElement('div');
                tips.className = 'calendar_day_tips';
                //content
                let content = document.createElement('div');
                content.className = 'calendar_day_content';
                //footer
                let footer = document.createElement('div');
                footer.className = 'calendar_day_footer';

                title.appendChild(document.createTextNode(this._formatDate(days[index])));
                tips.appendChild(document.createTextNode('辛苦了!'));

                let ul = document.createElement('ul');
                for (let i = 0; i < 2; i++) {
                    let li = document.createElement('li');
                    let text = document.createTextNode('08:52:43');
                    li.appendChild(text);
                    ul.appendChild(li);
                }
                content.appendChild(ul);



                day.appendChild(title);

                if (currentDay != 0 && currentDay != 6) {
                    day.appendChild(tips);
                    footer.appendChild(document.createTextNode('工作日'));
                } else {
                    footer.appendChild(document.createTextNode('周末'));
                }

                day.appendChild(content);
                day.appendChild(footer);
                td.appendChild(day);
                trb.appendChild(td);
            }
            scbody.appendChild(trb);
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

        month_picker.onclick = (i) => {
            this.currentMonth = i.path[1].rowIndex * 2 + i.path[0].cellIndex + 1;
            if (isNaN(this.currentMonth)) return; //没点上cell

            lastSelectedMonth.classList.remove('month_selected');
            i.path[0].classList.add('month_selected');
            lastSelectedMonth = i.path[0];

            this.updade();
            //console.log(this.currentMonth);
        };
    }

    _formatDate(date) {
        return (date.getMonth() + 1) + '-' + date.getDate();
    }

    generateDays(year, month) {
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
}
