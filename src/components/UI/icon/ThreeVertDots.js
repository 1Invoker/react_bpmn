import React from 'react';

const ThreeVertDots = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <svg
      onClick={handleClick}
      width="7"
      height="33"
      viewBox="0 0 7 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="three-vert-dots"
      style={{ cursor: 'pointer' }}
    >
      <path
        d="M7 29.1423C7 31.0722 5.43018 32.6426 3.50024 32.6426C1.56982 32.6426 0 31.0722 0 29.1423C0 27.2125 1.57039 25.6421 3.50024 25.6421C5.4297 25.6421 7 27.2124 7 29.1423ZM1.04921 29.1423C1.04921 30.4939 2.1488 31.5929 3.49976 31.5929C4.85072 31.5929 5.94982 30.4939 5.94982 29.1423C5.94982 27.7908 4.85082 26.6918 3.49976 26.6918C2.1487 26.6918 1.04921 27.7908 1.04921 29.1423Z"
        fill="#010002"
      />
      <path
        d="M7 16.8082C7 18.7381 5.43018 20.3085 3.50024 20.3085C1.56982 20.3085 0 18.7381 0 16.8082C0 14.8778 1.57039 13.308 3.50024 13.308C5.4297 13.308 7 14.8778 7 16.8082ZM1.04921 16.8082C1.04921 18.1598 2.1488 19.2588 3.49976 19.2588C4.85072 19.2588 5.94982 18.1598 5.94982 16.8082C5.94982 15.4573 4.85082 14.3577 3.49976 14.3577C2.1487 14.3577 1.04921 15.4573 1.04921 16.8082Z"
        fill="#010002"
      />
      <path
        d="M7 4.08057C7 6.01099 5.43018 7.58081 3.50024 7.58081C1.56982 7.58081 0 6.01099 0 4.08057C0 2.15014 1.57039 0.580329 3.50024 0.580329C5.4297 0.580232 7 2.15014 7 4.08057ZM1.04921 4.08057C1.04921 5.43153 2.1488 6.53112 3.49976 6.53112C4.85072 6.53112 5.94982 5.43153 5.94982 4.08057C5.94982 2.72961 4.85082 1.63002 3.49976 1.63002C2.1487 1.63002 1.04921 2.72951 1.04921 4.08057Z"
        fill="#010002"
      />
    </svg>
  );
};

export default ThreeVertDots;
