import { TargetUnitItem } from './unitTypes';

export const GRADE_2_UNITS: TargetUnitItem[] = [
  {
    id: 'g2_gs_u1',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'At My Birthday Party',
    unitTitleVi: 'Tại bữa tiệc sinh nhật của em',
    theme: 'Celebrations, Food and Requests',
    targetKeywords: [
      { word: 'pizza', phonetic: '/ˈpiːtsə/', meaningVi: 'bánh pizza', partOfSpeech: 'n' },
      { word: 'popcorn', phonetic: '/ˈpɒpkɔːn/', meaningVi: 'bắp rang bơ', partOfSpeech: 'n' },
      { word: 'pasta', phonetic: '/ˈpæstə/', meaningVi: 'mỳ Ý', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'I like + [pizza/popcorn/pasta].',
        explanationVi: 'Bày tỏ món ăn yêu thích trong bữa tiệc sinh nhật',
        example: 'I like pizza. I like popcorn.',
      },
      {
        pattern: 'Pass me the [popcorn], please. - Here you are.',
        explanationVi: 'Nhờ ai đó chuyển giúp món ăn trên bàn tiệc',
        example: 'Pass me the pasta, please. - Here you are.',
      },
    ],
  },
  {
    id: 'g2_gs_u2',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'In the Backyard',
    unitTitleVi: 'Trong sân sau',
    theme: 'Outdoor Fun and Actions',
    targetKeywords: [
      { word: 'kite', phonetic: '/kaɪt/', meaningVi: 'con diều', partOfSpeech: 'n' },
      { word: 'bike', phonetic: '/baɪk/', meaningVi: 'xe đạp', partOfSpeech: 'n' },
      { word: 'kitten', phonetic: '/ˈkɪtn/', meaningVi: 'mèo con', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "He's / She's [riding a bike / flying a kite].",
        explanationVi: 'Miêu tả hành động đang diễn ra trong sân sau',
        example: 'He is riding a bike. She is flying a kite.',
      },
      {
        pattern: "Is he/she [riding a bike]? - Yes, he/she is. / No, he/she isn't.",
        explanationVi: 'Hỏi xác nhận hành động của ai đó',
        example: 'Is he riding a bike? - Yes, he is.',
      },
    ],
  },
  {
    id: 'g2_gs_u3',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 3,
    unitTitleEn: 'At the Seaside',
    unitTitleVi: 'Tại bãi biển',
    theme: 'Seaside Sights and Invitations',
    targetKeywords: [
      { word: 'sea', phonetic: '/siː/', meaningVi: 'biển', partOfSpeech: 'n' },
      { word: 'sail', phonetic: '/seɪl/', meaningVi: 'cánh buồm', partOfSpeech: 'n' },
      { word: 'sand', phonetic: '/sænd/', meaningVi: 'bờ cát', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'What can you see? - I can see the [sea/sail/sand].',
        explanationVi: 'Hỏi và trả lời điều nhìn thấy ở biển',
        example: 'What can you see? - I can see the sea.',
      },
      {
        pattern: "Let's look at the + [sea/sail/sand]!",
        explanationVi: 'Rủ cùng nhìn ngắm cảnh biển',
        example: "Let's look at the sail!",
      },
    ],
  },
  {
    id: 'g2_gs_u4',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 4,
    unitTitleEn: 'In the Countryside',
    unitTitleVi: 'Ở vùng nông thôn',
    theme: 'Country Scenery and Observations',
    targetKeywords: [
      { word: 'river', phonetic: '/ˈrɪvə(r)/', meaningVi: 'dòng sông quê', partOfSpeech: 'n' },
      { word: 'road', phonetic: '/rəʊd/', meaningVi: 'con đường làng', partOfSpeech: 'n' },
      { word: 'rainbow', phonetic: '/ˈreɪnbəʊ/', meaningVi: 'cầu vồng nhiều màu', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'There is a + [river/road/rainbow].',
        explanationVi: 'Nói nhận biết cảnh vật vùng quê',
        example: 'There is a rainbow in the sky.',
      },
      {
        pattern: 'What can you see? - I can see a [river/road/rainbow].',
        explanationVi: 'Hỏi nhìn thấy gì ở nông thôn',
        example: 'What can you see? - I can see a long river.',
      },
    ],
  },
  {
    id: 'g2_gs_u5',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 5,
    unitTitleEn: 'In the Classroom',
    unitTitleVi: 'Trong lớp học',
    theme: 'Classroom Activities and Quizzes',
    targetKeywords: [
      { word: 'question', phonetic: '/ˈkwestʃən/', meaningVi: 'câu hỏi', partOfSpeech: 'n' },
      { word: 'square', phonetic: '/skweə(r)/', meaningVi: 'hình vuông', partOfSpeech: 'n' },
      { word: 'quiz', phonetic: '/kwɪz/', meaningVi: 'câu đố vui', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "What's he/she doing? - He's/She's [answering a question / doing a quiz / colouring a square].",
        explanationVi: 'Hỏi anh/cô ấy đang làm hoạt động gì trong lớp',
        example: "What's she doing? - She's answering a question.",
      },
      {
        pattern: "Is he/she [colouring a square]? - Yes, he/she is. / No, he/she isn't.",
        explanationVi: 'Hỏi xác nhận hoạt động của anh/cô ấy',
        example: 'Is he colouring a square? - Yes, he is.',
      },
    ],
  },
  {
    id: 'g2_gs_u6',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 6,
    unitTitleEn: 'On the Farm',
    unitTitleVi: 'Trên trang trại',
    theme: 'Farm Animals and Objects',
    targetKeywords: [
      { word: 'box', phonetic: '/bɒks/', meaningVi: 'cái hộp', partOfSpeech: 'n' },
      { word: 'ox', phonetic: '/ɒks/', meaningVi: 'con bò đực', partOfSpeech: 'n' },
      { word: 'fox', phonetic: '/fɒks/', meaningVi: 'con cáo', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "Is there an / a + [ox/fox/box]? - Yes, there is. / No, there isn't.",
        explanationVi: 'Hỏi xem có con vật hoặc đồ vật ở trang trại không',
        example: 'Is there an ox on the farm? - Yes, there is.',
      },
      {
        pattern: 'Look at the [ox/fox in the box]!',
        explanationVi: 'Hướng dẫn chú ý đến con vật trang trại',
        example: 'Look at the fox!',
      },
    ],
  },
  {
    id: 'g2_gs_u7',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 7,
    unitTitleEn: 'In the Kitchen',
    unitTitleVi: 'Trong nhà bếp',
    theme: 'Kitchen Foods and Drinks',
    targetKeywords: [
      { word: 'jam', phonetic: '/dʒæm/', meaningVi: 'mứt hoa quả', partOfSpeech: 'n' },
      { word: 'jelly', phonetic: '/ˈdʒeli/', meaningVi: 'món thạch dẻo ngọt', partOfSpeech: 'n' },
      { word: 'juice', phonetic: '/dʒuːs/', meaningVi: 'nước ép trái cây', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Pass me the + [jam/jelly/juice], please. - Here you are.',
        explanationVi: 'Đề nghị ai đưa giúp món trong bếp',
        example: 'Pass me the jam, please. - Here you are.',
      },
      {
        pattern: "Do you like [jam/jelly/juice]? - Yes, I do. / No, I don't.",
        explanationVi: 'Hỏi về sở thích món ăn trong nhà bếp',
        example: 'Do you like juice? - Yes, I do.',
      },
    ],
  },
  {
    id: 'g2_gs_u8',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 8,
    unitTitleEn: 'In the Village',
    unitTitleVi: 'Ở trong làng',
    theme: 'Village Life and Sports',
    targetKeywords: [
      { word: 'van', phonetic: '/væn/', meaningVi: 'xe tải nhỏ', partOfSpeech: 'n' },
      { word: 'village', phonetic: '/ˈvɪlɪdʒ/', meaningVi: 'ngôi làng thanh bình', partOfSpeech: 'n' },
      { word: 'volleyball', phonetic: '/ˈvɒlibɔːl/', meaningVi: 'môn bóng chuyền', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'This is a village. / There is a van.',
        explanationVi: 'Giới thiệu quang cảnh ngôi làng',
        example: 'This is a beautiful village.',
      },
      {
        pattern: "Are they playing volleyball? - Yes, they are. / No, they aren't.",
        explanationVi: 'Hỏi xem các bạn có đang chơi bóng chuyền không',
        example: 'Are they playing volleyball? - Yes, they are.',
      },
    ],
  },
  {
    id: 'g2_gs_u9',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 9,
    unitTitleEn: 'In the Grocery Store',
    unitTitleVi: 'Tại cửa hàng tạp hoá',
    theme: 'Grocery Shopping and Toys',
    targetKeywords: [
      { word: 'yogurt', phonetic: '/ˈjɒɡət/', meaningVi: 'sữa chua bổ dưỡng', partOfSpeech: 'n' },
      { word: 'yams', phonetic: '/jæmz/', meaningVi: 'củ khoai mỡ', partOfSpeech: 'n' },
      { word: 'yo-yos', phonetic: '/ˈjəʊjəʊz/', meaningVi: 'đồ chơi yo-yo', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'What do you want? - I want some + [yogurt/yams].',
        explanationVi: 'Hỏi và nói muốn mua gì ở tiệm tạp hoá',
        example: 'What do you want? - I want some yogurt.',
      },
      {
        pattern: 'Do you want a yo-yo? - Yes, please. / No, thank you.',
        explanationVi: 'Mời hoặc hỏi bạn có muốn mua một cái yo-yo không',
        example: 'Do you want a yo-yo? - Yes, please.',
      },
    ],
  },
  {
    id: 'g2_gs_u10',
    grade: 2,
    textbook: 'Global Success',
    unitNumber: 10,
    unitTitleEn: 'At the Zoo',
    unitTitleVi: 'Tại vườn thú',
    theme: 'Zoo Animals',
    targetKeywords: [
      { word: 'zebra', phonetic: '/ˈzebrə/', meaningVi: 'ngựa vằn', partOfSpeech: 'n' },
      { word: 'zebu', phonetic: '/ˈziːbuː/', meaningVi: 'con bò có u (bò zebu)', partOfSpeech: 'n' },
      { word: 'zoo', phonetic: '/zuː/', meaningVi: 'sở thú', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'What can you see? - I can see a + [zebra/zebu].',
        explanationVi: 'Hỏi con vật nhìn thấy trong sở thú',
        example: 'What can you see? - I can see a zebra.',
      },
      {
        pattern: 'The [zebra/zebu] is at the zoo.',
        explanationVi: 'Miêu tả con vật đang ở trong vườn thú',
        example: 'The zebra is at the zoo.',
      },
    ],
  },
];
