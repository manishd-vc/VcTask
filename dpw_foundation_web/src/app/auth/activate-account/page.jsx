// guard
import GuestGuard from 'src/guards/guest';
// components
import ActivateAccountMain from 'src/components/_main/auth/activateAccount';

// Meta information
export const metadata = {
  title: 'Forgot Password | DP World Foundation',
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
 * ForgetPassword Component
 *
 * This component renders the forget password page for users who need to reset their passwords.
 * It is wrapped in the GuestGuard, which ensures only unauthenticated users can access it.
 *
 * @returns {JSX.Element} The rendered ForgetPassword component wrapped with GuestGuard and displaying the main forget password form
 */
export default function ActivateAccount() {
  return (
    <GuestGuard>
      <ActivateAccountMain />
    </GuestGuard>
  );
}
