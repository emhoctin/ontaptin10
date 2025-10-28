import React from 'react';
import { AcademicCapIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-center md:justify-start">
        <AcademicCapIcon className="w-10 h-10 text-primary" />
        <h1 className="text-2xl font-bold text-dark ml-3">
          ÔN TẬP TIN 10 <span className="text-secondary font-semibold"> </span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
