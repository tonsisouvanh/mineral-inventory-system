'use client';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { Button } from 'antd';
import React from 'react';
import { TbMoonFilled, TbSunFilled } from 'react-icons/tb';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      type="primary"
      className=""
      shape="circle"
      icon={isDarkMode ? <TbMoonFilled /> : <TbSunFilled />}
    />
  );
};

export default ThemeToggle;
