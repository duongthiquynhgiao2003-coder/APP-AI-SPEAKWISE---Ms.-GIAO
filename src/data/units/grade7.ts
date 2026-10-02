import { TargetUnitItem } from './unitTypes';

export const GRADE_7_UNITS: TargetUnitItem[] = [
  {
    id: 'g7_gs_u1',
    grade: 7,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'Hobbies',
    unitTitleVi: 'Sở thích',
    theme: 'Interests and Leisure Activities',
    targetKeywords: [
      { word: 'dollhouse', phonetic: '/ˈdɒlhaʊs/', meaningVi: 'nhà búp bê mô hình', partOfSpeech: 'n' },
      { word: 'cardboard', phonetic: '/ˈkɑːdbɔːd/', meaningVi: 'bìa các-tông', partOfSpeech: 'n' },
      { word: 'gardening', phonetic: '/ˈɡɑːdnɪŋ/', meaningVi: 'làm vườn', partOfSpeech: 'n' },
      { word: 'horse riding', phonetic: '/hɔːs ˈraɪdɪŋ/', meaningVi: 'cưỡi ngựa', partOfSpeech: 'n' },
      { word: 'collect coins', phonetic: '/kəˈlekt kɔɪnz/', meaningVi: 'sưu tầm đồng xu', partOfSpeech: 'phrase' },
      { word: 'patient', phonetic: '/ˈpeɪʃnt/', meaningVi: 'kiên nhẫn', partOfSpeech: 'adj' },
      { word: 'creative', phonetic: '/kriˈeɪtɪv/', meaningVi: 'sáng tạo', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Verbs of liking/disliking + V-ing: like, love, enjoy, hate, prefer',
        explanationVi: 'Động từ chỉ yêu thích hoặc ghét kèm danh động từ V-ing',
        example: 'My sister enjoys making dollhouses, but she hates collecting stamps.',
      },
      {
        pattern: 'Present Simple: S + V(s/es) for hobbies and regular routines',
        explanationVi: 'Thì hiện tại đơn diễn tả các thói quen sở thích lặp đi lặp lại',
        example: 'My brother usually rides horses on weekends with his friends.',
      },
    ],
  },
  {
    id: 'g7_gs_u2',
    grade: 7,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'Healthy Living',
    unitTitleVi: 'Lối sống lành mạnh',
    theme: 'Health Habits and Wellness',
    targetKeywords: [
      { word: 'acne', phonetic: '/ˈækni/', meaningVi: 'mụn trứng cá', partOfSpeech: 'n' },
      { word: 'sunburn', phonetic: '/ˈsʌnbɜːn/', meaningVi: 'cháy nắng', partOfSpeech: 'n' },
      { word: 'dim light', phonetic: '/dɪm laɪt/', meaningVi: 'ánh sáng mờ', partOfSpeech: 'phrase' },
      { word: 'vegetarian', phonetic: '/ˌvedʒəˈteəriən/', meaningVi: 'người ăn chay', partOfSpeech: 'n' },
      { word: 'active', phonetic: '/ˈæktɪv/', meaningVi: 'năng động', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Simple sentences with coordinating conjunctions: and, or, but, so',
        explanationVi: 'Câu ghép các mệnh đề chỉ quan hệ nguyên nhân kết quả',
        example: 'He eats lots of fresh fruits, so his skin is smooth and healthy.',
      },
      {
        pattern: 'Imperatives with more and less: V + more / less + Noun',
        explanationVi: 'Câu mệnh lệnh đưa ra lời khuyên sức khỏe làm nhiều hơn hoặc ít hơn',
        example: 'Eat more fresh vegetables and drink less sugary soft drinks.',
      },
    ],
  },
];
