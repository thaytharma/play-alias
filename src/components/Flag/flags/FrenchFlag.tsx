import React from 'react';

interface Props {
  className?: string;
}

const FrenchFlag: React.FC<Props> = ({ className }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-fr" viewBox="0 0 640 480" className={className}>
    <path fill="#fff" d="M0 0h640v480H0z" />
    <path fill="#002654" d="M0 0h213.3v480H0z" />
    <path fill="#ce1126" d="M426.7 0H640v480H426.7z" />
  </svg>
);

export default FrenchFlag;
