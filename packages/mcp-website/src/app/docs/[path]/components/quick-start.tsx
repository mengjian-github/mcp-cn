import { FC } from 'react';
import { ClockIcon } from '@radix-ui/react-icons';
import styles from './quick-start.module.less';

interface QuickStartProps {
  title: string;
  description: string;
  lastUpdated?: string;
  icon?: React.ReactNode;
}

export const QuickStart: FC<QuickStartProps> = ({ icon, title, description, lastUpdated }) => {
  return (
    <div className={styles.quickStartCard}>
      <div className={styles.header}>
        {icon}
        <h2 className={styles.title}>{title}</h2>
      </div>
      <p className={styles.description}>{description}</p>
      {lastUpdated && (
        <div className={styles.lastUpdated}>
          <ClockIcon />
          <span>最后更新：{lastUpdated}</span>
        </div>
      )}
    </div>
  );
};
