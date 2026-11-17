'use client';

import type { ComponentProps } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/core/ui/button';
import { Calendar } from '@/components/core/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/core/ui/popover';
import TypographyBody from '@/components/core/ui/typography-body';
import { useDatePicker } from '@/components/platform/hooks/use.date.picker';
import { cn } from '@/lib/utils';

type DatePickerProps = Pick<
    ComponentProps<typeof Button>,
    'id' | 'ref' | 'disabled' | 'onBlur' | 'aria-invalid' | 'aria-describedby' | 'className'
> & {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
};

/** Presents a reusable calendar picker for a date value in YYYY-MM-DD format. */
export default function DatePicker({
    value,
    onChange,
    placeholder,
    className,
    disabled,
    ...props
}: DatePickerProps) {
    const { calendarOpen, setCalendarOpen, selectedDate, dateLabel, onDateSelect } = useDatePicker(
        value,
        onChange,
    );

    return (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        {...props}
                        disabled={disabled}
                        className={cn('w-full justify-between font-normal', className)}
                    />
                }
            >
                <TypographyBody className="text-sm">{dateLabel ?? placeholder}</TypographyBody>
                <CalendarIcon aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    onSelect={onDateSelect}
                    disabled={disabled}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
