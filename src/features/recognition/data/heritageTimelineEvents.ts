export interface TimelineEventItem {
  id: string;
  time: string;
  event: string;
  explanation: string;
}

export const CANONICAL_MONUMENT_TIMELINE: Record<string, TimelineEventItem[]> = {
  // 1. Bến Nhà Rồng
  BNR: [
    {
      id: 'bnr_ev1',
      time: 'Năm 1863',
      event: 'Khởi công xây dựng trụ sở thương cảng với nóc nhà chạm hình đôi rồng chầu mặt trời kiểu phương Đông',
      explanation: 'Bến Nhà Rồng được khởi dựng năm 1863 bên bờ sông Sài Gòn, vốn là trụ sở của hãng vận tải Messageries Maritimes.',
    },
    {
      id: 'bnr_ev2',
      time: 'Ngày 5/6/1911',
      event: 'Người thanh niên yêu nước Nguyễn Tất Thành bước lên con tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước',
      explanation: 'Sự kiện lịch sử trọng đại mở đầu hành trình bôn ba khắp năm châu tìm con đường giải phóng cho dân tộc của Bác Hồ.',
    },
    {
      id: 'bnr_ev3',
      time: 'Năm 1979',
      event: 'Khu lưu niệm Bác Hồ tại Bến Nhà Rồng được xếp hạng Di tích lịch sử - văn hóa cấp quốc gia',
      explanation: 'Địa danh gắn liền với cuộc đời hoạt động cách mạng của Chủ tịch Hồ Chí Minh được Nhà nước vinh danh và bảo tồn nghiêm cẩn.',
    },
    {
      id: 'bnr_ev4',
      time: 'Tháng 6 hàng năm',
      event: 'Nhân dân và du khách cả nước tề tựu trước bến cảng tri ân ngày một hành trình lịch sử vĩ đại bắt đầu',
      explanation: 'Bảo tàng Hồ Chí Minh - Bến Nhà Rồng là điểm đến thiêng liêng lưu giữ những kỷ vật bất hủ và truyền ngọn lửa yêu nước cho thế hệ trẻ.',
    },
  ],

  // 2. Chợ Bến Thành
  CBT: [
    {
      id: 'cbt_ev1',
      time: 'Đầu thế kỷ XIX',
      event: 'Hình thành ngôi chợ nguyên thủy bằng tranh tre nứa nằm ven sông Bến Nghé, cạnh thành Quy',
      explanation: 'Ngôi chợ xưa nằm cạnh bến sông đón thuyền khách vào thành Gia Định nên người dân quen gọi là Chợ Bến Thành.',
    },
    {
      id: 'cbt_ev2',
      time: 'Năm 1912 - 1914',
      event: 'Khởi công và hoàn thành xây dựng ngôi chợ kiên cố mới với tháp đồng hồ 4 mặt biểu tượng',
      explanation: 'Khu chợ mới khánh thành năm 1914 tại bến xe ngựa cũ, trở thành biểu tượng giao thương sầm uất bậc nhất Sài Gòn.',
    },
    {
      id: 'cbt_ev3',
      time: 'Năm 1952',
      event: 'Gắn các bức phù điêu gốm mỹ thuật Biên Hòa miêu tả sản vật Nam Bộ tại các cửa Đông - Tây - Nam - Bắc',
      explanation: 'Các bức phù điêu gốm hình bò, chuối, cá... tạo nên nét độc đáo giao hòa giữa kiến trúc phương Tây và văn hóa dân gian Việt.',
    },
    {
      id: 'cbt_ev4',
      time: 'Năm 1985',
      event: 'Đại trùng tu quy mô lớn để bảo tồn kiến trúc tháp đồng hồ và chỉnh trang khuôn viên kinh doanh',
      explanation: 'Đợt chỉnh trang toàn diện giúp chợ giữ vững diện mạo cổ kính và tiếp tục là trung tâm văn hóa - thương mại tiêu biểu của TP.HCM.',
    },
  ],

  // 3. Chùa Một Cột
  CMC: [
    {
      id: 'cmc_ev1',
      time: 'Mùa đông năm 1049',
      event: 'Vua Lý Thái Tông cho khởi dựng chùa Diên Hựu sau giấc chiêm bao được Phật Bà Quan Âm dắt lên đài sen',
      explanation: 'Công trình được thiết kế như một đóa hoa sen thanh tịnh ngát hương vươn lên từ cột đá giữa lòng hồ Linh Chiểu.',
    },
    {
      id: 'cmc_ev2',
      time: 'Năm 1105',
      event: 'Vua Lý Nhân Tông cho trùng tu, mở rộng hồ Linh Chiểu và cho đúc quả đại hồng chung Quy Điền',
      explanation: 'Nhà Lý tôn tạo quần thể cảnh quan tâm linh biến nơi đây thành biểu tượng thịnh trị của Phật giáo thời Lý.',
    },
    {
      id: 'cmc_ev3',
      time: 'Năm 1954',
      event: 'Chùa bị phá hủy trước khi quân Pháp rút khỏi Hà Nội và được chính quyền nhân dân phục dựng nguyên mẫu',
      explanation: 'Các nghệ nhân và kiến trúc sư Việt Nam đã khôi phục chuẩn xác theo bản vẽ cổ để đóa sen Phật giáo tiếp tục tỏa sáng.',
    },
    {
      id: 'cmc_ev4',
      time: 'Năm 2012',
      event: 'Tổ chức Kỷ lục Châu Á xác lập kỷ lục "Ngôi chùa có kiến trúc độc đáo nhất Châu Á"',
      explanation: 'Tôn vinh kiệt tác kiến trúc gỗ đặt trên một trụ đá duy nhất - viên ngọc quý của nền mỹ thuật cổ truyền dân tộc.',
    },
  ],

  // 4. Cầu Hiền Lương - Sông Bến Hải
  CauHienLuong: [
    {
      id: 'chl_ev1',
      time: 'Tháng 7/1954',
      event: 'Hiệp định Genève ký kết, sông Bến Hải và cầu Hiền Lương tại vĩ tuyến 17 trở thành giới tuyến quân sự tạm thời',
      explanation: 'Hiệp định Genève quy định đường giới tuyến chia cắt hai miền Nam - Bắc trong thời gian chờ cuộc tổng tuyển cử tự do.',
    },
    {
      id: 'chl_ev2',
      time: 'Giai đoạn 1954 - 1975',
      event: 'Cuộc chiến sơn màu cầu và các đợt "chọi cờ", "chọi loa" biểu tượng cho ý chí thống nhất non sông bất diệt',
      explanation: 'Hai bờ giới tuyến diễn ra những cuộc so tài ý chí rực lửa với cột cờ giới tuyến kiên cường tung bay trong bom đạn.',
    },
    {
      id: 'chl_ev3',
      time: 'Mùa Xuân năm 1975',
      event: 'Đại thắng giải phóng hoàn toàn miền Nam, cầu Hiền Lương chính thức hoàn thành sứ mệnh lịch sử giới tuyến',
      explanation: 'Đất nước trọn niềm vui non sông thu về một mối, đôi bờ Bến Hải nối liền khúc ruột Bắc - Nam gắn kết một nhà.',
    },
    {
      id: 'chl_ev4',
      time: 'Năm 2013',
      event: 'Cụm di tích Đôi bờ Hiền Lương - Bến Hải được Nhà nước xếp hạng Di tích quốc gia đặc biệt',
      explanation: 'Di tích trở thành chứng tích hào hùng và bài học thiêng liêng về khát vọng hòa bình, thống nhất của toàn dân tộc.',
    },
  ],

  // 5. Địa đạo Củ Chi
  DDCC: [
    {
      id: 'ddcc_ev1',
      time: 'Năm 1946 - 1948',
      event: 'Quân dân Tân Phú Trung và Phước Vĩnh An đào những đoạn hầm bí mật riêng lẻ đầu tiên trong lòng đất',
      explanation: 'Giai đoạn đầu thời kỳ kháng chiến chống thực dân Pháp, nhân dân đào hầm để che giấu cán bộ và cất giữ vũ khí.',
    },
    {
      id: 'ddcc_ev2',
      time: 'Giai đoạn 1961 - 1965',
      event: 'Mở rộng và kết nối các đoạn hầm thành hệ thống địa đạo liên hoàn đa tầng dài hơn 250km',
      explanation: 'Phát triển thành một kỳ quan quân sự dưới lòng đất với đầy đủ chiến hào, phòng hội họp, trạm xá và bếp Hoàng Cầm không khói.',
    },
    {
      id: 'ddcc_ev3',
      time: 'Năm 1966 - 1967',
      event: 'Kiên cường bám trụ đánh bại các cuộc hành quân càn quét quy mô lớn như Cedar Falls và Junction City',
      explanation: 'Quân dân Củ Chi vinh dự đón nhận danh hiệu cao quý "Đất thép thành đồng" vì tinh thần chiến đấu bất khuất.',
    },
    {
      id: 'ddcc_ev4',
      time: 'Năm 2015',
      event: 'Khu di tích lịch sử Địa đạo Củ Chi được Thủ tướng Chính phủ xếp hạng Di tích quốc gia đặc biệt',
      explanation: 'Một trong những công trình quân sự độc đáo nhất thế giới đón hàng triệu lượt khách quốc tế đến chiêm ngưỡng ý chí kiên cường Việt Nam.',
    },
  ],

  // 6. Đền Hùng
  DenHung: [
    {
      id: 'dh_ev1',
      time: 'Thời đại Hùng Vương',
      event: 'Các Vua Hùng chọn đỉnh núi Nghĩa Lĩnh linh thiêng định đô và khai sinh nhà nước Văn Lang',
      explanation: 'Mở đầu kỷ nguyên dựng nước Văn Lang - buổi bình minh của lịch sử hào hùng dựng nước và giữ nước của dân tộc.',
    },
    {
      id: 'dh_ev2',
      time: 'Năm 1479',
      event: 'Triều vua Lê Thánh Tông ban chỉ ghi chép ngọc phả Hùng Vương và quy chuẩn thể thức giỗ Tổ cấp quốc gia',
      explanation: 'Nhà nước phong kiến ghi nhận chính thức nghi thức tế lễ tri ân công đức tổ tiên hàng năm tại vùng đất Phong Châu.',
    },
    {
      id: 'dh_ev3',
      time: 'Ngày 19/9/1954',
      event: 'Chủ tịch Hồ Chí Minh căn dặn cán bộ, chiến sĩ: "Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước"',
      explanation: 'Lời căn dặn thiêng liêng tại Đền Giếng khắc sâu trách nhiệm gìn giữ giang sơn cho muôn đời con cháu mai sau.',
    },
    {
      id: 'dh_ev4',
      time: 'Ngày 6/12/2012',
      event: 'UNESCO chính thức công nhận "Tín ngưỡng thờ cúng Hùng Vương" là Di sản văn hóa phi vật thể đại diện của nhân loại',
      explanation: 'Biểu tượng gắn kết cộng đồng và tinh thần "uống nước nhớ nguồn" độc nhất vô nhị của người Việt được quốc tế vinh danh.',
    },
  ],

  // 7. Dinh Độc Lập
  DinhDocLap: [
    {
      id: 'ddl_ev1',
      time: 'Năm 1868',
      event: 'Thống đốc Nam Kỳ De La Grandière đặt viên đá đầu tiên khởi công xây dựng Dinh Norodom cổ kính',
      explanation: 'Dinh thự mang phong cách tân cổ điển phương Tây phục vụ bộ máy hành chính cấp cao của chính quyền Pháp tại Nam Kỳ.',
    },
    {
      id: 'ddl_ev2',
      time: 'Năm 1962 - 1966',
      event: 'Kiến trúc sư Ngô Viết Thụ thiết kế xây dựng lại dinh mới kết hợp hài hòa giữa triết lý Á Đông và kiến trúc hiện đại',
      explanation: 'Mặt bằng dinh được xếp đặt khéo léo theo các chữ Hán mang biểu tượng Cát, Khẩu, Trung, Tam hàm ý hòa bình, thịnh vượng.',
    },
    {
      id: 'ddl_ev3',
      time: '11 giờ 30 ngày 30/4/1975',
      event: 'Xe tăng 390 húc đổ cổng chính, lá cờ Mặt trận Dân tộc Giải phóng tung bay trên nóc dinh báo hiệu toàn thắng',
      explanation: 'Giây phút lịch sử thiêng liêng đánh dấu thắng lợi trọn vẹn của Chiến dịch Hồ Chí Minh lịch sử, non sông thu về một mối.',
    },
    {
      id: 'ddl_ev4',
      time: 'Năm 2009',
      event: 'Thủ tướng Chính phủ ký quyết định xếp hạng Dinh Độc Lập là một trong 10 Di tích quốc gia đặc biệt đầu tiên của cả nước',
      explanation: 'Công trình kiến trúc di sản chứng kiến bước ngoặt lịch sử thống nhất đất nước, thu hút hàng triệu du khách mỗi năm.',
    },
  ],

  // 8. Lăng Chủ tịch Hồ Chí Minh
  LangChuTichHCM: [
    {
      id: 'lb_ev1',
      time: 'Ngày 2/9/1969',
      event: 'Chủ tịch Hồ Chí Minh qua đời, Đảng và Nhà nước quyết định bảo quản lâu dài thi hài và xây dựng Lăng',
      explanation: 'Thể theo nguyện vọng thiết tha của toàn Đảng, toàn dân và đồng bào miền Nam muốn được chiêm ngưỡng dung nhan của Bác.',
    },
    {
      id: 'lb_ev2',
      time: 'Ngày 2/9/1973',
      event: 'Khởi công xây dựng công trình Lăng Chủ tịch Hồ Chí Minh tại vị trí lễ đài Quảng trường Ba Đình lịch sử',
      explanation: 'Công trình được dựng xây từ những khối đá quý, gỗ quý và hàng ngàn giống cây hoa do nhân dân khắp mọi miền đất nước gửi về.',
    },
    {
      id: 'lb_ev3',
      time: 'Ngày 29/8/1975',
      event: 'Lễ khánh thành Lăng Chủ tịch Hồ Chí Minh được tổ chức trọng thể và chính thức mở cửa đón nhân dân vào viếng',
      explanation: 'Đồng bào từ mọi miền Tổ quốc cùng bạn bè năm châu trang nghiêm nghiêng mình trước vị lãnh tụ vĩ đại của dân tộc.',
    },
    {
      id: 'lb_ev4',
      time: 'Mỗi ngày từ năm 1975 đến nay',
      event: 'Duy trì nghi thức thượng cờ lúc 6 giờ sáng và hạ cờ lúc 21 giờ tối trang nghiêm trên Quảng trường Ba Đình',
      explanation: 'Nghi lễ biểu tượng của chủ quyền quốc gia và lòng kính yêu, tự hào của các thế hệ người Việt Nam với Bác Hồ kính yêu.',
    },
  ],

  // 9. Cố đô Huế (Ngọ Môn)
  NgoMon: [
    {
      id: 'nm_ev1',
      time: 'Năm 1833',
      event: 'Vua Minh Mạng cho khởi công xây dựng Ngọ Môn làm cổng chính phía Nam của Hoàng thành Huế',
      explanation: 'Công trình thay thế Nam Khuyết Đài cũ, có bình diện chữ U với 5 lối đi và lầu Ngũ Phụng tráng lệ lợp ngói hoàng lưu ly và thanh lưu ly.',
    },
    {
      id: 'nm_ev2',
      time: 'Giai đoạn triều Nguyễn (1802 - 1945)',
      event: 'Nơi triều đình tổ chức các đại lễ quốc gia trọng thể như Lễ Ban Sóc (ban lịch mới) và Lễ Truyền Lô (xướng danh bảng vàng)',
      explanation: 'Không gian nghi lễ uy nghiêm phản ánh đỉnh cao lễ nhạc và phong cách kiến trúc cung đình thời phong kiến Việt Nam.',
    },
    {
      id: 'nm_ev3',
      time: 'Ngày 30/8/1945',
      event: 'Vua Bảo Đại đọc Chiếu thoái vị và trao ấn kiếm cho phái đoàn Chính phủ Cách mạng Lâm thời',
      explanation: 'Sự kiện mang tính bước ngoặt lịch sử chấm dứt chế độ quân chủ phong kiến kéo dài hàng ngàn năm trên dải đất Việt Nam.',
    },
    {
      id: 'nm_ev4',
      time: 'Năm 1993',
      event: 'Quần thể Di tích Cố đô Huế cùng Ngọ Môn được UNESCO vinh danh là Di sản Văn hóa Thế giới đầu tiên của Việt Nam',
      explanation: 'Biểu tượng kiến trúc cung đình tuyệt mỹ được nhân loại tôn vinh và cam kết bảo tồn nguyên vẹn giá trị lịch sử.',
    },
  ],

  // 10. Nhà Thờ Đức Bà
  NhaThoDB: [
    {
      id: 'ntdb_ev1',
      time: 'Tháng 10/1877',
      event: 'Giám mục Colombert cử hành nghi thức đặt viên đá đầu tiên khởi công xây dựng nhà thờ chính tòa Sài Gòn',
      explanation: 'Kiến trúc sư J. Bourard thiết kế công trình mang phong cách Roman kết hợp Gothic với toàn bộ gạch ngói vận chuyển từ Marseille (Pháp).',
    },
    {
      id: 'ntdb_ev2',
      time: 'Lễ Phục Sinh năm 1880',
      event: 'Tổ chức lễ khánh thành nhà thờ với sự tham dự của đông đảo chức sắc và nhân dân Sài Gòn',
      explanation: 'Ngôi thánh đường ban đầu mang tên Nhà thờ Nhà nước, trở thành tâm điểm kiến trúc uy nghi giữa lòng trung tâm thành phố.',
    },
    {
      id: 'ntdb_ev3',
      time: 'Năm 1895',
      event: 'Xây dựng thêm hai ngọn tháp nhọn cao 57,6m cùng hệ thống 6 quả chuông đồng lớn nặng gần 30 tấn',
      explanation: 'Hai tháp nhọn vút cao lên nền trời đã định hình nên diện mạo biểu tượng kiều diễm cho thánh đường suốt hơn một thế kỷ.',
    },
    {
      id: 'ntdb_ev4',
      time: 'Năm 1962',
      event: 'Tòa thánh Vatican chính thức nâng nhà thờ lên hàng Tiểu Vương cung thánh đường (Basilica)',
      explanation: 'Danh hiệu quốc tế cao quý ghi nhận vị thế tôn giáo trang trọng cùng giá trị nghệ thuật kiến trúc kiệt xuất của công trình.',
    },
  ],

  // 11. Thánh Địa Mỹ Sơn
  TDiaMS: [
    {
      id: 'tdms_ev1',
      time: 'Thế kỷ IV',
      event: 'Vua Bhadravarman cho khởi dựng ngôi đền gỗ đầu tiên thờ thần Shiva - Bhadresvara tại thung lũng Mỹ Sơn',
      explanation: 'Mở đầu cho hơn một thiên niên kỷ xây dựng trung tâm thánh địa tôn giáo linh thiêng của vương quốc cổ Champa.',
    },
    {
      id: 'tdms_ev2',
      time: 'Thế kỷ VII - XIII',
      event: 'Các triều vua Champa liên tục xây dựng hơn 70 đền tháp bằng gạch nung với kỹ thuật mài chập bí ẩn',
      explanation: 'Kỹ thuật xếp gạch khít khao không dùng vữa liên kết vẫn là kiệt tác nghệ thuật kiến trúc độc nhất vô nhị làm kinh ngạc thế giới.',
    },
    {
      id: 'tdms_ev3',
      time: 'Năm 1898',
      event: 'Nhà khảo cổ học người Pháp Camille Paris phát hiện lại quần thể phế tích nằm ẩn sâu trong rừng rậm',
      explanation: 'Mở đầu công tác thám sát, giải mã văn bia và trùng tu khoa học quy mô của Viện Viễn Đông Bác Cổ (EFEO).',
    },
    {
      id: 'tdms_ev4',
      time: 'Tháng 12/1999',
      event: 'UNESCO chính thức ghi danh Thánh địa Mỹ Sơn vào danh mục Di sản Văn hóa Thế giới',
      explanation: 'Minh chứng sống động độc nhất về một nền văn hóa và tôn giáo cổ đại phát triển rực rỡ tại vùng duyên hải miền Trung Việt Nam.',
    },
  ],

  // 12. Thành Cổ Quảng Trị
  ThanhCoQT: [
    {
      id: 'tcqt_ev1',
      time: 'Năm 1809 - 1827',
      event: 'Vua Gia Long cho đắp thành đất, sau đó vua Minh Mạng cho xây dựng kiên cố lại bằng gạch theo phong cách Vauban',
      explanation: 'Tòa thành quân sự - hành chính kiên cố của vùng đất địa đầu có chu vi gần 2.000 mét với 4 cổng thành hướng ra 4 phương.',
    },
    {
      id: 'tcqt_ev2',
      time: 'Mùa hè đỏ lửa năm 1972',
      event: 'Cuộc chiến đấu bảo vệ Thành Cổ Quảng Trị diễn ra ác liệt suốt 81 ngày đêm rực lửa',
      explanation: 'Hàng ngàn chiến sĩ anh dũng hy sinh, mỗi tấc đất và viên gạch nơi đây thấm đẫm máu xương và ý chí kiên cường vì độc lập dân tộc.',
    },
    {
      id: 'tcqt_ev3',
      time: 'Tháng 1/1973',
      event: 'Thắng lợi phòng ngự kiên cường 81 ngày đêm tạo thế mạnh quyết định buộc Mỹ phải ký Hiệp định Paris',
      explanation: 'Chiến công quả cảm đã mở đường cho thắng lợi ngoại giao quốc tế và tạo tiền đề tiến tới giải phóng hoàn toàn miền Nam.',
    },
    {
      id: 'tcqt_ev4',
      time: 'Năm 1986',
      event: 'Thành Cổ Quảng Trị được Nhà nước xếp hạng Di tích lịch sử quốc gia đặc biệt quan trọng',
      explanation: 'Đài tưởng niệm tri ân và mảnh đất linh thiêng nhắc nhở muôn đời thế hệ mai sau về cái giá vô cùng to lớn của hòa bình.',
    },
  ],

  // 11. Nhà Tù Côn Đảo
  NTCD: [
    {
      id: 'ntcd_ev1',
      time: 'Năm 1862',
      event: 'Thực dân Pháp thành lập hệ thống nhà tù Côn Đảo giữa biển khơi',
      explanation: 'Hệ thống nhà tù lập ra nhằm giam giữ, đày đọa thể xác và tinh thần các sĩ phu, nhà yêu nước và chiến sĩ cách mạng Việt Nam.',
    },
    {
      id: 'ntcd_ev2',
      time: 'Giai đoạn 1940 - 1970',
      event: 'Xây dựng mở rộng các trại giam khét tiếng như Chuồng Cọp; biến ngục tù thành trường học cách mạng',
      explanation: 'Dù đối mặt với vô vàn nhục hình và đày đọa, các chiến sĩ cách mạng vẫn kiên cường giữ vững khí tiết và ý chí đấu tranh.',
    },
    {
      id: 'ntcd_ev3',
      time: 'Sáng 1/5/1975',
      event: 'Những người tù chính trị tự nổi dậy phá tan cửa sắt trại Phú Bình, giải phóng toàn bộ Côn Đảo',
      explanation: 'Sự kiện lịch sử vĩ đại chấm dứt hơn một thế kỷ tồn tại của "địa ngục trần gian", giương cao lá cờ giải phóng thiêng liêng.',
    },
    {
      id: 'ntcd_ev4',
      time: 'Năm 2012 - Nay',
      event: 'Được Thủ tướng Chính phủ xếp hạng Di tích Lịch sử Quốc gia Đặc biệt',
      explanation: 'Bảo tồn nguyên vẹn các công trình chứng tích và Nghĩa trang Hàng Dương, trở thành biểu tượng sống động về lòng yêu nước bất diệt.',
    },
  ],

  // 14. Văn Miếu Quốc Tử Giám
  VanMieuQTG: [
    {
      id: 'vm_ev1',
      time: 'Mùa thu năm 1070',
      event: 'Vua Lý Thánh Tông cho xây dựng Văn Miếu để thờ Khổng Tử và các bậc hiền triết Nho học',
      explanation: 'Khởi đầu cho trung tâm văn hóa, giáo dục tiêu biểu của kinh thành Thăng Long thời Lý.',
    },
    {
      id: 'vm_ev2',
      time: 'Năm 1076',
      event: 'Vua Lý Nhân Tông cho lập Quốc Tử Giám bên cạnh Văn Miếu, trở thành trường đại học đầu tiên của Việt Nam',
      explanation: 'Nơi quy tụ và đào tạo hàng ngàn danh sĩ, hiền tài kiệt xuất phò tá triều đình qua bao thế hệ.',
    },
    {
      id: 'vm_ev3',
      time: 'Năm 1484',
      event: 'Vua Lê Thánh Tông ban chỉ khởi dựng những tấm bia đá đầu tiên ghi danh các vị tiến sĩ đỗ đạt',
      explanation: '82 tấm bia tiến sĩ đặt trên lưng rùa đá vững chãi là Di sản tư liệu thế giới biểu trưng cho truyền thống hiếu học bất diệt.',
    },
    {
      id: 'vm_ev4',
      time: 'Năm 1805',
      event: 'Xây dựng Khuê Văn Các với bốn cửa sổ tròn hình mặt trời tỏa sáng, tượng trưng cho sao Khuê văn học',
      explanation: 'Công trình kiến trúc tinh xảo và tao nhã đã trở thành biểu tượng văn hiến chính thức của thủ đô Hà Nội ngàn năm văn vật.',
    },
  ],
};

export function getMonumentTimelineEvents(code: string): TimelineEventItem[] {
  if (CANONICAL_MONUMENT_TIMELINE[code]) {
    return CANONICAL_MONUMENT_TIMELINE[code];
  }
  // Fallback if code isn't recognized
  return CANONICAL_MONUMENT_TIMELINE['BNR'];
}
