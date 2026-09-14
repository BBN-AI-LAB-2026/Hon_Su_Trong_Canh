import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { StepGuideItem } from '../types';

export const SEARCH_GUIDE_STEPS: StepGuideItem[] = [
  {
    stepNumber: 1,
    stepCode: 'TÌM KIẾM',
    title: 'Nhập Từ Khóa & Tên Địa Danh Di Tích',
    subtitle: 'Thanh tìm kiếm thông minh hỗ trợ tiếng Việt có dấu, không dấu và gợi ý nhanh',
    icon: <SearchIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Tại thanh tra cứu, người dùng chỉ cần gõ tên di tích lịch sử (ví dụ: Chợ Bến Thành, Chùa Một Cột, Dinh Độc Lập, Văn Miếu Quốc Tử Giám, ...). Hệ thống sẽ ngay lập tức đối soát dữ liệu và lọc ra địa danh phù hợp.',
    keyPoints: [
      'Thuật toán chuẩn hóa tự động: Gõ có dấu hoặc không dấu đều tìm kiếm chính xác (ví dụ: gõ "cho ben thanh" hoặc "Chợ Bến Thành" đều hiển thị kết quả đúng).',
      'Hỗ trợ tra cứu theo tên gọi di tích, địa danh hành chính (Tỉnh / Thành phố) hoặc từ khóa đặc trưng.',
      'Nút xóa nhanh (biểu tượng ✕) giúp làm mới ô tìm kiếm chỉ bằng một lần chạm.',
      'Gợi ý sẵn danh mục các di tích lịch sử tiêu biểu trải dài khắp 3 miền Bắc - Trung - Nam.',
    ],
    tip: 'Bạn có thể nhập các từ khóa vắn tắt như "mot cot", "ben thanh", "hue", "van mieu" để hệ thống tự động lọc nhanh kết quả.',
    highlightBadge: 'Tìm kiếm không dấu và có dấu',
  },
  {
    stepNumber: 2,
    stepCode: 'KẾT QUẢ',
    title: 'Kết quả tìm kiếm',
    subtitle: 'Xem ảnh chân thực, nhãn khu vực địa lý và đoạn tóm lược lịch sử',
    icon: <TouchAppIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Kết quả tra cứu xuất hiện trực quan dưới dạng các thẻ di tích di sản. Mỗi thẻ cung cấp hình ảnh chân thực, nhãn phân vùng miền (Bắc - Trung - Nam), địa chỉ chi tiết và đoạn tóm lược kiến trúc lịch sử.',
    keyPoints: [
      'Mỗi thẻ hiển thị hình ảnh tiêu biểu sắc nét kèm nhãn khu vực địa lý (Miền Bắc, Miền Trung, Miền Nam).',
      'Đoạn trích tóm tắt lịch sử giúp người dùng nắm bắt nhanh nét đặc trưng và ý nghĩa của di tích.',
      'Nhấn nút "Tìm Hiểu" màu đỏ son nổi bật ở chân thẻ để lập tức mở ra không gian khám phá toàn diện.',
      'Giao diện thông báo rõ ràng: Nhắc nhở nhập từ khóa khi chưa gõ và báo "Không có kết quả" kèm hướng dẫn thử lại nếu từ khóa chưa khớp.',
    ],
    tip: 'Nhấn nút "Tìm Hiểu" trên thẻ di tích bạn quan tâm để chuyển ngay sang trang khám phá trọn vẹn các thông tin bổ ích.',
    highlightBadge: 'Xem tóm lược & chọn di tích',
  },
  {
    stepNumber: 3,
    stepCode: 'KHÁM PHÁ',
    title: 'Trải Nghiệm Toàn Diện',
    subtitle: 'Thuyết minh âm thanh 3 thứ tiếng, Sơ đồ tư duy, Dòng thời gian và Thực tế ảo VR 360°',
    icon: <MenuBookIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Sau khi bấm "Tìm Hiểu", hệ thống mở ra không gian khám phá chuyên sâu với đầy đủ 4 tính năng tinh hoa mà không cần phải tải lại ảnh hay qua bước nhận diện:',
    keyPoints: [
      '1. Hồ Sơ Di Sản và Thuyết Minh Audio: Lắng nghe giọng đọc truyền cảm hứng bằng 3 ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Trung) kèm hình ảnh thực tế sắc nét.',
      '2. Sơ Đồ Tư Duy (MindMap): Hệ thống hóa kiến thức di tích qua video đồ họa trực quan và các nhánh thông tin mạch lạc.',
      '3. Khôi Phục Dòng Thời Gian: Tham gia mini-game xếp niên biểu lịch sử để thử tài tri thức và mở khóa Cổng Thời Gian.',
      '4. Thực Tế Ảo VR 360°: Đắm chìm vào không gian 360° chân thực của di tích, tương tác xoay góc nhìn và trải nghiệm toàn màn hình.',
    ],
    tip: 'Bạn có thể chuyển đổi linh hoạt giữa 4 tab ở đầu trang khám phá, hoặc nhấn nút "Tra cứu địa danh khác" để quay lại tìm kiếm thêm các di tích khác.',
    highlightBadge: 'Hồ sơ đa ngôn ngữ và VR 360°',
  },
];

