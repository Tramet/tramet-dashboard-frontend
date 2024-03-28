import Image from "next/image";
import TrametLogo from "../../public/tramet.png";

export const HeaderLogo = () => {
  return (
    <Image
      width={35}
      alt="tramet logo"
      className="w-12 mx-2 min-h-fit"
      height={35}
      src={TrametLogo}
    />
  );
};
