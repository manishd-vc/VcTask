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
import EditProfile from '../editProfile';
export default function AccountGeneral() {
  const [edit, setEdit] = useState(false);
  const { data, refetch } = useQuery(['user-profile'], () => api.getProfile(), {
    onSuccess: () => {
      setEdit(false);
    }
  });

  return (
    <>
      {!edit ? (
        <>
          <EditProfile user={data?.data} setEdit={setEdit} refetch={refetch} isEdit={false} isView={true} />
        </>
      ) : (
        <EditProfile user={data?.data} setEdit={setEdit} refetch={refetch} isEdit={true} isView={false} />
      )}
    </>
  );
}
