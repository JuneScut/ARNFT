export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        className="next-error-h1"
        style={{
          display: "inline-block",
          margin: "0",
          marginRight: "20px",
          padding: "0 23px 0 0",
          fontSize: "24px",
          fontWeight: "500",
          verticalAlign: "top",
          lineHeight: "49px",
        }}
      >
        OOPs
      </h1>
      <div
        style={{
          display: "inline-block",
          textAlign: "left",
          lineHeight: "49px",
          verticalAlign: "middle",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "normal",
            lineHeight: "49px",
            margin: "0",
            padding: "0",
          }}
        >
          This NFT could not be found
        </h2>
      </div>
    </div>
  );
}
