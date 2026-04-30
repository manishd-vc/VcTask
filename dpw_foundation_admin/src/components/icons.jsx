'use client';
import Image from 'next/image';

/**
 * StyledIcon Component
 * A styled image component with fixed width and height for displaying icons.
 *
 * @returns {JSX.Element} A styled image element for use in various icon components.
 */
const StyledIcon = ({ src, alt, width = 24, height = 24, ...rest }) => {
  return <Image src={src} alt={alt} width={width} height={height} {...rest} />;
};
const baseImagePath = '/dpwfadm';
/**
 * NextWhiteArrow Component
 * Displays the white "next" arrow icon.
 *
 * @returns {JSX.Element} The white next arrow icon.
 */
export const NextWhiteArrow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/next-white.svg`} alt="next arrow" unoptimized />;
};

/**
 * NextDisabledArrow Component
 * Displays the disabled "next" arrow icon.
 *
 * @returns {JSX.Element} The disabled next arrow icon.
 */
export const NextDisabledArrow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/next-disabled.svg`} alt="next disabled arrow" />;
};

/**
 * NextBlackArrow Component
 * Displays the black "next" arrow icon.
 *
 * @returns {JSX.Element} The black next arrow icon.
 */
export const NextBlackArrow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/next-black.svg`} alt="next black arrow" />;
};

export const NextArrow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/sliderNext.svg`} alt="next black arrow" />;
};

/**
 * BackArrow Component
 * Displays the back arrow icon.
 *
 * @returns {JSX.Element} The back arrow icon.
 */
export const BackArrow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/back-black.svg`} alt="back arrow" />;
};

/**
 * BackDisabledArrow Component
 * Displays the disabled back arrow icon.
 *
 * @returns {JSX.Element} The disabled back arrow icon.
 */
export const BackDisabledArrow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/back-disabled.svg`} alt="back arrow" />;
};

/**
 * SearchIcon Component
 * Displays the search icon.
 *
 * @returns {JSX.Element} The search icon.
 */
export const SearchIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/searchIcon.svg`} alt="search" />;
};

/**
 * EditIcon Component
 * Displays the edit icon.
 *
 * @returns {JSX.Element} The edit icon.
 */
export const EditIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/edit.svg`} alt="edit" />;
};

/**
 * ViewIcon Component
 * Displays the view icon.
 *
 * @returns {JSX.Element} The view icon.
 */
export const ViewIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/view.svg`} alt="view" />;
};

/**
 * DeleteIcon Component
 * Displays the delete icon.
 *
 * @returns {JSX.Element} The delete icon.
 */
export const DeleteIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/delete.svg`} alt="delete" />;
};

/**
 * DeleteIconRed Component
 * Displays the red delete icon.
 *
 * @returns {JSX.Element} The red delete icon.
 */
export const DeleteIconRed = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/delete_red.svg`} alt="delete" width={width} height={height} />;
};

/**
 * GrowthIcon Component
 * Displays the growth icon.
 *
 * @returns {JSX.Element} The growth icon.
 */
export const GrowthIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/Growth.svg`} alt="Growth" />;
};

/**
 * MoreVertIcon Component
 * Displays the "more vertical" icon (three dots).
 *
 * @returns {JSX.Element} The more vertical icon.
 */
export const MoreVertIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/dots-menu.svg`} alt="MoreVert" />;
};

/**
 * CalendarIcon Component
 * Displays the calendar icon.
 *
 * @returns {JSX.Element} The calendar icon.
 */
export const CalendarIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/CalendarIcon.svg`} alt="calendar" />;
};

/**
 * Radio Component
 * Displays the unselected radio button icon.
 *
 * @returns {JSX.Element} The radio icon.
 */
export const Radio = () => {
  return <StyledIcon src={`${baseImagePath}/icons/radio.svg`} alt="Radio" />;
};

/**
 * RadioChecked Component
 * Displays the selected radio button icon.
 *
 * @returns {JSX.Element} The selected radio icon.
 */
