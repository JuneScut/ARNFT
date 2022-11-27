import { useRef, useState, useEffect } from "react";
import type { LottiePlayer } from "lottie-web";

const Loading = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/loading.json", // path to your animation file, place it inside public folder
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  return (
    <>
      <div style={{ height: "25vh" }}></div>
      <div
        ref={ref}
        style={{
          height: "50vh",
        }}
      ></div>
    </>
  );
};

export default Loading;
