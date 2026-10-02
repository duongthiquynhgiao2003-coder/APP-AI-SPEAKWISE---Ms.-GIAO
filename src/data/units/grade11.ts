import { TargetUnitItem } from './unitTypes';

export const GRADE_11_UNITS: TargetUnitItem[] = [
  {
    id: 'g11_gs_u1',
    grade: 11,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'A Long and Healthy Life',
    unitTitleVi: 'Cuộc sống trường thọ và khỏe mạnh',
    theme: 'Longevity, Nutrition and Fitness',
    targetKeywords: [
      { word: 'longevity', phonetic: '/lɒnˈdʒevəti/', meaningVi: 'tuổi thọ, sống lâu', partOfSpeech: 'n' },
      { word: 'immune system', phonetic: '/ɪˈmjuːn ˈsɪstəm/', meaningVi: 'hệ thống miễn dịch', partOfSpeech: 'phrase' },
      { word: 'life expectancy', phonetic: '/ˈlaɪf ɪkspektənsi/', meaningVi: 'tuổi thọ trung bình', partOfSpeech: 'phrase' },
      { word: 'antibiotic resistance', phonetic: '/ˌæntibaɪˈɒtɪk rɪˈzɪstəns/', meaningVi: 'kháng thuốc kháng sinh', partOfSpeech: 'phrase' },
      { word: 'nutritious diet', phonetic: '/njuːˈtrɪʃəs ˈdaɪət/', meaningVi: 'chế độ dinh dưỡng lành mạnh', partOfSpeech: 'phrase' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Past Simple vs. Present Perfect with time adverbials (recently, lately, since, for, ago, yesterday)',
        explanationVi: 'Phân biệt quá khứ đơn (hành động đã kết thúc trong quá khứ) và hiện tại hoàn thành (kết quả còn liên quan đến hiện tại)',
        example: 'Scientists have discovered groundbreaking treatments that have significantly prolonged human life expectancy.',
      },
    ],
  },
  {
    id: 'g11_gs_u2',
    grade: 11,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'The Generation Gap',
    unitTitleVi: 'Khoảng cách thế hệ',
    theme: 'Family Dynamics and Conflicts',
    targetKeywords: [
      { word: 'generation gap', phonetic: '/ˌdʒenəˈreɪʃn ɡæp/', meaningVi: 'khoảng cách thế hệ', partOfSpeech: 'phrase' },
      { word: 'nuclear family', phonetic: '/ˌnjuːkliə ˈfæməli/', meaningVi: 'gia đình hạt nhân (bố mẹ và con)', partOfSpeech: 'phrase' },
      { word: 'open-minded', phonetic: '/ˌəʊpən ˈmaɪndɪd/', meaningVi: 'cởi mở, tân tiến', partOfSpeech: 'adj' },
      { word: 'conservative', phonetic: '/kənˈsɜːvətɪv/', meaningVi: 'bảo thủ, hoài cổ', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Modal verbs of rules and obligation: must, have to, must not (prohibition)',
        explanationVi: 'Động từ khuyết thiếu diễn tả quy tắc gia đình và xã hội',
        example: 'Children must respect family curfews, and parents have to listen more sympathetically.',
      },
    ],
  },
];
