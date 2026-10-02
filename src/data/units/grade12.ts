import { TargetUnitItem } from './unitTypes';

export const GRADE_12_UNITS: TargetUnitItem[] = [
  {
    id: 'g12_gs_u1',
    grade: 12,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'Life Stories We Admire',
    unitTitleVi: 'Những câu chuyện cuộc đời ngưỡng mộ',
    theme: 'Biographies and Inspiring Figures',
    targetKeywords: [
      { word: 'inspirational figure', phonetic: '/ˌɪnspəˈreɪʃənl ˈfɪɡə(r)/', meaningVi: 'nhân vật truyền cảm hứng', partOfSpeech: 'phrase' },
      { word: 'dedication', phonetic: '/ˌdedɪˈkeɪʃn/', meaningVi: 'sự cống hiến quên mình', partOfSpeech: 'n' },
      { word: 'perseverance', phonetic: '/ˌpɜːsɪˈvɪərəns/', meaningVi: 'nghị lực kiên trì', partOfSpeech: 'n' },
      { word: 'overcome adversity', phonetic: '/ˌəʊvəˈkʌm ədˈvɜːsəti/', meaningVi: 'vượt lên nghịch cảnh', partOfSpeech: 'phrase' },
      { word: 'philanthropist', phonetic: '/fɪˈlænθrəpɪst/', meaningVi: 'nhà từ thiện vì cộng đồng', partOfSpeech: 'n' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Past Simple vs. Past Continuous vs. Past Perfect in narrative biographies',
        explanationVi: 'Phối hợp các thì quá khứ khi thuật lại tiểu sử nhân vật xuất chúng',
        example: 'Before she received the Nobel Prize, she had conducted research tirelessly in modest laboratories for decades.',
      },
    ],
  },
  {
    id: 'g12_gs_u2',
    grade: 12,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'A Multicultural World',
    unitTitleVi: 'Một thế giới đa văn hoá',
    theme: 'Cultural Diversity and Global Citizenship',
    targetKeywords: [
      { word: 'multiculturalism', phonetic: '/ˌmʌltiˈkʌltʃərəlɪzəm/', meaningVi: 'chủ nghĩa đa văn hóa', partOfSpeech: 'n' },
      { word: 'cultural diversity', phonetic: '/ˈkʌltʃərəl daɪˈvɜːsəti/', meaningVi: 'sự đa dạng văn hóa nhân loại', partOfSpeech: 'phrase' },
      { word: 'stereotype', phonetic: '/ˈsteriətaɪp/', meaningVi: 'định kiến hẹp hòi', partOfSpeech: 'n' },
      { word: 'cross-cultural communication', phonetic: '/krɒs ˈkʌltʃərəl kəˌmjuːnɪˈkeɪʃn/', meaningVi: 'giao tiếp liên văn hóa', partOfSpeech: 'phrase' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Double comparatives: The more ... the more ... in intercultural understanding',
        explanationVi: 'So sánh kép diễn tả sự phát triển hiểu biết văn hóa song hành',
        example: 'The more open-minded citizens become, the more harmoniously multicultural societies thrive.',
      },
    ],
  },
];
