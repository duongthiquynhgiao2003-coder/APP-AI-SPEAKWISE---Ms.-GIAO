import { TargetUnitItem } from './unitTypes';

export const GRADE_10_UNITS: TargetUnitItem[] = [
  {
    id: 'g10_gs_u1',
    grade: 10,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'Family Life',
    unitTitleVi: 'Đời sống gia đình',
    theme: 'Family Duties and Household Chores',
    targetKeywords: [
      { word: 'breadwinner', phonetic: '/ˈbredwɪnə(r)/', meaningVi: 'trụ cột kinh tế gia đình', partOfSpeech: 'n' },
      { word: 'homemaker', phonetic: '/ˈhəʊmmeɪkə(r)/', meaningVi: 'người nội trợ gia đình', partOfSpeech: 'n' },
      { word: 'household chore', phonetic: '/ˈhaʊshəʊld tʃɔː(r)/', meaningVi: 'công việc nhà', partOfSpeech: 'phrase' },
      { word: 'share responsibilities', phonetic: '/ʃeə(r) rɪˌspɒnsəˈbɪlətiz/', meaningVi: 'chia sẻ trách nhiệm', partOfSpeech: 'phrase' },
      { word: 'gratitude', phonetic: '/ˈɡrætɪtjuːd/', meaningVi: 'lòng biết ơn', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Present Simple vs. Present Continuous: S + V(s/es) vs. S + am/is/are + V-ing',
        explanationVi: 'Phân biệt hành động thói quen hàng ngày với hành động đang diễn ra tại thời điểm nói',
        example: 'My father usually cooks dinner, but today my mother is preparing a special meal for us.',
      },
    ],
  },
  {
    id: 'g10_gs_u2',
    grade: 10,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'Humans and the Environment',
    unitTitleVi: 'Con người và môi trường',
    theme: 'Eco-friendly Living and Green Lifestyle',
    targetKeywords: [
      { word: 'carbon footprint', phonetic: '/ˈkɑːbən ˈfʊtprɪnt/', meaningVi: 'lượng phát thải khí nhà kính', partOfSpeech: 'phrase' },
      { word: 'eco-friendly lifestyle', phonetic: '/ˌiːkəʊ ˈfrendli ˈlaɪfstaɪl/', meaningVi: 'lối sống thân thiện môi trường', partOfSpeech: 'phrase' },
      { word: 'renewable energy', phonetic: '/rɪˈnjuːəbl ˈenədʒi/', meaningVi: 'năng lượng tái tạo', partOfSpeech: 'phrase' },
      { word: 'sustainable development', phonetic: '/səˈsteɪnəbl dɪˈveləpmənt/', meaningVi: 'phát triển bền vững', partOfSpeech: 'phrase' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Passive voice: S + be + V3/ed (+ by Agent)',
        explanationVi: 'Thể bị động nhấn mạnh hành động chung tay bảo vệ môi trường',
        example: 'Single-use plastic bottles are collected and recycled into useful eco-friendly products.',
      },
    ],
  },
];
