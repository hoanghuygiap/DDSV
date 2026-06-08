export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  target: string;
  date: string;
  status: "SENT" | "SENDING";
  content?: string;
  imageUrl?: string;
  sender?: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Thông báo nghỉ lễ Quốc khánh",
    summary: "Sinh viên được nghỉ từ ngà...",
    target: "Tất cả",
    date: "25/08/2023 09:00",
    status: "SENT",
  },
  {
    id: "2",
    title: "Cập nhật lịch thi học kỳ II",
    summary: "Mời các em sinh viên vào x...",
    target: "Sinh viên",
    date: "Vừa xong",
    status: "SENDING",
    sender: "Quản trị viên",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
    content: "Kính gửi các em sinh viên toàn trường,\n\nPhòng Đào tạo xin thông báo về việc cập nhật lịch thi chính thức cho Học kỳ II năm học 2023-2024. Một số môn học đã được điều chỉnh thời gian và phòng thi để tránh xung đột lịch trình.\n\nCác em vui lòng đăng nhập vào cổng thông tin sinh viên để kiểm tra lịch thi chi tiết của mình. Mọi thắc mắc xin vui lòng liên hệ văn phòng khoa trước ngày 15/09."
  },
  {
    id: "3",
    title: "Họp Hội đồng Khoa học tháng 9",
    summary: "Kính mời các thầy cô tham ...",
    target: "Giảng viên",
    date: "20/08/2023 14:30",
    status: "SENT",
  },
  {
    id: "4",
    title: "Bảo trì hệ thống Portal",
    summary: "Hệ thống sẽ tạm ngưng ho...",
    target: "Tất cả",
    date: "15/08/2023 08:15",
    status: "SENT",
  }
];
