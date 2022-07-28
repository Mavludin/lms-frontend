import { List } from 'antd';
import { useEffect, useState } from 'react';
import { Header } from '../../../components/Header/Header';
import { LessonItem } from '../../../models';
import { useAppSelector } from '../../../store';
import { lessonsGraphqlApi } from '../../../store/api/lessonsApi';
import { selectLessons } from '../../../store/slices/lessons';
import { StudentLessonsFilters } from '../components/StudentLessonsFilters/StudentLessonsFilters';
import { StudentLessonsItem } from '../components/StudentLessonsItem/StudentLessonsItem';
import s from './StudentLessons.module.css';

export const StudentLessons = () => {
  const [openLessons, setOpenLessons] = useState<LessonItem[]>([]);
  const lessons = useAppSelector(selectLessons);
  const [openLessonsIds, setOpenLessonsIds] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<LessonItem[]>([]);
  const [readLessons, setReadLessons] = useState<string[]>([]);

  const finalData = filteredData.length ? filteredData : openLessons;

  const [fetchLessons] = lessonsGraphqlApi.useLazyFetchLessonsQuery();

  useEffect(() => {
    if (lessons.length) return;

    fetchLessons();
  }, [fetchLessons, lessons]);

  useEffect(() => {
    fetch('/api/open-lessons')
      .then((res) => res.json())
      .then((res) => setOpenLessonsIds(res.data));
  }, []);

  useEffect(() => {
    setOpenLessons(
      lessons.filter((item) => openLessonsIds.some((id) => id === item.sys.id)),
    );
  }, [lessons, openLessonsIds]);

  useEffect(() => {
    fetch('/api/read-lessons')
      .then((res) => res.json())
      .then((res) => setReadLessons(res.data));
  }, []);

  return (
    <>
      <Header />
      <div className={s.lessons}>
        <div className={s.title}>
          <h1>Материалы</h1>
          <StudentLessonsFilters
            setFilteredData={setFilteredData}
            openLessons={openLessons}
          />
        </div>

        <List
          pagination={{
            pageSize: 6,
          }}
          grid={{
            gutter: 75,
            column: 3,
          }}
          dataSource={finalData}
          renderItem={(item) => (
            <StudentLessonsItem item={item} readLessons={readLessons} />
          )}
        />
      </div>
    </>
  );
};
