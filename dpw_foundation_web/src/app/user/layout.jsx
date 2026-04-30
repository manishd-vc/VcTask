// Importing the VendorGuard to protect routes accessible only by vendors
import VendorGuard from 'src/guards/vendor';

// Importing the VendorLayout which will be used for the layout specific to vendors
import VendorLayout from 'src/layout/_vendor';

/**
 * Vendor Layout Wrapper Component
 *
 * This component acts as a wrapper for all vendor-specific pages. It ensures that
 * only authorized vendors can access the pages by using the VendorGuard.
 * The layout is wrapped inside the VendorLayout, which provides a specific UI
 * structure for vendor pages.
 *
 * All vendor pages will be rendered within this layout and guarded by the VendorGuard.
 */
export default function layout({ children }) {
  return (
    <VendorGuard>
      <VendorLayout>{children}</VendorLayout>
    </VendorGuard>
  );
}
