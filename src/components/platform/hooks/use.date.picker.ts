'use client';

import { useState } from 'react';
import { useUserDateTime } from '@/components/platform/hooks/use.user.datetime';

/** Manages calendar visibility, date selection, and localized date display. */
export function useDatePicker(value: string, onChange: (value: string) => void) {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const formatDate = useUserDateTime();
    const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;
    const dateLabel = value
        ? formatDate(new Date(`${value}T00:00:00Z`), { dateOnly: true })
        : undefined;

    /** Updates the selected calendar date and closes the picker. */
    function onDateSelect(date: Date | undefined) {
        onChange(
            date
                ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
                      .toISOString()
                      .slice(0, 10)
                : '',
        );
        setCalendarOpen(false);
    }

    return { calendarOpen, setCalendarOpen, selectedDate, dateLabel, onDateSelect };
}
