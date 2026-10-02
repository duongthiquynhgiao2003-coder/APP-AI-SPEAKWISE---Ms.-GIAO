import { TargetUnitItem } from './unitTypes';

export const GRADE_8_UNITS: TargetUnitItem[] = [
  {
    id: 'g8_gs_u1',
    grade: 8,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'Leisure Time',
    unitTitleVi: 'Thời gian rảnh rỗi',
    theme: 'Leisure and DIY',
    targetKeywords: [
      { word: 'origami', phonetic: '/ˌɒrɪˈɡɑːmi/', meaningVi: 'nghệ thuật gấp giấy Nhật Bản', partOfSpeech: 'n' },
      { word: 'DIY project', phonetic: '/ˌdiː aɪ ˈwaɪ ˈprɒdʒekt/', meaningVi: 'dự án tự làm handmade', partOfSpeech: 'phrase' },
      { word: 'knit', phonetic: '/nɪt/', meaningVi: 'đan len', partOfSpeech: 'v' },
      { word: 'hang out', phonetic: '/hæŋ aʊt/', meaningVi: 'tụ tập cùng bạn bè', partOfSpeech: 'phrase' },
      { word: 'hooked on', phonetic: '/hʊkt ɒn/', meaningVi: 'say mê, nghiện làm việc gì', partOfSpeech: 'phrase' },
      { word: 'relaxing', phonetic: '/rɪˈlæksɪŋ/', meaningVi: 'mang tính thư giãn', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: "Verbs of liking/disliking + Gerund (V-ing): adore, enjoy, fancy, detest, don't mind",
        explanationVi: 'Các động từ chỉ sở thích bắt buộc theo sau bởi V-ing',
        example: 'Many teenagers fancy doing DIY projects and adore hanging out with their peers.',
      },
      {
        pattern: 'Verbs of liking/disliking + To-infinitive / Gerund: like, love, hate, prefer',
        explanationVi: 'Các động từ có thể theo sau bởi V-ing hoặc to-V mà không đổi nhiều ý nghĩa',
        example: 'I love to knit wool sweaters in winter. / I love knitting wool sweaters in winter.',
      },
    ],
  },
  {
    id: 'g8_gs_u2',
    grade: 8,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'Life in the Countryside',
    unitTitleVi: 'Cuộc sống ở nông thôn',
    theme: 'Rural Life and Comparative Adverbs',
    targetKeywords: [
      { word: 'harvest time', phonetic: '/ˈhɑːvɪst taɪm/', meaningVi: 'mùa thu hoạch vụ mùa', partOfSpeech: 'phrase' },
      { word: 'paddy field', phonetic: '/ˈpædi fiːld/', meaningVi: 'cánh đồng lúa', partOfSpeech: 'n' },
      { word: 'herd', phonetic: '/hɜːd/', meaningVi: 'chăn dắt gia súc', partOfSpeech: 'v' },
      { word: 'hospitable', phonetic: '/hɒˈspɪtəbl/', meaningVi: 'hiếu khách, nồng hậu', partOfSpeech: 'adj' },
      { word: 'vast', phonetic: '/vɑːst/', meaningVi: 'bao la, bát ngát', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Comparative of adverbs: S1 + V + more + adv + than + S2 / adv-er',
        explanationVi: 'So sánh hơn của trạng từ có quy tắc và bất quy tắc',
        example: 'Life in the countryside moves more slowly and peacefully than in big cities.',
      },
    ],
  },
];
