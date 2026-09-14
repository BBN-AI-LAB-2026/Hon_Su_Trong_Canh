import { MonumentDetailed } from '../types';

export const SAMPLE_MONUMENTS: MonumentDetailed[] = [
  {
    id: 'van-mieu-quoc-tu-giam',
    name: 'Văn Miếu - Quốc Tử Giám',
    location: 'Phường Văn Miếu - Quốc Tử Giám, Thành phố Hà Nội',
    region: 'Bắc',
    coordinates: {
      lat: 21.0278,
      lng: 105.8358,
      xPercent: 54,
      yPercent: 18,
    },
    thumbnailUrl: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236553/tmb_vm.jpg',
    shortDescription: 'Trường đại học đầu tiên của Việt Nam, biểu tượng đỉnh cao của nền nho học và tinh thần hiếu học dân tộc.',
    historicalStory: `Văn Miếu - Quốc Tử Giám được khởi dựng vào năm 1070 dưới triều vua Lý Thánh Tông nhằm thờ phụng Khổng Tử, các bậc hiền triết Nho gia và dạy dỗ Hoàng tử. Năm 1076, vua Lý Nhân Tông cho lập Quốc Tử Giám ngay kề bên, mở đầu cho nền giáo dục đại học chính quy đầu tiên của nước Đại Việt.

Trải qua hơn 900 năm lịch sử, nơi đây đã đào tạo hàng nghìn bậc hiền tài, trạng nguyên, tiến sĩ phụng sự giang sơn. Nổi bật nhất trong quần thể là Khuê Văn Các - biểu tượng văn hiến thủ đô Hà Nội, giếng Thiên Quang thanh tịnh và 82 bia đá tiến sĩ đặt trên lưng rùa đá uy nghiêm, được UNESCO vinh danh là Di sản tư liệu thế giới.`,
    audioNarrationText: `Chào mừng bạn đến với Văn Miếu Quốc Tử Giám - trường đại học đầu tiên của Việt Nam. Được khởi lập từ thế kỷ 11 thời nhà Lý, nơi đây gìn giữ tinh hoa hiếu học của ngàn năm văn hiến Thăng Long. Bước qua Khuê Văn Các uy nghi soi bóng xuống giếng Thiên Quang, bạn sẽ chiêm ngưỡng tám mươi hai bia tiến sĩ khắc tên các bậc hiền tài giang sơn. Hãy lắng lòng để cảm nhận truyền thống tôn sư trọng đạo thiêng liêng trường tồn cùng đất nước.`,
    architecturalHighlights: [
      'Khuê Văn Các - Công trình kiến trúc gỗ lầu vuông 8 mái độc đáo',
      'Giếng Thiên Quang - Mang ý nghĩa hội tụ tinh hoa đất trời',
      '82 Bia Tiến sĩ - Di sản tư liệu thế giới khắc tên các bậc danh nho từ khoa thi 1442',
      'Đại Thành môn & Nhà Thái Học - Trung tâm học tập và tôn vinh Nho học',
    ],
    timeline: [
      { year: '1070', title: 'Khởi dựng Văn Miếu', description: 'Vua Lý Thánh Tông cho xây dựng Văn Miếu thờ Chu Công, Khổng Tử và dạy học.' },
      { year: '1076', title: 'Thành lập Quốc Tử Giám', description: 'Vua Lý Nhân Tông cho lập Quốc Tử Giám - trường đại học đầu tiên của Việt Nam.' },
      { year: '1484', title: 'Khởi xướng dựng Bia Tiến sĩ', description: 'Vua Lê Thánh Tông ban sắc lệnh khắc bia đá đề danh tiến sĩ đỗ đạt.' },
      { year: '1805', title: 'Xây dựng Khuê Văn Các', description: 'Tổng trấn Nguyễn Văn Thành cho dựng Khuê Văn Các biểu trưng cho văn chương tinh tú.' },
      { year: '2010', title: 'Vinh danh Di sản Thế giới', description: 'UNESCO chính thức công nhận 82 Bia Tiến sĩ là Di sản tư liệu thế giới.' },
    ],
    quiz: [
      {
        id: 'vm-q1',
        question: 'Văn Miếu được khởi dựng dưới triều đại vua nào?',
        options: ['Lý Thái Tổ', 'Lý Thánh Tông', 'Trần Nhân Tông', 'Lê Thánh Tông'],
        correctIndex: 1,
        explanation: 'Văn Miếu được khởi dựng vào mùa thu năm Canh Tuất (1070) dưới triều vua Lý Thánh Tông.',
      },
      {
        id: 'vm-q2',
        question: 'Hiện nay trong Văn Miếu còn lưu giữ bao nhiêu Bia Tiến sĩ?',
        options: ['72 bia', '82 bia', '92 bia', '102 bia'],
        correctIndex: 1,
        explanation: 'Quần thể Văn Miếu - Quốc Tử Giám hiện bảo tồn nguyên vẹn 82 tấm bia tiến sĩ ghi danh các khoa thi từ 1442 đến 1779.',
      },
      {
        id: 'vm-q3',
        question: 'Công trình nào tại Văn Miếu được chọn làm biểu tượng chính thức của thủ đô Hà Nội?',
        options: ['Đoan Môn', 'Cột Cờ Hà Nội', 'Khuê Văn Các', 'Cầu Long Biên'],
        correctIndex: 2,
        explanation: 'Khuê Văn Các với lầu vuông tám mái thanh thoát đã được luật Thủ đô chọn làm biểu tượng chính thức của Hà Nội.',
      },
    ],
    panoramas: [
      {
        id: 'vm-pano-1',
        title: 'Sân Khuê Văn Các & Giếng Thiên Quang',
        imageUrl: 'https://images.unsplash.com/photo-1599818814725-b82b992fcaef?auto=format&fit=crop&w=1800&q=80',
        description: 'Toàn cảnh không gian tĩnh mịch với bóng cổ thụ và lầu Khuê Văn Các phản chiếu xuống giếng ngọc.',
      },
      {
        id: 'vm-pano-2',
        title: 'Khu Vườn Bia Tiến Sĩ',
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
        description: 'Dãy nhà bia hai bên che chở cho 82 rùa đá ngậm bia lưu truyền muôn đời.',
      },
    ],
  },
  {
    id: 'co-do-hue-ngo-mon',
    name: 'Đại Nội Huế - Ngọ Môn',
    location: 'Phường Phú Xuân, Thành phố Huế',
    region: 'Trung',
    coordinates: {
      lat: 16.4697,
      lng: 107.5796,
      xPercent: 62,
      yPercent: 44,
    },
    thumbnailUrl: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236028/tmb_nmon.jpg',
    shortDescription: 'Cửa chính phía nam của Hoàng thành Huế, tuyệt tác kiến trúc cung đình triều Nguyễn uy nghi tráng lệ.',
    historicalStory: `Ngọ Môn là cổng chính phía Nam của Hoàng thành Huế, được xây dựng năm 1833 dưới triều vua Minh Mạng. Cái tên "Ngọ Môn" mang ý nghĩa quay mặt về hướng Ngọ (hướng Nam) - hướng của bậc đế vương theo dịch lý phương Đông để "nam diện nhi thính thiên hạ" (hướng về phía nam để lắng nghe thiên hạ).

Phía trên nền cổng bằng đá Thanh là lầu Ngũ Phụng tráng lệ với cấu trúc gỗ lim đồ sộ, chia thành 9 gian với 100 cột biểu tượng cho sự trường cửu. Nơi đây từng diễn ra các đại lễ trọng đại nhất của vương triều Nguyễn: lễ Truyền Lô (xướng danh tiến sĩ), lễ Ban Sóc (phát lịch mới), và đặc biệt vào ngày 30/8/1945, vua Bảo Đại đã đọc Chiếu Thoái vị, trao ấn kiếm cho phái đoàn chính phủ lâm thời Việt Nam Dân chủ Cộng hòa, chấm dứt chế độ quân chủ phong kiến.`,
    audioNarrationText: `Đứng trước Ngọ Môn kinh thành Huế, bạn đang chạm tay vào chứng nhân vĩ đại của vương triều phong kiến cuối cùng tại Việt Nam. Được kiến tạo năm 1833, tầng trên là lầu Ngũ Phụng như cánh chim phượng hoàng sải cánh che chở giang sơn. Tại cổng giữa chỉ dành riêng cho Thiên tử ngự hành, tiếng chuông đồng và trống lệnh từng vang vọng khắp kinh kỳ. Lịch sử ngàn năm đọng lại trong từng viên gạch hoa văn rồng uốn lượn uy nghiêm.`,
    architecturalHighlights: [
      'Hệ thống 5 cửa: Cửa chính giữa (Ngọ Môn) dành cho vua, hai bên Tả/Hữu Giáp môn và Tả/Hữu Dịch môn',
      'Lầu Ngũ Phụng - Kiệt tác lầu gỗ mái ngói hoàng lưu ly và thanh lưu ly',
      'Hồ Thái Dịch và cầu Trung Đạo lát đá thanh',
      'Bố cục phong thủy hài hòa tả thanh long (Cồn Hến), hữu bạch hổ (Cồn Dã Viên)',
    ],
    timeline: [
      { year: '1802', title: 'Thành lập Vương triều Nguyễn', description: 'Vua Gia Long thống nhất đất nước, chọn Huế làm kinh đô.' },
      { year: '1833', title: 'Xây dựng Ngọ Môn', description: 'Vua Minh Mạng quy hoạch xây dựng cổng Ngọ Môn và lầu Ngũ Phụng nguy nga.' },
      { year: '1945', title: 'Lễ thoái vị của Vua Bảo Đại', description: 'Vua Bảo Đại trao ấn kiếm, chấm dứt hoàn toàn chế độ phong kiến Việt Nam.' },
      { year: '1993', title: 'UNESCO công nhận Di sản', description: 'Quần thể Di tích Cố đô Huế trở thành Di sản Văn hóa Thế giới đầu tiên của Việt Nam.' },
    ],
    quiz: [
      {
        id: 'hue-q1',
        question: 'Ngọ Môn được xây dựng dưới thời vị hoàng đế nào?',
        options: ['Gia Long', 'Minh Mạng', 'Tự Đức', 'Khải Định'],
        correctIndex: 1,
        explanation: 'Ngọ Môn được khởi công xây dựng vào năm 1833 dưới triều vua Minh Mạng.',
      },
      {
        id: 'hue-q2',
        question: 'Lầu phía trên Ngọ Môn có tên gọi dân gian và kiến trúc là gì?',
        options: ['Lầu Bát Giác', 'Lầu Vọng Cảnh', 'Lầu Ngũ Phụng', 'Lầu Nghinh Lương'],
        correctIndex: 2,
        explanation: 'Phía trên cổng là lầu Ngũ Phụng nguy nga, nhìn từ xa như năm con chim phụng đang đậu xuống.',
      },
      {
        id: 'hue-q3',
        question: 'Sự kiện lịch sử trọng đại nào diễn ra tại lầu Ngọ Môn vào tháng 8 năm 1945?',
        options: ['Ký hiệp định Paris', 'Vua Bảo Đại tuyên bố thoái vị', 'Lễ đăng quang của vua Hàm Nghi', 'Lễ khánh thành đường sắt Bắc Nam'],
        correctIndex: 1,
        explanation: 'Ngày 30/8/1945, vua Bảo Đại tuyên bố thoái vị tại lầu Ngọ Môn với câu nói nổi tiếng thà làm dân một nước độc lập hơn làm vua một nước nô lệ.',
      },
    ],
    panoramas: [
      {
        id: 'hue-pano-1',
        title: 'Toàn cảnh Quảng trường Ngọ Môn & Kỳ Đài',
        imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1800&q=80',
        description: 'Góc nhìn 360 độ ngắm trọn vẹn bờ thành đá rêu phong và lá cờ tổ quốc bay phấp phới trên Kỳ Đài.',
      },
      {
        id: 'hue-pano-2',
        title: 'Nội điện Thái Hòa & Sân Đại Triều',
        imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1800&q=80',
        description: 'Không gian tôn nghiêm nơi các quan văn võ xếp hàng chầu thiên tử thời Nguyễn.',
      },
    ],
  },
  {
    id: 'chua-cau-hoi-an',
    name: 'Chùa Cầu Hội An (Lai Viễn Kiều)',
    location: 'TP. Hội An, Quảng Nam',
    region: 'Trung',
    coordinates: {
      lat: 15.8771,
      lng: 108.3259,
      xPercent: 65,
      yPercent: 49,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Cây cầu ngói cổ kính vắt ngang lạch nước, linh hồn kết tinh văn hóa giao thương của phố cổ Hội An.',
    historicalStory: `Chùa Cầu (còn gọi là Cầu Nhật Bản, hay Lai Viễn Kiều) được các thương nhân Nhật Bản định cư tại Hội An góp tiền xây dựng vào khoảng đầu thế kỷ 17. Tương truyền, cây cầu được ví như một thanh kiếm báu trấn yểm lưng con quái vật Namazu (mãng xà thần bí đầu ở Nhật Bản, mình ở Việt Nam và đuôi ở Ấn Độ), giúp xứ sở tránh khỏi các thảm họa động đất lụt lội.

Đến năm 1719, chúa Nguyễn Phúc Chu khi vi hành Hội An đã ban tặng bức hoành phi sơn son thếp vàng ba chữ "Lai Viễn Kiều" (Cầu đón khách phương xa). Điểm độc đáo hiếm có là cầu kết hợp với chùa: chùa không thờ Phật mà thờ thần Bắc Đế Trấn Vũ - vị thần chuyên trị phong ba bão lụt, che chở bình an cho cư dân thương cảng. Hai đầu cầu có tượng Thần Chó (Thiên Cẩu) và Thần Khỉ (Thân Hầu) canh giữ ngày đêm.`,
    audioNarrationText: `Lắng nghe tiếng nước êm đềm dưới chân Chùa Cầu Hội An - tuyệt phẩm giao thoa văn hóa giữa Việt Nam, Nhật Bản và Trung Hoa. Xây dựng từ thế kỷ 17, cây cầu mái ngói âm dương trầm mặc soi bóng xuống dòng sông Hoài êm ả. Không gian bên trong thờ thần Bắc Đế Trấn Vũ hộ trì gió thuận mưa hòa. Hình ảnh Chùa Cầu đã trở thành linh hồn thân thương, được vinh dự in trên tờ tiền polymer 20.000 đồng của Việt Nam.`,
    architecturalHighlights: [
      'Kiến trúc "Thượng gia hạ kiều" (Trên là nhà ngói, dưới là cầu gỗ)',
      'Tượng linh thú Thần Thân (khỉ) và Thần Cẩu (chó) bằng gỗ mít chạm khắc tinh xảo',
      'Mái ngói âm dương rêu phong cổ kính che chắn mưa nắng xứ nhiệt đới',
      'Hoành phi "Lai Viễn Kiều" ghi dấu ân tình chúa Nguyễn thời mở cõi',
    ],
    timeline: [
      { year: '1593', title: 'Khởi công xây dựng', description: 'Các thương gia Nhật Bản bắt đầu dựng cầu nối liền khu phố người Nhật và khu phố người Hoa.' },
      { year: '1719', title: 'Chúa Nguyễn ngự ban tên', description: 'Chúa Nguyễn Phúc Chu thăm Hội An, đặt tên cầu là Lai Viễn Kiều (cầu đón bạn xa).' },
      { year: '1999', title: 'Được công nhận Di sản', description: 'Được UNESCO công nhận là Di sản Văn hóa Thế giới cùng đô thị cổ Hội An.' },
      { year: '2024', title: 'Đại trùng tu bảo tồn', description: 'Hoàn thành đợt trùng tu khoa học quy mô lớn nhất bảo vệ kết cấu cổ cho muôn đời sau.' },
    ],
    quiz: [
      {
        id: 'ha-q1',
        question: 'Chùa Cầu Hội An được thương nhân nước nào khởi xướng xây dựng đầu tiên?',
        options: ['Bồ Đào Nha', 'Hà Lan', 'Nhật Bản', 'Pháp'],
        correctIndex: 2,
        explanation: 'Chùa Cầu được cộng đồng kiều dân thương nhân Nhật Bản xây dựng vào khoảng thế kỷ 17 để tiện giao thương.',
      },
      {
        id: 'ha-q2',
        question: 'Ngôi chùa nằm trên cầu thờ vị thần nào?',
        options: ['Phật Thích Ca', 'Quan Thế Âm', 'Bắc Đế Trấn Vũ', 'Thần Đất Thổ Công'],
        correctIndex: 2,
        explanation: 'Chùa Cầu không thờ tượng Phật mà thờ thần Bắc Đế Trấn Vũ - vị thần bảo trợ mùa màng, trừ tà và trấn phong ba bão lụt.',
      },
      {
        id: 'ha-q3',
        question: 'Hình ảnh Chùa Cầu Hội An được in trên mệnh giá tiền polymer nào của Việt Nam?',
        options: ['10.000 VNĐ', '20.000 VNĐ', '50.000 VNĐ', '100.000 VNĐ'],
        correctIndex: 1,
        explanation: 'Di tích Chùa Cầu Hội An được in trang trọng trên mặt sau của tờ tiền polymer mệnh giá 20.000 VNĐ.',
      },
    ],
    panoramas: [
      {
        id: 'ha-pano-1',
        title: 'Phố cổ Hội An & Chùa Cầu về đêm',
        imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1800&q=80',
        description: 'Khung cảnh lung linh huyền ảo với hàng nghìn lồng đèn ngũ sắc thắp sáng soi bóng sông Hoài.',
      },
      {
        id: 'ha-pano-2',
        title: 'Gian thờ Bắc Đế Trấn Vũ bên trong Chùa Cầu',
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
        description: 'Kết cấu rường cột gỗ mít chạm rồng phượng và gian thờ cổ kính trầm hương.',
      },
    ],
  },
  {
    id: 'dinh-doc-lap-tphcm',
    name: 'Dinh Độc Lập (Dinh Thống Nhất)',
    location: 'Phường Bến Thành, Thành phố Hồ Chí Minh',
    region: 'Nam',
    coordinates: {
      lat: 10.7770,
      lng: 106.6954,
      xPercent: 55,
      yPercent: 82,
    },
    thumbnailUrl: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235910/tmb_ddl.jpg',
    shortDescription: 'Di tích quốc gia đặc biệt, biểu tượng của sự thống nhất đất nước non sông thu về một mối ngày 30/4/1975.',
    historicalStory: `Dinh Độc Lập tọa lạc trên khuôn viên rộng 12 hécta giữa lòng Sài Gòn, được thiết kế bởi kiến trúc sư tài ba Ngô Viết Thụ - người Việt Nam đầu tiên đoạt giải Khôi nguyên La Mã danh giá. Công trình khởi công năm 1962 và hoàn thành năm 1966, mang triết lý phương Đông sâu sắc: mặt bằng tạo thành chữ Cát (tốt lành), chữ Khẩu (coi trọng giáo dục, tự do ngôn luận) và chữ Trung (ngay thẳng).

Trưa ngày 30/4/1975, hai chiếc xe tăng số hiệu 843 và 390 của Quân Giải phóng đã húc đổ cánh cổng sắt của Dinh, cắm lá cờ chiến thắng lên nóc dinh thự, đánh dấu mốc son chói lọi kết thúc thắng lợi cuộc kháng chiến trường kỳ, đất nước Việt Nam hoàn toàn độc lập, thống nhất.`,
    audioNarrationText: `Chào bạn đang ngắm nhìn Dinh Độc Lập - công trình kiến trúc hiện đại hòa quyện triết học phương Đông độc đáo. Từ các bức rèm hoa đá hình hoa trúc cách điệu đón gió mát, đến đại sảnh khánh tiết lộng lẫy và boong-ke hầm ngầm cơ mật dưới lòng đất. Hình ảnh chiếc xe tăng tiến vào cổng trưa ngày ba mươi tháng tư năm 1975 sẽ mãi mãi khắc sâu trong trái tim mỗi người con đất Việt như một khúc ca khải hoàn non sông một dải.`,
    architecturalHighlights: [
      'Bức rèm hoa đá hình gióng trúc thanh nhã ở mặt tiền lầu 2 vừa cản nắng vừa thông gió',
      'Phòng Khánh tiết tráng lệ với sức chứa hàng trăm quan khách ngoại giao',
      'Hệ thống hầm ngầm boong-ke kiên cố chống bom pháo với phòng tham mưu và thiết bị vô tuyến điện tử cổ',
      'Sân bay trực thăng trên nóc dinh thự cùng vết bom lịch sử',
    ],
    timeline: [
      { year: '1868', title: 'Dinh Norodom thời Pháp', description: 'Thống đốc Pháp De La Grandière đặt viên đá đầu tiên xây dựng Dinh Norodom.' },
      { year: '1962', title: 'Khởi công xây Dinh mới', description: 'Kiến trúc sư Ngô Viết Thụ thiết kế đồ án mới theo phong cách hiện đại kết hợp chữ Nho.' },
      { year: '1966', title: 'Khánh thành Dinh Độc Lập', description: 'Công trình kiến trúc hiện đại hàng đầu Đông Nam Á lúc bấy giờ chính thức mở cửa.' },
      { year: '1975', title: 'Ngày toàn thắng thống nhất', description: 'Xe tăng húc đổ cổng Dinh Độc Lập ngày 30/4, non sông liền một dải.' },
      { year: '2009', title: 'Di tích quốc gia đặc biệt', description: 'Thủ tướng Chính phủ xếp hạng Dinh Độc Lập là một trong 10 di tích quốc gia đặc biệt đầu tiên.' },
    ],
    quiz: [
      {
        id: 'ddl-q1',
        question: 'Ai là kiến trúc sư thiết kế Dinh Độc Lập hiện nay?',
        options: ['Huỳnh Tấn Phát', 'Ngô Viết Thụ', 'Võ Trọng Nghĩa', 'Paul Hermite'],
        correctIndex: 1,
        explanation: 'Kiến trúc sư tài danh Ngô Viết Thụ, người từng đoạt giải Khôi nguyên La Mã (Grand Prix de Rome), là tác giả thiết kế công trình.',
      },
      {
        id: 'ddl-q2',
        question: 'Chiếc xe tăng đầu tiên tiến vào húc nghiêng cổng phụ Dinh Độc Lập ngày 30/4/1975 mang số hiệu bao nhiêu?',
        options: ['Xe tăng 390', 'Xe tăng 843', 'Xe tăng 985', 'Xe tăng 124'],
        correctIndex: 1,
        explanation: 'Xe tăng 843 do Trung úy Bùi Quang Thận chỉ huy đã húc nghiêng cổng phụ, và xe tăng 390 sau đó húc đổ bung cánh cổng chính.',
      },
      {
        id: 'ddl-q3',
        question: 'Mặt bằng tổng thể của Dinh Độc Lập được kiến trúc sư thiết kế ẩn chứa các chữ Nho nào mang ý nghĩa chúc phúc?',
        options: ['Phúc - Lộc - Thọ', 'Cát - Khẩu - Trung', 'Tâm - Đức - Trí', 'Vinh - Hoa - Phú'],
        correctIndex: 1,
        explanation: 'Mặt tiền và tổng thể tạo thành hình chữ Cát (tốt lành), chữ Khẩu (tự do ngôn luận), chữ Trung (trung chính ngay thẳng).',
      },
    ],
    panoramas: [
      {
        id: 'ddl-pano-1',
        title: 'Toàn cảnh Bãi cỏ & Đài phun nước Dinh Độc Lập',
        imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1800&q=80',
        description: 'Góc nhìn 360 bao quát toàn bộ mặt tiền rèm hoa đá và đài phun nước rực rỡ.',
      },
      {
        id: 'ddl-pano-2',
        title: 'Khu Hầm chỉ huy tác chiến ngầm',
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
        description: 'Không gian ngầm dưới lòng đất kiên cố với các bản đồ tác chiến và máy vô tuyến điện.',
      },
    ],
  },
  {
    id: 'hoang-thanh-thang-long',
    name: 'Hoàng Thành Thăng Long',
    location: 'Ba Đình, Hà Nội',
    region: 'Bắc',
    coordinates: {
      lat: 21.0347,
      lng: 105.8406,
      xPercent: 53,
      yPercent: 17,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Trung tâm quyền lực chính trị suốt 13 thế kỷ liên tục từ thời tiền Thăng Long qua các triều đại Lý, Trần, Lê, Mạc, Nguyễn.',
    historicalStory: `Hoàng Thành Thăng Long là quần thể di tích gắn liền với lịch sử kinh thành Thăng Long - Đông Kinh và tỉnh thành Hà Nội. Bắt đầu từ thời kỳ tiền Thăng Long (thế kỷ VII) qua thời Đinh - Tiền Lê, phát triển mạnh mẽ dưới thời Lý, Trần, Lê và thành Hà Nội dưới triều Nguyễn.

Khu di tích trung tâm Hoàng Thành Thăng Long nổi bật với Đoan Môn, Điện Kính Thiên với đôi rồng đá thế kỷ 15 uốn lượn uy dũng, Hậu Lâu, và di chỉ khảo cổ học 18 Hoàng Diệu với hàng triệu hiện vật tầng tầng lớp lớp chồng xếp minh chứng cho sức sống bền bỉ nghìn năm văn vật của dân tộc Việt Nam.`,
    audioNarrationText: `Bạn đang đứng giữa Hoàng Thành Thăng Long - trái tim ngàn năm của nước Đại Việt. Từ năm 1010 khi vua Lý Thái Tổ dời đô từ Hoa Lư về thành Đại La thấy rồng vàng bay lên, mảnh đất này đã trở thành linh hồn vương triều. Hãy bước qua Đoan Môn cổ kính, đặt chân lên thềm Rồng điện Kính Thiên để lắng nghe hào khí ngút trời của tổ tiên gìn giữ bờ cõi.`,
    architecturalHighlights: [
      'Đoan Môn - Cổng chính dẫn vào Cấm thành xây bằng gạch vồ thời Lê',
      'Đôi rồng đá thềm Điện Kính Thiên - Kiệt tác điêu khắc đá thời Lê sơ thế kỷ 15',
      'Hậu Lâu (Lầu Công Chúa) - Kiến trúc gỗ gạch độc đáo thời Nguyễn',
      'Khu khảo cổ học 18 Hoàng Diệu - Giếng nước cổ thời Trần và gạch ngói đầu rồng thời Lý',
    ],
    timeline: [
      { year: '1010', title: 'Lý Thái Tổ dời đô', description: 'Vua Lý Thái Tổ ban Chiếu dời đô, khởi lập kinh thành Thăng Long.' },
      { year: '1428', title: 'Lê Lợi xưng đế', description: 'Lê Thái Tổ đại thắng quân Minh, tu bổ và mở rộng Hoàng Thành Thăng Long.' },
      { year: '1467', title: 'Tạo tác thềm Rồng Kính Thiên', description: 'Vua Lê Thánh Tông cho điêu khắc đôi rồng đá biểu tượng cho vương quyền thịnh trị.' },
      { year: '2010', title: 'UNESCO công nhận Di sản', description: 'Đúng dịp Đại lễ 1000 năm Thăng Long - Hà Nội, UNESCO vinh danh Di sản Văn hóa Thế giới.' },
    ],
    quiz: [
      {
        id: 'ht-q1',
        question: 'Ai là vị vua đã ban "Chiếu dời đô" về Thăng Long năm 1010?',
        options: ['Lý Thái Tổ', 'Lê Hoàn', 'Đinh Bộ Lĩnh', 'Trần Thái Tông'],
        correctIndex: 0,
        explanation: 'Năm 1010, vua Lý Thái Tổ (Lý Công Uẩn) đã ban Chiếu dời đô từ Hoa Lư về thành Đại La và đổi tên thành Thăng Long.',
      },
      {
        id: 'ht-q2',
        question: 'Hiện vật điêu khắc đá nổi tiếng nhất còn lại tại Điện Kính Thiên là gì?',
        options: ['Bia đá rùa ngậm', 'Đôi rồng đá thế kỷ 15', 'Tượng nghê đá chầu', 'Súng thần công'],
        correctIndex: 1,
        explanation: 'Đôi rồng đá chạm trổ tinh xảo trên thềm điện Kính Thiên tạc từ thời Lê sơ thế kỷ 15 là bảo vật quốc gia vô giá.',
      },
    ],
    panoramas: [
      {
        id: 'ht-pano-1',
        title: 'Sân Đoan Môn & Cột Cờ Hà Nội',
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
        description: 'Toàn cảnh Đoan Môn rêu phong nhìn về phía Cột Cờ Hà Nội lịch sử.',
      },
    ],
  },
];
