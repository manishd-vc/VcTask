'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
// api
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import LoadingFallback from 'src/components/loadingFallback';
import { setCampaignData } from 'src/redux/slices/campaign';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import AddCampaign from './addCampaign';
const moduleList = ['CAMPAIGN_PHOTO_ALBUM', 'CAMPAIGN_PHOTO_BANNER'];
const type = 'CAMPAIGN';

UpdateCampaign.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isApprove: PropTypes.bool.isRequired,

  // 'isView' is a boolean indicating if the component is in view mode
  isView: PropTypes.bool.isRequired
};
/**
 * UpdateCampaign component
 *
 * Manages the process of updating campaign details, including fetching campaign data,
 * campaign media, tasks, questions, and email data. Uses `useQuery` to fetch data
 * and dispatches the campaign details to the Redux store.
 *
 * @component
 * @param {boolean} isEdit - Flag indicating if the campaign is in edit mode.
 * @param {boolean} isApprove - Flag indicating if the campaign is in approve mode.
 * @param {boolean} isView - Flag indicating if the campaign is in view mode.
 * @example
 * return <UpdateCampaign isEdit={true} isApprove={false} isView={false} />;
 */
export default function UpdateCampaign({ isEdit, isApprove, isView, isSupervisor, beneficiaryProject }) {
  const params = useParams();
  const dispatch = useDispatch();

  const fetchCampaignMediaList = async () => {
    return await api.getMediaList({ type, moduleList, id: params?.id });
  };

  const filterMediaByType = (mediaList, type) => {
    return mediaList?.filter((item) => item.moduleType === type);
  };

  const fetchEmailData = async () => {
    return await api.emailPreDraft({ entityType: type, entityId: params?.id });
  };

  const fetchUserList = async () => {
    let userList = await api.getUsersList('');
    return userList?.data?.content || [];
  };

  const mapTasksWithAssignee = (tasks, userList) => {
    return tasks.map((task) => {
      const assignee = userList.find((user) => user.id === task.taskAssigneeId);
      return assignee ? { ...task, taskAssigneeId: assignee } : task;
    });
  };

  const hasValidCampaignEmail = (emailData) => {
    return emailData?.subject && emailData?.body;
  };

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['getCampaign', params.id],
    () => api.getCampaignById(params.id),
    {
      enabled: !!params.id,
      onSuccess: async (response) => {
        const campaignMediaList = await fetchCampaignMediaList();
        const banner = filterMediaByType(campaignMediaList, 'CAMPAIGN_PHOTO_BANNER');
        const campaignPhotoAlbum = filterMediaByType(campaignMediaList, 'CAMPAIGN_PHOTO_ALBUM');

        const emailData = await fetchEmailData();
        const userList = await fetchUserList();

        const tasks = mapTasksWithAssignee(response?.campaignTasks, userList);

        const hasCampaignEmail = hasValidCampaignEmail(emailData);

        dispatch(
          setCampaignData({
            ...response,
            // campaignAttachments: projectDoc,
            campaignPhotoAlbum: campaignPhotoAlbum,
            attachThumbnail: banner?.length > 0 ? banner[0] : [],
            emailId: emailData?.id || '',
            subject: emailData?.subject || '',
            body: emailData?.body || '',
            bannerFileId: emailData?.bannerFileId || '',
            sendOn: emailData?.sendOn || null,
            sendCondition: emailData?.sendCondition || '',
            sendImmidiately: emailData?.sendImmidiately || '',
            sendAutomatically: emailData?.sendAutomatically || false,
            emailRecipients:
              emailData?.emailRecipients?.map((emailInfo) => ({
                emailId: emailInfo?.emailId,
                emailGroupId: emailInfo?.emailGroupId
              })) || [],
            hasCampaignEmail: hasCampaignEmail,
            attachments: emailData?.attachments || [],
            campaignTasks: tasks,
            bannerImage: emailData?.bannerFile
          })
        );
      },
      onError: (err) => {
        // Handle error and show toast message
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  if (isLoading || isFetching) {
    return <LoadingFallback />;
  }

  return (
    <AddCampaign
      isEdit={isEdit}
      isApprove={isApprove}
      isView={isView}
      data={data}
      refetch={refetch}
      isSupervisor={isSupervisor}
      beneficiaryProject={beneficiaryProject}
    />
  );
}
