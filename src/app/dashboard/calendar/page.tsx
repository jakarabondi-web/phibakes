import { PageHeader } from "@/components/dashboard/page-header";
import { BookingCalendar } from "@/components/dashboard/calendar/booking-calendar";

export const metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="Production Calendar" description="Booking capacity per day — prevents overbooking automatically." />
      <BookingCalendar />
    </div>
  );
}
