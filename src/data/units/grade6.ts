import { TargetUnitItem } from './unitTypes';

export const GRADE_6_UNITS: TargetUnitItem[] = [
  {
    id: 'g6_gs_u1',
    grade: 6,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'My New School',
    unitTitleVi: 'Ngôi trường mới của em',
    theme: 'School Life and New Beginnings',
    targetKeywords: [
      { word: 'school uniform', phonetic: '/skuːl ˈjuːnɪfɔːm/', meaningVi: 'đồng phục học sinh', partOfSpeech: 'n' },
      { word: 'compass', phonetic: '/ˈkʌmpəs/', meaningVi: 'com-pa vẽ hình tròn', partOfSpeech: 'n' },
      { word: 'calculator', phonetic: '/ˈkælkjuleɪtə(r)/', meaningVi: 'máy tính bỏ túi', partOfSpeech: 'n' },
      { word: 'pencil sharpener', phonetic: '/ˈpensl ˈʃɑːpnə(r)/', meaningVi: 'gọt bút chì', partOfSpeech: 'n' },
      { word: 'boarding school', phonetic: '/ˈbɔːdɪŋ skuːl/', meaningVi: 'trường nội trú', partOfSpeech: 'n' },
      { word: 'classmate', phonetic: '/ˈklɑːsmeɪt/', meaningVi: 'bạn cùng lớp', partOfSpeech: 'n' },
      { word: 'excited', phonetic: '/ɪkˈsaɪtɪd/', meaningVi: 'hào hứng, phấn khởi', partOfSpeech: 'adj' },
      { word: 'study', phonetic: '/ˈstʌdi/', meaningVi: 'học tập', partOfSpeech: 'v' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Present Simple: S + V(s/es) / S + do/does not + V',
        explanationVi: 'Thì hiện tại đơn diễn tả thói quen, lịch trình trường học',
        example: 'I usually wear my school uniform on Mondays. The school year starts in September.',
      },
      {
        pattern: 'Present Continuous for actions happening now: S + am/is/are + V-ing',
        explanationVi: 'Thì hiện tại tiếp diễn chỉ hoạt động đang diễn ra ngay lúc nói',
        example: 'We are doing our maths homework in the library right now.',
      },
    ],
  },
  {
    id: 'g6_gs_u2',
    grade: 6,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'My House',
    unitTitleVi: 'Ngôi nhà của em',
    theme: 'Home and Living Spaces',
    targetKeywords: [
      { word: 'town house', phonetic: '/taʊn haʊs/', meaningVi: 'nhà phố', partOfSpeech: 'n' },
      { word: 'country house', phonetic: '/ˈkʌntri haʊs/', meaningVi: 'nhà ở nông thôn', partOfSpeech: 'n' },
      { word: 'stilt house', phonetic: '/stɪlt haʊs/', meaningVi: 'nhà sàn', partOfSpeech: 'n' },
      { word: 'microwave', phonetic: '/ˈmaɪkrəweɪv/', meaningVi: 'lò vi sóng', partOfSpeech: 'n' },
      { word: 'dishwasher', phonetic: '/ˈdɪʃwɒʃə(r)/', meaningVi: 'máy rửa bát', partOfSpeech: 'n' },
      { word: 'wardrobe', phonetic: '/ˈwɔːdrəʊb/', meaningVi: 'tủ đựng quần áo', partOfSpeech: 'n' },
      { word: 'chest of drawers', phonetic: '/tʃest əv drɔːz/', meaningVi: 'tủ có nhiều ngăn kéo', partOfSpeech: 'n' },
      { word: 'air conditioner', phonetic: '/ˈeə kəndɪʃənə(r)/', meaningVi: 'máy điều hòa không khí', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "Possessive case ('s): Noun + 's + Noun",
        explanationVi: 'Sở hữu cách chỉ sự sở hữu đồ vật hoặc phòng ốc',
        example: "This is Nick's bedroom, and that is his parents' study room.",
      },
      {
        pattern: 'Prepositions of place: in, on, behind, under, next to, in front of, between',
        explanationVi: 'Giới từ chỉ nơi chốn miêu tả vị trí đồ vật trong nhà',
        example: 'The dog is sleeping under the table, between the two chairs.',
      },
    ],
  },
];
