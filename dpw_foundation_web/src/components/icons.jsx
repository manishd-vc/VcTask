'use client';
import { styled } from '@mui/material/styles';

/**
 * StyledIcon Component
 * A styled image component with fixed width and height for displaying icons.
 *
 * @returns {JSX.Element} A styled image element for use in various icon components.
 */
const StyledIcon = styled('img')(({ width, height }) => ({
  width: width || '24px', // Default to 24px if not provided
  height: height || '24px'
}));

/**
 * NextWhiteArrow Component
 * Displays the white "next" arrow icon.
 *
 * @returns {JSX.Element} The white next arrow icon.
 */
export const NextWhiteArrow = () => {
  return <StyledIcon src="/icons/next-white.svg" alt="next arrow" />;
};
export const HeroSliderPrev = () => {
  return <StyledIcon src="/icons/hero-slider-prev.svg" alt="prev arrow" />;
};
export const HeroSliderNext = () => {
  return <StyledIcon src="/icons/hero-slider-next.svg" alt="prev arrow" />;
};
/**
 * NextDisabledArrow Component
 * Displays the disabled "next" arrow icon.
 *
 * @returns {JSX.Element} The disabled next arrow icon.
 */
export const NextDisabledArrow = () => {
  return <StyledIcon src="/icons/next-disabled.svg" alt="next arrow" />;
};

/**
 * NextBlackArrow Component
 * Displays the black "next" arrow icon.
 *
 * @returns {JSX.Element} The black next arrow icon.
 */
export const NextBlackArrow = () => {
  return <StyledIcon src="/icons/next-black.svg" alt="next black arrow" />;
};

/**
 * BackArrow Component
 * Displays the back arrow icon.
 *
 * @returns {JSX.Element} The back arrow icon.
 */
export const BackArrow = () => {
  return <StyledIcon src="/icons/back-black.svg" alt="back arrow" />;
};

/**
 * BackDisabledArrow Component
 * Displays the disabled back arrow icon.
 *
 * @returns {JSX.Element} The disabled back arrow icon.
 */
export const BackDisabledArrow = () => {
  return <StyledIcon src="/icons/back-disabled.svg" alt="back arrow" />;
};

/**
 * SearchIcon Component
 * Displays the search icon.
 *
 * @returns {JSX.Element} The search icon.
 */
export const SearchIcon = () => {
  return <StyledIcon src="/icons/searchIcon.svg" alt="search" />;
};

/**
 * EditIcon Component
 * Displays the edit icon.
 *
 * @returns {JSX.Element} The edit icon.
 */
export const EditIcon = () => {
  return <StyledIcon src="/icons/edit.svg" alt="edit" />;
};

/**
 * ViewIcon Component
 * Displays the view icon.
 *
 * @returns {JSX.Element} The view icon.
 */
export const ViewIcon = () => {
  return <StyledIcon src="/icons/view.svg" alt="view" />;
};

export const Withdraw = () => {
  return <StyledIcon src="/icons/withdraw.svg" alt="withdraw" />;
};

/**
 * ViewIcon Component
 * Displays the view icon.
 *
 * @returns {JSX.Element} The view icon.
 */
export const DonateIcon = () => {
  return <StyledIcon src="/icons/donate.svg" alt="donate" />;
};

export const ReportIcon = () => {
  return <StyledIcon src="/icons/partner-report.svg" alt="Report" />;
};
/**
 * DeleteIcon Component
 * Displays the delete icon.
 *
 * @returns {JSX.Element} The delete icon.
 */
export const DeleteIcon = () => {
  return <StyledIcon src="/icons/delete.svg" alt="delete" />;
};

/**
 * DeleteIconRed Component
 * Displays the red delete icon.
 *
 * @returns {JSX.Element} The red delete icon.
 */
export const DeleteIconRed = () => {
  return <StyledIcon src="/icons/delete_red.svg" alt="delete" />;
};

/**
 * GrowthIcon Component
 * Displays the growth icon.
 *
 * @returns {JSX.Element} The growth icon.
 */
export const GrowthIcon = () => {
  return <StyledIcon src="/icons/Growth.svg" alt="Growth" />;
};

/**
 * MoreVertIcon Component
 * Displays the "more vertical" icon (three dots).
 *
 * @returns {JSX.Element} The more vertical icon.
 */
export const MoreVertIcon = () => {
  return <StyledIcon src="/icons/dots-menu.svg" alt="MoreVert" />;
};

/**
 * CalendarIcon Component
 * Displays the calendar icon.
 *
 * @returns {JSX.Element} The calendar icon.
 */
export const CalendarIcon = () => {
  return <StyledIcon src="/icons/CalendarIcon.svg" alt="calendar" />;
};

/**
 * Radio Component
 * Displays the unselected radio button icon.
 *
 * @returns {JSX.Element} The radio icon.
 */
