import { Card, List } from 'antd';
import {
  CheckOutlined,
  EllipsisOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { LessonItem } from '../../../../models';
import s from './StudentLessonsItem.module.css';
import { getLessonImageByType } from '../../../../helpers/getLessonImageByType';
import { selectReadLessonsIds } from '../../../../store/slices/lessons';
import { useAppSelector } from '../../../../store';

type Props = {
  item: LessonItem;
};

export const StudentLessonsItem = ({ item }: Props) => {
  const readLessonsIds = useAppSelector(selectReadLessonsIds);
  const isReading = readLessonsIds.some((id) => item.sys.id === id);

  return (
    <List.Item>
      <Card
        className={isReading ? s.complete : ''}
        bodyStyle={{
          lineHeight: '15px',
          marginBottom: '5px',
          height: '84px',
        }}
        size="small"
        actions={[
          isReading ? (
            <CheckOutlined style={{ fontSize: '24px', color: '#58B588' }} />
          ) : (
            <MinusOutlined className={s.minus} />
          ),
          <EllipsisOutlined
            style={{
              fontSize: '24px',
              color: isReading ? '#58B588' : '',
            }}
            key="ellipsis"
          />,
        ]}
      >
        <div className={s.info}>
          <img src={getLessonImageByType(item.type)} alt="lesson icon" />
          <Meta title={item.title} description={item.shortDescription} />
        </div>
      </Card>
    </List.Item>
  );
};
