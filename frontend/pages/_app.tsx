import type { AppProps } from "next/app";
import "../styles/index.css";
import "../styles/button.scss";
import { ConfigProvider } from "antd-mobile";
import enUS from "antd-mobile/es/locales/en-US";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={enUS}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
