'use client';
// react
import { useQuery } from 'react-query';
// icons
// mui
// component
// api
import * as api from 'src/services';
// yup
// formik
// axios
// redux
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from 'src/redux/slices/profile';
import EditProfile from './editProfile';
import ViewProfile from './viewProfile';
export default function AccountGeneral() {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const { profileData } = useSelector((state) => state.profile);
  const { refetch } = useQuery(['user-profile'], () => api.getProfile(), {
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(setProfileData(response?.data || {}));
      }
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  return (
    <>
      {!edit ? (
        <ViewProfile user={profileData} setEdit={setEdit} />
      ) : (
        <EditProfile user={profileData} setEdit={setEdit} refetch={refetch} />
      )}
    </>
  );
}
