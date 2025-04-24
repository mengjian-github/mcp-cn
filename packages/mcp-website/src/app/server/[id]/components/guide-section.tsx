export const GuideSection = (props: { url: string }) => {
  const { url } = props;
  const src = url.includes("?")
    ? url
    : `${url}?opendoc=1&doc_app_id=-1&shwm=false`;
  return (
    <div className="h-[calc(100vh-280px)] w-full">
      <iframe
        allowFullScreen
        src={src}
        className="w-full h-full border-none"
        style={{ minHeight: "600px" }}
      ></iframe>
    </div>
  );
};
