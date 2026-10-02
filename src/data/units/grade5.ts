import { TargetUnitItem } from './unitTypes';

export const GRADE_5_UNITS: TargetUnitItem[] = [
  {
    id: 'g5_gs_u1',
    grade: 5,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'All About Me',
    unitTitleVi: 'Tất cả về em',
    theme: 'Personal Information and Preferences',
    targetKeywords: [
      { word: 'class', phonetic: '/klɑːs/', meaningVi: 'lớp học', partOfSpeech: 'n' },
      { word: 'city', phonetic: '/ˈsɪti/', meaningVi: 'thành phố', partOfSpeech: 'n' },
      { word: 'countryside', phonetic: '/ˈkʌntrisaɪd/', meaningVi: 'vùng nông thôn', partOfSpeech: 'n' },
      { word: 'town', phonetic: '/taʊn/', meaningVi: 'thị trấn', partOfSpeech: 'n' },
      { word: 'village', phonetic: '/ˈvɪlɪdʒ/', meaningVi: 'ngôi làng', partOfSpeech: 'n' },
      { word: 'introduce', phonetic: '/ˌɪntrəˈdjuːs/', meaningVi: 'giới thiệu', partOfSpeech: 'v' },
      { word: 'dolphin', phonetic: '/ˈdɒlfɪn/', meaningVi: 'cá heo', partOfSpeech: 'n' },
      { word: 'panda', phonetic: '/ˈpændə/', meaningVi: 'gấu trúc', partOfSpeech: 'n' },
      { word: 'pink', phonetic: '/pɪŋk/', meaningVi: 'màu hồng', partOfSpeech: 'n' },
      { word: 'sandwich', phonetic: '/ˈsænwɪtʃ/', meaningVi: 'bánh mì kẹp', partOfSpeech: 'n' },
      { word: 'table tennis', phonetic: '/ˈteɪbl ˈtenɪs/', meaningVi: 'bóng bàn', partOfSpeech: 'n' },
      { word: 'favourite', phonetic: '/ˈfeɪvərɪt/', meaningVi: 'yêu thích', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "Can you tell me about yourself? - I'm in Class [Class]. / I live in the [city/town/village/countryside].",
        explanationVi: 'Hỏi và giới thiệu bản thân (lớp và nơi ở)',
        example: "Can you tell me about yourself? - I'm in Class 5A. I live in the countryside.",
      },
      {
        pattern: "What's your favourite [animal/colour/food/sport]? - It's a/an [noun]. / It's [noun].",
        explanationVi: 'Hỏi về con vật, màu sắc, đồ ăn hoặc môn thể thao yêu thích',
        example: "What's your favourite animal? - It's a dolphin.",
      },
    ],
  },
  {
    id: 'g5_gs_u2',
    grade: 5,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'Our Homes',
    unitTitleVi: 'Ngôi nhà của chúng em',
    theme: 'Living Places and Addresses',
    targetKeywords: [
      { word: 'building', phonetic: '/ˈbɪldɪŋ/', meaningVi: 'tòa nhà', partOfSpeech: 'n' },
      { word: 'flat', phonetic: '/flæt/', meaningVi: 'căn hộ chung cư', partOfSpeech: 'n' },
      { word: 'house', phonetic: '/haʊs/', meaningVi: 'ngôi nhà', partOfSpeech: 'n' },
      { word: 'tower', phonetic: '/ˈtaʊə(r)/', meaningVi: 'tòa tháp cao tầng', partOfSpeech: 'n' },
      { word: 'address', phonetic: '/əˈdres/', meaningVi: 'địa chỉ', partOfSpeech: 'n' },
      { word: 'street', phonetic: '/striːt/', meaningVi: 'đường phố', partOfSpeech: 'n' },
      { word: 'district', phonetic: '/ˈdɪstrɪkt/', meaningVi: 'quận, huyện', partOfSpeech: 'n' },
      { word: 'near', phonetic: '/nɪə(r)/', meaningVi: 'gần', partOfSpeech: 'prep' },
      { word: 'far from', phonetic: '/fɑː frɒm/', meaningVi: 'xa', partOfSpeech: 'prep' },
      { word: 'live', phonetic: '/lɪv/', meaningVi: 'sinh sống', partOfSpeech: 'v' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "Do you live in this/that [building/flat/house/tower]? - Yes, I do. / No, I don't.",
        explanationVi: 'Hỏi xem bạn có sống ở tòa nhà/ngôi nhà này/kia không',
        example: 'Do you live in that building? - Yes, I do.',
      },
      {
        pattern: "What's your address? - It's [Number] [Street Name] Street.",
        explanationVi: 'Hỏi và trả lời về địa chỉ nhà',
        example: "What's your address? - It's 45 Nguyen Du Street.",
      },
    ],
  },
];
