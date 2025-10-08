import Image from "next/image"

export const DomainFavicon = ({ url, className, h, w }: {
  url: string;
  className?: string;
  h: number;
  w: number;
}) => {
  if (url === "" || url === "direct") {
    return <p className="font-mono">direct</p>
  }
  const uri = new URL(url)
  const domain = uri.hostname;

  return <div>
    <Image
      src={`https://${domain}/favicon.ico`}
      alt="favicon"
      height={h}
      width={w}
    />
    <p className="font-mono">{domain}</p>
  </div>
}