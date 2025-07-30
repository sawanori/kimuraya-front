import { Language } from '@/lib/i18n'

// 静的な翻訳（UI要素など）
export const staticTranslations: Record<string, Record<Language, string>> = {
  // ナビゲーション
  'nav.home': {
    ja: 'ホーム',
    en: 'Home',
    ko: '홈',
    zh: '首页'
  },
  'nav.about': {
    ja: '私たちについて',
    en: 'About Us',
    ko: '우리에 대해',
    zh: '关于我们'
  },
  'nav.features': {
    ja: '特徴',
    en: 'Features',
    ko: '특징',
    zh: '特色'
  },
  'nav.menu': {
    ja: 'メニュー',
    en: 'Menu',
    ko: '메뉴',
    zh: '菜单'
  },
  'nav.gallery': {
    ja: 'ギャラリー',
    en: 'Gallery',
    ko: '갤러리',
    zh: '画廊'
  },
  'nav.info': {
    ja: '店舗情報',
    en: 'Store Info',
    ko: '매장 정보',
    zh: '店铺信息'
  },
  'nav.seats': {
    ja: 'お席案内',
    en: 'Seating',
    ko: '좌석 안내',
    zh: '座位介绍'
  },
  'nav.access': {
    ja: 'アクセス',
    en: 'Access',
    ko: '오시는 길',
    zh: '交通'
  },
  
  // ボタン
  'button.reservation': {
    ja: '予約する',
    en: 'Reserve',
    ko: '예약하기',
    zh: '预约'
  },
  'button.webReservation': {
    ja: 'WEB予約',
    en: 'Online Booking',
    ko: '온라인 예약',
    zh: '在线预约'
  },
  'button.webReservationHere': {
    ja: 'WEB予約はこちら',
    en: 'Book Online Here',
    ko: '온라인 예약은 여기',
    zh: '在线预约请点击这里'
  },
  'button.viewCourses': {
    ja: '宴会コースを見る',
    en: 'View Party Courses',
    ko: '연회 코스 보기',
    zh: '查看宴会套餐'
  },
  'button.viewSakeMenu': {
    ja: '日本酒メニューを見る',
    en: 'View Sake Menu',
    ko: '사케 메뉴 보기',
    zh: '查看日本酒菜单'
  },
  'button.viewMore': {
    ja: 'もっと見る',
    en: 'View More',
    ko: '더 보기',
    zh: '查看更多'
  },
  'button.close': {
    ja: '閉じる',
    en: 'Close',
    ko: '닫기',
    zh: '关闭'
  },
  
  // セクションタイトル
  'section.features': {
    ja: '当店の４つのこだわり',
    en: 'Our 4 Commitments',
    ko: '우리 가게의 4가지 고집',
    zh: '本店的4个坚持'
  },
  'section.menu': {
    ja: 'お品書き',
    en: 'Menu',
    ko: '메뉴',
    zh: '菜单'
  },
  'section.menuSubtitle': {
    ja: '心安らぐ空間で、特別なひとときを',
    en: 'Special moments in a relaxing space',
    ko: '마음이 편안한 공간에서 특별한 시간을',
    zh: '在舒心的空间，享受特别的时光'
  },
  'section.seats': {
    ja: 'お席のご案内',
    en: 'Seating Guide',
    ko: '좌석 안내',
    zh: '座位指南'
  },
  'section.seatsSubtitle': {
    ja: '大切なひとときを過ごすための、さまざまな空間をご用意',
    en: 'Various spaces for your precious moments',
    ko: '소중한 시간을 위한 다양한 공간 준비',
    zh: '为您的珍贵时光准备了各种空间'
  },
  'section.gallery': {
    ja: 'フォトギャラリー',
    en: 'Photo Gallery',
    ko: '포토 갤러리',
    zh: '照片廊'
  },
  'section.gallerySubtitle': {
    ja: '木村屋本店の様々な風景',
    en: 'Various scenes of Kimuraya Honten',
    ko: '기무라야 본점의 다양한 풍경',
    zh: '木村屋本店的各种风景'
  },
  'section.info': {
    ja: '店舗案内',
    en: 'Store Information',
    ko: '매장 안내',
    zh: '店铺介绍'
  },
  
  // 営業情報
  'info.address': {
    ja: '住所',
    en: 'Address',
    ko: '주소',
    zh: '地址'
  },
  'info.access': {
    ja: 'アクセス',
    en: 'Access',
    ko: '교통',
    zh: '交通'
  },
  'info.phone': {
    ja: '電話番号',
    en: 'Phone',
    ko: '전화번호',
    zh: '电话'
  },
  'info.hours': {
    ja: '営業時間',
    en: 'Business Hours',
    ko: '영업시간',
    zh: '营业时间'
  },
  'info.closed': {
    ja: '定休日',
    en: 'Closed',
    ko: '정기휴일',
    zh: '定休日'
  },
  'info.seats': {
    ja: '席数',
    en: 'Seats',
    ko: '좌석 수',
    zh: '座位数'
  },
  
  // その他
  'footer.rights': {
    ja: 'All rights reserved.',
    en: 'All rights reserved.',
    ko: 'All rights reserved.',
    zh: 'All rights reserved.'
  },
  'pageTop': {
    ja: 'PAGE TOP',
    en: 'PAGE TOP',
    ko: 'PAGE TOP',
    zh: '返回顶部'
  },
  
  // 新着情報
  'section.news': {
    ja: '新着情報',
    en: 'News',
    ko: '새소식',
    zh: '最新消息'
  },
  
  // 営業情報ラベル
  'info.label.address': {
    ja: '住所',
    en: 'Address',
    ko: '주소',
    zh: '地址'
  },
  'info.label.access': {
    ja: 'アクセス',
    en: 'Access',
    ko: '교통',
    zh: '交通'
  },
  'info.label.phone': {
    ja: 'TEL',
    en: 'TEL',
    ko: 'TEL',
    zh: '电话'
  },
  'info.label.hours': {
    ja: '営業時間',
    en: 'Hours',
    ko: '영업시간',
    zh: '营业时间'
  },
  'info.label.closed': {
    ja: '定休日',
    en: 'Closed',
    ko: '정기휴일',
    zh: '定休日'
  },
  'info.label.seats': {
    ja: '席数',
    en: 'Seats',
    ko: '좌석 수',
    zh: '座位数'
  },
  
  // もつ鍋セクション
  'motsunabe.title': {
    ja: '名物もつ鍋',
    en: 'Famous Motsunabe',
    ko: '명물 모츠나베',
    zh: '名物牛肠火锅'
  },
  'motsunabe.subtitle': {
    ja: '本場博多の味を、横浜で',
    en: 'Authentic Hakata taste in Yokohama',
    ko: '본고장 하카타의 맛을 요코하마에서',
    zh: '在横滨品尝正宗博多味道'
  },
  'motsunabe.description': {
    ja: '厳選された新鮮な国産牛もつを使用し、秘伝の出汁でじっくりと煮込んだ本格もつ鍋。プリプリの食感と濃厚な旨味が特徴です。',
    en: 'Authentic motsunabe made with carefully selected fresh domestic beef offal, slowly simmered in our secret broth. Features a plump texture and rich umami flavor.',
    ko: '엄선된 신선한 국산 소 곱창을 사용하여 비전의 육수로 천천히 끓인 정통 모츠나베. 쫄깃한 식감과 진한 감칠맛이 특징입니다.',
    zh: '使用严选的新鲜国产牛肠，用秘传高汤慢慢炖煮的正宗牛肠火锅。弹牙的口感和浓郁的鲜味是其特色。'
  },
  
  // ダイニングスタイル
  'dining.partyFeature1': {
    ja: '完全個室（2〜12名様）',
    en: 'Private rooms (2-12 guests)',
    ko: '완전 개인실 (2~12명)',
    zh: '完全包厢（2-12位）'
  },
  'dining.partyFeature2': {
    ja: '季節の会席コース',
    en: 'Seasonal kaiseki course',
    ko: '계절 가이세키 코스',
    zh: '季节会席套餐'
  },
  'dining.partyFeature3': {
    ja: '飲み放題プランあり',
    en: 'All-you-can-drink plans',
    ko: '무제한 음료 플랜',
    zh: '畅饮方案'
  },
  'dining.sakeFeature1': {
    ja: '日本酒 常時30種以上',
    en: 'Over 30 types of sake',
    ko: '일본주 상시 30종 이상',
    zh: '日本酒常备30种以上'
  },
  'dining.sakeFeature2': {
    ja: 'プレミアム焼酎',
    en: 'Premium shochu',
    ko: '프리미엄 소주',
    zh: '高级烧酒'
  },
  'dining.sakeFeature3': {
    ja: 'オリジナルカクテル',
    en: 'Original cocktails',
    ko: '오리지널 칵테일',
    zh: '原创鸡尾酒'
  },
  
  // 楽しみ方
  'section.enjoyWay': {
    ja: '楽しみ方',
    en: 'How to Enjoy',
    ko: '즐기는 방법',
    zh: '享受方式'
  },
  
  // 本場九州仕込み
  'section.kyushuStyle': {
    ja: '本場九州仕込み',
    en: 'Authentic Kyushu Style',
    ko: '정통 규슈 스타일',
    zh: '正宗九州风味'
  },
  
  // メニュー関連
  'menu.hakataMoitsunabe': {
    ja: '博多もつ鍋',
    en: 'Hakata Motsunabe',
    ko: '하카타 모츠나베',
    zh: '博多牛肠火锅'
  },
  'menu.specialDishes': {
    ja: '逸品料理',
    en: 'Special Dishes',
    ko: '일품요리',
    zh: '精品料理'
  },
  'menu.hormoneChiritri': {
    ja: 'ホルモン ちりとり焼肉',
    en: 'Hormone Chiritri Yakiniku',
    ko: '곱창 치리토리 야키니쿠',
    zh: '内脏烤肉'
  },
  'menu.meals': {
    ja: 'お食事',
    en: 'Meals',
    ko: '식사',
    zh: '主食'
  },
  'menu.nabeToppings': {
    ja: '鍋の追加と〆',
    en: 'Nabe Toppings & Finishers',
    ko: '나베 추가와 마무리',
    zh: '火锅配菜与收尾'
  },
  'menu.note.twoOrders': {
    ja: '※ 鍋のご注文は2人前から承ります。価格は1人前（税込）',
    en: '* Minimum 2 servings per pot order. Price per serving (tax included)',
    ko: '※ 나베 주문은 2인분부터 가능합니다. 가격은 1인분(세금 포함)',
    zh: '※ 火锅最少2人份起订。价格为每人份（含税）'
  },
  'menu.note.priceIncluded': {
    ja: '※ 価格は税込みです',
    en: '* Tax included',
    ko: '※ 세금 포함 가격입니다',
    zh: '※ 价格已含税'
  },
  'menu.note.twoOrdersChiritri': {
    ja: '※ ご注文は2人前より承ります（価格は1人前・税込）',
    en: '* Minimum 2 servings per order (price per serving, tax included)',
    ko: '※ 주문은 2인분부터 가능합니다 (가격은 1인분·세금 포함)',
    zh: '※ 最少2人份起订（价格为每人份·含税）'
  },
  
  // メニュー項目
  'menu.miso': {
    ja: '濃厚味噌',
    en: 'Rich Miso',
    ko: '진한 미소',
    zh: '浓厚味噌'
  },
  'menu.shoyu': {
    ja: '醤油',
    en: 'Soy Sauce',
    ko: '간장',
    zh: '酱油'
  },
  'menu.shio': {
    ja: '塩',
    en: 'Salt',
    ko: '소금',
    zh: '盐味'
  },
  'menu.choregiSalad': {
    ja: 'チョレギサラダ',
    en: 'Choregi Salad',
    ko: '초레기 샐러드',
    zh: '韩式沙拉'
  },
  'menu.chickenKaraage': {
    ja: '大分 鶏唐揚げ',
    en: 'Oita Chicken Karaage',
    ko: '오이타 닭 가라아게',
    zh: '大分鸡唐扬'
  },
  'menu.tunaSashimi': {
    ja: '本鮪のお刺身',
    en: 'Bluefin Tuna Sashimi',
    ko: '참다랑어 사시미',
    zh: '蓝鳍金枪鱼刺身'
  },
  'menu.mentaikoDashimaki': {
    ja: '明太子入り 出汁巻き玉子',
    en: 'Mentaiko Dashimaki Egg',
    ko: '명란젓 다시마키 계란',
    zh: '明太子厚蛋烧'
  },
  'menu.chiritriYakiniku': {
    ja: 'ちりとり焼肉',
    en: 'Chiritri Yakiniku',
    ko: '치리토리 야키니쿠',
    zh: '铁板烤肉'
  },
  'menu.additionalHormone': {
    ja: '追加ホルモンセット',
    en: 'Additional Hormone Set',
    ko: '추가 곱창 세트',
    zh: '追加内脏套餐'
  },
  'menu.additionalVeggies': {
    ja: '追加野菜セット',
    en: 'Additional Vegetable Set',
    ko: '추가 야채 세트',
    zh: '追加蔬菜套餐'
  },
  'menu.chanponFinisher': {
    ja: '〆のちゃんぽん麺',
    en: 'Chanpon Noodles Finisher',
    ko: '마무리 짬뽕면',
    zh: '收尾杂烩面'
  },
  'menu.teppanRamen': {
    ja: '親富孝通り 屋台名物 鉄板焼きラーメン',
    en: 'Oyafuko Street Teppan Ramen',
    ko: '오야후코도리 포장마차 명물 철판 라멘',
    zh: '亲富孝通街 摊位名物 铁板拉面'
  },
  'menu.miyazakiSpicyNoodles': {
    ja: '宮崎辛麺',
    en: 'Miyazaki Spicy Noodles',
    ko: '미야자키 매운면',
    zh: '宫崎辣面'
  },
  'menu.tunaBowl': {
    ja: '本鮪漬け丼',
    en: 'Marinated Tuna Bowl',
    ko: '참치 절임 덮밥',
    zh: '腌金枪鱼盖饭'
  },
  'menu.garlicRice': {
    ja: '石焼きペッパーガーリックライス',
    en: 'Stone-grilled Pepper Garlic Rice',
    ko: '돌구이 페퍼 갈릭 라이스',
    zh: '石烧胡椒蒜味饭'
  },
  'menu.nabeFinisherSet': {
    ja: 'もつ鍋〆セット',
    en: 'Motsunabe Finisher Set',
    ko: '모츠나베 마무리 세트',
    zh: '牛肠火锅收尾套餐'
  },
  'menu.vegetables': {
    ja: '野菜',
    en: 'Vegetables',
    ko: '야채',
    zh: '蔬菜'
  },
  'menu.chanponNoodles': {
    ja: '特製ちゃんぽん麺',
    en: 'Special Chanpon Noodles',
    ko: '특제 짬뽕면',
    zh: '特制杂烩面'
  },
  'menu.zosui': {
    ja: '雑炊セット',
    en: 'Rice Porridge Set',
    ko: '죽 세트',
    zh: '杂炊套餐'
  },
  
  // ギャラリーキャプション
  'gallery.atmosphere': {
    ja: '店内の雰囲気',
    en: 'Restaurant Atmosphere',
    ko: '매장 분위기',
    zh: '店内氛围'
  },
  'gallery.notJustKyushu': {
    ja: 'ちょっとは九州じゃない料理',
    en: 'Not Just Kyushu Cuisine',
    ko: '규슈만이 아닌 요리',
    zh: '不只是九州料理'
  },
  'gallery.traditionalTaste': {
    ja: '伝統の味',
    en: 'Traditional Flavors',
    ko: '전통의 맛',
    zh: '传统风味'
  },
  'gallery.counterSeats': {
    ja: 'カウンター席',
    en: 'Counter Seats',
    ko: '카운터석',
    zh: '吧台座位'
  },
  'gallery.interior': {
    ja: 'こだわりの内装',
    en: 'Carefully Designed Interior',
    ko: '고집스러운 인테리어',
    zh: '讲究的内装'
  },
  'gallery.nightEntrance': {
    ja: '夜のエントランス',
    en: 'Night Entrance',
    ko: '밤의 입구',
    zh: '夜晚的入口'
  },
  'gallery.spaciousSeating': {
    ja: '広々とした客席',
    en: 'Spacious Seating',
    ko: '넓은 객석',
    zh: '宽敞的客席'
  },
  'gallery.privateRoom': {
    ja: '特別個室',
    en: 'Special Private Room',
    ko: '특별 개인실',
    zh: '特别包厢'
  },
  'gallery.hospitality': {
    ja: 'おもてなしの心',
    en: 'Spirit of Hospitality',
    ko: '환대의 마음',
    zh: '待客之心'
  },
  'gallery.viewAll': {
    ja: 'すべての写真を見る',
    en: 'View All Photos',
    ko: '모든 사진 보기',
    zh: '查看所有照片'
  },
  
  // 新着情報
  'news.winterMenu': {
    ja: '冬季限定メニューのご案内',
    en: 'Winter Limited Menu Information',
    ko: '겨울 한정 메뉴 안내',
    zh: '冬季限定菜单介绍'
  },
  'news.newYearHours': {
    ja: '年始の営業時間について',
    en: 'New Year Business Hours',
    ko: '신년 영업시간 안내',
    zh: '新年营业时间通知'
  },
  'news.yearEndNotice': {
    ja: '年末年始の営業日のお知らせ',
    en: 'Year-end Holiday Schedule',
    ko: '연말연시 영업일 안내',
    zh: '年末年初营业日通知'
  },
  'news.viewAll': {
    ja: 'すべての新着情報を見る',
    en: 'View All News',
    ko: '모든 새소식 보기',
    zh: '查看所有最新消息'
  },
  
  // 店舗情報ラベル
  'info.shopName': {
    ja: '店名',
    en: 'Restaurant Name',
    ko: '매장명',
    zh: '店名'
  },
  
  // 席タグ
  'seat.tag.largeGroup': {
    ja: '大人数OK',
    en: 'Large Groups OK',
    ko: '대인원 OK',
    zh: '可容纳大团体'
  },
  'seat.tag.privateBooking': {
    ja: '貸切可能',
    en: 'Private Booking Available',
    ko: '대관 가능',
    zh: '可包场'
  },
  'seat.tag.flexibleLayout': {
    ja: 'レイアウト変更可',
    en: 'Flexible Layout',
    ko: '레이아웃 변경 가능',
    zh: '可调整布局'
  },
  'seat.tag.quietSpace': {
    ja: '落ち着いた空間',
    en: 'Quiet Space',
    ko: '차분한 공간',
    zh: '安静的空间'
  },
  'seat.tag.windowSide': {
    ja: '窓際席',
    en: 'Window Seats',
    ko: '창가석',
    zh: '窗边座位'
  },
  'seat.tag.girlsNight': {
    ja: '女子会におすすめ',
    en: 'Great for Girls Night',
    ko: '여자 모임 추천',
    zh: '适合女子聚会'
  },
  'seat.tag.spacious': {
    ja: 'ゆったり空間',
    en: 'Spacious Area',
    ko: '여유로운 공간',
    zh: '宽敞空间'
  },
  'seat.tag.smallGroup': {
    ja: '少人数向け',
    en: 'For Small Groups',
    ko: '소인원용',
    zh: '适合小团体'
  },
  'seat.tag.largeGroupFriendly': {
    ja: '大人数対応',
    en: 'Large Group Friendly',
    ko: '대인원 대응',
    zh: '适合大团体'
  },
  'seat.tag.partyReady': {
    ja: '宴会向け',
    en: 'Party Ready',
    ko: '연회용',
    zh: '适合宴会'
  },
  'seat.tag.goodView': {
    ja: '景色が良い',
    en: 'Good View',
    ko: '경치가 좋음',
    zh: '景色优美'
  },
  'seat.tag.datePopular': {
    ja: 'デートに人気',
    en: 'Popular for Dates',
    ko: '데이트 인기',
    zh: '约会热门'
  },
  'seat.tag.open': {
    ja: '開放的',
    en: 'Open Space',
    ko: '개방적',
    zh: '开放式'
  },
  
  // もつ鍋セクション
  'motsunabe.feature1.title': {
    ja: '厳選素材',
    en: 'Selected Ingredients',
    ko: '엄선 재료',
    zh: '严选食材'
  },
  'motsunabe.feature1.desc': {
    ja: '国産牛もつを100%使用',
    en: '100% Domestic Beef Offal',
    ko: '국산 소 곱창 100% 사용',
    zh: '100%使用国产牛肠'
  },
  'motsunabe.feature2.title': {
    ja: '２つの味',
    en: 'Two Flavors',
    ko: '두 가지 맛',
    zh: '两种口味'
  },
  'motsunabe.feature2.desc': {
    ja: '醤油・味噌からお選びいただけます',
    en: 'Choose from Soy Sauce or Miso',
    ko: '간장·미소 중에서 선택 가능',
    zh: '可选酱油或味噌'
  },
  'motsunabe.feature3.title': {
    ja: '〆まで美味しい',
    en: 'Delicious to the Last Bite',
    ko: '마무리까지 맛있는',
    zh: '收尾也美味'
  },
  'motsunabe.feature3.desc': {
    ja: 'ちゃんぽん麺や雑炊で最後まで',
    en: 'Finish with Chanpon or Rice Porridge',
    ko: '짬뽕면이나 죽으로 마무리',
    zh: '用杂烩面或杂炊收尾'
  },
  'motsunabe.priceLabel': {
    ja: 'お一人様',
    en: 'Per Person',
    ko: '1인분',
    zh: '每位'
  },
  'motsunabe.priceUnit': {
    ja: '円〜',
    en: 'yen~',
    ko: '엔~',
    zh: '日元起'
  },
  'motsunabe.priceTax': {
    ja: '（税込）',
    en: '(Tax Included)',
    ko: '(세금 포함)',
    zh: '（含税）'
  },
  'motsunabe.optionsTitle': {
    ja: 'お好みの味をお選びください',
    en: 'Please Choose Your Preferred Flavor',
    ko: '원하는 맛을 선택하세요',
    zh: '请选择您喜欢的口味'
  },
  'motsunabe.shoyuTitle': {
    ja: '醤油もつ鍋',
    en: 'Soy Sauce Motsunabe',
    ko: '간장 모츠나베',
    zh: '酱油牛肠火锅'
  },
  'motsunabe.shoyuDesc': {
    ja: 'あっさりとした醤油ベースに、にんにくと唐辛子がアクセント。定番の人気メニューです。',
    en: 'Light soy sauce base with garlic and chili pepper accents. Our classic popular menu item.',
    ko: '산뜻한 간장 베이스에 마늘과 고추가 액센트. 정번 인기 메뉴입니다.',
    zh: '清爽的酱油基底，调入大蒜和辣椒。是我们的经典人气菜品。'
  },
  'motsunabe.misoTitle': {
    ja: '味噌もつ鍋',
    en: 'Miso Motsunabe',
    ko: '미소 모츠나베',
    zh: '味噌牛肠火锅'
  },
  'motsunabe.misoDesc': {
    ja: '数種類の味噌をブレンドした濃厚スープ。コクと深みのある味わいが特徴です。',
    en: 'Rich soup blended with several types of miso. Features a deep, full-bodied flavor.',
    ko: '여러 종류의 미소를 블렌드한 진한 수프. 깊고 풍부한 맛이 특징입니다.',
    zh: '融合多种味噌的浓厚汤底。特点是醇厚而有深度的口感。'
  },
  
  // こだわりの空間セクション
  'space.cabbage.text1': {
    ja: '厳選した新鮮な国産牛もつを使用し、',
    en: 'Using carefully selected fresh domestic beef offal,',
    ko: '엄선한 신선한 국산 소 곱창을 사용하여,',
    zh: '使用严选的新鲜国产牛肠，'
  },
  'space.cabbage.text2': {
    ja: '幾度も試作を重ねて完成させた',
    en: 'perfected through countless trials,',
    ko: '수차례 시행착오를 거쳐 완성시킨',
    zh: '经过无数次试做而完成的'
  },
  'space.cabbage.text3': {
    ja: '香り高き秘伝の特製スープ。',
    en: 'our aromatic secret special soup.',
    ko: '향기로운 비전의 특제 수프.',
    zh: '香气扑鼻的秘传特制汤底。'
  },
  'space.cabbage.text4': {
    ja: 'キャベツはあえて手でちぎることで',
    en: 'By deliberately tearing the cabbage by hand,',
    ko: '양배추는 일부러 손으로 찢어서',
    zh: '卷心菜特意用手撕碎，'
  },
  'space.cabbage.text5': {
    ja: '食感を残し、スープがよく染み込むよう工夫。',
    en: 'we preserve texture and enhance soup absorption.',
    ko: '식감을 남기고 수프가 잘 배어들도록 공부.',
    zh: '保留口感，让汤汁更容易浸透。'
  },
  'space.cabbage.text6': {
    ja: 'もつ鍋専門店としての伝統の味と製法を守り続けています。',
    en: 'We continue to preserve the traditional flavors and methods as a motsunabe specialty restaurant.',
    ko: '모츠나베 전문점으로서의 전통의 맛과 제조법을 지켜나가고 있습니다.',
    zh: '作为牛肠火锅专门店，我们继续保持传统的口味和制作方法。'
  },
  'space.quote': {
    ja: '「塩」、何度でも食べたくなる定番の味「醤油」、まろやかで深みのある濃厚な味わいの「味噌」よりスープをお選びください♪',
    en: 'Please choose from "Salt" for a pure taste, "Soy Sauce" for our classic flavor you\'ll crave again and again, or "Miso" for a mellow, rich taste♪',
    ko: '"소금", 계속 먹고 싶어지는 정번의 맛 "간장", 부드럽고 깊이 있는 진한 맛의 "미소" 중에서 수프를 선택해 주세요♪',
    zh: '请从「盐味」、让人百吃不厌的经典口味「酱油」、醇厚温和的浓郁口味「味噌」中选择汤底♪'
  },
  'space.quoteAuthor': {
    ja: '店長より',
    en: 'From the Manager',
    ko: '매니저로부터',
    zh: '店长寄语'
  },
  'motsunabe.badge1': {
    ja: '創業以来の',
    en: 'Since Our',
    ko: '창업 이래의',
    zh: '创业以来的'
  },
  'motsunabe.badge2': {
    ja: '秘伝の味',
    en: 'Founding Secret',
    ko: '비전의 맛',
    zh: '秘传口味'
  },
  'motsunabe.catch': {
    ja: '厳選された国産牛もつを使用したこだわりの博多もつ鍋',
    en: 'Our special Hakata motsunabe made with carefully selected domestic beef offal',
    ko: '엄선된 국산 소 곱창을 사용한 고집스러운 하카타 모츠나베',
    zh: '使用精挑细选的国产牛肠制作的讲究博多牛肠火锅'
  },
  
  // 画像のaltテキスト
  'alt.mainVisual': {
    ja: 'メインビジュアル',
    en: 'Main Visual',
    ko: '메인 비주얼',
    zh: '主视觉'
  },
  'alt.mobileVisual': {
    ja: 'スマホ用',
    en: 'Mobile Version',
    ko: '모바일용',
    zh: '手机版'
  },
  'alt.ingredients': {
    ja: 'こだわりの食材',
    en: 'Premium Ingredients',
    ko: '고집스러운 식재료',
    zh: '讲究的食材'
  },
  'alt.notJustKyushuFood': {
    ja: 'ちょっとは九州じゃない料理',
    en: 'Not Just Kyushu Cuisine',
    ko: '규슈만이 아닌 요리',
    zh: '不只是九州料理'
  },
  'alt.specialDishes': {
    ja: 'こだわりの料理',
    en: 'Special Dishes',
    ko: '고집스러운 요리',
    zh: '讲究的料理'
  },
  'alt.varietyOfTastes': {
    ja: '多彩な味',
    en: 'Variety of Tastes',
    ko: '다채로운 맛',
    zh: '多样的口味'
  },
  'alt.richLineup': {
    ja: '充実の逸品',
    en: 'Rich Lineup',
    ko: '풍부한 일품',
    zh: '丰富的精品'
  },
  'alt.japaneseSpace': {
    ja: '和の空間',
    en: 'Japanese Space',
    ko: '일본식 공간',
    zh: '日式空间'
  },
  'alt.motsunabeMain': {
    ja: 'もつ鍋メイン',
    en: 'Motsunabe Main',
    ko: '모츠나베 메인',
    zh: '牛肠火锅主图'
  },
  'alt.cookingScene': {
    ja: '博多もつ鍋の調理風景',
    en: 'Hakata Motsunabe Cooking Scene',
    ko: '하카타 모츠나베 조리 풍경',
    zh: '博多牛肠火锅烹饪场景'
  },
  'alt.ingredientsCloseup': {
    ja: 'もつ鍋の具材アップ',
    en: 'Motsunabe Ingredients Closeup',
    ko: '모츠나베 재료 클로즈업',
    zh: '牛肠火锅食材特写'
  },
  'alt.traditionalTools': {
    ja: '伝統の調理器具',
    en: 'Traditional Cooking Tools',
    ko: '전통 조리 도구',
    zh: '传统烹饪器具'
  },
  'alt.selectedIngredients': {
    ja: '厳選された食材',
    en: 'Selected Ingredients',
    ko: '엄선된 식재료',
    zh: '严选的食材'
  },
  'alt.craftsmanship': {
    ja: '職人の技',
    en: 'Craftsmanship',
    ko: '장인의 손길',
    zh: '匠人技艺'
  },
  'alt.hakataMoitsunabe': {
    ja: '博多もつ鍋',
    en: 'Hakata Motsunabe',
    ko: '하카타 모츠나베',
    zh: '博多牛肠火锅'
  },
  'alt.summerBanquet': {
    ja: '夏の宴会コース',
    en: 'Summer Banquet Course',
    ko: '여름 연회 코스',
    zh: '夏季宴会套餐'
  },
  'alt.unlimitedCourse': {
    ja: 'もつ鍋食べ飲み放題コース',
    en: 'Motsunabe All-You-Can-Eat & Drink Course',
    ko: '모츠나베 무한리필 코스',
    zh: '牛肠火锅畅吃畅饮套餐'
  },
  'alt.seatThumbnail': {
    ja: '貸切スペース',
    en: 'Private Space',
    ko: '대관 공간',
    zh: '包场空间'
  },
  'alt.semiPrivateThumbnail': {
    ja: '半個室風ボックス席',
    en: 'Semi-Private Box Seats',
    ko: '반개인실 박스석',
    zh: '半包厢式座位'
  },
  'alt.tableThumbnail': {
    ja: 'テーブル席',
    en: 'Table Seats',
    ko: '테이블석',
    zh: '桌座'
  },
  'alt.groupThumbnail': {
    ja: 'グループ席',
    en: 'Group Seats',
    ko: '그룹석',
    zh: '团体座位'
  },
  'alt.dateThumbnail': {
    ja: '窓際デート席',
    en: 'Window Date Seats',
    ko: '창가 데이트석',
    zh: '窗边约会座位'
  }
}