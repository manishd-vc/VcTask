/**
 * @file ProductDetailsDialog.js
 * @description A dialog component that displays detailed product information in a modal.
 * It includes a loading skeleton during data fetching, and upon completion, it shows the product carousel and summary.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
// API service for fetching product details
import * as api from 'src/services';
// React Query hook for data fetching
import { useQuery } from 'react-query';
// mui components
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
// custom components
import DetailsSkeleton from 'src/components/skeletons/productDetail';
import ProductDetailsSumaryMobile from '../_main/product/mobileSummary';
import ProductDetailsCarousel from 'src/components/carousels/customPaginationSilder';

/**
 * ProductDetailsDialog Component
 * @description A dialog component that displays detailed information about a product, including a carousel and product summary.
 * The dialog also shows a loading skeleton while the product data is being fetched.
 *
 * @param {Object} props - React props
 * @param {string} props.slug - The product slug used for fetching the product details.
 * @param {function} props.onClose - Function to close the dialog when the user clicks outside or closes it.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @returns {JSX.Element} A dialog containing product details or a loading skeleton.
 */
ProductDetailsDialog.propTypes = {
  slug: PropTypes.string, // Product slug used to fetch data
  onClose: PropTypes.func, // Function to close the dialog
  open: PropTypes.bool.isRequired // Boolean to control dialog visibility
};

export default function ProductDetailsDialog(props) {
  const { onClose, open, slug } = props;

  // Fetch product details using React Query and the provided slug
  const { data, isLoading } = useQuery(['coupon-codes', slug], () => api.getProductBySlug(slug));

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      {/* Loading state: Display skeleton while data is being fetched */}
      {isLoading ? (
        <DetailsSkeleton isPopup />
      ) : (
        // Display product details once data is loaded
        <Grid container spacing={2} justifyContent="center" sx={{ p: 3 }}>
          {/* Product carousel with images */}
          <Grid item xs={12} md={6} lg={6}>
            <ProductDetailsCarousel slug={slug} product={data?.data} data={data?.data} />
          </Grid>

          {/* Product summary with additional details */}
          <Grid item xs={12} md={6} lg={6}>
            <ProductDetailsSumaryMobile
              id={data?.data?._id}
              product={data?.data}
              brand={data?.brand}
              category={data?.category}
              totalRating={data?.totalRating}
              totalReviews={data?.totalReviews}
            />
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
}