export const RadioChecked = () => {
  return <StyledIcon src={`${baseImagePath}/icons/radioChecked.svg`} alt="Radio Checked" />;
};

/**
 * RadioCheckedYellow Component
 * Displays the yellow selected radio button icon.
 *
 * @returns {JSX.Element} The yellow selected radio icon.
 */
export const RadioCheckedYellow = () => {
  return <StyledIcon src={`${baseImagePath}/icons/radioCheckedYellow.svg`} alt="Radio Checked" />;
};

/**
 * RadioCheckedGreen Component
 * Displays the green selected radio button icon.
 *
 * @returns {JSX.Element} The green selected radio icon.
 */
export const RadioCheckedGreen = () => {
  return <StyledIcon src={`${baseImagePath}/icons/radioCheckedGreen.svg`} alt="Radio Checked" />;
};

/**
 * ICADRequest Component
 * Displays the ICAD request icon.
 *
 * @returns {JSX.Element} The ICAD request icon.
 */
export const ICADRequest = () => {
  return <StyledIcon src={`${baseImagePath}/icons/iacad_request.svg`} alt="Radio Checked" />;
};

/**
 * ICADApproved Component
 * Displays the ICAD approved icon.
 *
 * @returns {JSX.Element} The ICAD approved icon.
 */
export const ICADApproved = () => {
  return <StyledIcon src={`${baseImagePath}/icons/iacad_approve.svg`} alt="Radio Checked" />;
};

/**
 * ICADReject Component
 * Displays the ICAD rejected icon.
 *
 * @returns {JSX.Element} The ICAD rejected icon.
 */
export const ICADReject = () => {
  return <StyledIcon src={`${baseImagePath}/icons/iacad_reject.svg`} alt="Radio Checked" />;
};

/**
 * AefNumber Component
 * Displays the AEF number icon.
 *
 * @returns {JSX.Element} The AEF number icon.
 */
export const AefNumber = () => {
  return <StyledIcon src={`${baseImagePath}/icons/afe_number.svg`} alt="Radio Checked" />;
};

/**
 * AssignToSelf Component
 * Displays the "assign to self" icon.
 *
 * @returns {JSX.Element} The "assign to self" icon.
 */
export const AssignToSelf = () => {
  return <StyledIcon src={`${baseImagePath}/icons/assignToSelf.svg`} alt="Assign To Self" />;
};

/**
 * SliderBack Component
 * Displays the slider back icon.
 *
 * @returns {JSX.Element} The slider back icon.
 */
export const SliderBack = () => {
  return <StyledIcon src={`${baseImagePath}/icons/sliderBack.svg`} alt="Slider Back" />;
};

/**
 * SliderNext Component
 * Displays the slider next icon.
 *
 * @returns {JSX.Element} The slider next icon.
 */
export const SliderNext = () => {
  return <StyledIcon src={`${baseImagePath}/icons/sliderNext.svg`} alt="Slider Next" />;
};

/**
 * DropDownArrow Component
 * Displays a drop-down arrow SVG icon with gradient stroke.
 *
 * @param {Object} props - The props to be passed to the SVG element.
 *
 * @returns {JSX.Element} The drop-down arrow icon in SVG format.
 */
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
export const ApprovalTree = () => {
  return <StyledIcon src={`${baseImagePath}/icons/approvalTree.svg`} alt="approval Tree" />;
};

/**
 * NotificationIcon Component
 * Displays the notification icon.
 *
 * @returns {JSX.Element} The notification icon.
 */
export const NotificationIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/notification.svg`} alt="notification" />;
};

/**
 * UserIcon Component
 * Displays the user icon.
 *
 * @returns {JSX.Element} The user icon.
 */
export const UserIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/userIcon.svg`} alt="userIcon" />;
};

/**
 * CloseIcon Component
 * Displays the close icon.
 *
 * @returns {JSX.Element} The close icon.
 */
