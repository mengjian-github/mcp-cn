import { FC } from 'react';
import { Box, Separator, Card } from '@radix-ui/themes';
import { QuickStart } from './quick-start';
import styles from './theme.module.less';

interface DocContentProps {
  content: React.ReactNode;
  meta?: {
    title?: string;
    description?: string;
    lastUpdated?: string;
    icon?: React.ReactNode;
  };
}

export const DocContent: FC<DocContentProps> = ({ content, meta }) => {
  return (
    <Box style={{ maxWidth: '48rem' }} className="mx-auto">
      {meta?.title && (
        <Box>
          <QuickStart
            title={meta.title}
            description={meta.description ?? ''}
            lastUpdated={meta.lastUpdated}
            icon={meta.icon}
          />
          <Separator size="4" mt="5" />
        </Box>
      )}
      <Card variant="ghost" className="min-h-[300px] prose">
        <Box className={styles['docs-content']}>{content}</Box>
      </Card>
    </Box>
  );
};
