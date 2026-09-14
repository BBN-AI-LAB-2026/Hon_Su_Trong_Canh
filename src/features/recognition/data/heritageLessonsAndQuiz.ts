import { DEFAULT_MONUMENT_STORIES } from './defaultMonumentStories';

export interface MonumentLessonData {
  code: string;
  name: string;
  location: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  era: string;
  summary: string;
  historicalValue: string;
  heritageLesson: string; // Bài học lịch sử trích xuất
  keyTakeaways: string[];
  audioNarrationText: string;
}

export interface FunQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string; // Lời giải thích vui vẻ, thú vị
}

export const MONUMENT_LESSONS_DATA: Record<string, MonumentLessonData> = {
  BNR: {
    code: 'BNR',
    name: 'Bến Nhà Rồng (Bảo tàng Hồ Chí Minh - Chi nhánh TP.HCM)',
    location: 'Số 1 Nguyễn Tất Thành, Phường 12, Quận 4, TP. Hồ Chí Minh',
    region: 'Nam',
    era: 'Khởi công xây dựng năm 1863 thời Pháp thuộc',
    summary: DEFAULT_MONUMENT_STORIES.BNR.storyContent,
    historicalValue: 'Công trình kiến trúc kết hợp phong cách phương Tây và nóc nhà gắn hai con rồng bằng gốm sứ châu mặt trời. Là biểu tượng thiêng liêng của ý chí quật cường và khát vọng độc lập dân tộc.',
    heritageLesson: 'Bài học về lòng yêu nước nồng nàn, ý chí tự lực tự cường, tinh thần dấn thân tìm tòi chân lý và khát vọng cháy bỏng vì độc lập, tự do và hạnh phúc của nhân dân.',
    keyTakeaways: [
      'Ngày 5/6/1911: Điểm khởi đầu cuộc hành trình 30 năm tìm đường cứu nước vĩ đại.',
      'Ý chí vượt khó: Dám nghĩ, dám làm, mở đường cho kỷ nguyên độc lập tự do dân tộc.',
      'Di sản sống: Nơi giáo dục truyền thống yêu nước sâu sắc cho mọi thế hệ người Việt.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.BNR.storyContent,
  },
  CBT: {
    code: 'CBT',
    name: 'Chợ Bến Thành',
    location: 'Quảng trường Quách Thị Trang, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    region: 'Nam',
    era: 'Xây dựng từ năm 1912 đến 1914',
    summary: DEFAULT_MONUMENT_STORIES.CBT.storyContent,
    historicalValue: 'Biểu tượng lịch sử hơn 100 năm chứng kiến những đổi thay thăng trầm của Sài Gòn - TP. Hồ Chí Minh, lưu giữ nét đẹp văn hóa ẩm thực và đời sống thị dân qua nhiều thế kỷ.',
    heritageLesson: 'Bài học về sức sống bền bỉ, tính năng động, cởi mở, lòng hiếu khách và tinh thần hội nhập kinh tế của người dân phương Nam.',
    keyTakeaways: [
      'Tháp đồng hồ 4 mặt biểu tượng trường tồn qua hơn một thế kỷ.',
      'Trung tâm giao thương văn hóa đặc trưng của Sài Gòn - TP. Hồ Chí Minh.',
      'Gìn giữ bản sắc đô thị văn minh, năng động và giàu truyền thống nghĩa tình.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.CBT.storyContent,
  },
  CMC: {
    code: 'CMC',
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    location: 'Phố Chùa Một Cột, Đội Cấn, Quận Ba Đình, Hà Nội',
    region: 'Bắc',
    era: 'Khởi dựng năm Kỷ Sửu 1049 thời vua Lý Thái Tông',
    summary: DEFAULT_MONUMENT_STORIES.CMC.storyContent,
    historicalValue: 'Đỉnh cao của kiến trúc tâm linh thời Lý kết hợp hài hòa giữa triết lý Phật giáo, nghệ thuật điêu khắc gỗ dân tộc và triết lý âm dương nhân sinh.',
    heritageLesson: 'Bài học về sự thanh tịnh, tâm đức sáng trong, tinh hoa trí tuệ dựng nước và tinh thần hòa hợp dân tộc thời Lý - Trần.',
    keyTakeaways: [
      'Kiến trúc hoa sen vươn lên từ nước độc đáo nhất châu Á.',
      'Thời Lý hưng thịnh: Sự hòa quyện giữa đạo pháp và tinh thần dân tộc.',
      'Giá trị trường tồn: Di sản văn hóa quốc gia đặc biệt cần được trân trọng giữ gìn.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.CMC.storyContent,
  },
  CauHienLuong: {
    code: 'CauHienLuong',
    name: 'Cầu Hiền Lương - Sông Bến Hải',
    location: 'Huyện Vĩnh Linh và Gio Linh, Tỉnh Quảng Trị',
    region: 'Trung',
    era: 'Vĩ tuyến 17 - Giới tuyến quân sự tạm thời từ năm 1954 đến 1975',
    summary: DEFAULT_MONUMENT_STORIES.CauHienLuong.storyContent,
    historicalValue: 'Cụm di tích quốc gia đặc biệt ghi dấu những cuộc đọ cờ, đọ loa, cuộc chiến giữ từng tấc đất thiêng liêng vì ngày đất nước trọn niềm vui non sông liền một dải.',
    heritageLesson: 'Bài học về giá trị vô giá của hòa bình, độc lập dân tộc, sự hy sinh to lớn của thế hệ cha anh và tinh thần đoàn kết Bắc - Nam ruột thịt.',
    keyTakeaways: [
      'Vĩ tuyến 17: Nơi thử thách ý chí sắt đá và khát vọng thống nhất đất nước.',
      'Giá trị của hòa bình: Mỗi tấc đất hôm nay thấm đượm mồ hôi và xương máu cha ông.',
      'Trách nhiệm thế hệ trẻ: Giữ gìn chủ quyền và dựng xây đất nước phồn vinh.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.CauHienLuong.storyContent,
  },
  DDCC: {
    code: 'DDCC',
    name: 'Địa đạo Củ Chi',
    location: 'Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi, TP. Hồ Chí Minh',
    region: 'Nam',
    era: 'Xây dựng trong thời kỳ kháng chiến 1946 - 1968',
    summary: DEFAULT_MONUMENT_STORIES.DDCC.storyContent,
    historicalValue: 'Kỳ quan quân sự thế giới được đục đẽo thủ công bằng tay, bao gồm bệnh xá, phòng họp, nhà kho, bếp Hoàng Cầm và công sự tác chiến kiên cường dưới mưa bom bão đạn.',
    heritageLesson: 'Bài học về sức sáng tạo vô tận, sự kiên cường bất khuất, sự gắn kết máu thịt giữa quân và dân trong mọi hoàn cảnh thử thách cam go.',
    keyTakeaways: [
      'Hơn 250km địa đạo ngầm đục đẽo hoàn toàn bằng ý chí và công cụ thô sơ.',
      'Sáng tạo phi thường: Bếp Hoàng Cầm giấu khói, hệ thống thông gió thông minh.',
      'Đất thép thành đồng: Sức mạnh lòng dân làm nên kỳ tích lịch sử.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.DDCC.storyContent,
  },
  DenHung: {
    code: 'DenHung',
    name: 'Khu Di tích Lịch sử Đền Hùng',
    location: 'Núi Nghĩa Lĩnh, Thành phố Việt Trì, Tỉnh Phú Thọ',
    region: 'Bắc',
    era: 'Nơi thờ phụng các Vua Hùng thời lập quốc Văn Lang',
    summary: DEFAULT_MONUMENT_STORIES.DenHung.storyContent,
    historicalValue: 'Không gian văn hóa Tín ngưỡng thờ cúng Hùng Vương - Di sản văn hóa phi vật thể đại diện của nhân loại được UNESCO vinh danh.',
    heritageLesson: 'Bài học đạo lý "Uống nước nhớ nguồn", truyền thống đại đoàn kết toàn dân tộc và lời căn dặn bất hủ của Bác Hồ: "Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước".',
    keyTakeaways: [
      'Cội nguồn tâm linh chung: Đồng bào cùng chung nguồn gốc Con Rồng Cháu Tiên.',
      'Đạo lý tri ân: Ghi nhớ công ơn các thế hệ tiền nhân khai sơn phá thạch.',
      'Lời thề non sông: Trách nhiệm cùng nhau bảo vệ và xây dựng Tổ quốc trường tồn.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.DenHung.storyContent,
  },
  DinhDocLap: {
    code: 'DinhDocLap',
    name: 'Dinh Độc Lập (Hội trường Thống Nhất)',
    location: '135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    region: 'Nam',
    era: 'Thiết kế bởi KTS Ngô Viết Thụ, khánh thành năm 1966',
    summary: DEFAULT_MONUMENT_STORIES.DinhDocLap.storyContent,
    historicalValue: 'Kiệt tác kiến trúc giao hòa phong thủy Á Đông và hiện đại phương Tây, lưu giữ nguyên vẹn các phòng họp, hầm chỉ huy và kỷ vật lịch sử trọng đại.',
    heritageLesson: 'Bài học về sức mạnh của khát vọng thống nhất, tinh thần hòa hợp dân tộc và tầm nhìn kiến thiết đất nước trong kỷ nguyên mới.',
    keyTakeaways: [
      'Trưa 30/4/1975: Cột mốc lịch sử kết thúc chiến tranh, non sông trọn niềm vui.',
      'Đỉnh cao kiến trúc hiện đại kết hợp triết lý phương Đông của KTS Ngô Viết Thụ.',
      'Biểu tượng của hòa bình, hòa hợp dân tộc và tương lai phát triển bền vững.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.DinhDocLap.storyContent,
  },
  LangChuTichHCM: {
    code: 'LangChuTichHCM',
    name: 'Lăng Chủ tịch Hồ Chí Minh',
    location: 'Quảng trường Ba Đình, Quận Ba Đình, Hà Nội',
    region: 'Bắc',
    era: 'Khởi công 1973, khánh thành ngày 29/8/1975',
    summary: DEFAULT_MONUMENT_STORIES.LangChuTichHCM.storyContent,
    historicalValue: 'Công trình kiến trúc uy nghiêm với vật liệu đá quý được đóng góp từ khắp mọi miền đất nước, thể hiện lòng tôn kính và biết ơn vô hạn của toàn dân đối với Bác.',
    heritageLesson: 'Bài học về tư tưởng đạo đức Hồ Chí Minh: cần, kiệm, liêm, chính, chí công vô tư, trọn đời hy sinh vì nước, vì dân.',
    keyTakeaways: [
      'Quảng trường Ba Đình: Nơi vang vọng bản Tuyên ngôn Độc lập ngày 2/9/1945.',
      'Biểu tượng tấm lòng của toàn thể nhân dân Việt Nam đối với Bác Hồ kính yêu.',
      'Noi gương tư tưởng, đạo đức, phong cách sống giản dị mà vĩ đại của Người.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.LangChuTichHCM.storyContent,
  },
  NgoMon: {
    code: 'NgoMon',
    name: 'Ngọ Môn - Quần thể Di tích Cố đô Huế',
    location: 'Đại Nội Huế, Thành phố Huế, Tỉnh Thừa Thiên Huế',
    region: 'Trung',
    era: 'Xây dựng năm Minh Mạng thứ 14 (1833)',
    summary: DEFAULT_MONUMENT_STORIES.NgoMon.storyContent,
    historicalValue: 'Di sản Văn hóa Thế giới được UNESCO công nhận, đại diện tiêu biểu cho nghệ thuật kiến trúc gỗ, điêu khắc đá và triết lý phong thủy hoàng gia triều Nguyễn.',
    heritageLesson: 'Bài học về việc trân trọng, gìn giữ tinh hoa văn hóa truyền thống, đồng thời ghi nhận sự chuyển giao thời đại vì quyền làm chủ của nhân dân.',
    keyTakeaways: [
      'Kiến trúc Ngũ Phụng lâu tinh xảo biểu trưng cho đỉnh cao nghệ thuật triều Nguyễn.',
      'Sự kiện tháng 8/1945: Vua Bảo Đại thoái vị, trao ấn kiếm cho chính quyền cách mạng.',
      'Bảo tồn di sản thế giới: Trách nhiệm giữ gìn hồn cốt văn hóa cung đình Việt Nam.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.NgoMon.storyContent,
  },
  NhaThoDB: {
    code: 'NhaThoDB',
    name: 'Nhà Thờ Đức Bà Sài Gòn',
    location: 'Số 1 Công Xã Paris, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    region: 'Nam',
    era: 'Khởi công năm 1877, khánh thành năm 1880',
    summary: DEFAULT_MONUMENT_STORIES.NhaThoDB.storyContent,
    historicalValue: 'Biểu tượng kiến trúc cổ kính hơn 140 năm tuổi nằm ngay trung tâm thành phố, phản ánh sự giao thoa văn hóa Đông - Tây trong quá trình hình thành đô thị Sài Gòn.',
    heritageLesson: 'Bài học về tinh thần bao dung văn hóa, sự tôn trọng tự do tín ngưỡng và ý thức bảo tồn các công trình kiến trúc cổ đô thị quý giá.',
    keyTakeaways: [
      'Gạch đỏ ngói Marseille không hề rêu mốc qua hơn một thế kỷ thời gian.',
      'Sự hòa quyện giữa văn hóa phương Tây và bản sắc đô thị đa dạng của TP.HCM.',
      'Gìn giữ giá trị di sản kiến trúc cổ trong lòng một thành phố hiện đại phát triển.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.NhaThoDB.storyContent,
  },
  NTCD: {
    code: 'NTCD',
    name: 'Nhà Tù Côn Đảo',
    location: 'Huyện Côn Đảo, Tỉnh Bà Rịa - Vũng Tàu',
    region: 'Nam',
    era: '1862 - 1975 (Trọng tâm: Ngày giải phóng 1/5/1975)',
    summary:
      'Sáng ngày 1/5/1975 đánh dấu mốc son lịch sử vĩ đại khi những người tù chính trị tại Côn Đảo tự nổi dậy phá gông cùm, giải phóng hòn đảo. Sự kiện này chính thức chấm dứt hơn một thế kỷ tồn tại của hệ thống nhà tù tàn khốc nhất Đông Dương. Ngày nay, khu di tích bảo tồn nguyên vẹn các không gian giam giữ, trở thành biểu tượng sống động về ý chí kiên trung và khát vọng tự do cháy bỏng của dân tộc Việt Nam.',
    historicalValue:
      'Quần thể di tích mang giá trị tố cáo tội ác chiến tranh sâu sắc thông qua việc giữ nguyên trạng các kiến trúc ép xác tàn bạo như: hệ thống Chuồng Cọp, trại Phú Bình, hầm đá, cùng những bộ gông cùm rỉ sét. Sự đối lập giữa sự tăm tối, lạnh lẽo của kiến trúc ngục tù và ánh sáng của ngày tự do càng làm nổi bật giá trị nhân văn và lịch sử của di tích.',
    heritageLesson:
      'Nhắc nhở thế hệ thanh niên về cái giá máu xương của nền độc lập và hòa bình. Hình ảnh những người tù gầy gò, mang đầy thương tích giương cao lá cờ tự do là bài học vĩ đại về nghị lực sống, tinh thần bất khuất trước nghịch cảnh, từ đó củng cố lòng biết ơn và trách nhiệm cống hiến cho quê hương.',
    keyTakeaways: [
      'Sáng 1/5/1975, những người tù chính trị Côn Đảo tự phá cửa sắt, giải phóng nhà tù.',
      'Sự kiện khép lại hơn một thế kỷ tồn tại của hệ thống nhà tù "địa ngục trần gian".',
      'Lá cờ giải phóng tung bay được khâu từ những mảnh vải giấu kín suốt những năm đọa đày.',
      'Các chứng tích lịch sử như chuồng cọp, gông cùm hiện được bảo tồn nguyên vẹn để du khách tham quan.',
    ],
    audioNarrationText:
      'Sáng sớm 1/5/1975, những người tù chính trị phá tung lớp cửa sắt của trại Phú Bình, tiếng reo hò tự do vỡ òa giữa không gian vốn u ám và lạnh lẽo của Côn Đảo. Những chiến sĩ gầy gò, mang đầy thương tích bước ra, chạy thẳng ra khoảng sân trung tâm, nơi sự kìm kẹp của chế độ cũ từng bủa vây. Họ ôm chầm lấy nhau, giương cao lá cờ giải phóng được khâu vội vàng từ những mảnh vải giấu kín suốt bao năm tháng đọa đày. Khắp các trại giam, đám chúa đảo và cai ngục đã bỏ chạy toán loạn hoặc cúi đầu chờ đợi, không một tiếng la mắng, không một tiếng roi vút. Đó là khoảnh khắc khép lại hơn một thế kỷ tồn tại của "địa ngục trần gian", mở ra ngày tự do thực sự cho hòn đảo đau thương. Ngày nay, những chuồng cọp tăm tối, những bộ gông cùm bằng sắt bọc rỉ sét năm xưa được giữ nguyên vẹn trong khuôn viên nhà tù, như một chứng nhân im lặng kể lại khúc tráng ca lịch sử ấy cho hàng triệu du khách mỗi năm ghé thăm.',
  },
  TDiaMS: {
    code: 'TDiaMS',
    name: 'Khu Đền tháp Thánh Địa Mỹ Sơn',
    location: 'Xã Duy Phú, Huyện Duy Xuyên, Tỉnh Quảng Nam',
    region: 'Trung',
    era: 'Xây dựng từ thế kỷ IV đến thế kỷ XIII',
    summary: DEFAULT_MONUMENT_STORIES.TDiaMS.storyContent,
    historicalValue: 'Di sản Văn hóa Thế giới UNESCO với kỹ thuật xây gạch mài chập và điêu khắc phù điêu Sa thạch bí ẩn mà khoa học ngày nay vẫn không ngừng thán phục.',
    heritageLesson: 'Bài học về sự phong phú của bản sắc văn hóa đa dân tộc Việt Nam, sự tôn trọng và bảo tồn các nền văn minh cổ đại trên dải đất hình chữ S.',
    keyTakeaways: [
      'Kỹ thuật xây tháp gạch nung độc nhất vô nhị không cần vữa liên kết lộ thiên.',
      'Bằng chứng rực rỡ của văn hóa tín ngưỡng Ấn Độ giáo hòa nhập bản địa Chăm Pa.',
      'Sự đa dạng di sản tạo nên chiều sâu ngàn năm của nền văn hóa Việt Nam thống nhất.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.TDiaMS.storyContent,
  },
  ThanhCoQT: {
    code: 'ThanhCoQT',
    name: 'Thành Cổ Quảng Trị',
    location: 'Phường 2, Thị xã Quảng Trị, Tỉnh Quảng Trị',
    region: 'Trung',
    era: 'Xây dựng từ thời vua Gia Long (1809) và vua Minh Mạng (1827)',
    summary: DEFAULT_MONUMENT_STORIES.ThanhCoQT.storyContent,
    historicalValue: 'Nghĩa trang không nấm mồ, biểu tượng cao cả của chủ nghĩa anh hùng cách mạng và tinh thần sẵn sàng quyết tử cho Tổ quốc quyết sinh.',
    heritageLesson: 'Bài học về đức hy sinh cao cả, lòng trung thành tuyệt đối với Tổ quốc và lòng biết ơn vô hạn đối với thế hệ thanh niên đã ngã xuống vì độc lập tự do.',
    keyTakeaways: [
      '81 ngày đêm năm 1972: Bản anh hùng ca bất tử của chủ nghĩa yêu nước Việt Nam.',
      'Mỗi tấc đất là một cuộc đời thanh xuân dâng hiến trọn vẹn cho Tổ quốc.',
      'Sống có lý tưởng, có trách nhiệm và xứng đáng với sự hy sinh của các thế hệ đi trước.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.ThanhCoQT.storyContent,
  },
  VanMieuQTG: {
    code: 'VanMieuQTG',
    name: 'Văn Miếu - Quốc Tử Giám',
    location: '58 Quốc Tử Giám, Quận Đống Đa, Hà Nội',
    region: 'Bắc',
    era: 'Văn Miếu xây năm 1070; Quốc Tử Giám lập năm 1076 thời vua Lý Nhân Tông',
    summary: DEFAULT_MONUMENT_STORIES.VanMieuQTG.storyContent,
    historicalValue: 'Quần thể di tích quốc gia đặc biệt với 82 bia Tiến sĩ vinh quy bái tổ được UNESCO công nhận là Di sản Tư liệu Thế giới.',
    heritageLesson: 'Bài học về truyền thống hiếu học, tôn sư trọng đạo, coi "Hiền tài là nguyên khí quốc gia", đặt sự học và tri thức làm nền tảng hưng thịnh dân tộc.',
    keyTakeaways: [
      'Trường đại học đầu tiên của Việt Nam biểu trưng cho truyền thống hiếu học ngàn đời.',
      '82 Bia Tiến sĩ: Tôn vinh người tài, lấy tri thức và đạo đức làm rường cột đất nước.',
      'Không ngừng học tập, trau dồi đạo đức và phát huy trí tuệ để phụng sự Tổ quốc.',
    ],
    audioNarrationText: DEFAULT_MONUMENT_STORIES.VanMieuQTG.storyContent,
  },
};

export const FUN_QUIZZES_DATA: Record<string, FunQuizItem[]> = {
  BNR: [
    {
      id: 'q_bnr_1',
      question: 'Bác Hồ ra đi tìm đường cứu nước từ Bến Nhà Rồng vào năm nào?',
      options: ['Năm 1911', 'Năm 1920', 'Năm 1930', 'Năm 1945'],
      correctIndex: 0,
      funFact: 'Chính xác! Ngày 5/6/1911, chàng thanh niên Văn Ba đã lên con tàu Amiral Latouche-Tréville bắt đầu hành trình vĩ đại!',
    },
    {
      id: 'q_bnr_2',
      question: 'Vì sao tòa nhà này lại có tên gọi dân gian quen thuộc là "Bến Nhà Rồng"?',
      options: [
        'Vì bến sông này ngày xưa có rồng bay lượn',
        'Vì trên nóc tòa nhà có gắn hai con rồng bằng gốm sứ châu đầu vào nhau',
        'Vì nhà vua thời Nguyễn từng ban sắc phong rồng cho bến',
        'Vì bến tàu được sơn hoàn toàn hình rồng vàng',
      ],
      correctIndex: 1,
      funFact: 'Rất chuẩn xác! Hai con rồng bằng gốm sứ xanh châu đầu vào mặt trời trên đỉnh mái chính là nguồn gốc tên gọi thân thương "Nhà Rồng".',
    },
  ],
  CBT: [
    {
      id: 'q_cbt_1',
      question: 'Điểm nhận diện đặc trưng nổi tiếng nhất của Chợ Bến Thành là gì?',
      options: ['Tháp đồng hồ 4 mặt', 'Bức tường gạch màu xanh', 'Cổng chào hình rồng vàng', 'Hồ phun nước trung tâm'],
      correctIndex: 0,
      funFact: 'Tuyệt vời! Tháp đồng hồ 4 mặt ở cửa Nam là góc check-in và biểu tượng thời gian hơn 100 năm của Sài Gòn!',
    },
    {
      id: 'q_cbt_2',
      question: 'Chợ Bến Thành có bao nhiêu cửa chính hướng ra các trục đường lớn?',
      options: ['2 cửa', '3 cửa', '4 cửa (Đông, Tây, Nam, Bắc)', '6 cửa'],
      correctIndex: 2,
      funFact: 'Đúng rồi! Chợ có 4 cửa chính Đông - Tây - Nam - Bắc tương ứng mở ra 4 con phố sầm uất giữa trung tâm quận 1.',
    },
  ],
  CMC: [
    {
      id: 'q_cmc_1',
      question: 'Kiến trúc độc đáo của Chùa Một Cột mô phỏng hình tượng gì?',
      options: ['Cây đa cổ thụ', 'Một bông sen ngàn cánh vươn lên mặt nước', 'Ngọn tháp chuông rồng', 'Một chiếc thuyền buồm'],
      correctIndex: 1,
      funFact: 'Chính xác! Chùa được ví như đóa sen tinh khiết nở giữa hồ Linh Chiểu, khởi nguồn từ giấc mộng của vua Lý Thái Tông.',
    },
    {
      id: 'q_cmc_2',
      question: 'Chùa Một Cột được khởi dựng dưới triều đại phong kiến nào của Việt Nam?',
      options: ['Nhà Trần', 'Nhà Lê', 'Nhà Lý (vua Lý Thái Tông)', 'Nhà Nguyễn'],
      correctIndex: 2,
      funFact: 'Hoan hô! Chùa được khởi dựng năm 1049 thời vua Lý Thái Tông, đến nay đã gần 1000 năm tuổi!',
    },
  ],
  CauHienLuong: [
    {
      id: 'q_cauhl_1',
      question: 'Cầu Hiền Lương bắc qua dòng sông lịch sử nào?',
      options: ['Sông Hương', 'Sông Thạch Hãn', 'Sông Bến Hải', 'Sông Gianh'],
      correctIndex: 2,
      funFact: 'Tuyệt vời! Sông Bến Hải và cầu Hiền Lương chính là giới tuyến quân sự tạm thời chia cắt đất nước trong hơn 20 năm.',
    },
    {
      id: 'q_cauhl_2',
      question: 'Cầu Hiền Lương nằm ở vĩ tuyến bao nhiêu?',
      options: ['Vĩ tuyến 13', 'Vĩ tuyến 17', 'Vĩ tuyến 20', 'Vĩ tuyến 21'],
      correctIndex: 1,
      funFact: 'Rất chuẩn! Vĩ tuyến 17 được quy định trong Hiệp định Giơ-ne-vơ 1954 và trở thành chứng nhân của khát vọng thống nhất.',
    },
  ],
  DDCC: [
    {
      id: 'q_ddcc_1',
      question: 'Địa đạo Củ Chi được mệnh danh với danh xưng anh hùng nào?',
      options: ['Đất Thép Thành Đồng', 'Vùng Đất Kim Cương', 'Pháo Đài Bất Khả Xâm Phạm', 'Kỳ Quan Sa Mạc'],
      correctIndex: 0,
      funFact: 'Chính xác! "Đất thép thành đồng" là niềm tự hào của vùng đất kiên trung Củ Chi qua hai cuộc kháng chiến.',
    },
    {
      id: 'q_ddcc_2',
      question: 'Hệ thống bếp nấu giấu khói nổi tiếng trong lòng địa đạo có tên là gì?',
      options: ['Bếp Lò Than', 'Bếp Củi Nước', 'Bếp Hoàng Cầm', 'Bếp Hồng Ngoại'],
      correctIndex: 2,
      funFact: 'Xuất sắc! Bếp Hoàng Cầm dẫn khói qua các rãnh đất ngầm làm loãng khói, máy bay địch trên cao không thể phát hiện.',
    },
  ],
  DenHung: [
    {
      id: 'q_denhung_1',
      question: 'Khu di tích lịch sử Đền Hùng tọa lạc trên ngọn núi thiêng nào?',
      options: ['Núi Yên Tử', 'Núi Nghĩa Lĩnh', 'Núi Ba Vì', 'Núi Nưa'],
      correctIndex: 1,
      funFact: 'Chính xác! Đền Hùng nằm trên núi Nghĩa Lĩnh (núi Hùng), cao 175m so với mực nước biển tại TP. Việt Trì, Phú Thọ.',
    },
    {
      id: 'q_denhung_2',
      question: 'Ngày Giỗ Tổ Hùng Vương hằng năm diễn ra vào ngày âm lịch nào?',
      options: ['Mùng 1 tháng Giêng', 'Mùng 10 tháng 3', 'Ngày 15 tháng 8', 'Ngày 2 tháng 9'],
      correctIndex: 1,
      funFact: 'Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba! Rất chính xác!',
    },
  ],
  DinhDocLap: [
    {
      id: 'q_dinhdl_1',
      question: 'Chiếc xe tăng lịch sử nào đã húc đổ cánh cổng Dinh Độc Lập trưa ngày 30/4/1975?',
      options: ['Xe tăng 390 và 843', 'Xe tăng 100 và 200', 'Xe tăng 555', 'Xe tăng 999'],
      correctIndex: 0,
      funFact: 'Chính xác! Xe tăng 390 húc đổ cổng chính và xe tăng 843 tiến vào cắm cờ giải phóng trên nóc Dinh Độc Lập.',
    },
    {
      id: 'q_dinhdl_2',
      question: 'Ai là kiến trúc sư tài ba đã thiết kế công trình Dinh Độc Lập hiện nay?',
      options: ['KTS Võ Trọng Nghĩa', 'KTS Ngô Viết Thụ', 'KTS Huỳnh Tấn Phát', 'KTS Nguyễn Gia Trí'],
      correctIndex: 1,
      funFact: 'Chuẩn xác! KTS Ngô Viết Thụ (giải Khôi nguyên La Mã) đã thiết kế công trình với bố cục chữ Hán Cát tường, Khẩu, Trung, Chủ.',
    },
  ],
  LangChuTichHCM: [
    {
      id: 'q_lang_1',
      question: 'Lăng Chủ tịch Hồ Chí Minh nằm ở quảng trường lịch sử nào tại Hà Nội?',
      options: ['Quảng trường Đông Kinh Nghĩa Thục', 'Quảng trường Cách Mạng Tháng Tám', 'Quảng trường Ba Đình', 'Quảng trường 1-5'],
      correctIndex: 2,
      funFact: 'Đúng rồi! Quảng trường Ba Đình là nơi Bác Hồ đọc Tuyên ngôn Độc lập ngày 2/9/1945 và là nơi Lăng Bác ngự trị uy nghiêm.',
    },
    {
      id: 'q_lang_2',
      question: 'Hàng tre xanh trồng hai bên Lăng Bác tượng trưng cho điều gì?',
      options: ['Vẻ đẹp của cây cảnh miền Bắc', 'Tâm hồn, khí phách kiên cường bất khuất của dân tộc Việt Nam', 'Để chắn gió mùa đông', 'Quà tặng từ nước ngoài'],
      correctIndex: 1,
      funFact: 'Chính xác! "Đã thấy trong sương hàng tre bát ngát / Ôi hàng tre xanh xanh Việt Nam / Bão táp mưa sa đứng thẳng hàng"!',
    },
  ],
  NgoMon: [
    {
      id: 'q_ngomon_1',
      question: 'Công trình kiến trúc nằm trên đỉnh cổng Ngọ Môn có tên là gì?',
      options: ['Lầu Ngũ Phụng', 'Điện Thái Hòa', 'Chùa Thiên Mụ', 'Tháp Phước Duyên'],
      correctIndex: 0,
      funFact: 'Chính xác! Lầu Ngũ Phụng với hệ thống 100 cột gỗ lim thanh thoát như năm con chim phụng đang đậu.',
    },
    {
      id: 'q_ngomon_2',
      question: 'Cổng Ngọ Môn được xây dựng dưới triều vua nào của nhà Nguyễn?',
      options: ['Vua Gia Long', 'Vua Minh Mạng', 'Vua Tự Đức', 'Vua Khải Định'],
      correctIndex: 1,
      funFact: 'Tuyệt vời! Ngọ Môn được xây dựng vào năm 1833 dưới triều vua Minh Mạng thứ 14.',
    },
  ],
  NhaThoDB: [
    {
      id: 'q_nhathodb_1',
      question: 'Gạch đỏ xây dựng Nhà Thờ Đức Bà được chuyển từ đâu về?',
      options: ['Bát Tràng (Hà Nội)', 'Marseille (Pháp)', 'Đồng Nai', 'Hải Phòng'],
      correctIndex: 1,
      funFact: 'Chuẩn xác! Toàn bộ gạch đỏ ngói Marseille được chuyển từ Pháp sang, qua 140 năm vẫn giữ màu hồng tươi không hề bám rêu.',
    },
    {
      id: 'q_nhathodb_2',
      question: 'Nhà Thờ Đức Bà có bao nhiêu tháp chuông chính cao vút?',
      options: ['1 tháp', '2 tháp chuông song song', '3 tháp', '4 tháp'],
      correctIndex: 1,
      funFact: 'Đúng rồi! Hai tháp chuông đôi cao hơn 60 mét với 6 quả chuông đồng lớn ngân vang khắp trung tâm thành phố.',
    },
  ],
  TDiaMS: [
    {
      id: 'q_tdms_1',
      question: 'Thánh Địa Mỹ Sơn từng là trung tâm tôn giáo của vương quốc cổ nào?',
      options: ['Phù Nam', 'Chăm Pa', 'Đại Việt', 'Chân Lạp'],
      correctIndex: 1,
      funFact: 'Chính xác! Nơi đây là thánh địa tâm linh thiêng liêng bậc nhất của vương triều Chăm Pa từ thế kỷ IV đến XIII.',
    },
    {
      id: 'q_tdms_2',
      question: 'Chất kết dính giữa các viên gạch xây tháp Mỹ Sơn là điều kỳ bí nào?',
      options: ['Xi măng hiện đại', 'Dùng keo hoá học', 'Chất nhựa thực vật bản địa (dầu rái) kết hợp kỹ thuật mài chập', 'Đinh sắt'],
      correctIndex: 2,
      funFact: 'Tuyệt vời! Người Chăm cổ mài chập khít các viên gạch và sử dụng hợp chất tự nhiên khiến các mạch ghép gần như vô hình!',
    },
  ],
  ThanhCoQT: [
    {
      id: 'q_thanhco_1',
      question: 'Cuộc chiến ác liệt tại Thành Cổ Quảng Trị mùa hè đỏ lửa 1972 kéo dài bao nhiêu ngày đêm?',
      options: ['30 ngày đêm', '56 ngày đêm', '81 ngày đêm', '100 ngày đêm'],
      correctIndex: 2,
      funFact: 'Rất chính xác! Trận đánh 81 ngày đêm bảo vệ Thành Cổ Quảng Trị là một trong những trang sử hào hùng bi tráng nhất của dân tộc.',
    },
    {
      id: 'q_thanhco_2',
      question: 'Dòng sông nào nằm bên Thành Cổ Quảng Trị, nơi hàng vạn ngọn hoa đăng được thả để tri ân các anh hùng?',
      options: ['Sông Hương', 'Sông Thạch Hãn', 'Sông Bến Hải', 'Sông Nhật Lệ'],
      correctIndex: 1,
      funFact: 'Đò lên Thạch Hãn xin chèo nhẹ / Đáy sông còn đó bạn tôi nằm... Đúng là dòng sông Thạch Hãn anh hùng!',
    },
  ],
  NTCD: [
    {
      id: 'q_ntcd_1',
      question: 'Sự kiện lịch sử giải phóng Nhà tù Côn Đảo diễn ra vào thời khắc nào?',
      options: [
        'Sáng ngày 1/5/1975',
        'Ngày 30/4/1975',
        'Ngày 2/9/1945',
        'Ngày 19/5/1968',
      ],
      correctIndex: 0,
      funFact: 'Chính xác! Sáng 1/5/1975, những người tù chính trị kiên trung đã tự nổi dậy phá tan cửa sắt, tự giải phóng nhà tù Côn Đảo sau hơn một thế kỷ đau thương!',
    },
    {
      id: 'q_ntcd_2',
      question: 'Kiến trúc giam giữ tàn bạo mang tính biểu tượng khét tiếng tại Nhà tù Côn Đảo được gọi là gì?',
      options: [
        'Hệ thống Chuồng Cọp',
        'Địa đạo bí mật',
        'Tháp canh ven biển',
        'Pháo đài ngầm',
      ],
      correctIndex: 0,
      funFact: 'Rất chính xác! Hệ thống "Chuồng Cọp" tại Côn Đảo là minh chứng tố cáo tội ác chiến tranh tàn bạo và ý chí bất khuất của các chiến sĩ cách mạng.',
    },
  ],
  VanMieuQTG: [
    {
      id: 'q_vmqtg_1',
      question: 'Văn Miếu - Quốc Tử Giám được tôn vinh với danh xưng lịch sử nào?',
      options: [
        'Ngôi chùa cổ nhất Việt Nam',
        'Trường Đại học đầu tiên của Việt Nam',
        'Bảo tàng lịch sử quốc gia',
        'Cung điện mùa hè của triều Lý',
      ],
      correctIndex: 1,
      funFact: 'Tuyệt vời! Văn Miếu xây năm 1070, đến năm 1076 Quốc Tử Giám được lập, trở thành trường đại học đầu tiên của nước ta.',
    },
    {
      id: 'q_vmqtg_2',
      question: 'Trong Văn Miếu có bao nhiêu tấm bia Tiến sĩ vinh quy bái tổ được đặt trên lưng rùa đá?',
      options: ['50 tấm bia', '82 tấm bia Tiến sĩ', '100 tấm bia', '120 tấm bia'],
      correctIndex: 1,
      funFact: 'Chính xác! 82 tấm bia Tiến sĩ là Di sản Tư liệu Thế giới ghi danh các bậc đại khoa hiền tài của đất nước.',
    },
  ],
};