export const CloseIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/closeIcon.svg`} alt="closeIcon" />;
};

/**
 * CloseIconWhite Component
 * Displays the white close icon.
 *
 * @returns {JSX.Element} The white close icon.
 */
export const CloseIconWhite = () => {
  return <StyledIcon src={`${baseImagePath}/icons/closeIconWhite.svg`} alt="closeIcon" />;
};

/**
 * TimerIcon Component
 * Displays the timer icon.
 *
 * @returns {JSX.Element} The timer icon.
 */
export const TimerIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/timerIcon.svg`} alt="timerIcon" />;
};

/**
 * HamburgerMenu Component
 * Displays the hamburger menu icon.
 *
 * @returns {JSX.Element} The hamburger menu icon.
 */
export const HamburgerMenu = () => {
  return <StyledIcon src={`${baseImagePath}/icons/hamburger-menu.svg`} alt="hamburger-menu" />;
};

/**
 * HamburgerWhiteMenu Component
 * Displays the white hamburger menu icon.
 *
 * @returns {JSX.Element} The white hamburger menu icon.
 */
export const HamburgerWhiteMenu = () => {
  return <StyledIcon src={`${baseImagePath}/icons/hamburger-menuWhite.svg`} alt="hamburger-menu" />;
};

/**
 * TickIcon Component
 * Displays the tick icon.
 *
 * @returns {JSX.Element} The tick icon.
 */
export const TickIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/tick.svg`} alt="tick Icon" />;
};

/**
 * NextWhiteArrowSlider Component
 * Displays the white next arrow slider icon.
 *
 * @returns {JSX.Element} The white next arrow slider icon.
 */
export const NextWhiteArrowSlider = () => {
  return <StyledIcon src={`${baseImagePath}/icons/nextArrowWhite.svg`} alt="next arrow" />;
};

/**
 * PrevWhiteArrowSlider Component
 * Displays the white previous arrow slider icon.
 *
 * @returns {JSX.Element} The white previous arrow slider icon.
 */
export const PrevWhiteArrowSlider = () => {
  return <StyledIcon src={`${baseImagePath}/icons/prevArrowWhite.svg`} alt="Previous arrow" />;
};

/**
 * NextBlackArrowSlider Component
 * Displays the black next arrow slider icon.
 *
 * @returns {JSX.Element} The black next arrow slider icon.
 */
export const NextBlackArrowSlider = () => {
  return <StyledIcon src={`${baseImagePath}/icons/nextArrowBlack.svg`} alt="next arrow" />;
};

/**
 * ClockIcon Component
 * Displays the clock icon.
 *
 * @returns {JSX.Element} The clock icon.
 */
export const ClockIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/clock.svg`} alt="Clock Icon" />;
};

/**
 * LocationIcon Component
 * Displays the location icon.
 *
 * @returns {JSX.Element} The location icon.
 */
export const LocationIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/location.svg`} alt="Location Icon" />;
};

/**
 * TrueSignIcon Component
 * Displays the TrueSign icon.
 *
 * @returns {JSX.Element} The TrueSign icon.
 */
export const TrueSignIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/TrueSign.svg`} alt="Location Icon" />;
};

export const SuspendedIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/suspended.svg`} alt="Suspended Icon" width={width} height={height} />;
};

export const ReActiveIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/re-active.svg`} alt="ReActive Icon" width={width} height={height} />;
};
export const UploadWhiteIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/upload_white.svg`} alt="ReActive Icon" />;
};
export const UploadBlackIcon = () => {
  return <StyledIcon src={`${baseImagePath}/icons/upload_black.svg`} alt="ReActive Icon" />;
};

export const DashboardIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/dashboard.svg`} alt="Dashboard Icon" width={width} height={height} />;
};

export const UserManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/userManagement.svg`}
      alt="Charity Operation Icon"
      width={width}
      height={height}
    />
  );
};
export const PartnerManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/partnerManagement.svg`}
      alt="Partner Management Icon"
      width={width}
      height={height}
    />
  );
};

