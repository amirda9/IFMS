import React, {FC} from 'react';

type PropsType = {
  color?: string;
  size?: number;
  rotate?: string;
  className?: string;
};
const TallArrow: FC<PropsType> = ({
  color = 'black',
  size = 24,
  rotate,
  className,
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{width: size * 7.5, height: size, rotate}}
      viewBox="0 0 182 24"
      fill="none">
      <path
        d="M181.061 13.0607C181.646 12.4749 181.646 11.5251 181.061 10.9393L171.515 1.3934C170.929 0.807611 169.979 0.807611 169.393 1.3934C168.808 1.97919 168.808 2.92893 169.393 3.51472L177.879 12L169.393 20.4853C168.808 21.0711 168.808 22.0208 169.393 22.6066C169.979 23.1924 170.929 23.1924 171.515 22.6066L181.061 13.0607ZM0 13.5H180V10.5H0V13.5Z"
        fill={color}
      />
    </svg>
  );
};

export default TallArrow;
