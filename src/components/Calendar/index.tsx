import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { CaretLeft, CaretRight } from 'phosphor-react';

import { getWeekDays } from '@/utils/get-week-days';

import {
  CalendarContainer,
  CalendarHeader,
  CalendarTitle,
  CalendarActions,
  CalendarBody,
  CalendarDay,
} from './styles';

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = Array<CalendarWeek>;

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1);
  });

  const handlePreviusMonth = useCallback(() => {
    const previusMonthDate = currentDate.subtract(1, 'month');
    setCurrentDate(previusMonthDate);
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    const nextMonthDate = currentDate.add(1, 'month');
    setCurrentDate(nextMonthDate);
  }, [currentDate]);

  const shortWeekDasy = getWeekDays({ short: true });

  const currentMonth = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1);
    });

    const firstWeekDay = currentDate.get('day');

    const previusMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day');
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth()
    );

    const lastWeekDay = lastDayInCurrentMonth.get('day');

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1), // 7 days in week - lastWeekDay (starts in 0, so +1)
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day');
    });

    const calendarDays = [
      ...previusMonthFillArray.map((date) => {
        return {
          date,
          disabled: true,
        };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled: false,
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return {
          date,
          disabled: true,
        };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          });
        }

        return weeks;
      },
      []
    );

    return calendarWeeks;
  }, [currentDate]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviusMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDasy.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <CalendarDay disabled={disabled}>
                    {date.get('date')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
