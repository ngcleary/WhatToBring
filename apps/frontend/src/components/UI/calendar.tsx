import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { buttonVariants } from '../UI/Button.tsx';

type CalendarProps = Omit<DayPickerSingleProps, 'mode'> & {
    className?: string;
};
//add prop for onSelect and selected
function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    onSelect,
    selected,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            onSelect={onSelect}
            selected={selected}
            mode="single"
            showOutsideDays={showOutsideDays}
            className={cn(
                'p-4 bg-primary text-primary-foreground rounded-2xl shadow-md w-full',
                className
            )}
            classNames={{
                months: 'w-full flex flex-col gap-4',
                month: 'w-full flex flex-col gap-4',
                caption:
                    'flex justify-center pt-1 relative items-center w-full text-primary-foreground',
                caption_label: 'text-sm font-bold tracking-wide',
                nav: 'flex items-center gap-1',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'size-7 bg-transparent border-white/20 text-white p-0 opacity-70 hover:opacity-100 hover:bg-white/10'
                ),
                nav_button_previous: 'absolute left-1 text-primary-foreground',
                nav_button_next: 'absolute right-1 text-primary-foreground',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex w-full justify-between',
                head_cell:
                    'text-primary-foreground flex-1 text-center font-medium text-[0.8rem] py-1.5 opacity-80',
                row: 'flex w-full mt-1.5 justify-between',
                cell: cn(
                    'flex-1 relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/40 rounded-lg',
                    '[&:has([aria-selected])]:rounded-lg'
                ),
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-full p-0 font-medium text-white hover:bg-white/20 hover:text-white rounded-lg transition-colors aria-selected:opacity-100'
                ),
                day_range_start: 'day-range-start aria-selected:bg-accent aria-selected:text-white',
                day_range_end: 'day-range-end aria-selected:bg-accent aria-selected:text-white',
                day_selected:
                    '!bg-accent !text-white font-bold hover:!bg-accent hover:!text-white focus:!bg-accent focus:!text-white shadow-sm',
                day_today: 'bg-white/20 text-white font-bold border border-white/30',
                day_outside: 'day-outside text-white/40 opacity-40 aria-selected:text-white/40',
                day_disabled: 'text-white/30 opacity-30',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-white',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft className={cn('size-4', className)} {...props} />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight className={cn('size-4', className)} {...props} />
                ),
            }}
            {...props}
        />
    );
}

export { Calendar };
