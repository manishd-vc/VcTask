// components
import PropTypes from 'prop-types';
import MainLayout from 'src/layout/_main';
/**
 * Root Layout Component
 *
 * This is the root layout for the application. It wraps the children components inside the MainLayout,
 * ensuring consistency in the layout structure across various pages. The metadata section provides SEO
 * and social sharing information for the DPW Foundation website.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be rendered within this layout
 *
 * @returns {JSX.Element} The rendered RootLayout component
 */

export const metadata = {
  title: 'DP World Foundation',
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

RootLayout.propTypes = {
  // 'children' represents any valid React node (elements, strings, fragments, etc.)
  children: PropTypes.node.isRequired
};
/**
 * RootLayout Component
 *
 * This component serves as the root layout for the application, rendering all child components within the MainLayout,
 * which maintains consistent design and layout structure for the application.
 *
 * @param {ReactNode} children - The child components to be rendered within the root layout
 *
 * @returns {JSX.Element} The rendered layout with MainLayout wrapping the children
 */
export default async function RootLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