export const Radio = () => {
  return <StyledIcon src="/icons/radio.svg" alt="Radio" />;
};
export const UploadWhiteIcon = () => {
  return <StyledIcon src="/icons/upload_white.svg" alt="ReActive Icon" />;
};
/**
 * RadioChecked Component
 * Displays the selected radio button icon.
 *
 * @returns {JSX.Element} The selected radio icon.
 */
export const RadioChecked = () => {
  return <StyledIcon src="/icons/radioChecked.svg" alt="Radio Checked" />;
};

/**
 * RadioCheckedYellow Component
 * Displays the yellow selected radio button icon.
 *
 * @returns {JSX.Element} The yellow selected radio icon.
 */
export const RadioCheckedYellow = () => {
  return <StyledIcon src="/icons/radioCheckedYellow.svg" alt="Radio Checked" />;
};

/**
 * RadioCheckedGreen Component
 * Displays the green selected radio button icon.
 *
 * @returns {JSX.Element} The green selected radio icon.
 */
export const RadioCheckedGreen = () => {
  return <StyledIcon src="/icons/radioCheckedGreen.svg" alt="Radio Checked" />;
};

/**
 * ICADRequest Component
 * Displays the ICAD request icon.
 *
 * @returns {JSX.Element} The ICAD request icon.
 */
export const ICADRequest = () => {
  return <StyledIcon src="/icons/iacad_request.svg" alt="Radio Checked" />;
};

/**
 * ICADApproved Component
 * Displays the ICAD approved icon.
 *
 * @returns {JSX.Element} The ICAD approved icon.
 */
export const ICADApproved = () => {
  return <StyledIcon src="/icons/iacad_approve.svg" alt="Radio Checked" />;
};

/**
 * ICADReject Component
 * Displays the ICAD rejected icon.
 *
 * @returns {JSX.Element} The ICAD rejected icon.
 */
export const ICADReject = () => {
  return <StyledIcon src="/icons/iacad_reject.svg" alt="Radio Checked" />;
};

/**
 * AefNumber Component
 * Displays the AEF number icon.
 *
 * @returns {JSX.Element} The AEF number icon.
 */
export const AefNumber = () => {
  return <StyledIcon src="/icons/afe_number.svg" alt="Radio Checked" />;
};

/**
 * AssignToSelf Component
 * Displays the "assign to self" icon.
 *
 * @returns {JSX.Element} The "assign to self" icon.
 */
export const AssignToSelf = () => {
  return <StyledIcon src="/icons/assignToSelf.svg" alt="Assign To Self" />;
};

/**
 * SliderBack Component
 * Displays the slider back icon.
 *
 * @returns {JSX.Element} The slider back icon.
 */
export const SliderBack = () => {
  return <StyledIcon src="/icons/sliderBack.svg" alt="Slider Back" />;
};

/**
 * SliderNext Component
 * Displays the slider next icon.
 *
 * @returns {JSX.Element} The slider next icon.
 */
export const SliderNext = () => {
  return <StyledIcon src="/icons/sliderNext.svg" alt="Slider Next" />;
};

/**
 * DropDownArrow Component
 * Displays a drop-down arrow SVG icon with gradient stroke.
 *
 * @param {Object} props - The props to be passed to the SVG element.
 *
 * @returns {JSX.Element} The drop-down arrow icon in SVG format.
 */

export const DropDownArrowWhite = () => {
  return <StyledIcon src="/icons/Arrow-Down.svg" alt="DownArrowIcon" />;
};
/**
 * NotificationIcon Component
 * Displays the notification icon.
 *
 * @returns {JSX.Element} The notification icon.
 */
export const NotificationIcon = () => {
  return <StyledIcon src="/icons/notification.svg" alt="notification" />;
};

/**
 * UserIcon Component
 * Displays the user icon.
 *
 * @returns {JSX.Element} The user icon.
 */
export const UserIcon = () => {
  return <StyledIcon src="/icons/userIcon.svg" alt="userIcon" />;
};

/**
 * CloseIcon Component
 * Displays the close icon.
 *
 * @returns {JSX.Element} The close icon.
 */
export const CloseIcon = () => {
  return <StyledIcon src="/icons/closeIcon.svg" alt="closeIcon" />;
};

/**
 * CloseIconWhite Component
 * Displays the white close icon.
 *
 * @returns {JSX.Element} The white close icon.
 */
export const CloseIconWhite = () => {
  return <StyledIcon src="/icons/closeIconWhite.svg" alt="closeIcon" />;
};

/**
 * TimerIcon Component
 * Displays the timer icon.
 *
 * @returns {JSX.Element} The timer icon.
 */
export const TimerIcon = () => {
  return <StyledIcon src="/icons/timerIcon.svg" alt="timerIcon" />;
};

/**
 * HamburgerMenu Component
 * Displays the hamburger menu icon.
 *
 * @returns {JSX.Element} The hamburger menu icon.
 */
export const HamburgerMenu = () => {
  return <StyledIcon src="/icons/hamburger-menu.svg" alt="hamburger-menu" />;
};

