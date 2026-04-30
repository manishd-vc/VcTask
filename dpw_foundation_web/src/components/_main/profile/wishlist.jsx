'use client';
import { useSelector } from 'react-redux';

// mui
import { Card, Grid } from '@mui/material';

// components
import ProductCard from 'src/components/cards/product';
import NoDataFound from 'src/illustrations/dataNotFound';

// api
import { useQuery } from 'react-query';
import * as api from 'src/services';

export default function Wishlist() {
  const { wishlist } = useSelector(({ wishlist }) => wishlist);

  const { data, isLoading } = useQuery(['get-wishlist-products', wishlist], () => api.getWishlist(wishlist), {
    onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
  });

  return (
    <Grid container justifyContent="center" spacing={2} mt={2}>
      {!isLoading && !data?.data.length && (
        <Grid item md={12}>
          <Card>
            <NoDataFound />
          </Card>
        </Grid>
      )}

      {(isLoading ? Array.from(new Array(4)) : data?.data)?.map((item) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={`data-key_${new Date().getTime()}`}>
          <ProductCard product={item} loading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
}
