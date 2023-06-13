import { Layout } from '@/component';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    // <Provider store={store}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    // </Provider>
  );
}
