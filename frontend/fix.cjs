const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboards/LecturerDashboard.tsx', 'utf8');
code = code.replace('dayjs(nextClass.ngay_hoc).format("DD/MM/YYYY")', 'formatDate(nextClass.ngay_hoc)');
code = code.replace('c.ma_lop.toLowerCase()', '(c.ma_lop || "").toLowerCase()');
code = code.replace('c.ten_hoc_phan.toLowerCase()', '(c.ten_hoc_phan || "").toLowerCase()');
fs.writeFileSync('src/pages/dashboards/LecturerDashboard.tsx', code);
console.log('done')
