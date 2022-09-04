import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  StockOutlined,
} from '@ant-design/icons';
import { List, Spin } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../../store';
import {
  createOpenAssignmentsIds,
  deleteOpenAssignmentsIds,
} from '../../../../store/slices/assignments';
import { AssignmentsData } from '../../models';
import s from './Task.module.css';

type Props = {
  item: AssignmentsData;
  index: number;
  openAssignmentsIds: number[];
};

export const Task = ({ item, index, openAssignmentsIds }: Props) => {
  const [isViewTask, setIsViewTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMatchIds = useMemo(
    () => openAssignmentsIds.some((id) => id === item.id),
    [openAssignmentsIds, item],
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isMatchIds) {
      setIsViewTask(true);
    }
  }, [isMatchIds, item]);

  const handleClickViewTask = async (id: number) => {
    if (isViewTask) {
      setIsLoading(true);
      dispatch(deleteOpenAssignmentsIds(id)).finally(() => {
        setIsLoading(false);
        setIsViewTask(false);
      });
    } else {
      setIsLoading(true);
      dispatch(createOpenAssignmentsIds(id)).finally(() => {
        setIsLoading(false);
        setIsViewTask(true);
      });
    }
  };
  return (
    <Spin tip="Loading..." spinning={isLoading}>
      <List.Item className={s.item} key={item.id}>
        <div className={s.itemWrapper}>
          <List.Item.Meta
            title={
              <div className={s.link}>
                {index + 1}. {item.name}
              </div>
            }
          />
          <StockOutlined /> {item.difficulty}
        </div>
        {isViewTask ? (
          <EyeTwoTone
            className={s.icon}
            onClick={() => handleClickViewTask(item.id)}
          />
        ) : (
          <EyeInvisibleOutlined
            className={s.icon}
            onClick={() => handleClickViewTask(item.id)}
          />
        )}
      </List.Item>
    </Spin>
  );
};
