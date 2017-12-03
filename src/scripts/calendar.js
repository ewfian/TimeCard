class Calendar {
    constructor(query, year, month) {
        this.year = year;
        this.month = month;
        this.container = document.querySelector(query);
        this.build();
    }

    build() {
        let days = this.generateDays();

        let root = this.container;
        root.innerHTML = '<table class="calendar_table" >\
                            <thead class="calendar_table_title">\
                            </thead>\
                            <tbody class="calendar_table_body" >\
                            </tbody>\
                          <table>';

        let header = root.querySelector('.calendar_table_title');
        let scbody = root.querySelector('.calendar_table_body');

        //创建thead
        let weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let trh = document.createElement('tr');
        weekName.forEach(i => {
            let th = document.createElement('th');
            let text = document.createTextNode(i);
            th.appendChild(text);
            trh.appendChild(th);
        });
        header.appendChild(trh);

        //创建tbody
        for (var i = 0; i < days.length / 7; i++) {
            //创建一行
            let trb = document.createElement('tr');
            for (var j = 0; j < 7; j++) {
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

                title.appendChild(document.createTextNode(this.formatDate(days[7 * i + j])));
                tips.appendChild(document.createTextNode('辛苦了!'));

                let ul = document.createElement('ul');
                for (let i = 0; i < 2; i++) {
                    let li = document.createElement('li');
                    let text = document.createTextNode('10:01:01');
                    li.appendChild(text);
                    ul.appendChild(li);
                }
                content.appendChild(ul);

                footer.appendChild(document.createTextNode('工作日'));

                day.appendChild(title);
                day.appendChild(tips);
                day.appendChild(content);
                day.appendChild(footer);
                td.appendChild(day);
                trb.appendChild(td);
            }
            scbody.appendChild(trb);
        }

    }

    formatDate(date) {
        return (date.getMonth() + 1) + '-' + date.getDate();
    }

    generateDays() {
        let days = [];

        //本月的第一天是周几（上月剩余几天）
        let daysOfLastMonth = new Date(this.year, this.month - 1, 1).getDay();
        //本月的总天数
        let daysOfThisMonth = new Date(this.year, this.month, 0).getDate();

        //添加上个月最后的几天
        for (let i = daysOfLastMonth; i > 0; i--) {
            days.push(new Date(this.year, this.month - 1, -i + 1));
        }

        //添加本月的日期
        for (let i = 0; i < daysOfThisMonth; i++) {
            days.push(new Date(this.year, this.month - 1, i + 1));
        }

        let currentDays = daysOfLastMonth + daysOfThisMonth;
        //添加下个月开始的几天
        for (let i = 0; i < Math.ceil(currentDays / 7) * 7 - currentDays; i++) {
            days.push(new Date(this.year, this.month, i + 1));
        }
        console.log(days);
        return days;
    }
}
