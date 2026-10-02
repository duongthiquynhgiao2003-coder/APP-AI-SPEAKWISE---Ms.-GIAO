import { TargetUnitItem } from './unitTypes';

export const GRADE_9_UNITS: TargetUnitItem[] = [
  {
    id: 'g9_gs_u1',
    grade: 9,
    textbook: 'Global Success',
    unitNumber: 1,
    unitTitleEn: 'Local Community',
    unitTitleVi: 'Cộng đồng địa phương',
    theme: 'Community and Craft Villages',
    targetKeywords: [
      { word: 'artisan', phonetic: '/ˌɑːtɪˈzæn/', meaningVi: 'nghệ nhân thủ công', partOfSpeech: 'n' },
      { word: 'handicraft', phonetic: '/ˈhændikrɑːft/', meaningVi: 'đồ thủ công mỹ nghệ', partOfSpeech: 'n' },
      { word: 'pottery', phonetic: '/ˈpɒtəri/', meaningVi: 'nghề làm gốm', partOfSpeech: 'n' },
      { word: 'conical hat', phonetic: '/ˈkɒnɪkl hæt/', meaningVi: 'nón lá', partOfSpeech: 'phrase' },
      { word: 'preserve heritage', phonetic: '/prɪˈzɜːv ˈherɪtɪdʒ/', meaningVi: 'bảo tồn di sản truyền thống', partOfSpeech: 'phrase' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Question words before to-infinitives: who / what / where / when / how + to V',
        explanationVi: 'Từ để hỏi kết hợp động từ nguyên thể to diễn tả sự lựa chọn hoặc giải pháp',
        example: 'Visitors often do not know where to buy authentic handicrafts or how to preserve local traditions.',
      },
    ],
  },
  {
    id: 'g9_gs_u2',
    grade: 9,
    textbook: 'Global Success',
    unitNumber: 2,
    unitTitleEn: 'City Life',
    unitTitleVi: 'Cuộc sống thành thị',
    theme: 'Urban Living and Comparisons',
    targetKeywords: [
      { word: 'metropolis', phonetic: '/məˈtrɒpəlɪs/', meaningVi: 'đại đô thị', partOfSpeech: 'n' },
      { word: 'cost of living', phonetic: '/kɒst əv ˈlɪvɪŋ/', meaningVi: 'chi phí sinh hoạt', partOfSpeech: 'phrase' },
      { word: 'traffic congestion', phonetic: '/ˈtræfɪk kənˈdʒestʃən/', meaningVi: 'tắc nghẽn giao thông', partOfSpeech: 'phrase' },
      { word: 'bustling', phonetic: '/ˈbʌslɪŋ/', meaningVi: 'nhộn nhịp, hối hả', partOfSpeech: 'adj' },
    ],
    keyGrammarPatterns: [
      {
        pattern: 'Double comparatives: The + comparative ..., the + comparative ...',
        explanationVi: 'So sánh kép: Càng... thì càng... miêu tả mối tương quan trong đô thị',
        example: 'The larger the metropolis grows, the more severe the traffic congestion becomes.',
      },
    ],
  },
];
