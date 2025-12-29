import { BASE } from "../../../api";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const Image = ({ src, className }: ImageProps) => {
    if (!src) return null;

    const isAbsolute = /^https?:\/\//i.test(src);
    const normalizedSrc = isAbsolute ? src : `${BASE}/${src.replace(/^\/+/, "")}`;

    return <img src={normalizedSrc} className={className} />;
}

export default Image;