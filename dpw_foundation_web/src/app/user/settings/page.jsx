// Importing the AccountGeneral component for profile settings
import AccountGeneral from 'src/components/_main/profile/edit/accountGeneral';

// Meta information for SEO and page metadata
export const metadata = {
  title: 'My Profile| DP World Foundation',
  description:
    'DP World Foundation is the philanthropic arm of DP World, dedicated to creating sustainable social impact through food, education, healthcare, community development, and humanitarian aid initiatives. Our mission is to empower communities, drive positive change, and build a better future for all across the UAE and worldwide.',
  applicationName: 'DP World Charity Management Platform',
  authors: [{ name: 'DP World Foundation' }],
  keywords: [
    'Charitable projects, fundraising campaigns, charitable organizations in UAE, DP World Foundation, community development UAE, corporate social responsibility Dubai, sustainable philanthropy, humanitarian aid UAE, education programs UAE, health initiatives Middle East, environmental charity, global philanthropy, nonprofit organizations, giving back UAE, social impact projects, volunteering opportunities UAE, humanitarian relief, CSR programs UAE, donations UAE, charity foundations Dubai, year of community, DP World' +
      'مشاريع خيرية، حملات تبرع، منظمات خيرية في الإمارات، مؤسسة دي بي وورلد الخيرية، موانئ دبي العالمية، دي بي ورلد، تنمية المجتمع في الإمارات، المسؤولية الاجتماعية في دبي، العمل الخيري المستدام، المساعدات الإنسانية في الإمارات، برامج تعليمية في الإمارات، مبادرات صحية في الشرق الأوسط، جمعيات بيئية، العمل الخيري العالمي، منظمات غير ربحية، رد الجميل في الإمارات، مشاريع الأثر الاجتماعي، فرص التطوع في الإمارات، الإغاثة الإنسانية، برامج المسؤولية الاجتماعية في الإمارات، تبرعات في الإمارات، مؤسسات خيرية في دبي، مؤسسات خيرية في الامارات'
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png'
  }
};
/**
 * Setting Page Component
 *
 * This component represents the settings page for the DPW Foundation platform.
 * It currently includes the AccountGeneral component, which allows users to manage
 * their account information such as personal details and preferences.
 *
 * Future enhancements can include adding more settings like privacy, notifications, etc.
 */
export default function page() {
  return <AccountGeneral />;
}