export const CharityOperationIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/charityOperation.svg`}
      alt="User Management Icon"
      width={width}
      height={height}
    />
  );
};

export const CharityAdministratorIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/charityAdministrator.svg`}
      alt="Charity Administrator Icon"
      width={width}
      height={height}
    />
  );
};

export const DonorManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/donorManagement.svg`}
      alt="Donor Management Icon"
      width={width}
      height={height}
    />
  );
};

export const QuestionAnswerIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/question_answer-icon.svg`}
      alt="Question Answer Icon"
      width={width}
      height={height}
    />
  );
};
export const MoreInfoIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/moreInfo.svg`} alt="More Info Icon" width={width} height={height} />;
};

export const CompleteIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/complete.svg`} alt="Complete Icon" width={width} height={height} />;
};
export const QuestionIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/question.svg`} alt="Question Icon" width={width} height={height} />;
};
export const AnswerReceivedIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/answerReceivedIcon.svg`}
      alt="Answer Received Icon"
      width={width}
      height={height}
    />
  );
};
export const GeoLocationIcon = ({ width, height }) => {
  return (
    <StyledIcon src={`${baseImagePath}/icons/geoLocation.svg`} alt="Geo Location Icon" width={width} height={height} />
  );
};
export const AcceptanceLetterIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/acceptance-letter.svg`}
      alt="Geo Location Icon"
      width={width}
      height={height}
    />
  );
};
export const ArrowGreenIcon = ({ width, height }) => {
  return (
    <StyledIcon src={`${baseImagePath}/icons/arrow-green.svg`} alt="Arrow Green Icon" width={width} height={height} />
  );
};
export const CancelRedIcon = ({ width, height }) => {
  return (
    <StyledIcon src={`${baseImagePath}/icons/cancel-red.svg`} alt="Cancel Red Icon" width={width} height={height} />
  );
};
export const CancelIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/calcelIcon.svg`} alt="Cancel Icon" width={width} height={height} />;
};

export const RightArrowIcon = ({ width, height }) => {
  return (
    <StyledIcon src={`${baseImagePath}/icons/Right-Arrow.svg`} alt="Right Arrow Icon" width={width} height={height} />
  );
};
export const DownloadLetterIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/downloadLetter.svg`}
      alt="Download Letter Icon"
      width={width}
      height={height}
    />
  );
};

export const PrintIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/print.svg`} alt="Print Icon" width={width} height={height} />;
};

export const SettingIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/settings.svg`} alt="Setting Icon" width={width} height={height} />;
};
export const VolunteerManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/volunteerManagement.svg`}
      alt="Volunteer Management Icon"
      width={width}
      height={height}
    />
  );
};
export const GrantManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/grantManagement.svg`}
      alt="Grant Management Icon"
      width={width}
      height={height}
    />
  );
};

export const SignDocumentIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/sign-document-icon.svg`}
      alt="Sign Document Icon"
      width={width}
      height={height}
    />
  );
};

export const EnrollVolunteer = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/enrollVolunteer.svg`}
      alt="Enroll Volunteer"
      width={width}
      height={height}
    />
  );
};

export const TrackActivityIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/trackActivity.svg`}
      alt="Track Activity Icon"
      width={width}
      height={height}
    />
  );
};

export const FilterIcon = ({ width, height }) => {
  return <StyledIcon src={`${baseImagePath}/icons/filter.svg`} alt="Filter Icon" width={width} height={height} />;
};
export const FinanceManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/financeManagement.svg`}
      alt="Finance Management Icon"
      width={width}
      height={height}
    />
  );
};
export const ReportManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/ReportManagement.svg`}
      alt="Report Management Icon"
      width={width}
      height={height}
    />
  );
};

export const BeneficiaryManagementIcon = ({ width, height }) => {
  return (
    <StyledIcon
      src={`${baseImagePath}/icons/beneficiaryManagement.svg`}
      alt="Beneficiary Management Icon"
      width={width}
      height={height}
    />
  );
};