export const GUIDE_STEPS: StepGuideItem[] = [
  {
    stepNumber: 1,
    stepCode: 'ĐĂNG ẢNH',
    title: 'Đăng Tải Hình Ảnh Thực Địa',
    subtitle: 'Khởi đầu hành trình với hình ảnh di tích chụp từ camera hoặc thiết bị',
    icon: <CameraAltIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Người dùng có thể tải lên ảnh chụp thực tế của di tích lịch sử từ thư viện thiết bị hoặc trực tiếp kích hoạt camera chụp ngay tại điểm di tích.',
    keyPoints: [
      'Hỗ trợ định dạng phổ biến: .JPG, .JPEG, .PNG, .WEBP với độ phân giải linh hoạt.',
      'Tính năng Kéo - Thả ảnh trực tiếp vào khung tải ảnh nhanh chóng, tiện lợi.',
      'Tự động tích hợp thuật toán tăng cường độ nét siêu phân giải trong chế độ nền khi ảnh chụp có kích thước dưới 500px.',
      'Hỗ trợ chế độ camera thực địa: Chụp ảnh tức thì trên điện thoại.',
    ],
    tip: 'Nên chụp toàn cảnh mặt tiền, cổng chính hoặc các kiến trúc hoa văn đặc trưng dưới điều kiện đủ sáng để mô hình AI nhận diện chuẩn xác nhất.',
    highlightBadge: 'Chụp và Đăng ảnh',
  },
  {
    stepNumber: 2,
    stepCode: 'NHẬN DIỆN',
    title: 'Hệ Thống Nhận Diện & Hồ Sơ Di Sản',
    subtitle: 'Mô hình AI nhận diện danh tính di tích và trích xuất hồ sơ văn hóa chuyên sâu',
    icon: <SearchIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Mô hình Mobinet V2 nhận diện chính xác tên di tích lịch sử và tự động mở ra hồ sơ di sản toàn diện với đầy đủ niên đại và giá trị văn hóa.',
    keyPoints: [
      'Tự động hiển thị tên chính thức của di tích kèm vị trí hành chính (Tỉnh / Thành phố).',
      'Cung cấp thông tin niên đại khởi lập, các triều đại lịch sử gắn liền.',
      'Trình phát Thuyết Minh Âm Thanh Di Sản truyền cảm hứng, hỗ trợ phát/dừng linh hoạt.',
      'Mức chặn an toàn nếu độ tin cậy dưởi 60%.',
    ],
    tip: 'Nếu ảnh mờ hoặc hệ thống cảnh báo độ tin cậy dưới 60%, bạn chỉ cần bấm "Đổi ảnh khác" để chụp lại một góc rõ nét hơn.',
    highlightBadge: 'Nhận diện hình ảnh',
  },
  {
    stepNumber: 3,
    stepCode: 'SƠ ĐỒ KIẾN THỨC',
    title: 'Sơ Đồ Tư Duy Tri Thức (Mindmap)',
    subtitle: 'Hệ thống hóa toàn diện thông tin di tích dưới dạng cây tri thức trực quan',
    icon: <AccountTreeIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Sơ đồ tư duy đa chiều liên kết bối cảnh lịch sử, nhân vật phụ trách, kiến trúc và giá trị di sản giúp người xem ghi nhớ và thấu hiểu lịch sử một cách khoa học.',
    keyPoints: [
      'Cấu trúc cây tri thức đa phân nhánh: Bối cảnh khởi dựng, Sự kiện lịch sử, Kiến trúc nghệ thuật và Ý nghĩa thời đại.',
      'Giao diện trực quan, rõ nét, dễ đọc, phù hợp cho học tập, nghiên cứu và tham quan di sản.',
      'Dễ dàng kết nối các mắt xích thông tin lịch sử từ ngàn xưa đến ngày nay.',
    ],
    tip: 'Sau khi nắm bắt cấu trúc sơ đồ tư duy, nhấn nút "Tiếp Theo: Khôi Phục Dòng Thời Gian" để bước sang phần thử thách lịch sử thú vị.',
    highlightBadge: 'Sơ đồ tri thức trực quan',
  },
  {
    stepNumber: 4,
    stepCode: 'DÒNG THỜI GIAN',
    title: 'Khôi Phục Dòng Thời Gian',
    subtitle: 'Tham gia mini-game thử tài kiến thức cùng Giáo Sư Trần Sử - Nhà du hành thời gian',
    icon: <TimelineIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Trò chơi tương tác giúp người dùng vừa chơi vừa học: Trả lời các câu đố lịch sử và sắp xếp các cột mốc niên biểu theo đúng trật tự lịch sử để mở khóa "Cổng Thời Gian".',
    keyPoints: [
      'Bộ câu hỏi trắc nghiệm đố vui hấp dẫn, bám sát các sự kiện lịch sử của di tích vừa nhận diện.',
      'Thao tác kéo thả hoặc chọn mốc niên biểu trực quan, tái hiện sinh động tiến trình lịch sử oai hùng.',
      'Tích lũy điểm thưởng kiến thức và nhận danh hiệu di sản danh dự khi hoàn thành xuất sắc.',
    ],
    tip: 'Hãy chú ý các mốc niên đại đã được thuyết minh ở Bước 2 và Bước 3 để hoàn thành thử thách!',
    highlightBadge: 'Vừa học, vừa chơi tương tác',
  },
  {
    stepNumber: 5,
    stepCode: 'VR 360° TOUR',
    title: 'Khám Phá Toàn Cảnh VR 360° Tour',
    subtitle: 'Đắm chìm vào không gian thực tế ảo 360° sống động tại di tích lịch sử',
    icon: <ViewInArIcon sx={{ fontSize: 24, color: '#8E201B' }} />,
    summary:
      'Trải nghiệm thực tế ảo toàn cảnh 360° đưa người dùng như đang đứng giữa lòng di sản, thỏa sức chiêm ngưỡng kiến trúc tinh xảo và cảnh quan hùng vĩ.',
    keyPoints: [
      'Tự do xoay 360° bằng cách kéo chuột trên máy tính hoặc vuốt chạm nhẹ trên thiết bị cảm ứng.',
      'Có thể phóng to toàn màn hình sắc nét.',
      'Trải nghiệm chân thực không gian kiến trúc truyền thống của các di tích.',
      'Sau khi hoàn thành, nhấn nút "Hoàn tất" để quay về tiếp tục hành trình với địa danh tiếp theo.',
    ],
    tip: 'Sử dụng chế độ Toàn màn hình trên thiết bị để có trải nghiệm không gian VR ấn tượng nhất.',
    highlightBadge: 'Không gian số 360° sống động',
  },
];
