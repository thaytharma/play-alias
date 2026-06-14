import React from 'react';

interface Props {
  className?: string;
}

const NorwegianFlag: React.FC<Props> = ({ className }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-no" viewBox="0 0 640 480" className={className}>
    <path fill="#ed2939" d="M0 0h640v480H0z" />
    <path fill="#fff" d="M180 0h120v480H180z" />
    <path fill="#fff" d="M0 180h640v120H0z" />
    <path fill="#002664" d="M210 0h60v480h-60z" />
    <path fill="#002664" d="M0 210h640v60H0z" />
  </svg>
);

export default NorwegianFlag;