/**
 * HamburgerWhiteMenu Component
 * Displays the white hamburger menu icon.
 *
 * @returns {JSX.Element} The white hamburger menu icon.
 */
export const HamburgerWhiteMenu = () => {
  return <StyledIcon src="/icons/hamburger-menuWhite.svg" alt="hamburger-menu" />;
};

/**
 * TickIcon Component
 * Displays the tick icon.
 *
 * @returns {JSX.Element} The tick icon.
 */
export const TickIcon = () => {
  return <StyledIcon src="/icons/tick.svg" alt="tick Icon" />;
};

/**
 * NextWhiteArrowSlider Component
 * Displays the white next arrow slider icon.
 *
 * @returns {JSX.Element} The white next arrow slider icon.
 */
export const NextWhiteArrowSlider = () => {
  return <StyledIcon src="/icons/nextArrowWhite.svg" alt="next arrow" />;
};

/**
 * PrevWhiteArrowSlider Component
 * Displays the white previous arrow slider icon.
 *
 * @returns {JSX.Element} The white previous arrow slider icon.
 */
export const PrevWhiteArrowSlider = () => {
  return <StyledIcon src="/icons/prevArrowWhite.svg" alt="Previous arrow" />;
};

/**
 * NextBlackArrowSlider Component
 * Displays the black next arrow slider icon.
 *
 * @returns {JSX.Element} The black next arrow slider icon.
 */
export const NextBlackArrowSlider = () => {
  return <StyledIcon src="/icons/nextArrowBlack.svg" alt="next arrow" />;
};

/**
 * ClockIcon Component
 * Displays the clock icon.
 *
 * @returns {JSX.Element} The clock icon.
 */
export const ClockIcon = () => {
  return <StyledIcon src="/icons/clock.svg" alt="Clock Icon" />;
};

/**
 * LocationIcon Component
 * Displays the location icon.
 *
 * @returns {JSX.Element} The location icon.
 */
export const LocationIcon = () => {
  return <StyledIcon src="/icons/location.svg" alt="Location Icon" />;
};

/**
 * TrueSignIcon Component
 * Displays the TrueSign icon.
 *
 * @returns {JSX.Element} The TrueSign icon.
 */
export const TrueSignIcon = () => {
  return <StyledIcon src="/icons/true-sign.svg" alt="True Sign Icon" />;
};

export const MoreInfoIcon = () => {
  return <StyledIcon src="/icons/moreInfo.svg" alt="MoreInfo Icon" />;
};

export const ArrowGreenIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/arrow-green.svg" alt="Arrow Green Icon" width={width} height={height} />;
};
export const CancelRedIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/cancel-red.svg" alt="Cancel Red Icon" width={width} height={height} />;
};
export const RightArrowIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/Right-Arrow.svg" alt="Right Arrow Icon" width={width} height={height} />;
};

export const DownloadLetterIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/download.svg" alt="Download Letter Icon" width={width} height={height} />;
};
export const ResizeIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/resize.svg" alt="Resize Icon" width={width} height={height} />;
};
export const LinkedinIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/Linkedin.svg" alt="Linkedin Icon" width={width} height={height} />;
};

export const FacebookIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/Facebook.svg" alt="Facebook Icon" width={width} height={height} />;
};

export const InstagramIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/Instagram.svg" alt="Instagram Icon" width={width} height={height} />;
};

export const XIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/X.svg" alt="X Icon" width={width} height={height} />;
};

export const PrintIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/print.svg" alt="Print Icon" width={width} height={height} />;
};

export const SignDocumentIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/sign-document-icon.svg" alt="Sign Document Icon" width={width} height={height} />;
};

export const ArrowBackIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/back-black.svg" alt="Arrow Back Icon" width={width} height={height} />;
};

export const AddIcon = ({ width, height }) => {
  return <StyledIcon src="/icons/add.svg" alt="Add Icon" width={width} height={height} />;
};

/**
 * TrackActivityIcon Component
 * Displays the Track Activity icon.
 *
 * @returns {JSX.Element} The calendar icon.
 */
export const TrackActivityIcon = () => {
  return <StyledIcon src="/icons/trackActivity.svg" alt="Track Activity" />;
};
export const DropDownArrow = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none">
    <path d="M1 1L12 13L23 1" stroke="url(#paint0_linear_3041_7679)" strokeLinecap="square" strokeLinejoin="round" />
    <defs>
      <linearGradient
        id="paint0_linear_3041_7679"
        x1="12"
        y1="5.31248"
        x2="12"
        y2="1.37498"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
export const UpArrow = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="14"
    viewBox="0 0 24 14"
    fill="none"
    style={{ transform: 'rotate(180deg)', ...props.style }}
  >
    <path d="M1 1L12 13L23 1" stroke="url(#paint0_linear_3041_7679)" strokeLinecap="square" strokeLinejoin="round" />
    <defs>
      <linearGradient
        id="paint0_linear_3041_7679"
        x1="12"
        y1="5.31248"
        x2="12"
        y2="1.37498"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
