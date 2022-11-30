import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useAppDispatch, useAppSelector } from '../../../store';
import { lessonsGraphqlApi } from '../../../store/api/lessonsApi';
import {
  createReadLessonId,
  selectLessons,
  selectLessonsCollection,
  selectOpenLessonsIds,
  selectReadLessonsIds,
} from '../../../store/slices/lessons';
import s from './LessonView.module.css';

export const LessonView = () => {
  const dispatch = useAppDispatch();

  const [isRead, setIsRead] = useState<boolean>(false);

  const lesson = useAppSelector(selectLessons);
  const lessonsCollection = useAppSelector(selectLessonsCollection);
  const openLessonsIds = useAppSelector(selectOpenLessonsIds);
  const readLessonsIds = useAppSelector(selectReadLessonsIds);

  const [fetchLesson] = lessonsGraphqlApi.useLazyFetchLessonsQuery();

  const { lessonId } = useParams();

  useEffect(() => {
    if (!lessonId) return;

    fetchLesson({ lessonId });
  }, [fetchLesson, lessonId]);

  const studentLessonIds = lessonsCollection
    .filter((item) => openLessonsIds.some((id) => id === item.sys.id))
    .map((item) => item.sys.id);

  const isMatchIds = readLessonsIds.some((id) => id === lessonId);

  useEffect(() => {
    if (isMatchIds) {
      setIsRead(true);
    } else {
      setIsRead(false);
    }
  }, [isMatchIds]);

  const handleReadLesson = () => {
    if (!lessonId || isRead) return;
    dispatch(createReadLessonId(lessonId)).finally(() => {
      setIsRead(true);
    });
  };

  const index = studentLessonIds.findIndex((i) => i === lessonId);

  const prev = studentLessonIds[index - 1];
  const next = studentLessonIds[index + 1];

  if (!lesson) return null;

  return (
    <div className={s.lessonView}>
      {documentToReactComponents(lesson?.description?.json)}

      <div className={s.btn}>
        <Button className={s.nav} disabled={index === 0}>
          <Link to={`/student/lessons/${prev}`}>Назад</Link>
        </Button>
        <Button
          className={isRead ? s.readUp : s.read}
          onClick={handleReadLesson}
        >
          Прочитано
        </Button>
        <Button
          className={s.nav}
          disabled={index === studentLessonIds.length - 1}
        >
          <Link to={`/student/lessons/${next}`}>Вперед</Link>
        </Button>
      </div>
    </div>
  );
};
