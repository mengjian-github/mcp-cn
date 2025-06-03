import 'dayjs/esm/locale/zh-cn';
import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const dayjsInstance = dayjs;
