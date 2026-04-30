// pages/campaign/[slug].js

/**
 * Campaign Main Page Component
 *
 * This component renders the main campaign page, fetching campaign details
 * based on the dynamic route parameter (`slug`). It displays the campaign
 * details using the `CampaignDetail` component.
 */

// mui (Material-UI library imports can be added here if necessary)

// components
import PropTypes from 'prop-types';
import CampaignDetail from 'src/components/_main/campaign';
/**
 * Meta Information
 *
 * This object defines metadata for the Campaign Main page, such as the title,
 * description, application name, authors, and keywords.
 */
export const metadata = {
  title: 'Charitable Project | DP World Foundation',
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
CampaignMain.propTypes = {
  // 'params' is an object containing route parameters
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired // 'slug' is a required string
  }).isRequired
};

/**
 * CampaignMain Component
 *
 * Fetches the campaign details based on the provided `slug` parameter
 * and displays the campaign details using the `CampaignDetail` component.
 *
 * @async
 * @param {Object} props - Component properties
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.slug - Slug used to fetch campaign details
 * @returns {JSX.Element} The rendered Campaign Main page component
 */
export default async function CampaignMain({ params }) {
  return <CampaignDetail params={params} />;
}
