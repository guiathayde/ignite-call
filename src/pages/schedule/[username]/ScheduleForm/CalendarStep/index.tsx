import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { api } from '@/lib/axios';

import { Calendar } from '@/components/Calendar';

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles';

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

export function CalendarStep() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isDateSelected = !!selectedDate;
  const username = router.query.username as string | undefined;

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null;
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD [de] MMMM')
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null;

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      });

      return response.data;
    },
    enabled: !!selectedDate,
  });

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
