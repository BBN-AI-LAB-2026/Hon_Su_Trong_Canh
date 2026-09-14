export interface DefaultMonumentStory {
  monumentCode: string;
  monumentName: string;
  storyTitle: string;
  storyContent: string;
  era: string;
  author: string;
}

export const DEFAULT_MONUMENT_STORIES: Record<string, DefaultMonumentStory> = {
  BNR: {
    monumentCode: 'BNR',
    monumentName: 'Bến Nhà Rồng',
    storyTitle: 'Bến Nhà Rồng - Khởi Đầu Cuộc Hành Trình Cứu Nước Vĩ Đại',
    storyContent:
      'Ngày 5/6/1911, tại bến cảng mang tên Nhà Rồng vì nóc nhà chạm hình rồng kiểu phương Đông, một chàng trai trẻ tên Nguyễn Tất Thành lặng lẽ bước lên con tàu Amiral Latouche-Tréville với danh nghĩa phụ bếp. Không ai trong số thủy thủ đoàn biết rằng người thanh niên gầy gò ấy sẽ trở thành Chủ tịch Hồ Chí Minh, người dẫn dắt cả một dân tộc giành độc lập ba mươi năm sau đó. Suốt hành trình bôn ba khắp năm châu, ông làm đủ nghề để mưu sinh và học hỏi, từ đầu bếp trên tàu, thợ ảnh ở Paris cho đến người viết báo, nhưng luôn đau đáu câu hỏi làm sao để giải phóng quê hương. Bến Nhà Rồng năm xưa nay là Bảo tàng Hồ Chí Minh, nơi lưu giữ những di vật giản dị: đôi dép cao su, chiếc va li cũ, cuốn sổ tay ghi chép nét chữ nắn nót. Mỗi năm vào tháng 6, dòng người vẫn về đây, đứng lặng trước bến sông, tưởng nhớ ngày một hành trình lịch sử bắt đầu.',
    era: 'Tháng 6 năm 1911 - Thời Pháp thuộc',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  CBT: {
    monumentCode: 'CBT',
    monumentName: 'Chợ Bến Thành',
    storyTitle: 'Chợ Bến Thành - Hơn Một Thế Kỷ Nhịp Đập Sài Gòn',
    storyContent:
      'Trước khi có dáng vẻ với tháp đồng hồ quen thuộc ngày nay, ngôi chợ này từng nằm bên bờ sông Bến Nghé, gần bến thuyền tấp nập nên được gọi là Bến Thành. Năm 1911, chợ bị hỏa hoạn thiêu rụi, người Pháp quyết định xây lại tại vị trí mới — chính là khu chợ sừng sững giữa trung tâm Sài Gòn hiện nay, hoàn thành năm 1914. Từ đó, chiếc đồng hồ trên tháp cửa Nam trở thành biểu tượng, là điểm hẹn quen thuộc của bao thế hệ người Sài Gòn: "Hẹn gặp nhau dưới đồng hồ chợ Bến Thành" là câu nói cửa miệng suốt hơn trăm năm qua. Trải qua bao biến động lịch sử, khu chợ vẫn giữ nhịp sống sôi động, từ những sạp vải, hàng thực phẩm truyền thống đến quà lưu niệm cho du khách quốc tế. Buổi tối, khu chợ đêm bên ngoài lại rực sáng đèn, tiếp nối câu chuyện buôn bán không ngừng nghỉ của một trong những khu chợ lâu đời và nổi tiếng nhất Việt Nam.',
    era: 'Khởi dựng năm 1912 - Hoàn thành năm 1914',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  CMC: {
    monumentCode: 'CMC',
    monumentName: 'Chùa Một Cột',
    storyTitle: 'Chùa Một Cột - Giấc Mộng Đài Sen Ngàn Năm Văn Hiến',
    storyContent:
      'Tương truyền vào thế kỷ 11, vua Lý Thái Tông một đêm nằm mộng thấy Phật Bà Quan Âm ngồi trên tòa sen, tay bế một hoàng tử, dẫn nhà vua lên đài sen ấy. Ít lâu sau, nhà vua có được hoàng tử nối dõi như trong giấc mộng, liền cho dựng một ngôi chùa hình dáng đài sen, đặt trên một cột đá duy nhất giữa hồ nước, để tạ ơn và ghi nhớ điềm lành ấy — đó chính là Chùa Một Cột, khởi dựng năm 1049. Kiến trúc độc đáo với một trụ đá vươn lên giữa hồ, đỡ lấy ngôi chùa gỗ nhỏ hình vuông trên đỉnh, được ví như đóa sen nở giữa mặt nước, mang đậm tinh thần Phật giáo thời Lý. Trải qua gần nghìn năm cùng chiến tranh, thiên tai, ngôi chùa từng nhiều lần được trùng tu, phục dựng, nhưng vẫn giữ được hình dáng nguyên bản độc nhất vô nhị không nơi nào trên thế giới có được. Đến nay, Chùa Một Cột vẫn là một trong những biểu tượng kiến trúc Phật giáo tiêu biểu nhất của Hà Nội ngàn năm văn hiến.',
    era: 'Năm Kỷ Sửu 1049 - Triều Lý',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  CauHienLuong: {
    monumentCode: 'CauHienLuong',
    monumentName: 'Cầu Hiền Lương - Sông Bến Hải',
    storyTitle: 'Cầu Hiền Lương - Vĩ Tuyến 17 Và Khát Vọng Thống Nhất Non Sông',
    storyContent:
      'Năm 1954, Hiệp định Genève chia đôi đất nước tại vĩ tuyến 17, và cây cầu bắc qua sông Bến Hải bỗng trở thành ranh giới nghiệt ngã suốt 21 năm ròng. Một nửa cầu phía Bắc sơn màu xanh, nửa phía Nam mang màu khác, chỉ một vạch sơn kẻ giữa cầu thôi mà chia cắt bao gia đình, đôi lứa yêu nhau đứng hai đầu cầu không thể bước qua. Có câu chuyện kể về đôi vợ chồng trẻ, người vợ ở bờ Bắc, người chồng công tác bờ Nam, suốt hai mươi năm chỉ có thể đứng xa nhìn nhau qua dòng sông, chưa một lần được nắm tay. Loa phóng thanh từ hai phía ngày đêm phát đi những bài hát, lời kêu gọi, tạo nên một cuộc "chiến tranh bằng âm thanh" đầy ám ảnh. Đến năm 1975, khi đất nước thống nhất, cây cầu mới thực sự được nối liền theo đúng nghĩa. Ngày nay, cột cờ giới tuyến cao vút vẫn đứng sừng sững bên bờ Bắc, còn cây cầu Hiền Lương sơn hai màu được giữ lại như một chứng tích nhắc nhở về nỗi đau chia cắt và niềm vui đoàn tụ của dân tộc.',
    era: '1954 - 1975 (21 năm vĩ tuyến 17)',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  DDCC: {
    monumentCode: 'DDCC',
    monumentName: 'Địa đạo Củ Chi',
    storyTitle: 'Địa Đạo Củ Chi - Kỳ Tích Thành Phố Ngầm Dưới Lòng Đất Thép',
    storyContent:
      'Dưới lòng đất Củ Chi, cách Sài Gòn chỉ ba mươi cây số, tồn tại một thế giới song song dài hơn 250 km, len lỏi qua ba tầng sâu như một thành phố ngầm thu nhỏ. Suốt hai cuộc kháng chiến, người dân và du kích đào địa đạo bằng tay không, dùng cuốc, xẻng thô sơ, đôi khi chỉ bằng chiếc lon sữa bò cắt thành xẻng nhỏ để moi đất trong không gian chật hẹp không đầy một mét vuông. Bên trong là bếp Hoàng Cầm tỏa khói theo đường ngầm để tránh bị phát hiện từ trên không, là phòng họp, trạm quân y, kho lương thực, thậm chí cả nơi sinh hoạt gia đình giữa bom đạn ngày đêm. Có những đứa trẻ chào đời ngay dưới địa đạo, chưa từng thấy ánh mặt trời cho đến khi chiến tranh gần kết thúc. Ngày nay, du khách chui qua những đoạn hầm được mở rộng để tham quan vẫn không khỏi rùng mình trước sự ngột ngạt, tối tăm — và càng khâm phục hơn sức chịu đựng phi thường của những con người từng sống, chiến đấu suốt nhiều năm trong lòng đất ấy.',
    era: '1946 - 1968 (Thời kỳ kháng chiến)',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  DenHung: {
    monumentCode: 'DenHung',
    monumentName: 'Đền Hùng',
    storyTitle: 'Đền Hùng - Cội Nguồn Dân Tộc Và Khí Thiêng Núi Nghĩa Lĩnh',
    storyContent:
      'Truyền thuyết kể rằng vua Hùng thứ nhất đã chọn núi Nghĩa Lĩnh, giữa vùng đất Phong Châu, để lập đô và dựng nước Văn Lang — nhà nước đầu tiên của người Việt. Đền Hùng ngày nay tọa lạc trên chính ngọn núi ấy, gồm bốn đền chính là đền Hạ, đền Trung, đền Thượng và đền Giếng, mỗi nơi gắn với một câu chuyện dân gian riêng. Tương truyền đền Thượng chính là nơi vua Hùng thường lên tế trời đất, cầu cho mưa thuận gió hòa, còn đền Giếng là nơi hai công chúa Tiên Dung và Ngọc Hoa thường soi gương chải tóc bên giếng nước trong veo. Mùng 10 tháng 3 âm lịch hằng năm, dòng người từ khắp mọi miền đất nước đổ về đây, leo hàng trăm bậc đá dưới tán cây cổ thụ để dâng hương tưởng nhớ tổ tiên, cùng nhau nhắc lại câu ca dao đã in sâu vào tâm thức bao thế hệ: "Dù ai đi ngược về xuôi, nhớ ngày giỗ Tổ mùng mười tháng ba."',
    era: 'Thời đại Hùng Vương dựng nước Văn Lang',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  DinhDocLap: {
    monumentCode: 'DinhDocLap',
    monumentName: 'Dinh Độc Lập',
    storyTitle: 'Dinh Độc Lập - Khoảnh Khắc Lịch Sử Trưa Ngày 30/4/1975',
    storyContent:
      'Trưa 30/4/1975, chiếc xe tăng mang số hiệu 843, húc tung cánh cổng sắt của Dinh Độc Lập, tiếng động cơ gầm vang giữa không khí tĩnh lặng lạ thường của Sài Gòn. Trung úy Bùi Quang Thận nhảy xuống, chạy thẳng lên tầng thượng, nơi lá cờ của chính quyền cũ vẫn còn phấp phới. Ông kéo nó xuống, thay bằng lá cờ giải phóng mang theo suốt hành trình từ miền Bắc vào Nam. Bên trong dinh, Tổng thống Dương Văn Minh cùng nội các đang ngồi chờ, không một tiếng súng nổ, không một sự phản kháng. Đó là khoảnh khắc khép lại cuộc chiến kéo dài hai mươi năm, mở ra một trang sử mới cho đất nước. Ngày nay, chiếc bàn nơi ông Minh từng ngồi, chiếc xe tăng năm xưa được giữ nguyên vẹn trong khuôn viên dinh, như một chứng nhân im lặng kể lại giây phút lịch sử ấy cho hàng triệu du khách mỗi năm ghé thăm.',
    era: 'Trưa ngày 30 tháng 4 năm 1975',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  LangChuTichHCM: {
    monumentCode: 'LangChuTichHCM',
    monumentName: 'Lăng Chủ tịch Hồ Chí Minh',
    storyTitle: 'Lăng Bác - Tấm Lòng Non Sông Đối Với Người Cha Già Dân Tộc',
    storyContent:
      'Trong di chúc để lại trước lúc qua đời năm 1969, Chủ tịch Hồ Chí Minh mong muốn được hỏa táng giản dị, tro cốt chia đều ba miền đất nước. Thế nhưng, trước tình cảm và nguyện vọng tha thiết của toàn dân, Bộ Chính trị quyết định giữ gìn thi hài Người, xây dựng lăng để đồng bào cả nước, đặc biệt là những người con miền Nam chưa kịp ra thăm Bác lúc sinh thời, có nơi đến viếng. Công trình được khởi công năm 1973 giữa lúc chiến tranh vẫn còn ác liệt, với sự giúp đỡ kỹ thuật từ các chuyên gia Liên Xô, và khánh thành năm 1975. Đá cẩm thạch, gỗ quý từ khắp mọi miền Tổ quốc, kể cả gỗ từ Tây Nguyên, đá từ Cao Bằng, đều được gửi về góp phần xây dựng, như một cách để cả nước cùng chung tay dựng nơi an nghỉ cho Người. Mỗi sáng, hàng dài người xếp hàng từ rất sớm, lặng lẽ đi qua trong tiếng nhạc trầm buồn, để được nhìn thấy gương mặt hiền từ quen thuộc một lần trong đời.',
    era: 'Khởi công 1973 - Khánh thành 1975',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  NgoMon: {
    monumentCode: 'NgoMon',
    monumentName: 'Cố đô Huế (Ngọ Môn)',
    storyTitle: 'Ngọ Môn Cố Đô Huế - Dấu Ấn Vương Triều Và Bước Ngoặt Lịch Sử',
    storyContent:
      'Ngọ Môn được xây dựng năm 1833 dưới triều vua Minh Mạng, là cổng chính phía nam của Hoàng thành Huế, mang ý nghĩa "cổng giữa trưa" — hướng chính ngọ, hướng của bậc đế vương. Với năm cửa, trong đó cửa giữa chỉ dành riêng cho vua đi qua, cùng lầu Ngũ Phụng phía trên với hai tầng mái chồng lên nhau như đôi cánh chim phượng xòe rộng, Ngọ Môn từng là nơi diễn ra những nghi lễ quan trọng bậc nhất của triều Nguyễn. Chính tại đây, ngày 30/8/1945, vua Bảo Đại — vị hoàng đế cuối cùng của chế độ phong kiến Việt Nam — đã đọc chiếu thoái vị, trao ấn kiếm cho đại diện chính phủ cách mạng lâm thời, khép lại hơn nghìn năm chế độ quân chủ. Khoảnh khắc ấy đánh dấu bước ngoặt lớn của lịch sử dân tộc. Ngày nay, đứng trước Ngọ Môn lộng gió, du khách vẫn có thể hình dung lại khung cảnh trang nghiêm năm xưa, khi bậc thềm đá cẩm thạch từng in dấu chân của biết bao vị vua triều Nguyễn.',
    era: 'Khởi dựng năm 1833 - Lịch sử thoái vị 1945',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  NhaThoDB: {
    monumentCode: 'NhaThoDB',
    monumentName: 'Nhà Thờ Đức Bà',
    storyTitle: 'Nhà Thờ Đức Bà - Tuyệt Tác Kiến Trúc Và Ký Ức Tâm Linh Sài Gòn',
    storyContent:
      'Năm 1877, toàn bộ vật liệu xây dựng nhà thờ được chuyển thẳng từ Pháp sang, từ viên gạch đỏ Marseille không tô trát cho đến khung sắt thánh đường, để đảm bảo công trình giữ được vẻ nguyên bản giữa khí hậu nhiệt đới. Năm 1959, một bức tượng Đức Mẹ Hòa Bình bằng đá cẩm thạch trắng được đặt phía trước, và không lâu sau, có người truyền tai nhau rằng đã nhìn thấy những giọt nước mắt ứa ra từ khóe mắt tượng. Tin đồn lan xa, hàng ngàn người đổ về cầu nguyện, biến khoảnh sân nhỏ trước nhà thờ thành nơi hành hương suốt nhiều tuần liền. Dù chưa từng có lời giải thích khoa học nào được xác nhận chính thức, câu chuyện ấy vẫn được kể lại như một phần ký ức tâm linh của người Sài Gòn. Ngày nay, giữa tiếng chuông ngân buổi sớm và ánh nắng xuyên qua ô kính màu, nhà thờ vẫn là điểm hẹn quen thuộc của các cặp đôi đến chụp ảnh cưới, nối tiếp câu chuyện hơn một thế kỷ.',
    era: 'Khởi công năm 1877 - Khánh thành 1880',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  NTCD: {
    monumentCode: 'NTCD',
    monumentName: 'Nhà Tù Côn Đảo',
    storyTitle: 'Khoảnh khắc phá xiềng xích trên "Địa ngục trần gian" Côn Đảo',
    storyContent:
      'Sáng sớm 1/5/1975, những người tù chính trị phá tung lớp cửa sắt của trại Phú Bình, tiếng reo hò tự do vỡ òa giữa không gian vốn u ám và lạnh lẽo của Côn Đảo. Những chiến sĩ gầy gò, mang đầy thương tích bước ra, chạy thẳng ra khoảng sân trung tâm, nơi sự kìm kẹp của chế độ cũ từng bủa vây. Họ ôm chầm lấy nhau, giương cao lá cờ giải phóng được khâu vội vàng từ những mảnh vải giấu kín suốt bao năm tháng đọa đày. Khắp các trại giam, đám chúa đảo và cai ngục đã bỏ chạy toán loạn hoặc cúi đầu chờ đợi, không một tiếng la mắng, không một tiếng roi vút. Đó là khoảnh khắc khép lại hơn một thế kỷ tồn tại của "địa ngục trần gian", mở ra ngày tự do thực sự cho hòn đảo đau thương. Ngày nay, những chuồng cọp tăm tối, những bộ gông cùm bằng sắt bọc rỉ sét năm xưa được giữ nguyên vẹn trong khuôn viên nhà tù, như một chứng nhân im lặng kể lại khúc tráng ca lịch sử ấy cho hàng triệu du khách mỗi năm ghé thăm.',
    era: '1862 - 1975 (Trọng tâm: Ngày giải phóng 1/5/1975)',
    author: 'Ban Quản Trị Di Sản',
  },
  TDiaMS: {
    monumentCode: 'TDiaMS',
    monumentName: 'Thánh Địa Mỹ Sơn',
    storyTitle: 'Thánh Địa Mỹ Sơn - Huyền Bí Tháp Gạch Và Nền Văn Minh Cổ',
    storyContent:
      'Nằm ẩn mình giữa thung lũng khép kín của vùng đất Duy Xuyên, Quảng Nam, Thánh địa Mỹ Sơn từng là trung tâm cúng tế và tín ngưỡng thiêng liêng bậc nhất của vương quốc Champa cổ suốt từ thế kỷ IV đến thế kỷ XIII. Khởi nguồn từ ngôi đền bằng gỗ do vua Bhadravarman I dựng lên để thờ thần Shiva, qua nhiều thế kỷ, nơi đây đã phát triển thành một quần thể đồ sộ với hơn 70 công trình đền tháp bằng gạch sừng sững giữa núi rừng. Điều kỳ diệu làm kinh ngạc các nhà khảo cổ học chính là kỹ thuật xây dựng bí ẩn: những viên gạch nung đỏ được mài chập khít vào nhau mà không hề lộ rõ mạch vữa, trải qua mưa nắng ngàn năm vẫn giữ nguyên sắc màu son rực rỡ cùng những bức phù điêu vũ nữ Apsara uyển chuyển. Dù chiến tranh khốc liệt từng tàn phá nhiều di tích, những phế tích còn lại vẫn toát lên vẻ trầm mặc, linh thiêng đầy kiêu hãnh. Năm 1999, Mỹ Sơn chính thức được UNESCO công nhận là Di sản Văn hóa Thế giới. Ngày nay, dạo bước giữa những vòm tháp rêu phong trong tiếng gió ngàn và điệu múa Chăm huyền bí, du khách vẫn ngỡ như chạm vào hào quang của một nền văn minh rực rỡ từng lắng sâu dưới dòng thời gian.',
    era: 'Thế kỷ IV đến thế kỷ XIII - Vương triều Champa',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  ThanhCoQT: {
    monumentCode: 'ThanhCoQT',
    monumentName: 'Thành Cổ Quảng Trị',
    storyTitle: 'Thành Cổ Quảng Trị - 81 Ngày Đêm Bi Tráng Và Khúc Ca Bất Tử',
    storyContent:
      'Mùa hè năm 1972, Thành Cổ Quảng Trị trở thành chiến trường ác liệt bậc nhất trong lịch sử chiến tranh Việt Nam, khi bộ đội ta chiến đấu giữ từng tấc đất suốt 81 ngày đêm dưới mưa bom bão đạn dữ dội chưa từng có. Người ta ước tính lượng bom đạn trút xuống mảnh đất nhỏ bé này tương đương sức công phá của bảy quả bom nguyên tử từng ném xuống Hiroshima. Dòng sông Thạch Hãn chảy qua thành cổ đã chứng kiến hàng ngàn chiến sĩ trẻ ngã xuống, nhiều người không kịp có được một nấm mộ, thân thể hòa vào lòng sông, lòng đất quê hương. Sau này, nhà thơ Lê Bá Dương đã viết nên câu thơ lay động: "Đò lên Thạch Hãn ơi... chèo nhẹ, đáy sông còn đó bạn tôi nằm." Ngày nay, thành cổ chỉ còn lại những đoạn tường thành loang lổ vết đạn, cùng đài tưởng niệm trắng giản dị ở trung tâm, nơi hương khói không bao giờ tắt. Mỗi năm, đặc biệt vào tháng 7, dòng người vẫn về đây thả hoa đăng trên sông Thạch Hãn, tưởng nhớ những người lính đã nằm lại tuổi hai mươi.',
    era: 'Mùa hè đỏ lửa năm 1972 (81 ngày đêm)',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
  VanMieuQTG: {
    monumentCode: 'VanMieuQTG',
    monumentName: 'Văn Miếu Quốc Tử Giám',
    storyTitle: 'Văn Miếu - Quốc Tử Giám: Trường Đại Học Đầu Tiên Và Khí Phách Hiếu Học',
    storyContent:
      'Năm 1070, vua Lý Thánh Tông cho xây dựng Văn Miếu để thờ Khổng Tử, và sáu năm sau, Quốc Tử Giám ra đời, trở thành trường đại học đầu tiên của Việt Nam. Nơi đây từng đào tạo nên biết bao nhân tài, với 82 tấm bia tiến sĩ đặt trên lưng rùa đá vững chãi ghi danh gần 1.300 vị đỗ đạt qua các kỳ khoa cử. Đến năm 1805 dưới triều Nguyễn, Khuê Văn Các được dựng lên ngay trong khuôn viên, mang dáng dấp lầu vuông nhỏ nhắn với bốn cửa sổ tròn hình mặt trời tỏa sáng bốn hướng, tượng trưng cho sao Khuê — ngôi sao chủ về văn chương, học thuật. Xưa kia, đây từng là nơi sĩ tử dừng chân và bình những bài văn hay trước khi xướng danh trong các kỳ thi Hội. Trải qua bao thăng trầm, công trình tinh tế này đã trở thành biểu tượng chính thức của thủ đô Hà Nội. Ngày nay, trước mỗi mùa thi cử, nhiều thế hệ học trò vẫn tìm về đây gửi gắm ước nguyện may mắn. Đứng trong khuôn viên cổ kính vào một buổi chiều tà, ngắm ánh nắng xuyên qua ô cửa tròn gác Khuê Văn, du khách vẫn cảm nhận trọn vẹn hào khí ngàn năm văn vật cùng truyền thống hiếu học bất diệt của dân tộc Việt.',
    era: 'Năm 1070 (Văn Miếu) & 1076 (Quốc Tử Giám) - Triều Lý',
    author: 'Tư liệu Lịch sử Di Tích Việt',
  },
};
