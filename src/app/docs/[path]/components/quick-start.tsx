import { ClockIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

interface QuickStartProps {
  title: string;
  description: string;
  lastUpdated?: string;
  icon?: React.ReactNode;
}

export const QuickStart: FC<QuickStartProps> = ({ icon, title, description, lastUpdated }) => {
  return (
    <div>
      <div>
        {icon}
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
      {lastUpdated && (
        <div>
          <ClockIcon />
          <span>最后更新：{lastUpdated}</span>
        </div>
      )}
    </div>
  );
};
